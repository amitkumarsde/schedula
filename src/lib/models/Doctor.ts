import mongoose, { InferSchemaType, Model } from "mongoose";
import { notificationSchema } from "@/lib/models/notificationSchema";

const doctorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    fullName: { type: String, required: true, trim: true },
    gender: { type: String, enum: ["male", "female"] },
    profileImage: { type: String, default: "" },
    mobileNumber: { type: String, trim: true },
    specialization: { type: String, default: "", trim: true },
    qualification: { type: String, default: "", trim: true },
    experienceYears: { type: Number, min: 0, default: 0 },
    about: { type: String, default: "" },
    city: { type: String, default: "", trim: true },
    hospitalName: { type: String, default: "" },
    consultationFee: { type: Number, min: 0, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalPatients: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    availableDays: { type: [String], default: [] },
    startTime: { type: String, default: "" },
    endTime: { type: String, default: "" },
    slotDuration: { type: Number, default: 15 },
    breakDuration: { type: Number, default: 0 },
    visitTypes: { type: [String], default: [] },
    meetTypes: { type: [String], default: [] },
    consultTypes: { type: [String], default: [] },
    isAvailable: { type: Boolean, default: false },
    appointments: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }], default: [] },
    notifications: { type: [notificationSchema], default: [] },
  },
  { timestamps: true }
);

type DoctorDocument = InferSchemaType<typeof doctorSchema>;

const Doctor: Model<DoctorDocument> = mongoose.models.Doctor || mongoose.model<DoctorDocument>("Doctor", doctorSchema);

export default Doctor;
