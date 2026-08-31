// One doctor profile as the API sends it.
export type Doctor = {
  _id: string;
  fullName: string;
  gender: "male" | "female";
  profileImage: string;
  mobileNumber: string;
  specialization: string;
  qualification: string;
  experienceYears: number;
  about: string;
  city: string;
  hospitalName: string;
  consultationFee: number;
  rating: number;
  totalPatients: number;
  totalReviews: number;
  isAvailable: boolean;
};
