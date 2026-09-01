import mongoose, { InferSchemaType, Model } from "mongoose";

const fileLinkSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    url: { type: String, trim: true },
  },
  { _id: false }
);

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const patientSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    fullName: { type: String, required: true, trim: true },
    age: { type: Number, min: 0, max: 120 },
    gender: { type: String, enum: ["male", "female", "other"] },
    profileImage: { type: String, default: "" },
    mobileNumber: { type: String, trim: true },
    height: { type: Number, min: 0 },
    weight: { type: Number, min: 0 },
    bloodGroup: { type: String, default: "" },
    city: { type: String, default: "" },
    allergies: { type: [String], default: [] },
    diseases: { type: [String], default: [] },
    documents: { type: [fileLinkSchema], default: [] },
    testReports: { type: [fileLinkSchema], default: [] },
    notifications: { type: [notificationSchema], default: [] },
  },
  { timestamps: true }
);

type PatientDocument = InferSchemaType<typeof patientSchema>;

const Patient: Model<PatientDocument> =
  mongoose.models.Patient || mongoose.model<PatientDocument>("Patient", patientSchema);

export default Patient;
