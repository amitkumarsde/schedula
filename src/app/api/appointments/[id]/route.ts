import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { sendSuccess, sendError, handleApiError } from "@/lib/utils/apiResponse";
import { readJsonBody, isNonEmptyText } from "@/lib/utils/apiRequest";
import Appointment from "@/lib/models/Appointment";

// True when this user is the patient or the doctor on the appointment.
function isOwnAppointment(appointment: { patientUserId: unknown; doctorUserId: unknown }, userId: string) {
  return String(appointment.patientUserId) === userId || String(appointment.doctorUserId) === userId;
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

// Cancels or completes one appointment.
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await readJsonBody(request);
    if (!body) return sendError("Please send the details as a JSON object");

    const { userId, status } = body;
    if (!isNonEmptyText(userId)) return sendError("userId is required");

    if (status !== "completed" && status !== "cancelled") {
      return sendError("Status must be completed or cancelled");
    }

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

    // Only the doctor can mark an appointment as completed.
    if (status === "completed" && String(appointment.doctorUserId) !== userId) {
      return sendError("Only the doctor can complete an appointment", 403);
    }

    appointment.status = status;
    await appointment.save();

    return sendSuccess({ message: "Appointment updated", appointment });
  } catch (error) {
    return handleApiError(error);
  }
}
