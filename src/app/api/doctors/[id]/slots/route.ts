import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { sendSuccess, sendError, handleApiError } from "@/lib/utils/apiResponse";
import { makeSlots, weekdayName } from "@/lib/utils/schedule";
import Doctor from "@/lib/models/Doctor";
import Appointment from "@/lib/models/Appointment";

// Returns the time slots for one doctor on one date.
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const date = request.nextUrl.searchParams.get("date");

    if (!date) return sendError("date is required");

    await connectToDatabase();

    const doctor = await Doctor.findById(id);
    if (!doctor) return sendError("Doctor not found", 404);

    // The doctor works this day only if it is one of their chosen days and booking is on.
    const isWorkingDay = doctor.isAvailable && doctor.availableDays.includes(weekdayName(date));

    if (!isWorkingDay) {
      return sendSuccess({ date, isWorkingDay: false, slots: [] });
    }

    const slotTimes = [
      ...makeSlots(doctor.morningStartTime, doctor.morningEndTime, doctor.slotDurationMinutes),
      ...makeSlots(doctor.eveningStartTime, doctor.eveningEndTime, doctor.slotDurationMinutes),
    ];

    // A slot is taken if an appointment already holds it and was not cancelled.
    const booked = await Appointment.find({
      doctorUserId: doctor.userId,
      appointmentDate: date,
      status: { $ne: "cancelled" },
    });
    const takenTimes = new Set(booked.map((appointment) => appointment.slotTime));

    const slots = slotTimes.map((time) => ({ time, taken: takenTimes.has(time) }));

    return sendSuccess({ date, isWorkingDay: true, slots });
  } catch (error) {
    return handleApiError(error);
  }
}
