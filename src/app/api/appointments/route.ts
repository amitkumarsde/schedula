import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { sendSuccess, sendError, handleApiError, isDuplicateKeyError } from "@/lib/utils/apiResponse";
import { readJsonBody, isNonEmptyText, readOptionalText } from "@/lib/utils/apiRequest";
import { makeSlots, weekdayName, appointmentHasStarted } from "@/lib/utils/schedule";
import { VISIT_TYPES, MEET_TYPES, CONSULT_TYPES } from "@/lib/utils/appointmentOptions";
import User from "@/lib/models/User";
import Doctor from "@/lib/models/Doctor";
import Patient from "@/lib/models/Patient";
import Appointment from "@/lib/models/Appointment";

// Returns the logged in user's appointments.
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!isNonEmptyText(userId)) return sendError("userId is required");

    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) return sendError("User not found", 404);

    const filter = user.role === "patient" ? { patientUserId: userId } : { doctorUserId: userId };

    const appointments = await Appointment.find(filter).sort({ createdAt: -1 });

    return sendSuccess({ count: appointments.length, appointments });
  } catch (error) {
    return handleApiError(error);
  }
}

// The next number comes from the highest one so far, because a count breaks after a delete.
async function nextAppointmentNumber() {
  const last = await Appointment.findOne().sort({ appointmentNumber: -1 }).select("appointmentNumber");
  return (last?.appointmentNumber ?? 0) + 1;
}

// Books one appointment for a patient.
export async function POST(request: NextRequest) {
  try {
    const body = await readJsonBody(request);
    if (!body) return sendError("Please send the details as a JSON object");

    const { patientUserId, doctorId, appointmentDate, slotTime } = body;
    const problem = readOptionalText(body.problem);
    const visitType = readOptionalText(body.visitType);
    const meetType = readOptionalText(body.meetType);
    const consultType = readOptionalText(body.consultType);

    if (!isNonEmptyText(patientUserId) || !isNonEmptyText(doctorId)) {
      return sendError("patientUserId and doctorId are required");
    }
    if (!isNonEmptyText(appointmentDate) || !isNonEmptyText(slotTime)) {
      return sendError("Please pick a date and a time slot");
    }

    if (!VISIT_TYPES.includes(visitType)) return sendError("Please select a visit type");
    if (!MEET_TYPES.includes(meetType)) return sendError("Please select a meet type");
    if (!CONSULT_TYPES.includes(consultType)) return sendError("Please select a consult type");

    await connectToDatabase();

    // Only a real patient can book.
    const patientUser = await User.findById(patientUserId);
    if (!patientUser || patientUser.role !== "patient") {
      return sendError("Only a patient can book an appointment", 403);
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return sendError("Doctor not found", 404);

    if (!doctor.isAvailable || !doctor.availableDays.includes(weekdayName(appointmentDate))) {
      return sendError("The doctor is not available on this day");
    }

    // The doctor must allow each chosen option.
    if (!doctor.visitTypes.includes(visitType)) {
      return sendError("This doctor does not offer that visit type");
    }
    if (!doctor.meetTypes.includes(meetType)) {
      return sendError("This doctor does not offer that meet type");
    }
    if (!doctor.consultTypes.includes(consultType)) {
      return sendError("This doctor does not offer that consult type");
    }

    // The chosen slot must be a real slot from the doctor's timings.
    const allSlots = makeSlots(
      doctor.startTime,
      doctor.endTime,
      doctor.slotDuration,
      doctor.breakDuration
    );
    if (!allSlots.includes(slotTime)) {
      return sendError("This time slot is not available");
    }

    // A slot in the past cannot be booked.
    if (appointmentHasStarted(appointmentDate, slotTime)) {
      return sendError("That time has already passed, please pick a later slot");
    }

    // The slot must still be free.
    const alreadyBooked = await Appointment.findOne({
      doctorUserId: doctor.userId,
      appointmentDate,
      slotTime,
      status: { $ne: "cancelled" },
    });
    if (alreadyBooked) return sendError("This slot was just booked, please pick another");

    const patientProfile = await Patient.findOne({ userId: patientUserId });
    const patientName = patientProfile?.fullName || patientUser.fullName;

    const details = {
      doctorUserId: doctor.userId,
      patientUserId,
      doctorName: doctor.fullName,
      doctorSpecialization: doctor.specialization,
      consultationFee: doctor.consultationFee,
      patientName,
      appointmentDate,
      slotTime,
      problem,
      visitType,
      meetType,
      consultType,
    };

    // Two bookings can pick the same number at once, so try again with a fresh one.
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const appointment = await Appointment.create({
          appointmentNumber: await nextAppointmentNumber(),
          ...details,
        });
        return sendSuccess({ message: "Appointment booked", appointment }, 201);
      } catch (error) {
        if (isDuplicateKeyError(error, "appointmentNumber") && attempt < 4) continue;
        throw error;
      }
    }

    // Reached only if every retry clashed, which is very unlikely.
    return sendError("Could not book the appointment, please try again");
  } catch (error) {
    return handleApiError(error);
  }
}
