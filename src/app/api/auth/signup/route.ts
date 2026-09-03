import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { sendSuccess, sendError, handleApiError, isDuplicateKeyError } from "@/lib/utils/apiResponse";
import { readJsonBody, isNonEmptyText } from "@/lib/utils/apiRequest";
import { EMAIL_PATTERN, isValidFullName, FULL_NAME_MESSAGE } from "@/lib/utils/validation";
import { toSafeUser } from "@/lib/auth/toSafeUser";
import User from "@/lib/models/User";
import Patient from "@/lib/models/Patient";
import Doctor from "@/lib/models/Doctor";

// Creates a new account as a patient or a doctor.
export async function POST(request: NextRequest) {
  try {
    const body = await readJsonBody(request);
    if (!body) return sendError("Please send the details as a JSON object");

    const { fullName, email, password, role } = body;

    if (!isNonEmptyText(fullName) || !isNonEmptyText(email) || !isNonEmptyText(password)) {
      return sendError("Full name, email and password are required");
    }

    if (role !== "patient" && role !== "doctor") {
      return sendError("Role must be either patient or doctor");
    }

    const cleanFullName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!isValidFullName(cleanFullName)) {
      return sendError(FULL_NAME_MESSAGE);
    }

    if (!EMAIL_PATTERN.test(cleanEmail)) {
      return sendError("Please enter a valid email address");
    }

    if (password.length < 4) {
      return sendError("Password must be at least 4 characters");
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) return sendError("This email is already registered", 409);

    const user = await User.create({ fullName: cleanFullName, email: cleanEmail, password, role });

    if (role === "patient") {
      await Patient.create({ userId: user._id, fullName: cleanFullName });
    } else {
      await Doctor.create({ userId: user._id, fullName: cleanFullName });
    }

    return sendSuccess({ message: "Account created successfully", user: toSafeUser(user) }, 201);
  } catch (error) {
    if (isDuplicateKeyError(error, "email")) {
      return sendError("This email is already registered", 409);
    }
    return handleApiError(error);
  }
}
