"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MessageCircle, X, Send } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { getChatHistory, sendChatMessage } from "@/features/chatbot/api/chatService";
import type { ChatMessage } from "@/types";

// Ready-made questions the user can tap instead of typing.
const QUICK_QUESTIONS = [
  "How do I book an appointment?",
  "How do I reschedule or cancel?",
  "Where do I see my prescription?",
  "How do I update my profile?",
];

// If a question mentions these words, the answer shows a link to that page.
const LINK_RULES = [
  { words: ["doctor", "specialist", "book", "booking", "find"], label: "Browse doctors", href: "/doctors" },
  { words: ["appointment", "reschedule", "cancel", "prescription", "visit"], label: "My appointments", href: "/appointments" },
  { words: ["profile", "photo", "gender", "blood", "medical", "emergency", "detail"], label: "Go to my profile", href: "/profile" },
  { words: ["dashboard", "calendar", "stats"], label: "Open dashboard", href: "/dashboard" },
  { words: ["notification", "bell", "alert"], label: "Notifications", href: "/notifications" },
];

// Picks the page link that best matches the words in a question.
function linkForQuestion(text: string) {
  const lower = text.toLowerCase();
  for (const rule of LINK_RULES) {
    if (rule.words.some((word) => lower.includes(word))) return { label: rule.label, href: rule.href };
  }
  return null;
}

// A fixed chat button at the bottom right that opens the Schedula assistant.
export default function ChatWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Load the saved chat when the panel opens for a logged in user.
  useEffect(() => {
    if (!isOpen || !user) return;
    let active = true;

    getChatHistory(user._id)
      .then((history) => {
        if (active) setMessages(history);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [isOpen, user]);

  // Keep the newest message in view.
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, isOpen]);

  // Close the chat when the user clicks anywhere outside the panel.
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Sends one message (typed or tapped) and shows the reply.
  async function sendText(rawText: string) {
    const text = rawText.trim();
    if (!text || isSending) return;

    setInput("");
    setErrorMessage("");

    // Show the user's own message right away.
    const localMessage: ChatMessage = {
      _id: `local-${messages.length}`,
      role: "user",
      text,
      createdAt: "",
    };
    setMessages((current) => [...current, localMessage]);
    setIsSending(true);

    try {
      const reply = await sendChatMessage(user?._id ?? "", text);
      setMessages((current) => [...current, { ...reply, _id: reply._id || `reply-${current.length}` }]);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not send the message");
    } finally {
      setIsSending(false);
    }
  }

  // Sends the typed message when the form is submitted.
  function handleSend(event: React.FormEvent) {
    event.preventDefault();
    sendText(input);
  }

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {isOpen && (
        <div
          ref={panelRef}
          className="flex h-[28rem] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-lg"
        >
          <div className="flex items-center justify-between bg-brand px-4 py-3">
            <span className="text-sm font-semibold text-on-brand">Schedula Assistant</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="cursor-pointer text-on-brand"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div ref={listRef} className="thin-scrollbar flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-center text-sm text-muted">Ask me how to use Schedula, or tap a question.</p>

                {/* Ready-made questions the user can tap */}
                <div className="flex flex-col gap-2">
                  {QUICK_QUESTIONS.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => sendText(question)}
                      className="cursor-pointer rounded-xl border border-line bg-surface px-3 py-2 text-left text-sm text-ink hover:bg-brand-soft hover:text-brand"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((one, index) => {
              const previous = messages[index - 1];
              // The answer to a topic question also shows a link to that page.
              const suggestion =
                one.role === "assistant" && previous?.role === "user" ? linkForQuestion(previous.text) : null;

              return (
                <div key={one._id} className={one.role === "user" ? "text-right" : "text-left"}>
                  <span
                    className={`inline-block max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-left text-sm ${
                      one.role === "user" ? "bg-brand text-on-brand" : "bg-surface text-ink"
                    }`}
                  >
                    {one.text}
                  </span>

                  {suggestion && (
                    <div className="mt-1.5">
                      <Link
                        href={suggestion.href}
                        onClick={() => setIsOpen(false)}
                        className="inline-block rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand hover:bg-brand hover:text-on-brand"
                      >
                        {suggestion.label} →
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}

            {isSending && <p className="text-left text-xs text-muted">Assistant is typing...</p>}
          </div>

          {errorMessage && <p className="px-4 pb-2 text-xs text-danger">{errorMessage}</p>}

          <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-line p-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type your question"
              className="flex-1 rounded-xl bg-surface px-3 py-2 text-sm text-ink outline-none placeholder:text-muted"
            />
            <button
              type="submit"
              disabled={isSending}
              aria-label="Send message"
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-brand text-on-brand transition-colors hover:bg-brand-dark disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* The open button is hidden while the chat is open. */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open chat"
          className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-brand text-on-brand shadow-lg transition-colors hover:bg-brand-dark"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
