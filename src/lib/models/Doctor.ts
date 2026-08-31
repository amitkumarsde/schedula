import mongoose, { InferSchemaType, Model } from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    fullName: { type: String, required: true, trim: true },
    gender: { type: String, enum: ["male", "female"], required: true },
    profileImage: { type: String, default: "" },
    mobileNumber: { type: String, required: true, trim: true },
    specialization: { type: String, required: true, trim: true },
    qualification: { type: String, required: true, trim: true },
    experienceYears: { type: Number, required: true, min: 0 },
    about: { type: String, default: "" },
    city: { type: String, required: true, trim: true },
    hospitalName: { type: String, default: "" },
    consultationFee: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalPatients: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

type DoctorDocument = InferSchemaType<typeof doctorSchema>;

const Doctor: Model<DoctorDocument> =
  mongoose.models.Doctor || mongoose.model<DoctorDocument>("Doctor", doctorSchema);

export default Doctor;
