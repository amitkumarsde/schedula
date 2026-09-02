import Doctor from "@/lib/models/Doctor";
import Patient from "@/lib/models/Patient";

type WithUserIds = { doctorUserId: unknown; patientUserId: unknown; toObject?: () => Record<string, unknown> };

// Adds doctor and patient display data (read from their profiles) to each appointment.
export async function enrichAppointments<T extends WithUserIds>(appointments: T[]) {
  const doctorUserIds = [...new Set(appointments.map((a) => String(a.doctorUserId)))];
  const patientUserIds = [...new Set(appointments.map((a) => String(a.patientUserId)))];

  const doctors = await Doctor.find({ userId: { $in: doctorUserIds } });
  const patients = await Patient.find({ userId: { $in: patientUserIds } });

  const doctorByUser = new Map(doctors.map((d) => [String(d.userId), d]));
  const patientByUser = new Map(patients.map((p) => [String(p.userId), p]));

  return appointments.map((appointment) => {
    const base = appointment.toObject ? appointment.toObject() : appointment;
    const doctor = doctorByUser.get(String(appointment.doctorUserId));
    const patient = patientByUser.get(String(appointment.patientUserId));

    return {
      ...base,
      doctor: {
        id: doctor ? String(doctor._id) : "",
        name: doctor?.fullName ?? "",
        specialization: doctor?.specialization ?? "",
      },
      patient: {
        name: patient?.fullName ?? "",
        age: patient?.age ?? 0,
        gender: patient?.gender ?? "",
        mobileNumber: patient?.mobileNumber ?? "",
        allergies: patient?.allergies ?? [],
        diseases: patient?.diseases ?? [],
      },
    };
  });
}
