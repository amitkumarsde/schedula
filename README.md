# Schedula

A doctor appointment app. A person can make an account, log in, fill their profile, look for doctors, and book an appointment.

> New here? Read **[patient.md](patient.md)** for the patient story and **[doctor.md](doctor.md)** for the doctor story. Both list the files each role uses.

---

## What the app does

- Sign up as a **patient** or a **doctor** with full name, email and password
- Log in with email and password
- Home page with a search box, top rated doctors and a short "how it works" part
- Doctors page with all the doctors who are open for booking
- Search a doctor by name, specialization or city, or tap a specialization chip
- **Profile page** with tabs, and a separate **edit page** where each part saves on its own
  - A patient fills basic info, medical history, documents and test reports
  - A doctor fills basic info, professional details and availability
- **Booking** for a patient: pick a doctor, pick a date, pick a free slot, choose visit type and meet type, write the problem, and confirm. Slots that are taken or already gone are greyed out
- **Appointments page** for both roles with Upcoming, Completed and Cancelled tabs
- **Appointment detail page** showing the doctor, the patient and the appointment. A patient can cancel
- **Prescription**: after the visit time the doctor writes a note and a medicine list, then marks the visit completed. The patient can read it
- **Doctor dashboard** with the day's numbers and a calendar. The doctor drags an appointment to a free slot to move it
- **Notifications** with a bell in the header. The other person is told when an appointment is moved or cancelled

---

## Tech used

| Part | Tool |
|---|---|
| Frontend | Next.js, React.js, TypeScript |
| Styling | Tailwind CSS v4 |
| Icons | lucide-react |
| Backend | Next.js API routes |
| Database | MongoDB |

The pages and the API live in the same Next.js project, so there is no second server to start.

---

## Setup

**1. Install Node.js** version 20.9 or newer.

**2. Install the packages**

```bash
npm install
```

**3. Make a file named `.env` in the project root**

```
MONGODB_URI=your_mongodb_connection_string_here
```

**4. Add the sample doctors**

Open MongoDB Atlas, go to **Browse Collections**, then:

- put everything from `seed/users.json` into a `users` collection
- put everything from `seed/doctors.json` into a `doctors` collection

Add `users.json` **first**, because every doctor row points to a user row through `userId`.

All sample doctors use the password `123456`.

---

## How to run

```bash
npm run dev
```

Open <http://localhost:3000>.

To make the production build:

```bash
npm run build
```

---

## Folder structure

```
schedula/
├── README.md                   This file
├── patient.md                  The patient story and the patient files
├── doctor.md                   The doctor story and the doctor files
├── seed/                       Sample data for MongoDB
│   ├── users.json
│   └── doctors.json
└── src/
    ├── app/                    Pages and API (the folder path is the URL)
    │   ├── api/
    │   │   ├── auth/           signup, login
    │   │   ├── doctors/        list, one doctor, free slots
    │   │   ├── appointments/   list, book, one appointment
    │   │   ├── notifications/  read and mark as read
    │   │   └── profile/        patient profile, doctor profile
    │   ├── login/              Login page
    │   ├── signup/             Signup page
    │   ├── doctors/            Doctors list, one doctor, booking page
    │   ├── appointments/       My appointments, one appointment
    │   ├── dashboard/          Doctor dashboard
    │   ├── notifications/      Notifications page
    │   ├── profile/            Redirect by role, and profile + edit pages
    │   ├── layout.tsx          Header and footer on every page
    │   └── page.tsx            Home page
    ├── features/
    │   ├── auth/               Login and signup forms + API calls
    │   ├── doctors/            Doctor cards, list, public profile page
    │   ├── appointments/       Booking flow, calendars, slots, lists
    │   ├── dashboard/          Doctor dashboard
    │   ├── notifications/      Bell and notifications page
    │   ├── profile/            Patient and doctor profile
    │   └── home/               Home page parts
    ├── components/
    │   ├── ui/                 Buttons, inputs, avatar, etc
    │   └── layout/             Header, footer, background circles
    ├── lib/
    │   ├── api/                One fetch helper for the whole app
    │   ├── auth/               Keeps the logged in user
    │   ├── models/             Mongoose schemas
    │   ├── profile/            Server side checks for the profile parts
    │   ├── utils/              Small helpers
    │   └── db.ts               Database connection
    └── types/                  Shared TypeScript types
```

**Where the layout lives.** In the App Router, `layout.tsx` is the file for anything shown on every page. The header and footer sit there, so no page has to import them.

**Where the API lives.** The folder path is the URL and `route.ts` is the code that answers it. So `src/app/api/doctors/route.ts` answers `GET /api/doctors`.

