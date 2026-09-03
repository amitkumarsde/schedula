# Schedula — Personal Notes (files + interview Q&A)

Personal study notes. Not part of the project docs and not linked from any other file.

---

## Part 1 — Every file explained

### Pages (`src/app`) — thin route files that just show a feature

| File | What it does |
|---|---|
| `app/page.tsx` | Home page (hero, featured doctors, how it works, call to action) |
| `app/layout.tsx` | Wraps every page with the header, footer, chat button, auth provider and toasts |
| `app/login/page.tsx` | Login page (shows `LoginForm`) |
| `app/signup/page.tsx` | Signup page (shows `SignupForm`) |
| `app/doctors/page.tsx` | Doctors list page (search + filter), wrapped in Suspense |
| `app/doctors/[id]/page.tsx` | One doctor's public profile page |
| `app/doctors/[id]/book/page.tsx` | Booking page for one doctor |
| `app/appointments/page.tsx` | My appointments page (tabs), wrapped in Suspense |
| `app/appointments/[id]/page.tsx` | One appointment detail page |
| `app/dashboard/page.tsx` | Dashboard (doctor or patient) |
| `app/notifications/page.tsx` | Notifications page |
| `app/profile/page.tsx` | Redirects to the logged-in user's own profile |
| `app/profile/layout.tsx` | Requires a logged-in user for all profile pages (checked once) |
| `app/profile/doctor/page.tsx` | Doctor profile page |
| `app/profile/patient/page.tsx` | Patient profile page |

### API routes (`src/app/api`) — the backend

| File | What it does |
|---|---|
| `api/auth/signup/route.ts` | Create an account and an empty profile |
| `api/auth/login/route.ts` | Check email + password, return the user |
| `api/doctors/route.ts` | The doctors list (optional search / specialization) |
| `api/doctors/[id]/route.ts` | One doctor's full profile |
| `api/doctors/[id]/slots/route.ts` | A day's slots, each marked free / taken / past |
| `api/appointments/route.ts` | GET my appointments · POST book one |
| `api/appointments/[id]/route.ts` | GET one · PATCH reschedule / review / cancel / complete / missed / prescription |
| `api/notifications/route.ts` | GET my notifications · PATCH mark all read |
| `api/profile/doctor/route.ts` | GET / PUT the doctor profile (one tab at a time) |
| `api/profile/patient/route.ts` | GET / PUT the patient profile (one tab at a time) |
| `api/chat/route.ts` | GET chat history · POST message + reply · DELETE clear chat |

### Layout components (`src/components/layout`)

| File | What it does |
|---|---|
| `Header.tsx` | Top nav bar (links, notification bell, profile, logout) |
| `Footer.tsx` | Page footer |
| `BackgroundShapes.tsx` | Soft decorative circles behind the whole app |
| `SocialLinks.tsx` | Row of social icons (used in the footer) |

### Shared UI (`src/components/ui`) — dumb pieces, no data loading

| File | What it does |
|---|---|
| `Alert.tsx` | Red message box for errors / info |
| `AppCalendar.tsx` | Month calendar (react-calendar) with per-day counts |
| `Avatar.tsx` | Round profile photo with a fallback icon |
| `Button.tsx` | The app's button (works as a link or a button) |
| `Chip.tsx` | A small rounded label |
| `ChipToggleGroup.tsx` | A group of chips where many can be picked |
| `OptionGroup.tsx` | A group of choices where only one can be picked (greys out not-allowed) |
| `FormInput.tsx` | Labeled text input |
| `FormSelect.tsx` | Labeled dropdown |
| `FormTextarea.tsx` | Labeled multi-line box |
| `StringListInput.tsx` | Type an item and add it to a list of chips |
| `StatTiles.tsx` | Small number tiles |
| `SummaryCard.tsx` | A stat card (icon, label, number, optional link) |

### Auth feature (`src/features/auth`)

| File | What it does |
|---|---|
| `api/authService.ts` | Calls the signup / login API |
| `components/LoginForm.tsx` | The login form |
| `components/SignupForm.tsx` | The signup form (role + fields) |

### Doctors feature (`src/features/doctors`)

