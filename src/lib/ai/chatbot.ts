// The assistant is limited to how the app works and general public info.
const SYSTEM_PROMPT = `You are the Schedula Assistant for a doctor appointment booking web app.
Only help with how to use Schedula: finding doctors, booking, rescheduling, cancelling, appointment
status, prescriptions, and profile setup, plus general non-personal information.
Never share or guess private or personal details about any user, patient or doctor.
Do not give medical diagnosis or treatment; instead suggest booking a doctor.
If a question is outside the app or asks for private data, politely say you can only help with using Schedula.
Keep answers short, clear and friendly.`;

// OpenRouter and Groq both use the same OpenAI-style chat API, so one helper handles both.
async function askOpenAiStyle(
  name: string,
  url: string,
  apiKey: string | undefined,
  model: string,
  question: string
): Promise<string | null> {
  if (!apiKey) return null;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: question },
        ],
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error(`${name} failed (${response.status}):`, detail.slice(0, 300));
      return null;
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;
    if (typeof text === "string" && text.trim()) return text.trim();

    console.error(`${name} returned no text:`, JSON.stringify(data).slice(0, 300));
    return null;
  } catch (error) {
    console.error(`${name} request error:`, error);
    return null;
  }
}

// The main provider.
function askGroq(question: string) {
  return askOpenAiStyle(
    "Groq",
    "https://api.groq.com/openai/v1/chat/completions",
    process.env.GROQ_API_KEY,
    process.env.GROQ_MODEL || "openai/gpt-oss-20b",
    question
  );
}

// The backup provider.
function askOpenRouter(question: string) {
  return askOpenAiStyle(
    "OpenRouter",
    "https://openrouter.ai/api/v1/chat/completions",
    process.env.OPENROUTER_API_KEY,
    process.env.OPENROUTER_MODEL || "openrouter/free",
    question
  );
}

// Tries Groq first, then OpenRouter, then a safe fallback message.
export async function askAssistant(question: string): Promise<string> {
  const fromGroq = await askGroq(question);
  if (fromGroq) return fromGroq;

  const fromOpenRouter = await askOpenRouter(question);
  if (fromOpenRouter) return fromOpenRouter;

  console.error("All AI providers failed for question:", question.slice(0, 120));
  return "Sorry, the assistant is not available right now. Please try again later.";
}
