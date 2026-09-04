# Chat Assistant Guide

This file explains the **AI chat assistant** in Schedula: what it is, how it works, and which files make it work.

---

## What it is

- A small **chat button** at the bottom right of every page.
- **Anyone can use it** — you do not need to log in.
- You ask "how do I..." questions about using Schedula (find a doctor, book, reschedule, cancel, prescriptions, profile).
- An AI helper answers in short, friendly words.
- The empty chat shows a few **quick questions** you can tap instead of typing.
- Some answers show a **link to the right page** (like doctors or profile), based on your question.
- If you are logged in, your chat is **saved** and cleared when you log out. A guest's chat is not saved.
- It only helps with using the app. It does not give medical advice and never shares private user data.

---

## How it works

- Tap the chat button to open the window. Tap outside it, or the ✕, to close.
- The empty chat shows quick questions; tap one to ask it, or type your own.
- You press send and your message shows on screen at once.
- The app sends it to the server at `POST /api/chat` with your message (and your user id if you are logged in).
- The server asks the AI. It tries **Groq** first, then **OpenRouter** as a backup. If both fail, it returns a safe "assistant is not available" message.
- If you are logged in, your question and the reply are **saved**; a guest just gets the answer and nothing is saved.
- Every question carries one rule: only help with Schedula, keep it short, never share private data, never give a medical diagnosis.
- The reply shows under your question. If the question is about a topic like doctors or profile, a link to that page appears with the answer.
- On logout, a logged in user's whole chat is deleted.

---

## The files that make it work

```
src/
├── features/chatbot/
│   ├── components/ChatWidget.tsx      The chat button, window, quick questions and links
│   └── api/chatService.ts             Calls the chat API (load, send, clear)
├── app/api/chat/route.ts              Asks the AI and, for a logged in user, saves the chat
├── lib/ai/chatbot.ts                  Talks to Groq and OpenRouter, with the safety rule
├── lib/models/ChatMessage.ts          The chat message database shape
└── types/chat.ts                      The chat message TypeScript type
```

The chat button is added once in `src/app/layout.tsx`, so it shows on every page.

---

## How to turn it on

- The assistant is optional. Add one or both keys to `.env` (a free key from either site is enough):

```
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-20b

OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=openrouter/free
```

- Get a free Groq key: https://console.groq.com
- Get a free OpenRouter key: https://openrouter.ai
- The app tries Groq first, then OpenRouter.
- `.env` is read only when the server starts, so restart it after any change.
- Without any key, the app still runs; the chat button just says it is not available.

---