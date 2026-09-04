# Patient Guide

This file lists **what a patient can do in Schedula** and **which files make it work**. Shared UI and common helpers are not listed here.

---

## What a patient can do

- **Sign up and log in.** Create a patient account with full name, email and password.
- **Fill the profile.** The profile page has a name card and tabs. Each tab has its own **Edit** button and saves on its own.
  - **Basic Info** — age, gender, mobile number, weight, height, blood group, city, photo link. Saving this marks the account as complete.
  - **Medical History** — allergies, diseases and current medications, added as chips.
  - **Documents** — links to your documents.
  - **Test Reports** — links to your test reports.
  - **Emergency & Insurance** — emergency contact and insurance details.
- **Find a doctor.** Open `/doctors`. Search by name, specialization or city, or tap a specialization chip.
- **Save a doctor.** Tap the heart on a doctor card to save them, then use the **Saved** toggle to see only your saved doctors. Saved doctors are kept in your browser.
- **Open a doctor.** See the photo, about, consulting time, slot length, fee, and a **Book appointment** button.
- **Book an appointment.** On one page: pick a date, pick a free slot, choose a visit / meet / consult type (only the ones the doctor offers), write the problem, and press **Book appointment**. Taken or past slots are greyed out.
- **See the dashboard.** `/dashboard` shows your numbers (today's doctors, upcoming, completed, total), a calendar of your appointments coloured by status, and a link to your prescriptions.
- **See appointments.** `/appointments` has **All, Upcoming, Completed, Missed and Cancelled** tabs, grouped by date. Upcoming visits show a countdown like "Today" or "In 3 days". The detail page shows the doctor and lets you cancel an upcoming visit.
- **Read prescriptions.** Open the **Prescriptions** page from the dashboard to read your completed visits that have a diagnosis or medicines.
- **After the visit.** Read the prescription, download it as a PDF, leave a review, and rebook with the same doctor.
- **Notifications.** The header bell shows unread updates when an appointment is rescheduled, cancelled, completed or missed.
- **Chat assistant.** A chat button answers "how do I..." questions about using Schedula (see [chatbot.md](chatbot.md)).

---

## Folder structure

Only the files that are about the patient.

```
src/
├── app/
│   ├── api/
│   │   ├── profile/patient/route.ts                  Read and save the patient profile
│   ├── dashboard/page.tsx                            The dashboard route
│   ├── prescriptions/page.tsx                        The prescriptions route
│   └── profile/patient/page.tsx                      The patient profile page route
├── features/     
│   ├── dashboard/components/PatientDashboard.tsx     Numbers + appointment calendar
│   └── profile/     
│       ├── api/patientProfileService.ts              Calls the patient profile API
│       ├── hooks/usePatientProfile.ts                Loads the patient profile
│       ├── hooks/useSaveForm.ts                      Holds the saving state of one form
│       └── components/     
│           ├── EditableSection.tsx                   The read view + Edit button wrapper
│           └── patient/     
│               ├── PatientProfile.tsx                Profile page (name card + tabs)
│               ├── PatientBasicInfo.tsx              Basic Info form
│               ├── PatientMedicalHistory.tsx         Medical History form
│               ├── FileLinksSection.tsx              Documents and Test Reports form
│               └── PatientEmergency.tsx              Emergency & Insurance form
├── lib/     
│   ├── models/Patient.ts                             The patient database shape
│   ├── profile/validatePatientProfile.ts             Server checks for the patient parts
│   └── utils/savedDoctors.ts                         Saved doctors kept in the browser
└── types/patient.ts                                  The patient TypeScript type
```

## Quick map (patient screen → main file)

| Screen | Main file |
|---|---|
| Sign up | `src/features/auth/components/SignupForm.tsx` |
| Dashboard | `src/features/dashboard/components/PatientDashboard.tsx` |
| My profile (view + edit) | `src/features/profile/components/patient/PatientProfile.tsx` |
| Doctors list (and saving) | `src/features/doctors/components/DoctorsBrowser.tsx` |
| One doctor | `src/features/doctors/components/DoctorProfileView.tsx` |
| Book | `src/features/appointments/components/BookingFlow.tsx` |
| My appointments | `src/features/appointments/components/AppointmentList.tsx` |
| One appointment | `src/features/appointments/components/AppointmentDetail.tsx` |
| Prescriptions | `src/features/appointments/components/PrescriptionList.tsx` |
| Notifications | `src/features/notifications/components/NotificationList.tsx` |

---