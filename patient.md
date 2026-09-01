# Patient Guide

This file explains, in easy words, **what a patient does in Schedula** and **which files make it work**. Read it top to bottom to follow one patient from signup to booking.

---

## The patient journey (start to end)

1. **Sign up.** Open `/signup`, choose **"I am a Patient"**, and enter full name, email and password. The server makes a login account and an **empty patient profile row** (only the name is filled for now).

2. **Go to the profile.** After signup you land on `/profile`, which sends a patient to `/profile/patient`.

3. **Fill the profile.** The patient profile page has four tabs. Each tab shows the details with a small **edit icon**; you edit and press **Save**.
   - **Basic Info** — age, gender, mobile number, weight, blood group, city, photo link. Saving this marks the account as complete.
   - **Medical History** — allergies and diseases, added one at a time as chips.
   - **Documents** — links to your documents.
   - **Test Reports** — links to your test reports.

4. **Find a doctor.** Open `/doctors` (the **Doctors** link in the header). Search by name, specialization or city, or tap a specialization chip.

5. **Open a doctor.** Tap a doctor card to open `/doctors/[id]` — photo, numbers, about, fee, and a **Book appointment** button (only patients see this button).

6. **Book the appointment.** On `/doctors/[id]/book`, all on one page:
   - Pick a **date** on the calendar (past days and days the doctor does not work are greyed out).
   - Pick a **slot** from the morning or evening list (slots already taken are greyed out).
   - Choose a **Visit type** and a **Meet type**.
   - Write your **problem**.
   - Press **Book appointment**.

7. **See the confirmation.** You get the appointment number and a **View my appointment** button.

8. **Manage appointments.** Open `/appointments` to see the **Upcoming**, **Completed** and **Cancelled** tabs. Tap one to open its detail page, where you can **Cancel** an upcoming appointment.

> Next time, just **log in** at `/login` with your email and password to come back to the same account.

---

## Folder structure

Only the files that are **about the patient**. Shared UI (`components/ui`) and common helpers are not listed here.

```
src/
├── app/
│   ├── api/profile/patient/route.ts         Read and save the patient profile
│   └── profile/patient/page.tsx             The patient profile page route
├── features/profile/
│   ├── api/patientProfileService.ts         Calls the patient profile API
│   ├── hooks/usePatientProfile.ts           Loads the patient profile
│   └── components/patient/
│       ├── PatientProfile.tsx               Profile page (header + tabs)
│       ├── PatientBasicInfo.tsx             Basic Info tab
│       ├── PatientMedicalHistory.tsx        Medical History tab
│       └── FileLinksSection.tsx             Documents and Test Reports tabs
├── lib/
│   ├── models/Patient.ts                    The patient database shape
│   └── profile/validatePatientProfile.ts    Server checks for the patient tabs
└── types/patient.ts                         The patient TypeScript type
```

---

## Quick map (patient screen → main file)

| Screen | Main file |
|---|---|
| Sign up | `src/features/auth/components/SignupForm.tsx` |
| My profile | `src/features/profile/components/patient/PatientProfile.tsx` |
| Doctors list | `src/features/doctors/components/DoctorsBrowser.tsx` |
| One doctor | `src/features/doctors/components/DoctorProfileView.tsx` |
| Book | `src/features/appointments/components/BookingFlow.tsx` |
| My appointments | `src/features/appointments/components/AppointmentList.tsx` |
| One appointment | `src/features/appointments/components/AppointmentDetail.tsx` |
