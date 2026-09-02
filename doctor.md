# Doctor Guide

This file explains, in easy words, **what a doctor does in Schedula** and **which files make it work**. Read it top to bottom to follow one doctor from signup to getting appointments.

---

## The doctor journey (start to end)

1. **Sign up.** Open `/signup`, choose **"I am a Doctor"**, and enter full name, email and password. The server makes a login account and an **empty doctor profile**. A new doctor is **hidden** from the doctors list at first.

2. **Go to the profile.** After signup you land on `/profile`, which sends a doctor to `/profile/doctor`.

3. **Fill the profile.** The profile page shows a **numbers row** (experience, rating, patients, reviews) and three tabs. Tap the **edit icon** next to your name to open `/profile/doctor/edit`, where every part has its own **Save** button.
   - **Basic Info** - name, gender, mobile number, city, photo link. Saving this marks the account as complete
   - **Professional** - specialization, qualification, experience, hospital, and an "about you" note
   - **Availability** - consulting days, a start and end time, the slot length, the break between two slots, the fee, the **visit / meet / consult types** you offer, and a **"Show me on the doctors list"** switch

4. **Become visible.** You show up in the doctors list only after the **specialization is filled** *and* the **booking switch is on**. You also need a start and end time and at least one of each option type, or there is nothing to book. Then patients can find you at `/doctors` and open `/doctors/[id]`.

5. **Get booked.** Patients pick a date and a free slot, and only the option types you offer. A slot that is already booked, or whose time has gone, is greyed out, so the same time is never taken twice.

6. **Open the dashboard.** `/dashboard` is your home. It shows:
   - **Numbers** — today's patients, upcoming, completed, and total patients
   - A **month calendar** with how many appointments fall on each day. Days you do not consult are greyed out. You can move up to two months ahead and browse up to four months back
   - A **day calendar**, next to the month view, showing your slots for the chosen day, coloured by status (upcoming, completed)

7. **Move an appointment.** Two ways, both on the dashboard:
   - **Drag** an upcoming appointment onto a free slot on the same day
   - Tap its **move icon**, then pick any month, any day and a free slot

   The patient gets a notification with the new time either way.

8. **See appointments.** Open `/appointments` for the **Upcoming**, **Completed** and **Cancelled** tabs, grouped by date. Tap one to open its detail page, where you can see the patient's details (gender, age, allergies, diseases, contact number) along with the appointment.

9. **Write the prescription and finish.** After the appointment's time has passed, the detail page shows a prescription form. Write the **diagnosis**, add the **medicines** (name, dosage, duration) and any **instructions**, then press **Save & mark completed**. The diagnosis is needed to finish the visit. You can edit the prescription later too. The patient can then read it.

10. **Cancel if needed.** You can cancel an upcoming appointment from its detail page. The patient gets a notification.

11. **Check notifications.** The **bell** in the header shows how many messages are unread. Tap it to open `/notifications`. A doctor gets one kind of message: an appointment **cancelled** by the patient.

> Next time, just **log in** at `/login` with your email and password to come back to the same account.

---

## Folder structure

Only the files that are **about the doctor** (your own profile and dashboard, plus the public doctor pages patients read). Shared UI (`components/ui`) and common helpers are not listed here.

```
src/
├── app/
│   ├── api/
│   │   ├── doctors/route.ts                  The doctors list
│   │   ├── doctors/[id]/route.ts             One doctor's full profile
│   │   ├── doctors/[id]/slots/route.ts       Free, taken and past slots for a day
│   │   └── profile/doctor/route.ts           Read and save the doctor profile
│   ├── doctors/page.tsx                      Public doctors list page
│   ├── doctors/[id]/page.tsx                 Public doctor profile page
│   ├── dashboard/page.tsx                    The dashboard route
│   ├── profile/doctor/page.tsx               The doctor profile page route
│   └── profile/doctor/edit/page.tsx          The doctor edit page route
├── features/
│   ├── doctors/
│   │   ├── api/doctorService.ts              Calls the doctors API
│   │   ├── hooks/useDoctor.ts                Loads one doctor
│   │   ├── hooks/useDoctors.ts               Loads the doctors list
│   │   └── components/
│   │       ├── DoctorCard.tsx                One doctor card in the list
│   │       ├── DoctorsBrowser.tsx            List with search and filter
│   │       ├── FeaturedDoctors.tsx           Top doctors on the home page
│   │       └── DoctorProfileView.tsx         Public doctor profile page
│   ├── dashboard/
│   │   └── components/DoctorDashboard.tsx    Numbers + both calendars
│   ├── appointments/components/
│   │   ├── DayCalendar.tsx                   The slots of one day
│   │   └── DoctorPrescriptionForm.tsx        Write the prescription and finish
│   └── profile/
│       ├── api/doctorProfileService.ts       Calls the doctor profile API
│       ├── hooks/useDoctorProfile.ts         Loads the doctor profile
│       └── components/doctor/
│           ├── DoctorProfile.tsx             Profile page (header, numbers, tabs)
│           ├── DoctorProfileEdit.tsx         Edit page (all the forms)
│           ├── DoctorBasicInfo.tsx           Basic Info form
│           ├── DoctorProfessional.tsx        Professional form
│           ├── DoctorAvailability.tsx        Availability form
│           └── DoctorStatsRow.tsx            The numbers row
├── components/ui/AppCalendar.tsx             The month calendar (react-calendar)
├── lib/
│   ├── models/Doctor.ts                      The doctor database shape
│   ├── profile/validateDoctorProfile.ts      Server checks for the doctor parts
│   └── utils/schedule.ts                     Makes the time slots
└── types/doctor.ts                           The doctor TypeScript type
```

---

## Quick map (doctor screen → main file)

| Screen | Main file |
|---|---|
| Sign up | `src/features/auth/components/SignupForm.tsx` |
| Dashboard | `src/features/dashboard/components/DoctorDashboard.tsx` |
| My profile | `src/features/profile/components/doctor/DoctorProfile.tsx` |
| Edit my profile | `src/features/profile/components/doctor/DoctorProfileEdit.tsx` |
| Set availability | `src/features/profile/components/doctor/DoctorAvailability.tsx` |
| My appointments | `src/features/appointments/components/AppointmentList.tsx` |
| One appointment | `src/features/appointments/components/AppointmentDetail.tsx` |
| Write a prescription | `src/features/appointments/components/DoctorPrescriptionForm.tsx` |
| Notifications | `src/features/notifications/components/NotificationList.tsx` |
| How patients see me | `src/features/doctors/components/DoctorProfileView.tsx` |
