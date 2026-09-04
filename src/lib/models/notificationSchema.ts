import mongoose from "mongoose";

export const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  type: { type: String, enum: ["reschedule", "cancel", "patient-cancel", "missed", "complete"] },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