| File | What it does |
|---|---|
| `api/doctorService.ts` | Calls the doctors API |
| `hooks/useDoctor.ts` | Loads one doctor |
| `hooks/useDoctors.ts` | Loads the doctors list |
| `components/DoctorCard.tsx` | One doctor card in the list |
| `components/DoctorsBrowser.tsx` | Doctors page with search + filter |
| `components/DoctorListSkeleton.tsx` | Grey placeholder cards while loading |
| `components/DoctorProfileView.tsx` | Public doctor profile view |
| `components/FeaturedDoctors.tsx` | Top doctors on the home page |

### Appointments feature (`src/features/appointments`)

| File | What it does |
|---|---|
| `api/appointmentService.ts` | Calls the appointments API (book, load, update, slots, review, prescription, reschedule) |
| `hooks/useAppointment.ts` | Loads one appointment (and can reload) |
| `hooks/useDoctorSlots.ts` | Loads a doctor's slots for a date |
| `hooks/useMyAppointments.ts` | Loads my appointments (and can reload) |
| `components/BookingFlow.tsx` | The full one-page booking screen |
| `components/SlotPicker.tsx` | The grid of a day's slots to pick from |
| `components/AppointmentList.tsx` | My appointments with status tabs |
| `components/AppointmentCard.tsx` | One appointment row that links to its detail |
| `components/AppointmentDetail.tsx` | One appointment detail page |
| `components/AppointmentStatusBadge.tsx` | Small coloured status badge |
| `components/PendingActionBadge.tsx` | "Needs action" badge after the slot time |
| `components/DayCalendar.tsx` | One day's slot column (doctor can drag / drop to reschedule) |
| `components/DoctorPrescriptionForm.tsx` | Doctor writes / edits the prescription and finishes |
| `components/PrescriptionCard.tsx` | Read-only prescription view |
| `components/AppointmentReview.tsx` | Star rating + comment |
| `components/DoctorSummaryCard.tsx` | Small doctor card on the booking / detail pages |

### Dashboard feature (`src/features/dashboard`)

| File | What it does |
|---|---|
| `components/Dashboard.tsx` | Shows the doctor or patient dashboard by role |
| `components/DoctorDashboard.tsx` | Doctor: stats + two calendars + reschedule |
| `components/PatientDashboard.tsx` | Patient: stats + a read-only calendar |

### Notifications feature (`src/features/notifications`)

| File | What it does |
|---|---|
| `api/notificationService.ts` | Calls the notifications API |
| `hooks/useNotifications.ts` | Loads notifications + unread count |
| `components/NotificationBell.tsx` | Header bell with an unread badge |
| `components/NotificationList.tsx` | Notifications page, grouped by date |

### Profile feature (`src/features/profile`)

| File | What it does |
|---|---|
| `api/doctorProfileService.ts` | Calls the doctor profile API |
| `api/patientProfileService.ts` | Calls the patient profile API |
| `hooks/useDoctorProfile.ts` | Loads the doctor profile |
| `hooks/usePatientProfile.ts` | Loads the patient profile |
| `hooks/useSaveForm.ts` | Saving state (saving / error / saved) for one form |
| `components/EditableSection.tsx` | Read view + Edit button that swaps in the form |
| `components/ProfileField.tsx` | Shows one label + value (N/A when empty) |
| `components/ProfileHeaderCard.tsx` | Photo, name and email at the top of the profile |
| `components/ProfileRedirect.tsx` | Sends the user to their own role's profile |
| `components/ProfileTabs.tsx` | The row of tabs on the profile page |
| `components/SaveButton.tsx` | Save button + a small "Saved" message |
| `components/doctor/DoctorProfile.tsx` | Doctor profile page (header + tabs) |
| `components/doctor/DoctorBasicInfo.tsx` | Doctor basic info form |
| `components/doctor/DoctorProfessional.tsx` | Doctor professional form |
| `components/doctor/DoctorAvailability.tsx` | Doctor availability form |
| `components/patient/PatientProfile.tsx` | Patient profile page (header + tabs) |
| `components/patient/PatientBasicInfo.tsx` | Patient basic info form |
| `components/patient/PatientMedicalHistory.tsx` | Medical history form (chips) |
| `components/patient/FileLinksSection.tsx` | Documents / test reports links form |
| `components/patient/PatientEmergency.tsx` | Emergency contact + insurance form |

