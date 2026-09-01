export type AppointmentStatus = "upcoming" | "completed" | "cancelled";

export type Appointment = {
  _id: string;
  appointmentNumber: number;
  doctorUserId: string;
  patientUserId: string;
  doctorName: string;
  doctorSpecialization: string;
  consultationFee: number;
  patientName: string;
  appointmentDate: string;
  slotTime: string;
  problem: string;
  visitType: string;
  meetType: string;
  consultType: string;
  prescriptionDescription: string;
  medicines: string[];
  status: AppointmentStatus;
  createdAt: string;
};

export type Slot = {
  time: string;
  taken: boolean;
  past: boolean;
};
