import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { sendSuccess, sendError, handleApiError } from "@/lib/utils/apiResponse";
import { readJsonBody, isNonEmptyText, readOptionalText } from "@/lib/utils/apiRequest";
import { toSafeUser } from "@/lib/auth/toSafeUser";
import { CheckResult } from "@/lib/profile/checkResult";
import { validateDoctorBasic, validateDoctorProfessional, validateDoctorAvailability } from "@/lib/profile/validateDoctorProfile";
import User from "@/lib/models/User";
import Doctor from "@/lib/models/Doctor";

const SAVE_OPTIONS = { new: true, runValidators: true };

// Picks the right check for a doctor tab, or null when the tab name is unknown.
function checkDoctorSection(section: string, body: Record<string, unknown>): CheckResult | null {
  if (section === "basic") return validateDoctorBasic(body);
  if (section === "professional") return validateDoctorProfessional(body);
  if (section === "availability") return validateDoctorAvailability(body);
  return null;
}

// Returns the saved profile of one doctor.
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!isNonEmptyText(userId)) return sendError("userId is required");

    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) return sendError("User not found", 404);
    if (user.role !== "doctor") return sendError("This user is not a doctor", 403);

    const doctorProfile = await Doctor.findOne({ userId });
    return sendSuccess({ doctorProfile });
  } catch (error) {
    return handleApiError(error);
  }
}

// Saves one tab of a doctor profile.
export async function PUT(request: NextRequest) {
  try {
    const body = await readJsonBody(request);
    if (!body) return sendError("Please send the details as a JSON object");

    if (!isNonEmptyText(body.userId)) return sendError("userId is required");

    const section = readOptionalText(body.section);
    if (!section) return sendError("section is required");

    await connectToDatabase();

    const user = await User.findById(body.userId);
    if (!user) return sendError("User not found", 404);
    if (user.role !== "doctor") return sendError("This user is not a doctor", 403);

    const result = checkDoctorSection(section, body);
    if (!result) return sendError("Unknown profile section");
    if (!result.fields) return sendError(result.errorMessage);

    // A doctor can be listed for booking only after the specialization is filled.
    if (section === "availability" && result.fields.isAvailable === true) {
      const current = await Doctor.findOne({ userId: user._id });
      if (!current?.specialization) {
        return sendError("Add your specialization before you turn on booking");
      }
    }

    const profile = await Doctor.findOneAndUpdate({ userId: user._id }, result.fields, SAVE_OPTIONS);
    if (!profile) return sendError("Profile not found, please sign up again", 404);

    if (section === "basic") {
      user.isProfileComplete = true;
      await user.save();
    }

    return sendSuccess({ message: "Profile saved successfully", user: toSafeUser(user), doctorProfile: profile });
  } catch (error) {
    return handleApiError(error);
  }
}
