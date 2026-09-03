# Schedula

A doctor appointment app. A person can make an account, log in, fill their profile, look for a doctor, and book an appointment.

The pages and the API live in the same Next.js project, so there is no second server to start.

## Read next

- **[patient.md](patient.md)** — what a patient can do, and the patient files
- **[doctor.md](doctor.md)** — what a doctor can do, and the doctor files
- **[chatbot.md](chatbot.md)** — the AI chat assistant, and its files

---

## What the app does

- Sign up and log in as a **patient** or a **doctor**
- Patients: search doctors, open a doctor, book an appointment, and read the prescription after the visit
- Doctors: set up the profile and availability, get booked, and use a dashboard to see and move appointments
- Both roles: an appointments page, a notifications bell, and a chat assistant

See the three guides above for the full details.

---

## Tech used

| Part | Tool |
|---|---|
| Frontend | Next.js, React.js, TypeScript |
| Styling | Tailwind CSS v4 |
| Icons | lucide-react |
| Calendar | react-calendar |
| Toasts | react-toastify |
| Backend | Next.js API routes |
| Database | MongoDB |
| Chat assistant | Groq or OpenRouter (free chat models) |

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

The chat assistant is optional. To turn it on, add the AI keys — see **[chatbot.md](chatbot.md)**. The full list of keys is in `.env.example`.

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

> Note: changes to `.env` are read only when the server starts. After you edit `.env`, stop the server and run `npm run dev` again.

---

## Folder structure

```
schedula/
├── README.md                   This file
├── patient.md                  Patient features and files
├── doctor.md                   Doctor features and files
├── chatbot.md                  Chat assistant features and files
├── .env.example                The keys the app can use
├── seed/                       Sample data for MongoDB
└── src/
    ├── app/                    Pages and API (the folder path is the URL)
    ├── components/             Shared UI and layout pieces
    ├── features/               One folder per job (auth, doctors, appointments, ...)
    ├── lib/                    Database, helpers, models
    └── types/                  Shared TypeScript types
```

**Why there is a `features` folder.** Everything about one job stays in one place. All the doctor code is inside `features/doctors`, so you never have to search the whole project to change one screen.

The three guides list the exact files for each part.

---

## The three rules of the folders

**1. A page file stays small.** A file inside `app/` only joins the pieces together. It does not hold state and it does not call the API.

**2. One feature does not open another feature.** If two features need the same thing, that thing moves to `components/`, `lib/` or `types/`.

**3. `components/ui` never loads data.** `Button`, `FormInput` and `Alert` only draw on the screen.

---

## API

All the API lives in `src/app/api`. The folder path is the URL and `route.ts` answers it, so `src/app/api/doctors/route.ts` answers `GET /api/doctors`.

- Every reply has the same shape: `{ "success": true, ...data }` or `{ "success": false, "message": "..." }`
- The routes cover auth, doctors, profiles, appointments, notifications and chat
- Most routes need a `userId` so the server knows whose data to read or save

---

## Database

MongoDB holds these collections:

- **users** — the login account (name, email, password, role)
- **doctors** — the doctor profile (details, availability, appointments, notifications)
- **patients** — the patient profile (details, medical history, files, appointments, notifications)
- **appointments** — one booking (date, slot, types, prescription, review, status)
- **chatmessages** — one line of a chat with the assistant

Notifications are not their own collection; they live inside the doctor and patient profiles.

> Passwords are stored as plain text for now. That is fine for a learning project, but hash them before any real use.

---

## Deploy

Deploy on Vercel, because Next.js is made by the same team.

1. Push the code to GitHub. Your `.env` is ignored by git, so the keys stay with you
2. On Vercel, import the repository. It finds the Next.js settings by itself
3. Add `MONGODB_URI` (and the chat keys if you use them) in **Environment Variables** before the first deploy
4. In MongoDB Atlas open **Network Access** and allow `0.0.0.0/0`, because Vercel does not have one fixed IP address

---
