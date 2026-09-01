import { apiGet, apiPost, apiPatch } from "@/lib/api/apiClient";
import type { Appointment, AppointmentStatus, Slot } from "@/types";

// Loads the time slots for one doctor on one date.
export async function getDoctorSlots(
  doctorId: string,
  date: string
): Promise<{ isWorkingDay: boolean; slots: Slot[] }> {
  const data = await apiGet(`/doctors/${doctorId}/slots?date=${date}`);
  return { isWorkingDay: data.isWorkingDay, slots: data.slots };
}

// Books one appointment and returns it.
export async function bookAppointment(payload: {
  patientUserId: string;
  doctorId: string;
  appointmentDate: string;
  slotTime: string;
  problem: string;
  visitType: string;
  meetType: string;
}): Promise<Appointment> {
  const data = await apiPost("/appointments", payload);
  return data.appointment;
}

// Loads the logged in user's appointments.
export async function getMyAppointments(userId: string): Promise<Appointment[]> {
  const data = await apiGet(`/appointments?userId=${userId}`);
  return data.appointments;
}

// Loads one appointment by id.
export async function getAppointment(appointmentId: string, userId: string): Promise<Appointment> {
  const data = await apiGet(`/appointments/${appointmentId}?userId=${userId}`);
  return data.appointment;
}

// Changes an appointment status, like cancel or complete.
export async function updateAppointmentStatus(
  appointmentId: string,
  userId: string,
  status: AppointmentStatus
): Promise<Appointment> {
  const data = await apiPatch(`/appointments/${appointmentId}`, { userId, status });
  return data.appointment;
}
