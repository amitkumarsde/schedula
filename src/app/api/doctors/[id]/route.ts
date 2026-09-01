import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { sendSuccess, sendError, handleApiError } from "@/lib/utils/apiResponse";
import Doctor from "@/lib/models/Doctor";

// Returns one doctor's full profile.
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    await connectToDatabase();

    const doctor = await Doctor.findById(id);
    if (!doctor) return sendError("Doctor not found", 404);

    return sendSuccess({ doctor });
  } catch (error) {
    return handleApiError(error);
  }
}
