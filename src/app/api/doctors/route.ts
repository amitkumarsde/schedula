import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { sendSuccess, handleApiError } from "@/lib/utils/apiResponse";
import Doctor from "@/lib/models/Doctor";

// Returns the doctors list with optional search and filter.
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const search = request.nextUrl.searchParams.get("search");
    const specialization = request.nextUrl.searchParams.get("specialization");

    const filter: Record<string, unknown> = { isAvailable: true };

    if (specialization) filter.specialization = specialization;

    const cleanSearch = search?.trim().slice(0, 100);

    if (cleanSearch) {
      let searchPattern: RegExp;

      try {
        searchPattern = new RegExp(cleanSearch, "i");
      } catch {
        return sendSuccess({ count: 0, doctors: [] });
      }

      filter.$or = [
        { fullName: searchPattern },
        { specialization: searchPattern },
        { city: searchPattern },
      ];
    }

    const doctors = await Doctor.find(filter).select("-notifications -appointments").sort({ rating: -1 });

    return sendSuccess({ count: doctors.length, doctors });
  } catch (error) {
    return handleApiError(error);
  }
}
