import mongoose, { InferSchemaType, Model } from "mongoose";

// The doctor and patient names are copied in, so the record stays correct even if a profile changes later.
const appointmentSchema = new mongoose.Schema(
  {
    appointmentNumber: { type: Number, required: true },
    doctorUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    patientUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctorName: { type: String, required: true },
    doctorSpecialization: { type: String, default: "" },
    consultationFee: { type: Number, default: 0 },
    patientName: { type: String, required: true },
    appointmentDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    problem: { type: String, default: "" },
    visitType: { type: String, default: "" },
    meetType: { type: String, default: "" },
    status: {
      type: String,
      enum: ["upcoming", "completed", "cancelled"],
      default: "upcoming",
    },
  },
  { timestamps: true }
);

type AppointmentDocument = InferSchemaType<typeof appointmentSchema>;

const Appointment: Model<AppointmentDocument> =
  mongoose.models.Appointment ||
  mongoose.model<AppointmentDocument>("Appointment", appointmentSchema);

export default Appointment;
