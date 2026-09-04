# Schedula

Schedula is a doctor appointment booking app.

- A patient can find a doctor and book a visit.
- A doctor can set their timings and manage those visits.
- The website and the API are one Next.js project, so there is no second server to run.

## Guides

- [patient.md](patient.md) — what a patient can do, and the patient files
- [doctor.md](doctor.md) — what a doctor can do, and the doctor files
- [chatbot.md](chatbot.md) — the AI chat assistant, and its files

## Features

- Sign up and log in as a **patient** or a **doctor**.
- Patient: search doctors, open a doctor, and book an appointment on one page.
- Doctor: set the profile and timings, get booked, and manage visits from a dashboard.
- Booking picks a date, a free time slot, and the visit type the doctor offers.
- Appointments page with tabs: **All, Upcoming, Completed, Missed, Cancelled**.
- Each appointment shows a colour for its status:
  - Upcoming — blue
  - Action needed (time passed, not finished) — orange
  - Completed — green
  - Missed — gray
  - Cancelled — red
- Doctor writes a prescription (diagnosis, medicines, instructions) and marks the visit completed.
- Patient reads the prescription, downloads it as a PDF, and leaves a review.
- Doctor can reschedule, cancel, or mark a visit as missed.
- A notifications bell shows updates like reschedule, cancel, complete and missed.
- An AI chat assistant answers "how do I..." questions about using the app.

## Home page

The first page anyone sees. It introduces the app and shows the top doctors.

### Features

- A hero with a search box that opens the doctors page.
- Cards for the top rated doctors.
- A short "how it works" section.
- A button to start booking.

## Login and Signup page

Where a person makes an account or logs in as a patient or a doctor.

### Features

- Sign up as a patient or a doctor (name, email, password, role).
- Log in with email and password.
- Show or hide the password.
- The logged in user is kept in the browser.

## Doctors page

The list of doctors a patient can look through, search and filter.

### Features

- Search by doctor name, specialization or city.
- Filter by a specialization chip.
- Save a doctor with the heart, and a "Saved" toggle to show only saved ones.
- Each card opens the doctor's profile.

## Doctor profile page

One doctor's public page with their details and a way to book.

### Features

- Photo, about, specialization, experience, hospital and fee.
- Consulting days, times and slot length.
- A "Book appointment" button.

## Booking page

One page to book an appointment with a doctor.

### Features

- Pick a date and a free time slot (taken or past slots are greyed out).
- Choose a visit, meet and consult type (only the ones the doctor offers).
- Write the problem, then book.

## Dashboard page

The home screen after login. It shows numbers and a calendar of appointments.

### Features

- Stat cards (today, upcoming, completed and totals).
- A month calendar with a count on each day.
- A day calendar coloured by status; the doctor can drag to reschedule.
- A link to the prescriptions page.

## Appointments page

All of a user's appointments in one place, grouped by date.

### Features

- Tabs: All, Upcoming, Completed, Missed and Cancelled.
- A colour badge for each status.
- A countdown like "Today" or "In 3 days" on upcoming visits.
- Each card opens the appointment details.

## Appointment detail page

The full details of one appointment, for the patient and the doctor.

### Features

- Doctor, patient and appointment details.
- Doctor: reschedule, cancel, mark missed, and write or edit the prescription.
- Patient: cancel before the time, read the prescription, download the PDF, leave a review and rebook.

## Prescriptions page

Completed visits that have a diagnosis or medicines.

### Features

- Doctor: open one to manage the diagnosis, medicines and instructions.
- Patient: open one to read the prescription.
- Visits with only instructions are not listed.

## Notifications page

The updates a user has received, grouped by date.

### Features

- Told when an appointment is rescheduled, cancelled, completed or missed.
- The header bell shows the unread count.
- Opening the page marks everything read.

## Profile page

A user's own details, edited in tabs. It sends the user to their doctor or patient profile.

### Features

- Doctor tabs: Basic Info, Professional, Availability.
- Patient tabs: Basic Info, Medical History, Documents, Test Reports, Emergency and Insurance.
- Each tab has its own Edit button and saves on its own.

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

## Setup

- Install Node.js version 20.9 or newer.
- Install the packages: `npm install`
- Make a file named `.env` in the project root with your database link:
  - `MONGODB_URI=your_mongodb_connection_string`
- The chat assistant is optional. To turn it on, add the AI keys from `.env.example` (see [chatbot.md](chatbot.md)).
- Add the sample data in MongoDB Atlas (**Browse Collections**):
  - put `seed/users.json` into a `users` collection (add this one **first**)
  - put `seed/doctors.json` into a `doctors` collection
  - all sample doctors use the password `123456`

## Run

- Start the app: `npm run dev`, then open http://localhost:3000
- Make a production build: `npm run build`
- `.env` is read only when the server starts, so restart after any change.

## Folders

```
schedula/
├── seed/            Sample data for MongoDB
└── src/
    ├── app/         Pages and API (the folder path is the URL)
    ├── components/  Shared UI and layout pieces
    ├── features/    One folder per job (auth, doctors, appointments, ...)
    ├── lib/         Database, helpers, models
    └── types/       Shared TypeScript types
```

## API

- All API routes live in `src/app/api`. The folder path is the URL.
- Every reply looks like `{ "success": true, ... }` or `{ "success": false, "message": "..." }`.
- Routes cover auth, doctors, profiles, appointments, notifications and chat.

## Database

MongoDB holds these collections:

- **users** — login account (name, email, password, role)
- **doctors** — doctor profile (details, timings, appointments, notifications)
- **patients** — patient profile (details, medical history, files, appointments, notifications)
- **appointments** — one booking (date, slot, types, prescription, review, status)
- **chatmessages** — one line of a chat with the assistant

## Deploy

- Push the code to GitHub (your `.env` is not committed).
- Import the repository on Vercel; it finds the Next.js settings by itself.
- Add `MONGODB_URI` (and the chat keys if used) in Vercel **Environment Variables**.
- In MongoDB Atlas, open **Network Access** and allow `0.0.0.0/0`.
