"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MessageCircle, X, Send } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { getChatHistory, sendChatMessage } from "@/features/chatbot/api/chatService";
import type { ChatMessage } from "@/types";

// A fixed chat button at the bottom right that opens the Schedula assistant.
export default function ChatWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

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

  // Sends the typed message and shows the reply.
  async function handleSend(event: React.FormEvent) {
    event.preventDefault();
    if (!user || !input.trim() || isSending) return;

    const text = input.trim();
    setInput("");
    setErrorMessage("");

    // Show the user's own message right away.
    const localMessage: ChatMessage = {
      _id: `local-${Date.now()}`,
      role: "user",
      text,
      createdAt: new Date().toISOString(),
    };
    setMessages((current) => [...current, localMessage]);
    setIsSending(true);

    try {
      const reply = await sendChatMessage(user._id, text);
      setMessages((current) => [...current, reply]);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not send the message");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {isOpen && (
        <div className="mb-3 flex h-[28rem] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-lg">
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

          {!user ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
              <p className="text-sm text-muted">Please log in to start a chat.</p>
              <Link
                href="/login"
                className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-on-brand hover:bg-brand-dark"
              >
                Log in
              </Link>
            </div>
          ) : (
            <>
              <div ref={listRef} className="thin-scrollbar flex-1 space-y-3 overflow-y-auto p-4">
                {messages.length === 0 && (
                  <p className="text-center text-sm text-muted">Ask me how to use Schedula.</p>
                )}

                {messages.map((one) => (
                  <div key={one._id} className={one.role === "user" ? "text-right" : "text-left"}>
                    <span
                      className={`inline-block max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-left text-sm ${
                        one.role === "user" ? "bg-brand text-on-brand" : "bg-surface text-ink"
                      }`}
                    >
                      {one.text}
                    </span>
                  </div>
                ))}

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
            </>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label="Open chat"
        className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-brand text-on-brand shadow-lg transition-colors hover:bg-brand-dark"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
