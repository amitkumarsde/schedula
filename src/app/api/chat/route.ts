import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { sendSuccess, sendError, handleApiError } from "@/lib/utils/apiResponse";
import { readJsonBody, isNonEmptyText } from "@/lib/utils/apiRequest";
import { askAssistant } from "@/lib/ai/chatbot";
import User from "@/lib/models/User";
import ChatMessage from "@/lib/models/ChatMessage";

// Returns the logged in user's chat history, oldest first.
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!isNonEmptyText(userId)) return sendError("Please log in to use the chat", 401);

    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) return sendError("Please log in to use the chat", 401);

    const messages = await ChatMessage.find({ userId }).sort({ createdAt: 1 });
    return sendSuccess({ messages });
  } catch (error) {
    return handleApiError(error);
  }
}

// Saves the question, asks the assistant, then saves and returns the reply.
export async function POST(request: NextRequest) {
  try {
    const body = await readJsonBody(request);
    if (!body) return sendError("Please send the details as a JSON object");

    const { userId, message } = body;
    if (!isNonEmptyText(userId)) return sendError("Please log in to use the chat", 401);
    if (!isNonEmptyText(message)) return sendError("Please type a message");

    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) return sendError("Please log in to use the chat", 401);

    const question = message.trim().slice(0, 1000);
    await ChatMessage.create({ userId, role: "user", text: question });

    const answer = await askAssistant(question);
    const reply = await ChatMessage.create({ userId, role: "assistant", text: answer });

    return sendSuccess({ reply });
  } catch (error) {
    return handleApiError(error);
  }
}

// Deletes the user's whole chat. Called on logout so nothing is kept.
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!isNonEmptyText(userId)) return sendError("userId is required");

    await connectToDatabase();

    await ChatMessage.deleteMany({ userId });
    return sendSuccess({ message: "Chat cleared" });
  } catch (error) {
    return handleApiError(error);
  }
}