### Chatbot feature (`src/features/chatbot`)

| File | What it does |
|---|---|
| `api/chatService.ts` | Calls the chat API (load, send, clear) |
| `components/ChatWidget.tsx` | The chat button and window |

### Home feature (`src/features/home`)

| File | What it does |
|---|---|
| `components/HeroSection.tsx` | The top section of the home page |
| `components/HowItWorks.tsx` | The three-steps section |
| `components/BookingCallToAction.tsx` | The call-to-action section |

### Library (`src/lib`) — the shared engine

| File | What it does |
|---|---|
| `db.ts` | Keeps one MongoDB connection and reuses it |
| `api/apiClient.ts` | Browser fetch helper; throws when `success` is false |
| `ai/chatbot.ts` | Asks Groq, then OpenRouter, with the safety rule |
| `appointments/enrichAppointments.ts` | Adds doctor / patient display data to each appointment |
| `auth/AuthContext.tsx` | Holds the logged-in user for the whole app |
| `auth/toSafeUser.ts` | Removes the password before the user is sent back |
| `models/User.ts` | Mongoose schema: the login account |
| `models/Doctor.ts` | Mongoose schema: the doctor profile |
| `models/Patient.ts` | Mongoose schema: the patient profile |
| `models/Appointment.ts` | Mongoose schema: one booking |
| `models/ChatMessage.ts` | Mongoose schema: one chat line |
| `models/notificationSchema.ts` | Shared notification sub-schema for both profiles |
| `profile/checkResult.ts` | The shape a validator returns (error, or clean fields) |
| `profile/validateDoctorProfile.ts` | Server checks for the doctor tabs |
| `profile/validatePatientProfile.ts` | Server checks for the patient tabs |
| `profile/validateFileLinks.ts` | Server check for the document / report links |
| `utils/apiRequest.ts` | Server request helpers (read body, is-non-empty text) |
| `utils/apiResponse.ts` | Server reply helpers (success / error + error handling) |
| `utils/validation.ts` | Shared rules (email, name length, https) for client + server |
| `utils/schedule.ts` | Build time slots and read / format dates |
| `utils/groupByDate.ts` | Group items into date buckets |
| `utils/session.ts` | Save / read / clear the logged-in user in localStorage |
| `utils/getErrorMessage.ts` | Get a safe message from an unknown error |
| `utils/profileOptions.ts` | Choice lists for the profile forms (gender, blood group, days...) |
| `utils/appointmentOptions.ts` | The visit / meet / consult type lists |
| `utils/specializations.ts` | The one shared specialization list |
| `utils/prescriptionPdf.ts` | Opens a print window to save the prescription as a PDF |

### Types (`src/types`)

| File | What it does |
|---|---|
| `index.ts` | Re-exports all types so imports stay `@/types` |
| `user.ts` | User and role types |
| `doctor.ts` | Doctor type |
| `patient.ts` | Patient, FileLink, Notification, NotificationType |
| `appointment.ts` | Appointment, status, slot, medicine, review |
| `chat.ts` | Chat message type |

---

## Part 2 — Common / interview questions with answers

### About the project

**Q: What is Schedula?**
A doctor appointment booking web app. Patients sign up, fill a profile, search doctors and book slots; doctors set their availability, get booked, run a dashboard and write prescriptions. Built with Next.js, React, TypeScript and MongoDB.

**Q: Why did you use Next.js?**
It keeps the pages and the API in one project, uses simple file-based routing (the folder path is the URL), supports both server and browser components, and deploys easily on Vercel.

**Q: How is the code organized?**
By feature. `app/` has the routes, `features/` has one folder per job (auth, doctors, appointments, profile, dashboard, notifications, chatbot, home), `components/` has shared UI, `lib/` has the database, models and helpers, and `types/` has shared TypeScript types.

**Q: What are the folder rules?**
1) A page file stays small — it only shows a feature, no state or API calls.
2) One feature does not import another feature — shared things move to `components/`, `lib/` or `types/`.
3) `components/ui` never loads data — those pieces only draw on the screen.

