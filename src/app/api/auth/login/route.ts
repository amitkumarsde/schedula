import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { sendSuccess, sendError, handleApiError } from "@/lib/utils/apiResponse";
import { readJsonBody, isNonEmptyText } from "@/lib/utils/apiRequest";
import { toSafeUser } from "@/lib/auth/toSafeUser";
import User from "@/lib/models/User";

// POST /api/auth/login - checks the email and password and returns the user.
export async function POST(request: NextRequest) {
  try {
    const body = await readJsonBody(request);
    if (!body) return sendError("Please send the details as a JSON object");

    const { email, password } = body;

    if (!isNonEmptyText(email) || !isNonEmptyText(password)) {
      return sendError("Email and password are required");
    }

    await connectToDatabase();

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user || user.password !== password) {
      return sendError("Invalid email or password", 401);
    }

    return sendSuccess({ message: "Login successful", user: toSafeUser(user) });
  } catch (error) {
    return handleApiError(error);
  }
}
