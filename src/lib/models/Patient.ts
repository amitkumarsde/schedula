import mongoose, { InferSchemaType, Model } from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    fullName: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0, max: 120 },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    profileImage: { type: String, default: "" },
    mobileNumber: { type: String, required: true, trim: true },
    weight: { type: Number, required: true, min: 0 },
    bloodGroup: { type: String, default: "" },
    city: { type: String, default: "" },
  },
  { timestamps: true }
);

type PatientDocument = InferSchemaType<typeof patientSchema>;

const Patient: Model<PatientDocument> =
  mongoose.models.Patient || mongoose.model<PatientDocument>("Patient", patientSchema);

export default Patient;
