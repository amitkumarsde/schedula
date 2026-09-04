# Doctor Guide

This file lists **what a doctor can do in Schedula** and **which files make it work**. Shared UI and common helpers are not listed here.

## What a doctor can do

- **Sign up and log in.** Create a doctor account with full name, email and password. A new doctor is hidden from the doctors list until the profile is ready.
- **Fill the profile.** The profile page has a name card and three tabs. Each tab has its own **Edit** button and saves on its own.
  - **Basic Info** — name, gender, mobile number, city, photo link. Saving this marks the account as complete.
  - **Professional** — specialization, qualification, experience, hospital, and an "about you" note.
  - **Availability** — consulting days, start and end time, slot length, break between slots, fee, the visit / meet / consult types offered, and a **"Show me on the doctors list"** switch.
- **Show up in the list.** A doctor appears at `/doctors` only when the specialization is filled, the switch is on, start and end times are set, and there is at least one of each option type.
- **Get booked.** Patients pick a date, a free slot, and only the option types the doctor offers. Taken or past slots are greyed out, so a time is never booked twice.
- **See the dashboard.** `/dashboard` shows the day's numbers (today's patients, upcoming, completed, total patients), a month calendar with a count on each day, and a day calendar of the slots.
- **Read the calendar colours.** On the day calendar each slot shows its status: upcoming (blue), action required (orange, time passed but not finished), completed (green) and missed (gray).
- **Reschedule.** Drag an upcoming appointment onto a free slot, or use its move icon to pick any day and slot. The patient gets a notification with the new time.
- **See appointments.** `/appointments` has **All, Upcoming, Completed, Missed and Cancelled** tabs, grouped by date. The detail page shows the patient's details with the appointment.
- **Write a prescription.** After the visit time, add the diagnosis, medicines (name, dosage, duration) and instructions, then mark the visit completed. It can be edited later.
- **Cancel or mark missed.** Cancel an upcoming appointment, or mark it missed after the time if the patient did not come. The patient gets a notification.
- **Notifications.** The header bell shows unread updates, like when a patient cancels.
- **Chat assistant.** A chat button answers "how do I..." questions about using Schedula (see [chatbot.md](chatbot.md)).

## Folder structure

Only the files that are about the doctor (the doctor's own profile and dashboard, plus the public doctor pages patients read).

```
src/
├── app/
│   ├── api/
│   │   ├── doctors/route.ts                     The doctors list
│   │   ├── doctors/[id]/route.ts                One doctor's full profile
│   │   ├── doctors/[id]/slots/route.ts          Free, taken and past slots for a day
│   │   └── profile/doctor/route.ts              Read and save the doctor profile
│   ├── doctors/page.tsx                         Public doctors list page
│   ├── doctors/[id]/page.tsx                    Public doctor profile page
│   ├── dashboard/page.tsx                       The dashboard route
│   └── profile/doctor/page.tsx                  The doctor profile page route
├── components/ui/AppCalendar.tsx                The month calendar (react-calendar)
├── features/
│   ├── doctors/
│   │   ├── api/doctorService.ts                 Calls the doctors API
│   │   ├── hooks/useDoctor.ts                   Loads one doctor
│   │   ├── hooks/useDoctors.ts                  Loads the doctors list
│   │   └── components/
│   │       ├── DoctorCard.tsx                   One doctor card in the list
│   │       ├── DoctorsBrowser.tsx               List with search and filter
│   │       ├── FeaturedDoctors.tsx              Top doctors on the home page
│   │       └── DoctorProfileView.tsx            Public doctor profile page
│   ├── dashboard/components/DoctorDashboard.tsx Numbers + both calendars
│   ├── appointments/components/
│   │   ├── DayCalendar.tsx                      The slots of one day
│   │   └── DoctorPrescriptionForm.tsx           Write the prescription and finish
│   └── profile/
│       ├── api/doctorProfileService.ts          Calls the doctor profile API
│       ├── hooks/useDoctorProfile.ts            Loads the doctor profile
│       ├── hooks/useSaveForm.ts                 Holds the saving state of one form
│       └── components/
│           ├── EditableSection.tsx              The read view + Edit button wrapper
│           └── doctor/
│               ├── DoctorProfile.tsx            Profile page (name card + tabs)
│               ├── DoctorBasicInfo.tsx          Basic Info form
│               ├── DoctorProfessional.tsx       Professional form
│               └── DoctorAvailability.tsx       Availability form
├── lib/
│   ├── models/Doctor.ts                         The doctor database shape
│   ├── profile/validateDoctorProfile.ts         Server checks for the doctor parts
│   └── utils/schedule.ts                        Makes the time slots
└── types/doctor.ts                              The doctor TypeScript type
```

## Quick map (doctor screen → main file)

| Screen | Main file |
|---|---|
| Sign up | `src/features/auth/components/SignupForm.tsx` |
| Dashboard | `src/features/dashboard/components/DoctorDashboard.tsx` |
| My profile (view + edit) | `src/features/profile/components/doctor/DoctorProfile.tsx` |
| Set availability | `src/features/profile/components/doctor/DoctorAvailability.tsx` |
| My appointments | `src/features/appointments/components/AppointmentList.tsx` |
| One appointment | `src/features/appointments/components/AppointmentDetail.tsx` |
| Write a prescription | `src/features/appointments/components/DoctorPrescriptionForm.tsx` |
| Notifications | `src/features/notifications/components/NotificationList.tsx` |
| How patients see me | `src/features/doctors/components/DoctorProfileView.tsx` |
