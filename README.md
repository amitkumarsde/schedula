# Schedula

A doctor appointment app. A person can create an account, log in, fill their profile, browse doctors, and a patient can book an appointment with a doctor.

> New here? Read **[patient.md](patient.md)** for the patient story (signup to booking) and **[doctor.md](doctor.md)** for the doctor story (signup to getting appointments). Both list the exact files each role uses.

---

## What the app does

- Sign up as a **patient** or a **doctor** with full name, email and password
- Log in with email and password
- Home page with a search box, top rated doctors and a short "how it works" section
- Doctors page with all available doctors
- Search a doctor by name, specialization or city
- Filter doctors by specialization
- **Profile page** with tabs. A patient fills basic info, medical history, documents and test reports. A doctor fills basic info, professional details and availability (days, times, fee)
- **Booking** for a patient: pick a doctor, pick a date on a calendar, pick a slot, choose visit type and meet type, add the problem, and confirm
- **Appointments page** for both roles, with Upcoming, Completed and Cancelled tabs, and a detail page where a patient can cancel and a doctor can complete or cancel

---

## Tech used

| Part | Tool |
|---|---|
| Frontend | Next.js, React.js, TypeScript |
| Styling | Tailwind CSS v4 |
| Icons | lucide-react |
| Backend | Next.js API routes |
| Database | MongoDB |

The pages and the API live in the same Next.js project, so there is no separate backend server to start.

---

## Setup

**1. Install Node.js** version 20.9 or newer.

**2. Install the packages**

```bash
npm install
```

**3. Create a file named `.env` in the project root**

```
MONGODB_URI=your_mongodb_connection_string_here
```

**4. Add the sample doctors**

Open MongoDB Atlas, go to **Browse Collections**, then:

- insert everything from `seed/users.json` into a `users` collection
- insert everything from `seed/doctors.json` into a `doctors` collection

Insert `users.json` **first**, because every doctor row points to a user row through `userId`.

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
├── TASK.md                     Daily work log
├── patient.md                  The patient story and the patient files
├── doctor.md                   The doctor story and the doctor files
├── seed/                       Sample data to insert into MongoDB
│   ├── users.json
│   └── doctors.json
└── src/
    ├── app/                    Pages and API (the folder path is the URL)
    │   ├── api/
    │   │   ├── auth/           signup, login
    │   │   ├── doctors/        list, one doctor, free slots
    │   │   ├── appointments/   list, book, one appointment
    │   │   └── profile/        patient profile, doctor profile
    │   ├── login/              Login pages
        ├── signup/             Signup pages
    │   ├── doctors/            Doctors list, one doctor, booking page
    │   ├── appointments/       My appointments, one appointment
    │   ├── profile/            Redirect by role, patient profile, doctor profile
    │   ├── layout.tsx          Header and footer on every page
    │   └── page.tsx            Home page
    ├── features/               
    │   ├── auth/               Login and signup forms + API calls
    │   ├── doctors/            Doctor cards, list, public profile page
    │   ├── appointments/       Booking flow, calendar, slots, lists
    │   ├── profile/            Patient and doctor profile
    │   └── home/               Home page sections
    ├── components/
    │   ├── ui/                 Buttons, inputs, avatar, etc
    │   └── layout/             Header, footer
    ├── lib/
    │   ├── api/                One fetch helper for the whole app
    │   ├── auth/               Keeps the logged in user
    │   ├── models/             Mongoose schemas
    │   ├── profile/            Server side checks for the profile tabs
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
| POST | `/api/auth/signup` | Create an account. Needs `fullName`, `email`, `password`, `role`. Also makes an empty profile |
| POST | `/api/auth/login` | Check the email and password, returns the user |
| GET | `/api/doctors` | The doctors list. `?search=` and `?specialization=` are optional |
| GET | `/api/doctors/[id]` | One doctor's full profile |
| GET | `/api/doctors/[id]/slots?date=` | The free and taken time slots for that day |
| GET | `/api/profile/patient?userId=` | The patient's saved profile |
| PUT | `/api/profile/patient` | Save one tab of the patient profile |
| GET | `/api/profile/doctor?userId=` | The doctor's saved profile |
| PUT | `/api/profile/doctor` | Save one tab of the doctor profile |
| GET | `/api/appointments?userId=` | My appointments (patient or doctor, based on the role) |
| POST | `/api/appointments` | Book one appointment (patient only) |
| GET | `/api/appointments/[id]?userId=` | One appointment, only for the people on it |
| PATCH | `/api/appointments/[id]` | Cancel or complete one appointment |

The profile and appointment APIs need a `userId` so the server knows whose data to read or save.

---

## Database collections

**users** — the login account

| Field | Meaning |
|---|---|
| fullName | The person's name, asked at signup |
| email | Login email, saved in small letters, cannot repeat |
| password | Plain text for now, see the notes at the end |
| role | `patient` or `doctor` |
| isProfileComplete | Turns `true` when the profile "Basic info" tab is saved |

**doctors** — the doctor profile

Name, gender, photo, mobile number, specialization, qualification, experience, city, hospital, fee, rating, total patients and reviews. It also has the consulting **days**, **morning and evening times**, **slot length** and an `isAvailable` switch. A new doctor starts with `isAvailable: false`, and only doctors with `isAvailable: true` (and a specialization) appear in the doctors list.

**patients** — the patient profile

Name, age, gender, photo, mobile number, weight, blood group, city, **allergies** and **diseases** (saved as lists), and **documents** and **testReports** (saved as `{ name, link }` items).

**appointments** — one booking

Appointment number, the patient and doctor ids, a copy of the doctor name, specialization and fee, the patient name, the date and slot time, the problem, the visit type, the meet type, and a status of `upcoming`, `completed` or `cancelled`.

---

## Deploy

Deploy on Vercel, because Next.js is made by the same team.

1. Push the code to GitHub. Your `.env` is ignored by git, so the password stays with you
2. On Vercel, import the repository. It finds the Next.js settings by itself
3. Add `MONGODB_URI` in **Environment Variables** before the first deploy, otherwise the build fails
4. In MongoDB Atlas open **Network Access** and allow `0.0.0.0/0`, because Vercel does not have one fixed IP address

---
