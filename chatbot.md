# Chat Assistant Guide

This file explains the **AI chat assistant** in Schedula: what it is, how it works, and which files make it work.

## What it is

- A small **chat button** at the bottom right of every page.
- A logged in user taps it and asks "how do I..." questions about using Schedula (find a doctor, book, reschedule, cancel, prescriptions, profile).
- An AI helper answers in short, friendly words.
- The chat is saved for that user and cleared on logout.
- It only helps with using the app. It does not give medical advice and never shares private user data.

## How it works

- You tap the chat button and the chat window opens.
- If you are not logged in, it shows a "Please log in" message and stops.
- If you are logged in, it loads your saved chat and shows the old messages.
- You type a question and press send. Your message shows on screen at once.
- The app sends it to the server at `POST /api/chat` with your user id and message.
- The server checks you are logged in and the message is not empty, then saves your message.
- The server asks the AI. It tries **Groq** first, then **OpenRouter** as a backup. If both fail, it returns a safe "assistant is not available" message.
- Every question carries one rule: only help with Schedula, keep it short, never share private data, never give a medical diagnosis.
- The reply is saved and sent back, and shows under your question.
- On logout, the whole chat is deleted, so nothing is kept.

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
