# Schedula

Schedula is a doctor appointment booking app.

- A patient can find a doctor and book a visit.
- A doctor can set their timings and manage those visits.
- The website and the API are in one Next.js project, so you run only one server.

**Live Demo:** [Schedula](https://schedula-chi.vercel.app/)

---

## Guides

- [patient.md](patient.md) - what a patient can do, and the patient files
- [doctor.md](doctor.md) - what a doctor can do, and the doctor files
- [chatbot.md](chatbot.md) - the AI chat assistant, and its files

---

## Features

- Sign up and log in as a **patient** or a **doctor**.
- Patient: search doctors, open a doctor, and book an appointment on one page.
- Doctor: set the profile and timings, get booked, and manage visits from a dashboard.
- Booking picks a date, a free time slot, and the visit type the doctor offers.
- Appointments page with tabs: **All, Upcoming, Completed, Missed, Cancelled**.
- Each appointment shows a colour for its status:
  - Upcoming - blue
  - Action needed (time passed, not finished) - orange
  - Completed - green
  - Missed - gray
  - Cancelled - red
- Doctor writes a prescription (diagnosis, medicines, instructions) and marks the visit completed.
- Patient reads the prescription, downloads it as a PDF, and leaves a review.
- Doctor can reschedule, cancel, or mark a visit as missed.
- A notifications bell shows updates like reschedule, cancel, complete and missed.
- An AI chat assistant answers "how do I..." questions about using the app.

---

## Tech used

| Part | Tool |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Styling | Tailwind CSS v4 |
| Icons | lucide-react |
| Calendar | react-calendar |
| Toasts | react-toastify |
| Backend | Next.js API routes |
| Database | MongoDB (Mongoose) |
| Chat assistant | Groq or OpenRouter |

---

## Setup

- Install Node.js version 20.9 or newer.
- Install the packages: `npm install`
- Make a file named `.env` in the project root with your database link:
  - `MONGODB_URI=your_mongodb_connection_string`
- The chat assistant is optional. To turn it on, add the AI keys from `.env.example` (see [chatbot.md](chatbot.md)).
- Add the sample data in MongoDB Atlas (**Browse Collections**):
  - put `seed/users.json` into a `users` collection (add this one **first**)
  - put `seed/doctors.json` into a `doctors` collection

---

## Run

- Start the app: `npm run dev`, then open http://localhost:3000
- Make a production build: `npm run build`
- `.env` is read only when the server starts, so restart after any change.

---

## Folders

```
schedula/
├── seed/              Sample data for MongoDB
└── src/  
    ├── app/           Pages and API (the folder path is the URL)
    ├── components/    Shared UI and layout pieces
    ├── features/      One folder per job (auth, doctors, appointments, ...)
    ├── lib/           Database, helpers, models
    └── types/         Shared TypeScript types
```

---

## API

- All API routes live in `src/app/api`. The folder path is the URL.
- Every reply looks like `{ "success": true, ... }` or `{ "success": false, "message": "..." }`.
- Routes cover auth, doctors, profiles, appointments, notifications and chat.

---

## Database

MongoDB holds these collections:

- **users** - login account (name, email, password, role)
- **doctors** - doctor profile (details, timings, appointments, notifications)
- **patients** - patient profile (details, medical history, files, appointments, notifications)
- **appointments** - one booking (date, slot, types, prescription, review, status)
- **chatmessages** - one line of a chat with the assistant

---

## Deploy

- Push the code to GitHub (your `.env` is not committed).
- Import the repository on Vercel; it finds the Next.js settings by itself.
- Add `MONGODB_URI` (and the chat keys if used) in Vercel **Environment Variables**.
- In MongoDB Atlas, open **Network Access** and allow `0.0.0.0/0`.

---