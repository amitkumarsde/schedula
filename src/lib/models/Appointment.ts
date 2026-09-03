import mongoose, { InferSchemaType, Model } from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    dosage: { type: String, default: "", trim: true },
    duration: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String, default: "" },
  },
  { _id: false }
);

const appointmentSchema = new mongoose.Schema(
  {
    appointmentNumber: { type: Number, required: true, unique: true },
    doctorUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    patientUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    consultationFee: { type: Number, default: 0 },
    appointmentDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    problem: { type: String, default: "" },
    visitType: { type: String, default: "" },
    meetType: { type: String, default: "" },
    consultType: { type: String, default: "" },
    diagnosis: { type: String, default: "" },
    instructions: { type: String, default: "" },
    medicines: { type: [medicineSchema], default: [] },
    review: { type: reviewSchema, default: null },
    status: { type: String, enum: ["upcoming", "completed", "missed", "cancelled"], default: "upcoming" },
  },
  { timestamps: true }
);

type AppointmentDocument = InferSchemaType<typeof appointmentSchema>;

const Appointment: Model<AppointmentDocument> = mongoose.models.Appointment || mongoose.model<AppointmentDocument>("Appointment", appointmentSchema);

export default Appointment;
