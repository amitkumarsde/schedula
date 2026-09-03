export type AppointmentStatus = "upcoming" | "completed" | "missed" | "cancelled";

export type Appointment = {
  _id: string;
  appointmentNumber: number;
  doctorUserId: string;
  patientUserId: string;
  consultationFee: number;
  doctor: AppointmentDoctor;
  patient: AppointmentPatient;
  appointmentDate: string;
  slotTime: string;
  problem: string;
  visitType: string;
  meetType: string;
  consultType: string;
  diagnosis: string;
  instructions: string;
  medicines: Medicine[];
  review: Review | null;
  status: AppointmentStatus;
  createdAt: string;
};

type AppointmentDoctor = {
  id: string;
  name: string;
  specialization: string;
};

type AppointmentPatient = {
  name: string;
  age: number;
  gender: string;
  mobileNumber: string;
  allergies: string[];
  diseases: string[];
};

export type Medicine = {
  name: string;
  dosage: string;
  duration: string;
};

export type Review = {
  rating: number;
  comment: string;
};

export type Slot = {
  time: string;
  taken: boolean;
  past: boolean;
};