**Q: Server component vs client component here?**
Pages and `route.ts` files run on the server. Files that start with `"use client"` (forms, hooks, anything with state or events) run in the browser.

**Q: How does routing work?**
The folder path is the URL. `page.tsx` is the page a user sees, and `route.ts` is the API that answers a request. So `app/api/doctors/route.ts` answers `GET /api/doctors`.

**Q: What shape does the API return?**
Always the same: `{ success: true, ...data }` or `{ success: false, message }`. The browser helper (`apiClient`) throws an error when `success` is false, so components just use `try / catch`.

### Auth and security

**Q: How does login work? Do you use JWT or cookies?**
No JWT and no cookies. The server checks the email and password and returns the user (without the password). The browser saves that user in `localStorage` and keeps it in a React Context (`AuthContext`). Any page reads it with `useAuth()`. Logout clears both.

**Q: Is this secure? What would you improve?**
It is fine for a learning project but not for real use: passwords are stored as plain text, there are no real sessions or tokens, and the `userId` is sent in the request. To harden it: hash passwords (bcrypt), add real auth (JWT or NextAuth), and check permissions on the server from the session, not from a `userId` in the URL.

**Q: How do you keep the password safe in responses?**
`toSafeUser()` picks only the safe fields, so the password never leaves the server.

### Core features

**Q: How do you stop the same slot being booked twice?**
Before saving, the server checks the slot is a real slot from the doctor's timings, is not in the past, and has no other non-cancelled appointment at that time. The appointment number is unique, with a small retry if two bookings clash.

**Q: How are the time slots made?**
`makeSlots()` builds the times from the doctor's start time, end time, slot length and break. The slots API then marks each slot free, taken or past.

**Q: How do notifications work?**
They are not a separate collection. Each notification is stored in a list inside the doctor or patient profile. The other person gets one when an appointment is moved, cancelled, completed or missed. The header bell shows the unread count, and opening the page marks them read.

**Q: How does the chat assistant work?**
A logged-in user sends a message to `/api/chat`. The server saves it, then asks the AI with `askAssistant()` — Groq first, OpenRouter as a backup — using a system rule that limits answers to "how to use Schedula". The reply is saved and returned. History is per user and is deleted on logout.

**Q: Why two AI providers?**
For reliability and free usage. If the first provider fails, the second answers. If both fail, the user gets a safe "not available" message instead of an error.

**Q: How is the prescription saved as a PDF?**
No PDF library. `prescriptionPdf` opens a clean print window and the browser's own "Save as PDF" makes the file.

**Q: How is the profile edited?**
One page with tabs. Each section has an inline **Edit** button (`EditableSection`) that swaps the read view for a form, and each part saves on its own with `useSaveForm` + a PUT that names the `section`.

### Data and validation

**Q: How is data validated?**
Twice. The client checks first for quick feedback, and the server does the real check in the `lib/profile` validators plus the Mongoose model rules. Shared rules (email, name length, https) live in `validation.ts` so both sides agree.

**Q: What is Mongoose?**
A library that maps JavaScript objects to MongoDB documents. Each model has a schema that defines the fields and their rules. Notifications reuse a shared sub-schema kept inside the doctor and patient profiles.

**Q: How do the data hooks work?**
Each data hook (`useDoctors`, `useMyAppointments`, `useDoctorProfile`, etc.) uses `useState` for the data, loading and error, and a `useEffect` that calls its API service, then returns those values plus (for some) a `reload` function.

**Q: How do you avoid showing stale data?**
Each hook uses a race guard: the effect sets a flag and its cleanup clears it, so if an older request finishes after a newer one, its result is ignored.

### General React / web

**Q: What is a React hook?**
A function like `useState` or `useEffect` that lets a function component use state and lifecycle features.

**Q: What does the `useEffect` cleanup function do?**
It runs before the next effect or when the component unmounts. Here it flips the race-guard flag so a late API reply is ignored.

**Q: What is a controlled component?**
An input whose value comes from state and updates through `onChange`. All the forms in this app are controlled.

**Q: Why TypeScript?**
It catches mistakes while coding and documents the data shapes. All shapes live in `src/types` and are imported as `@/types`.

**Q: What is the Context API used for here?**
To share the logged-in user across the whole app (through `AuthContext`) without passing props down every level.
