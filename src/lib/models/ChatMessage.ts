import mongoose, { InferSchemaType, Model } from "mongoose";

// One line of a user's chat with the assistant.
const chatMessageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    role: { type: String, enum: ["user", "assistant"], required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

type ChatMessageDocument = InferSchemaType<typeof chatMessageSchema>;

const ChatMessage: Model<ChatMessageDocument> =
  mongoose.models.ChatMessage || mongoose.model<ChatMessageDocument>("ChatMessage", chatMessageSchema);

export default ChatMessage;
