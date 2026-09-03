import mongoose from "mongoose";

// One notification, stored inside a patient or doctor profile.
// Shared by both models so the fields and the type list live in one place.
export const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  type: { type: String, enum: ["reschedule", "cancel", "patient-cancel", "missed", "complete"] },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