**Why there is a `features` folder.** Everything about one job stays in one place. All the doctor code is inside `features/doctors`, so you never have to search the whole project to change one screen.

---

## The three rules of the folders

**1. A page file stays small.** A file inside `app/` only joins the pieces together. It does not hold state and it does not call the API. For example `app/login/page.tsx` only shows `LoginForm`, and the real work is inside `features/auth`.

**2. One feature does not open another feature.** `features/home` must not import a file from `features/doctors`. If two features need the same thing, that thing moves to `components/`, `lib/` or `types/`.

**3. `components/ui` never loads data.** `Button`, `FormInput` and `Alert` only draw on the screen. They know nothing about doctors or login.

---

## API

Every reply has the same shape:
`{ "success": true, ...data }` or `{ "success": false, "message": "..." }`

| Method | URL | What it does |
|---|---|---|
| POST | `/api/auth/signup` | Make an account. Needs `fullName`, `email`, `password`, `role`. Also makes an empty profile |
| POST | `/api/auth/login` | Check the email and password, returns the user |
| GET | `/api/doctors` | The doctors list. `?search=` and `?specialization=` are optional |
| GET | `/api/doctors/[id]` | One doctor's full profile |
| GET | `/api/doctors/[id]/slots?date=` | The slots for that day, each marked free, taken or past |
| GET | `/api/profile/patient?userId=` | The patient's saved profile |
| PUT | `/api/profile/patient` | Save one part of the patient profile |
| GET | `/api/profile/doctor?userId=` | The doctor's saved profile |
| PUT | `/api/profile/doctor` | Save one part of the doctor profile |
| GET | `/api/appointments?userId=` | My appointments (patient or doctor, based on the role) |
| POST | `/api/appointments` | Book one appointment (patient only) |
| GET | `/api/appointments/[id]?userId=` | One appointment, only for the people on it |
| PATCH | `/api/appointments/[id]` | Move it, save a prescription, cancel it or complete it |
| GET | `/api/notifications?userId=` | My notifications and how many are unread |
| PATCH | `/api/notifications` | Mark all my notifications as read |

The profile, appointment and notification APIs need a `userId` so the server knows whose data to read or save.

**What `PATCH /api/appointments/[id]` does** depends on what you send:

- send `appointmentDate` and `slotTime` → move the appointment (doctor only)
- send `status` as `cancelled` → cancel it (both roles), and the other person gets a notification
- send `status` as `completed` → finish it (doctor only, after the visit time, and a prescription note is needed)
- send `prescriptionDescription` and `medicines` → save the prescription (doctor only, after the visit time)

---

## Database collections

**users** — the login account

| Field | Meaning |
|---|---|
| fullName | The person's name, asked at signup |
| email | Login email, saved in small letters, cannot repeat |
| password | Plain text for now, see the notes at the end |
| role | `patient` or `doctor` |
| isProfileComplete | Turns `true` when the "Basic info" part is saved |

**doctors** — the doctor profile

Name, gender, photo, mobile number, specialization, qualification, experience, city, hospital, fee, rating, total patients and reviews. It also has the consulting **days**, a **start and end time**, the **slot length**, the **break** between two slots, and an `isAvailable` switch. It also keeps a **notifications** list.

A new doctor starts with `isAvailable: false`. Only doctors with `isAvailable: true` and a specialization show up in the doctors list.

**patients** — the patient profile

Name, age, gender, photo, mobile number, weight, height, blood group, city, **allergies** and **diseases** (saved as lists), and **documents** and **testReports** (saved as `{ name, link }` items). It also keeps a **notifications** list.

**appointments** — one booking

Appointment number, the patient and doctor ids, a copy of the doctor name, specialization and fee, the patient name, the date and slot time, the problem, the visit type, the meet type, the **prescription note** and **medicine list**, and a status of `upcoming`, `completed` or `cancelled`.

---

## How the time slots are made

A doctor sets a **start time**, an **end time**, a **slot length** and a **break**. The app then makes the slots one after another:

The same helper (`makeSlots` in `src/lib/utils/schedule.ts`) is used by the booking page, the slots API and the dashboard, so every screen shows the same times.

---

## Deploy

Deploy on Vercel, because Next.js is made by the same team.

1. Push the code to GitHub. Your `.env` is ignored by git, so the password stays with you
2. On Vercel, import the repository. It finds the Next.js settings by itself
3. Add `MONGODB_URI` in **Environment Variables** before the first deploy, otherwise the build fails
4. In MongoDB Atlas open **Network Access** and allow `0.0.0.0/0`, because Vercel does not have one fixed IP address

---
