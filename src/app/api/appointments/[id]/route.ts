import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { sendSuccess, sendError, handleApiError } from "@/lib/utils/apiResponse";
import { readJsonBody, isNonEmptyText, readOptionalText } from "@/lib/utils/apiRequest";
import {
  makeSlots,
  weekdayName,
  appointmentHasStarted,
  formatLongDate,
  formatSlotLabel,
} from "@/lib/utils/schedule";
import Appointment from "@/lib/models/Appointment";
import Doctor from "@/lib/models/Doctor";
import Patient from "@/lib/models/Patient";

// True when this user is the patient or the doctor on the appointment.
function isOwnAppointment(appointment: { patientUserId: unknown; doctorUserId: unknown }, userId: string) {
  return String(appointment.patientUserId) === userId || String(appointment.doctorUserId) === userId;
}

// Keeps only real medicine names typed by the doctor.
function cleanMedicines(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isNonEmptyText).map((item) => item.trim());
}

// Adds one notification to a patient profile (found by their user id).
async function notifyPatient(userId: unknown, message: string, appointmentId: unknown) {
  await Patient.updateOne(
    { userId: String(userId) },
    { $push: { notifications: { message, appointmentId: String(appointmentId), isRead: false } } }
  );
}

// Adds one notification to a doctor profile (found by their user id).
async function notifyDoctor(userId: unknown, message: string, appointmentId: unknown) {
  await Doctor.updateOne(
    { userId: String(userId) },
    { $push: { notifications: { message, appointmentId: String(appointmentId), isRead: false } } }
  );
}

// Returns one appointment for the people on it.
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

    return sendSuccess({ appointment });
  } catch (error) {
    return handleApiError(error);
  }
}

// Updates one appointment: reschedule, save a prescription, cancel or complete.
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await readJsonBody(request);
    if (!body) return sendError("Please send the details as a JSON object");

    const { userId, status, appointmentDate, slotTime } = body;
    if (!isNonEmptyText(userId)) return sendError("userId is required");

    await connectToDatabase();

    const appointment = await Appointment.findById(id);
    if (!appointment) return sendError("Appointment not found", 404);

    if (!isOwnAppointment(appointment, userId)) {
      return sendError("You cannot change this appointment", 403);
    }

    // Only an upcoming appointment can change, so a finished one stays as it is.
    if (appointment.status !== "upcoming") {
      return sendError("This appointment can no longer be changed");
    }

    const isDoctor = String(appointment.doctorUserId) === userId;
    const when = () => `${formatLongDate(appointment.appointmentDate)} at ${formatSlotLabel(appointment.slotTime)}`;

    // 1. Reschedule: only the doctor can move an appointment to a new date and time.
    if (isNonEmptyText(appointmentDate) && isNonEmptyText(slotTime)) {
      if (!isDoctor) return sendError("Only the doctor can reschedule an appointment", 403);

      const doctor = await Doctor.findOne({ userId: appointment.doctorUserId });
      if (!doctor) return sendError("Doctor not found", 404);

      if (!doctor.isAvailable || !doctor.availableDays.includes(weekdayName(appointmentDate))) {
        return sendError("You do not consult on this day");
      }

      const slots = makeSlots(doctor.startTime, doctor.endTime, doctor.slotDuration, doctor.breakDuration);
      if (!slots.includes(slotTime)) return sendError("This time slot is not available");

      // Cannot move an appointment into the past.
      if (appointmentHasStarted(appointmentDate, slotTime)) {
        return sendError("That time has already passed, please pick a later slot");
      }

      // The new slot must be free, ignoring this same appointment.
      const clash = await Appointment.findOne({
        _id: { $ne: appointment._id },
        doctorUserId: doctor.userId,
        appointmentDate,
        slotTime,
        status: { $ne: "cancelled" },
      });
      if (clash) return sendError("That slot is already booked, please pick another");

      appointment.appointmentDate = appointmentDate;
      appointment.slotTime = slotTime;
      await appointment.save();

      await notifyPatient(
        appointment.patientUserId,
        `${appointment.doctorName} rescheduled appointment #${appointment.appointmentNumber} to ${when()}.`,
        appointment._id
      );

      return sendSuccess({ message: "Appointment rescheduled", appointment });
    }

    // 2. Cancel or complete.
    if (isNonEmptyText(status)) {
      if (status !== "completed" && status !== "cancelled") {
        return sendError("Status must be completed or cancelled");
      }

      if (status === "cancelled") {
        appointment.status = "cancelled";
        await appointment.save();

        // Tell the other person their appointment was cancelled.
        const cancelledBy = isDoctor ? appointment.doctorName : appointment.patientName;
        const message = `${cancelledBy} cancelled appointment #${appointment.appointmentNumber} (${when()}).`;
        if (isDoctor) {
          await notifyPatient(appointment.patientUserId, message, appointment._id);
        } else {
          await notifyDoctor(appointment.doctorUserId, message, appointment._id);
        }

        return sendSuccess({ message: "Appointment cancelled", appointment });
      }

      // Only the doctor can complete, and only after the visit time, with a prescription.
      if (!isDoctor) return sendError("Only the doctor can complete an appointment", 403);
      if (!appointmentHasStarted(appointment.appointmentDate, appointment.slotTime)) {
        return sendError("You can complete the visit only after its scheduled time");
      }
      if (!appointment.prescriptionDescription) {
        return sendError("Add a prescription description before marking it completed");
      }

      appointment.status = "completed";
      await appointment.save();
      return sendSuccess({ message: "Appointment completed", appointment });
    }

    // 3. Otherwise: the doctor is saving a prescription.
    if (!isDoctor) return sendError("Only the doctor can add a prescription", 403);
    if (!appointmentHasStarted(appointment.appointmentDate, appointment.slotTime)) {
      return sendError("You can add a prescription only after the scheduled time");
    }

    appointment.prescriptionDescription = readOptionalText(body.prescriptionDescription);
    appointment.medicines = cleanMedicines(body.medicines);
    await appointment.save();
    return sendSuccess({ message: "Prescription saved", appointment });
  } catch (error) {
    return handleApiError(error);
  }
}
