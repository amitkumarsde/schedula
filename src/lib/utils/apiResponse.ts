import { NextResponse } from "next/server";
import { Error as MongooseError } from "mongoose";

export function sendSuccess(data: Record<string, unknown>, status = 200) {
  return NextResponse.json({ success: true, ...data }, { status });
}

export function sendError(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

// True when MongoDB rejected a value that must be unique, like an email already used.
export function isDuplicateKeyError(error: unknown, field?: string): boolean {
  const mongoError = error as { code?: number; keyPattern?: Record<string, number> };
  if (mongoError?.code !== 11000) return false;
  if (!field) return true;
  return mongoError.keyPattern?.[field] !== undefined;
}

// Turns a caught error into the right reply: 400 for bad data, 500 only for a real crash.
export function handleApiError(error: unknown) {
  if (error instanceof MongooseError.ValidationError) {
    const firstProblem = Object.values(error.errors)[0];
    return sendError(firstProblem?.message ?? "Please check the values you sent");
  }

  if (error instanceof MongooseError.CastError) {
    return sendError(`Invalid value sent for ${error.path}`);
  }

  if (isDuplicateKeyError(error)) {
    return sendError("This record already exists", 409);
  }

  console.error("API error:", error);
  return NextResponse.json({ success: false, message: "Something went wrong on the server" }, { status: 500 });
}
