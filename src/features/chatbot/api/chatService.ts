import { apiGet, apiPost, apiDelete } from "@/lib/api/apiClient";
import type { ChatMessage } from "@/types";

// Loads the user's saved chat messages.
export async function getChatHistory(userId: string): Promise<ChatMessage[]> {
  const data = await apiGet(`/chat?userId=${userId}`);
  return data.messages;
}

// Sends a message and returns the assistant's reply.
export async function sendChatMessage(userId: string, message: string): Promise<ChatMessage> {
  const data = await apiPost("/chat", { userId, message });
  return data.reply;
}

// Deletes the user's whole chat, used on logout.
export async function clearChatHistory(userId: string) {
  await apiDelete(`/chat?userId=${userId}`);
}
