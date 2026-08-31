# Schedula

A doctor appointment app. Right now a person can create an account, log in, and look through the list of doctors with search and specialization filters.

---

## What the app does

- Sign up as a **patient** or a **doctor** with full name, email and password
- Log in with email and password
- Home page with a search box, top rated doctors and a short "how it works" section
- Doctors page with all available doctors
- Search a doctor by name, specialization or city
- Filter doctors by specialization

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
├── seed/                        Sample data to insert into MongoDB by hand
│   ├── users.json
│   └── doctors.json
└── src/
    ├── app/ 
    │   ├── api/
    │   │   ├── auth/signup/     Create an account
    │   │   ├── auth/login/      Check email and password
    │   │   └── doctors/         The doctors list
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── doctors/page.tsx
    │   ├── login/page.tsx
    │   └── signup/page.tsx
    ├── features/
    │   ├── auth/
    │   │   ├── api/             Calls the signup and login API
    │   │   └── components/      LoginForm, SignupForm
    │   ├── doctors/
    │   │   ├── api/             Calls the doctors API
    │   │   ├── components/      DoctorCard, DoctorsBrowser, FeaturedDoctors
    │   │   └── hooks/           useDoctors, loads the doctors list
    │   └── home/
    │       └── components/
    ├── components/
    │   ├── ui/     
    │   └── layout/ 
    ├── lib/
    │   ├── api/                 One fetch helper for the whole app
    │   ├── auth/                Keeps the logged in user
    │   ├── models/              Mongoose schemas
    │   ├── utils/               Small helpers
    │   └── db.ts                Database connection
    └── types/                   Shared TypeScript types
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
| POST | `/api/auth/signup` | Create an account. Needs `fullName`, `email`, `password`, `role` |
| POST | `/api/auth/login` | Check the email and password, returns the user |
| GET | `/api/doctors` | The doctors list. `?search=` and `?specialization=` are optional |

---

## Database collections

**users** — the login account

| Field | Meaning |
|---|---|
| fullName | The person's name, asked at signup |
| email | Login email, saved in small letters, cannot repeat |
| password | Plain text for now, see the note at the end |
| role | `patient` or `doctor` |
| isProfileComplete | Ready for the profile screens, not used yet |

**doctors** — the doctor profile

Name, gender, photo, specialization, qualification, experience, city, fee, rating and an `isAvailable` switch. Only doctors with `isAvailable: true` appear in the list.

**patients** — the patient profile

Name, Age, gender, photo, mobile number, weight, blood group and city.

---

## Deploy

Deploy on Vercel, because Next.js is made by the same team.

1. Push the code to GitHub. Your `.env` is ignored by git, so the password stays with you
2. On Vercel, import the repository. It finds the Next.js settings by itself
3. Add `MONGODB_URI` in **Environment Variables** before the first deploy, otherwise the build fails
4. In MongoDB Atlas open **Network Access** and allow `0.0.0.0/0`, because Vercel does not have one fixed IP address

---
