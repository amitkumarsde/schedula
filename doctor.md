# Doctor Guide

This file explains, in easy words, **what a doctor does in Schedula** and **which files make it work**. Read it top to bottom to follow one doctor from signup to getting appointments.

---

## The doctor journey (start to end)

1. **Sign up.** Open `/signup`, choose **"I am a Doctor"**, and enter full name, email and password. The server makes a login account and an **empty doctor profile row**. A new doctor is **hidden** from the doctors list at first.

2. **Go to the profile.** After signup you land on `/profile`, which sends a doctor to `/profile/doctor`.

3. **Fill the profile.** The doctor profile page shows a **numbers row** (experience, rating, patients, reviews) and three tabs. Each tab has an **edit icon**; you edit and press **Save**.
   - **Basic Info** — name, gender, mobile number, city, photo link. Saving this marks the account as complete.
   - **Professional** — specialization, qualification, experience, hospital, and an "about you" note.
   - **Availability** ("Set") — consulting days, morning and evening times, slot length, consultation fee, and a **"Show me on the doctors list"** switch.

4. **Become visible.** The doctor shows up in the doctors list only after the **specialization is filled** *and* the **booking switch is on**. Then patients can find the doctor at `/doctors` and open `/doctors/[id]`.

5. **Get booked.** Patients pick a date and a free slot and book. A slot that is already booked is greyed out for other patients, so the same time is never taken twice.

6. **See appointments.** Open `/appointments` to see the doctor's own appointments in the **Upcoming**, **Completed** and **Cancelled** tabs. Tap one to open its detail page, where the doctor can **Mark completed** or **Cancel**.

> Next time, just **log in** at `/login` with your email and password to come back to the same account.

---

## Folder structure

Only the files that are **about the doctor** (the doctor's own profile, and the public doctor pages patients read). Shared UI (`components/ui`) and common helpers are not listed here.

```
src/
├── app/
│   ├── api/
│   │   ├── doctors/route.ts                  The doctors list
│   │   ├── doctors/[id]/route.ts             One doctor's full profile
│   │   ├── doctors/[id]/slots/route.ts       Free and taken slots for a day
│   │   └── profile/doctor/route.ts           Read and save the doctor profile
│   ├── doctors/page.tsx                      Public doctors list page
│   ├── doctors/[id]/page.tsx                 Public doctor profile page
│   └── profile/doctor/page.tsx               The doctor profile page route
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
│   └── profile/
│       ├── api/doctorProfileService.ts       Calls the doctor profile API
│       ├── hooks/useDoctorProfile.ts         Loads the doctor profile
│       └── components/doctor/
│           ├── DoctorProfile.tsx             Profile page (header, numbers, tabs)
│           ├── DoctorBasicInfo.tsx           Basic Info tab
│           ├── DoctorProfessional.tsx        Professional tab
│           ├── DoctorAvailability.tsx        Availability (Set) tab
│           └── DoctorStatsRow.tsx            The numbers row
├── lib/
│   ├── models/Doctor.ts                      The doctor database shape
│   └── profile/validateDoctorProfile.ts      Server checks for the doctor tabs
└── types/doctor.ts                           The doctor TypeScript type
```

---

## Quick map (doctor screen → main file)

| Screen | Main file |
|---|---|
| Sign up | `src/features/auth/components/SignupForm.tsx` |
| My profile | `src/features/profile/components/doctor/DoctorProfile.tsx` |
| Set availability | `src/features/profile/components/doctor/DoctorAvailability.tsx` |
| My appointments | `src/features/appointments/components/AppointmentList.tsx` |
| One appointment | `src/features/appointments/components/AppointmentDetail.tsx` |
| How patients see me | `src/features/doctors/components/DoctorProfileView.tsx` |
