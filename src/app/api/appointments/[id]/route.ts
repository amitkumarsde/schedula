import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { sendSuccess, sendError, handleApiError } from "@/lib/utils/apiResponse";
import { readJsonBody, isNonEmptyText, readOptionalText } from "@/lib/utils/apiRequest";
import {
  makeSlotsForDoctor,
  isDoctorWorkingOn,
  appointmentHasStarted,
  formatLongDate,
  formatSlotLabel,
} from "@/lib/utils/schedule";
import Appointment from "@/lib/models/Appointment";
import Doctor from "@/lib/models/Doctor";
import Patient from "@/lib/models/Patient";
import { enrichAppointments } from "@/lib/appointments/enrichAppointments";

// True when this user is the patient or the doctor on the appointment.
function isOwnAppointment(appointment: { patientUserId: unknown; doctorUserId: unknown }, userId: string) {
  return String(appointment.patientUserId) === userId || String(appointment.doctorUserId) === userId;
}

// Keeps only medicine lines that have a name.
function cleanMedicines(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
    .map((item) => ({
      name: readOptionalText(item.name),
      dosage: readOptionalText(item.dosage),
      duration: readOptionalText(item.duration),
    }))
    .filter((item) => item.name.length > 0);
}

type NotificationType = "reschedule" | "cancel" | "patient-cancel" | "missed" | "complete";

// Adds one notification to a patient or doctor profile (found by their user id).
async function notify(
  target: "patient" | "doctor",
  userId: unknown,
  message: string,
  type: NotificationType,
  appointmentId: unknown
) {
  const filter = { userId: String(userId) };
  const update = { $push: { notifications: { message, type, appointmentId: String(appointmentId), isRead: false } } };
  if (target === "doctor") {
    await Doctor.updateOne(filter, update);
  } else {
    await Patient.updateOne(filter, update);
  }
}

// Returns one appointment (with doctor and patient details) for the people on it.
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userId = request.nextUrl.searchParams.get("userId");
    if (!isNonEmptyText(userId)) return sendError("userId is required");

    await connectToDatabase();

    const appointment = await Appointment.findById(id);
    if (!appointment) return sendError("Appointment not found", 404);

    if (!isOwnAppointment(appointment, userId)) {
      return sendError("You cannot view this appointment", 403);
    }

    const [enriched] = await enrichAppointments([appointment]);
    return sendSuccess({ appointment: enriched });
  } catch (error) {
    return handleApiError(error);
  }
}

