"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, CalendarDays, Clock } from "lucide-react";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import FormTextarea from "@/components/ui/FormTextarea";
import OptionGroup from "@/components/ui/OptionGroup";
import { useAuth } from "@/lib/auth/AuthContext";
import { useDoctor } from "@/features/doctors/hooks/useDoctor";
import { useDoctorSlots } from "@/features/appointments/hooks/useDoctorSlots";
import { bookAppointment } from "@/features/appointments/api/appointmentService";
import DoctorSummaryCard from "@/features/appointments/components/DoctorSummaryCard";
import AppCalendar from "@/components/ui/AppCalendar";
import SlotPicker from "@/features/appointments/components/SlotPicker";
import { formatLongDate, formatSlotLabel, firstWorkingDate } from "@/lib/utils/schedule";
import { VISIT_TYPES, MEET_TYPES, CONSULT_TYPES } from "@/lib/utils/appointmentOptions";
import { toast } from "react-toastify";
import type { Appointment } from "@/types";

// The single page to book an appointment.
export default function BookingFlow({ doctorId }: { doctorId: string }) {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { doctor, isLoading: isDoctorLoading, errorMessage: doctorError } = useDoctor(doctorId);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [visitType, setVisitType] = useState("");
  const [meetType, setMeetType] = useState("");
  const [consultType, setConsultType] = useState("");
  const [problem, setProblem] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [booked, setBooked] = useState<Appointment | null>(null);

  // The date starts on the first day the doctor works, until the patient picks another.
  const activeDate = selectedDate || firstWorkingDate(doctor?.availableDays ?? []);

  const today = new Date();
  const bookingMaxDate = new Date(today.getFullYear(), today.getMonth() + 3, 0);

  const { slots, isWorkingDay, isLoading: areSlotsLoading } = useDoctorSlots(doctorId, activeDate);

  // Only a logged in patient can book. Send anyone else away.
  useEffect(() => {
    if (isAuthLoading) return;
    if (!user) router.push("/login");
    else if (user.role !== "patient") router.push(`/doctors/${doctorId}`);
  }, [isAuthLoading, user, doctorId, router]);

  // Picking a new date clears the chosen slot, so a taken slot is never carried over.
  function handleDateSelect(date: string) {
    setSelectedDate(date);
    setSelectedSlot("");
  }

  // Books the appointment with the chosen details.
  async function handleBook() {
    if (!user) return;

    setBookingError("");
    setIsBooking(true);

    try {
      const appointment = await bookAppointment({
        patientUserId: user._id,
        doctorId,
        appointmentDate: activeDate,
        slotTime: selectedSlot,
        problem,
        visitType,
        meetType,
        consultType,
      });
      setBooked(appointment);
      toast.success("Appointment booked");
    } catch (error) {
      const text = error instanceof Error ? error.message : "Could not book the appointment";
      setBookingError(text);
      toast.error(text);
    } finally {
      setIsBooking(false);
    }
  }

  if (isAuthLoading || isDoctorLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="h-64 animate-pulse rounded-2xl bg-surface" />
      </div>
    );
  }

  if (doctorError || !doctor) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Alert message={doctorError || "Doctor not found"} />
      </div>
    );
  }

  // After a successful booking, show the confirmation.
  if (booked) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-success" />
        <h1 className="mt-4 text-2xl font-bold text-ink">Appointment booked</h1>
        <p className="mt-1 text-sm text-muted">Appointment number #{booked.appointmentNumber}</p>

        <div className="mt-8 text-left">
          <DoctorSummaryCard
            name={doctor.fullName}
            specialization={doctor.specialization}
            qualification={doctor.qualification}
            imageUrl={doctor.profileImage}
          />
        </div>

        <div className="mt-4 flex flex-col gap-3 border-y border-line py-4 text-left sm:flex-row sm:justify-between">
          <span className="flex items-center gap-2 text-sm text-ink">
            <CalendarDays className="h-4 w-4 text-brand" />
            {formatLongDate(booked.appointmentDate)}
          </span>
          <span className="flex items-center gap-2 text-sm text-ink">
            <Clock className="h-4 w-4 text-brand" />
            {formatSlotLabel(booked.slotTime)}
          </span>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row-reverse">
          <Button href={`/appointments/${booked._id}`} fullWidth>
            View my appointment
          </Button>
          <Button href="/appointments" variant="outline" fullWidth>
            My appointments
          </Button>
        </div>
      </div>
    );
  }

  // Everything is ready to book only when all the choices are made.
  const canBook = Boolean(activeDate && selectedSlot && visitType && meetType && consultType);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-ink sm:text-3xl">Book appointment</h1>

      <div className="mt-6 grid items-stretch gap-8 lg:grid-cols-2">
        {/* Left side: the date and the time. */}
        <div className="space-y-6">
          <div>
            <p className="mb-1.5 text-sm font-medium text-ink">Select date</p>
            <AppCalendar
              selectedDate={activeDate}
              onSelectDate={handleDateSelect}
              availableDays={doctor.availableDays}
              minDate={today}
              maxDate={bookingMaxDate}
            />
          </div>

          <div>
            <p className="mb-1.5 text-sm font-medium text-ink">Select slot</p>

            {areSlotsLoading ? (
              <div className="h-24 animate-pulse rounded-2xl bg-surface" />
            ) : !isWorkingDay ? (
              <p className="text-sm text-muted">
                The doctor does not consult on this day. Please pick another date.
              </p>
            ) : slots.length === 0 ? (
              <p className="text-sm text-muted">No slots on this day.</p>
            ) : (
              <SlotPicker slots={slots} selectedSlot={selectedSlot} onSelect={setSelectedSlot} />
            )}
          </div>
        </div>

        {/* Right side: the visit type, meet type, problem and the book button. */}
        <div className="flex h-full flex-col gap-5">
          {/* Only the choices this doctor allows can be picked. */}
          <OptionGroup
            label="Visit type"
            options={VISIT_TYPES}
            value={visitType}
            onChange={setVisitType}
            allowed={doctor.visitTypes}
          />

          <OptionGroup
            label="Meet type"
            options={MEET_TYPES}
            value={meetType}
            onChange={setMeetType}
            allowed={doctor.meetTypes}
          />

          <OptionGroup
            label="Consult type"
            options={CONSULT_TYPES}
            value={consultType}
            onChange={setConsultType}
            allowed={doctor.consultTypes}
          />

          {/* This box grows so the right side matches the height of the left side. */}
          <FormTextarea
            label="Describe your problem"
            name="problem"
            value={problem}
            onChange={setProblem}
            placeholder="Write something about your problem or reason for the visit"
            grow
          />

          {bookingError && <Alert message={bookingError} />}

          <div className="flex items-center justify-between gap-4 border-t border-line pt-5">
            <div>
              <p className="text-sm text-muted">Consultation fee</p>
              <p className="text-xl font-bold text-ink">Rs {doctor.consultationFee}</p>
            </div>

            <div className="w-40 sm:w-52">
              <Button onClick={handleBook} disabled={!canBook || isBooking} fullWidth>
                {isBooking ? "Booking..." : "Book appointment"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
