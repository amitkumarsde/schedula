import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { sendSuccess, sendError, handleApiError } from "@/lib/utils/apiResponse";
import { readJsonBody, isNonEmptyText } from "@/lib/utils/apiRequest";
import User from "@/lib/models/User";
import Patient from "@/lib/models/Patient";
import Doctor from "@/lib/models/Doctor";

// Returns the logged in user's notifications, newest first.
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!isNonEmptyText(userId)) return sendError("userId is required");

    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) return sendError("User not found", 404);

    // Notifications live on the patient or doctor profile.
    const profile =
      user.role === "doctor" ? await Doctor.findOne({ userId }) : await Patient.findOne({ userId });

    const notifications = [...(profile?.notifications ?? [])].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const unreadCount = notifications.filter((one) => !one.isRead).length;

    return sendSuccess({ notifications, unreadCount });
  } catch (error) {
    return handleApiError(error);
  }
}

// Marks all of the user's notifications as read.
export async function PATCH(request: NextRequest) {
  try {
    const body = await readJsonBody(request);
    if (!body || !isNonEmptyText(body.userId)) return sendError("userId is required");

    await connectToDatabase();

    const user = await User.findById(body.userId);
    if (!user) return sendError("User not found", 404);

    const markRead = { $set: { "notifications.$[].isRead": true } };
    if (user.role === "doctor") {
      await Doctor.updateOne({ userId: body.userId }, markRead);
    } else {
      await Patient.updateOne({ userId: body.userId }, markRead);
    }

    return sendSuccess({ message: "Notifications marked as read" });
  } catch (error) {
    return handleApiError(error);
  }
}