// Updates one appointment: reschedule, review, cancel, complete or save a prescription.
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await readJsonBody(request);
    if (!body) return sendError("Please send the details as a JSON object");

    const { userId, status, appointmentDate, slotTime, review } = body;
    if (!isNonEmptyText(userId)) return sendError("userId is required");

    await connectToDatabase();

    const appointment = await Appointment.findById(id);
    if (!appointment) return sendError("Appointment not found", 404);

    if (!isOwnAppointment(appointment, userId)) {
      return sendError("You cannot change this appointment", 403);
    }

    const isDoctor = String(appointment.doctorUserId) === userId;

    // Names come from the profiles and are used for the notification text.
    const doctorProfile = await Doctor.findOne({ userId: appointment.doctorUserId });
    const patientProfile = await Patient.findOne({ userId: appointment.patientUserId });
    const doctorName = doctorProfile?.fullName ?? "The doctor";
    const patientName = patientProfile?.fullName ?? "The patient";
    const when = () => `${formatLongDate(appointment.appointmentDate)} at ${formatSlotLabel(appointment.slotTime)}`;

    // 1. Reschedule: only the doctor can move an upcoming appointment.
    if (isNonEmptyText(appointmentDate) && isNonEmptyText(slotTime)) {
      if (appointment.status !== "upcoming") return sendError("This appointment can no longer be changed");
      if (!isDoctor) return sendError("Only the doctor can reschedule an appointment", 403);
      if (!doctorProfile) return sendError("Doctor not found", 404);

      if (!isDoctorWorkingOn(doctorProfile, appointmentDate)) {
        return sendError("You do not consult on this day");
      }

      const slots = makeSlotsForDoctor(doctorProfile);
      if (!slots.includes(slotTime)) return sendError("This time slot is not available");

      if (appointmentHasStarted(appointmentDate, slotTime)) {
        return sendError("That time has already passed, please pick a later slot");
      }

      const clash = await Appointment.findOne({
        _id: { $ne: appointment._id },
        doctorUserId: appointment.doctorUserId,
        appointmentDate,
        slotTime,
        status: { $ne: "cancelled" },
      });
      if (clash) return sendError("That slot is already booked, please pick another");

      appointment.appointmentDate = appointmentDate;
      appointment.slotTime = slotTime;
      await appointment.save();

      // Tell the other person about the new time.
      await notify("patient",
        appointment.patientUserId,
        `${doctorName} rescheduled appointment #${appointment.appointmentNumber} to ${when()}.`,
        "reschedule",
        appointment._id
      );

      return sendSuccess({ message: "Appointment rescheduled", appointment });
    }

    // 2. Review: only the patient, only on a completed appointment.
    if (review && typeof review === "object") {
      if (isDoctor) return sendError("Only the patient can review", 403);
      if (appointment.status !== "completed") return sendError("You can review only a completed appointment");

      const rating = Number((review as Record<string, unknown>).rating);
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        return sendError("Please give a rating from 1 to 5");
      }

      appointment.review = { rating, comment: readOptionalText((review as Record<string, unknown>).comment) };
      await appointment.save();
      return sendSuccess({ message: "Review saved", appointment });
    }

    // 3. Change the status: cancel, complete or mark missed.
    if (isNonEmptyText(status)) {
      if (status !== "completed" && status !== "cancelled" && status !== "missed") {
        return sendError("Status must be completed, cancelled or missed");
      }
      if (appointment.status !== "upcoming") {
        return sendError("This appointment can no longer be changed");
      }

      const hasStarted = appointmentHasStarted(appointment.appointmentDate, appointment.slotTime);

      // Cancel: the patient can cancel only before the slot time; after that only the doctor can act.
      if (status === "cancelled") {
        if (!isDoctor && hasStarted) {
          return sendError("The time has passed, only the doctor can update this appointment", 403);
        }

        appointment.status = "cancelled";
        await appointment.save();

        const cancelledBy = isDoctor ? doctorName : patientName;
        const message = `${cancelledBy} cancelled appointment #${appointment.appointmentNumber} (${when()}).`;
        if (isDoctor) {
          // Doctor cancelled: the patient sees a red cancel notification.
          await notify("patient", appointment.patientUserId, message, "cancel", appointment._id);
        } else {
          // Patient cancelled: the doctor sees a blue notification.
          await notify("doctor", appointment.doctorUserId, message, "patient-cancel", appointment._id);
        }

        return sendSuccess({ message: "Appointment cancelled", appointment });
      }

      // Complete and missed are for the doctor only, and only after the scheduled time.
      if (!isDoctor) return sendError("Only the doctor can update this appointment", 403);
      if (!hasStarted) {
        return sendError("You can update this only after the scheduled time");
      }

      // Missed: the patient did not attend the visit.
      if (status === "missed") {
        appointment.status = "missed";
        await appointment.save();

        await notify("patient",
          appointment.patientUserId,
          `${doctorName} marked appointment #${appointment.appointmentNumber} (${when()}) as missed.`,
          "missed",
          appointment._id
        );

        return sendSuccess({ message: "Appointment marked as missed", appointment });
      }

      // Complete: needs a diagnosis first.
      if (!appointment.diagnosis) {
        return sendError("Add a diagnosis before marking it completed");
      }

      appointment.status = "completed";
      await appointment.save();

      await notify("patient",
        appointment.patientUserId,
        `${doctorName} completed appointment #${appointment.appointmentNumber} (${when()}).`,
        "complete",
        appointment._id
      );

      return sendSuccess({ message: "Appointment completed", appointment });
    }

    // 4. Otherwise the doctor is saving a prescription. Allowed after the time, and still after completion.
    if (!isDoctor) return sendError("Only the doctor can add a prescription", 403);
    if (appointment.status === "cancelled" || appointment.status === "missed") {
      return sendError("This appointment can no longer be changed");
    }
    if (
      appointment.status === "upcoming" &&
      !appointmentHasStarted(appointment.appointmentDate, appointment.slotTime)
    ) {
      return sendError("You can add a prescription only after the scheduled time");
    }

    appointment.diagnosis = readOptionalText(body.diagnosis);
    appointment.instructions = readOptionalText(body.instructions);
    appointment.set("medicines", cleanMedicines(body.medicines));
    await appointment.save();
    return sendSuccess({ message: "Prescription saved", appointment });
  } catch (error) {
    return handleApiError(error);
  }
}
