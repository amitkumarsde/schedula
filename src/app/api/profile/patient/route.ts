import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { sendSuccess, sendError, handleApiError } from "@/lib/utils/apiResponse";
import { readJsonBody, isNonEmptyText, readOptionalText } from "@/lib/utils/apiRequest";
import { toSafeUser } from "@/lib/auth/toSafeUser";
import { CheckResult } from "@/lib/profile/checkResult";
import { validatePatientBasic, validatePatientMedical, validatePatientEmergency } from "@/lib/profile/validatePatientProfile";
import { validateFileLinks } from "@/lib/profile/validateFileLinks";
import User from "@/lib/models/User";
import Patient from "@/lib/models/Patient";

const SAVE_OPTIONS = { new: true, runValidators: true };

// Picks the right check for a patient tab, or null when the tab name is unknown.
function checkPatientSection(section: string, body: Record<string, unknown>): CheckResult | null {
  if (section === "basic") return validatePatientBasic(body);
  if (section === "medical") return validatePatientMedical(body);
  if (section === "emergency") return validatePatientEmergency(body);
  if (section === "documents") return validateFileLinks("documents", body);
  if (section === "reports") return validateFileLinks("testReports", body);
  return null;
}

// Returns the saved profile of one patient.
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!isNonEmptyText(userId)) return sendError("userId is required");

    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) return sendError("User not found", 404);
    if (user.role !== "patient") return sendError("This user is not a patient", 403);

    const patientProfile = await Patient.findOne({ userId });
    return sendSuccess({ patientProfile });
  } catch (error) {
    return handleApiError(error);
  }
}

// Saves one tab of a patient profile.
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
    if (user.role !== "patient") return sendError("This user is not a patient", 403);

    const result = checkPatientSection(section, body);
    if (!result) return sendError("Unknown profile section");
    if (!result.fields) return sendError(result.errorMessage);

    const profile = await Patient.findOneAndUpdate({ userId: user._id }, result.fields, SAVE_OPTIONS);
    if (!profile) return sendError("Profile not found, please sign up again", 404);

    // The "Basic info" tab holds the main details, so saving it completes the account.
    if (section === "basic") {
      user.isProfileComplete = true;
      await user.save();
    }

    return sendSuccess({ message: "Profile saved successfully", user: toSafeUser(user), patientProfile: profile });
  } catch (error) {
    return handleApiError(error);
  }
}
