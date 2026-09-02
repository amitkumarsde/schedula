export type Notification = {
  _id: string;
  message: string;
  appointmentId?: string;
  isRead: boolean;
  createdAt: string;
};

export type Doctor = {
  _id: string;
  fullName: string;
  gender: "male" | "female" | "other";
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
  availableDays: string[];
  startTime: string;
  endTime: string;
  slotDuration: number;
  breakDuration: number;
  visitTypes: string[];
  meetTypes: string[];
  consultTypes: string[];
  isAvailable: boolean;
  appointments: string[];
  notifications: Notification[];
};
