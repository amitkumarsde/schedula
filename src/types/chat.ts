export type ChatMessage = {
  _id: string;
  role: "user" | "assistant";
  text: string;
  createdAt: string;
};
