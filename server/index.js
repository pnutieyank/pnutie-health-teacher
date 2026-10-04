import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL || "*";

app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Punuti Health Teacher AI",
  });
});

app.post("/api/ai", async (req, res) => {
  try {
    const { message, context } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "A message is required.",
      });
    }

    if (!OPENROUTER_API_KEY) {
      console.error("OPENROUTER_API_KEY is not configured.");

      return res.status(500).json({
        error: "AI service is not configured.",
      });
    }

    const systemPrompt = `
You are Punuti AI, the health education assistant for Punuti Health Teacher.

Your role is to help visitors understand health education content clearly and safely.

Guidelines:
- Give clear, simple, educational answers.
- Do not pretend to be a doctor.
- Do not diagnose diseases.
- Do not prescribe medications or give dangerous treatment instructions.
- Encourage professional medical care when a situation may require it.
- For emergencies, advise the person to seek emergency medical help immediately.
- Stay focused on health education.
- Use the website content/context provided when relevant.

Website context:
${context || "General health education"}
`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer":
            process.env.FRONTEND_URL || "https://punutie-health-teacher.onrender.com",
          "X-Title": "Punuti Health Teacher",
        },
        body: JSON.stringify({
          model: process.env.AI_MODEL || "openai/gpt-oss-20b",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: message.trim(),
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter error:", data);

      return res.status(502).json({
        error: "The AI provider could not process the request.",
      });
    }

    const answer = data?.choices?.[0]?.message?.content;

    if (!answer) {
      console.error("Unexpected OpenRouter response:", data);

      return res.status(502).json({
        error: "The AI provider returned an empty response.",
      });
    }

    return res.json({
      answer,
    });
  } catch (error) {
    console.error("AI server error:", error);

    return res.status(500).json({
      error: "Unable to process the AI request.",
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Punuti Health Teacher AI running on port ${PORT}`);
});
