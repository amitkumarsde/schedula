# Patient Guide

This file explains, in easy words, **what a patient does in Schedula** and **which files make it work**. Read it top to bottom to follow one patient from signup to booking.

---

## The patient journey (start to end)

1. **Sign up.** Open `/signup`, choose **"I am a Patient"**, and enter full name, email and password. The server makes a login account and an **empty patient profile** (only the name is filled for now).

2. **Go to the profile.** After signup you land on `/profile`, which sends a patient to `/profile/patient`.

3. **Fill the profile.** The profile page shows your details in tabs. Tap the **edit icon** next to your name to open `/profile/patient/edit`, where every part has its own **Save** button.
   - **Basic Info** - age, gender, mobile number, weight, height, blood group, city, photo link. Saving this marks the account as complete
   - **Medical History** - allergies, diseases and current medications, added one at a time as chips
   - **Documents** - links to your documents
   - **Test Reports** - links to your test reports
   - **Emergency & Insurance** - emergency contact and insurance details

   On the Documents and Test Reports tabs there is a **+** icon that takes you straight to the edit page.

4. **Find a doctor.** Open `/doctors` (the **Doctors** link in the header). Search by name, specialization or city, or tap a specialization chip. Each card shows the doctor's about text, experience, fee and the days they work.

5. **Open a doctor.** Tap a doctor card to open `/doctors/[id]` — photo, numbers, about, consulting time, slot length, fee, and a **Book appointment** button (only patients see this button).

6. **Book the appointment.** On `/doctors/[id]/book`, all on one page:
   - Pick a **date** on the calendar (past days and days the doctor does not work are greyed out)
   - Pick a **slot** from the list. All the times run one after another. A slot that is taken, or whose time has already gone, is greyed out
   - Choose a **Visit type**, a **Meet type** and a **Consult type**. Only the choices the doctor offers can be picked; the rest are greyed out
   - Write your **problem**
   - Press **Book appointment**

7. **See the confirmation.** You get the appointment number and a **View my appointment** button.

8. **Manage appointments.** Open `/appointments` to see the **Upcoming**, **Completed** and **Cancelled** tabs, grouped by date. Tap one to open its detail page. There you can see the doctor, your own details and the appointment, and you can **Cancel** an upcoming one. The doctor is told when you cancel.

9. **After the visit.** When the doctor completes the appointment, the detail page shows the **prescription** (diagnosis, medicines and instructions). You can **download it as a PDF**, leave a **review** (rating and comment), and **rebook** with the same doctor.

10. **Check notifications.** The **bell** in the header shows how many messages are unread. Tap it to open `/notifications`. A patient gets three kinds of message from the doctor: appointment **rescheduled**, **cancelled** or **completed**.

> Next time, just **log in** at `/login` with your email and password to come back to the same account.

---

## Folder structure

Only the files that are **about the patient**. Shared UI (`components/ui`) and common helpers are not listed here.

```
src/
├── app/
│   ├── api/profile/patient/route.ts         Read and save the patient profile
│   ├── profile/patient/page.tsx             The patient profile page route
│   └── profile/patient/edit/page.tsx        The patient edit page route
├── features/profile/
│   ├── api/patientProfileService.ts         Calls the patient profile API
│   ├── hooks/usePatientProfile.ts           Loads the patient profile
│   ├── hooks/useSaveForm.ts                 Holds the saving state of one form
│   └── components/patient/
│       ├── PatientProfile.tsx               Profile page (header + tabs)
│       ├── PatientProfileEdit.tsx           Edit page (all the forms)
│       ├── PatientBasicInfo.tsx             Basic Info form
│       ├── PatientMedicalHistory.tsx        Medical History form
│       ├── FileLinksSection.tsx             Documents and Test Reports form
│       └── PatientEmergency.tsx             Emergency & Insurance form
├── lib/
│   ├── models/Patient.ts                    The patient database shape
│   └── profile/validatePatientProfile.ts    Server checks for the patient parts
└── types/patient.ts                         The patient TypeScript type
```

---

## Quick map (patient screen → main file)

| Screen | Main file |
|---|---|
| Sign up | `src/features/auth/components/SignupForm.tsx` |
| My profile | `src/features/profile/components/patient/PatientProfile.tsx` |
| Edit my profile | `src/features/profile/components/patient/PatientProfileEdit.tsx` |
| Doctors list | `src/features/doctors/components/DoctorsBrowser.tsx` |
| One doctor | `src/features/doctors/components/DoctorProfileView.tsx` |
| Book | `src/features/appointments/components/BookingFlow.tsx` |
| My appointments | `src/features/appointments/components/AppointmentList.tsx` |
| One appointment | `src/features/appointments/components/AppointmentDetail.tsx` |
| Notifications | `src/features/notifications/components/NotificationList.tsx` |
