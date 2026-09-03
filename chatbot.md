# Chat Assistant Guide

This file explains, in easy words, the **AI chat assistant** in Schedula: what it is, how it works, and which files make it work.

---

## What the assistant is

- A small **chat button** at the bottom right of every page.
- A **logged in** user taps it and asks "how do I..." questions about using Schedula (find a doctor, book, reschedule, cancel, prescriptions, profile).
- An **AI helper** answers in short, friendly words.
- The chat is **saved** for that user and is **cleared on logout**.
- It only helps with *using the app*. It does not give medical advice and never shares private user data.

---

## How it works (step by step)

- **You tap the chat button.** The chat window opens.
- **Not logged in?** It shows a "Please log in" message and stops.
- **Logged in?** It loads your saved chat and shows the old messages.
- **You type a question and press send.** Your message shows on screen at once.
- **The app sends it to the server** at `POST /api/chat` with your user id and message.
- **The server checks it** — you must be logged in and the message must not be empty.
- **Your message is saved** to the database.
- **The server asks the AI.** It tries **Groq** first, then **OpenRouter** as a backup. If both fail, it returns a safe "assistant is not available" message.
- **A rule goes with every question:** only help with Schedula, keep it short, never share private data, never give a medical diagnosis.
- **The reply is saved** and **sent back** to the app.
- **The reply shows** under your question.
- **On logout**, the whole chat is deleted, so nothing is kept.

Short version:

```
You → chat button → /api/chat → save message → ask Groq → (if it fails) ask OpenRouter → save reply → show reply
Logout → delete the whole chat
```

---

## The files that make it work

```
src/
├── features/chatbot/
│   ├── components/ChatWidget.tsx      The chat button and window
│   └── api/chatService.ts             Calls the chat API (load, send, clear)
├── app/api/chat/route.ts              Saves messages, asks the AI, returns the reply
├── lib/ai/chatbot.ts                  Talks to Groq and OpenRouter, with the safety rule
├── lib/models/ChatMessage.ts          The chat message database shape
└── types/chat.ts                      The chat message TypeScript type
```

The chat button is added once in `src/app/layout.tsx`, so it shows on every page.

---

## How to turn it on

The assistant is **optional**. Add one or both keys to `.env` (a free key from either site is enough):

```
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-20b

OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=openrouter/free
```

- Get a free Groq key: <https://console.groq.com>
- Get a free OpenRouter key: <https://openrouter.ai>

Notes:

- The app tries **Groq** first, then **OpenRouter**.
- `.env` is read only when the server starts, so restart it after any change.
- Without any key, the app still runs fine — only the chat button says it is not available.
