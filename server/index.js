import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createHmac, timingSafeEqual } from "node:crypto";

dotenv.config({ path: ".env.local" });

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

app.use(express.json({
  limit: "1mb",
  verify: (req, res, buf) => {
    req.rawBody = Buffer.from(buf);
  },
}));

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

// ---------------- PAYSTACK PAYMENTS ----------------

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYMENT_FRONTEND_URL =
  process.env.FRONTEND_URL || "https://pnutie-health-teacher.onrender.com";

async function paystackRequest(path, options = {}) {
  if (!PAYSTACK_SECRET_KEY) {
    throw new Error("Paystack is not configured.");
  }

  const response = await fetch(`https://api.paystack.co${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok || !data.status) {
    console.error("Paystack request failed:", data.message || response.status);
    throw new Error("The payment provider could not process the request.");
  }

  return data.data;
}
app.post("/api/payments/initialize", async (req, res) => {
  try {
    const email =
      typeof req.body?.email === "string"
        ? req.body.email.trim()
        : "";

    const amount = Number(req.body?.amount);

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !Number.isFinite(amount) ||
      amount < 5 ||
      amount > 10000
    ) {
      return res.status(400).json({
        error:
          "Enter a valid email and an amount between GH₵5 and GH₵10,000.",
      });
    }

    const transaction = await paystackRequest(
      "/transaction/initialize",
      {
        method: "POST",
        body: JSON.stringify({
          email,
          amount: Math.round(amount * 100),
          currency: "GHS",
          callback_url: `${PAYMENT_FRONTEND_URL}/payment-success`,
          metadata: {
            purpose: "Support Punutie Health Teacher",
          },
        }),
      }
    );

    return res.json({
      authorization_url: transaction.authorization_url,
      reference: transaction.reference,
    });
  } catch (error) {
    console.error(
      "Payment initialization error:",
      error.message
    );

    return res.status(502).json({
      error:
        "Unable to start payment. Please try again later.",
    });
  }
});

app.get("/api/payments/verify/:reference", async (req, res) => {
  try {
    const reference = req.params.reference;

    if (
      typeof reference !== "string" ||
      reference.length < 5 ||
      reference.length > 100
    ) {
      return res.status(400).json({
        error: "Invalid transaction reference.",
      });
    }

    const transaction = await paystackRequest(
      `/transaction/verify/${encodeURIComponent(reference)}`
    );

    if (
      transaction.status !== "success" ||
      transaction.currency !== "GHS"
    ) {
      return res.status(402).json({
        status: "failed",
      });
    }

    return res.json({
      status: "success",
      amount: transaction.amount / 100,
      currency: transaction.currency,
      reference: transaction.reference,
    });
  } catch (error) {
    console.error(
      "Payment verification error:",
      error.message
    );

    return res.status(502).json({
      error: "Unable to verify this payment right now.",
    });
  }
});

app.post("/api/payments/webhook", async (req, res) => {
  try {
    if (!PAYSTACK_SECRET_KEY) {
      return res.sendStatus(503);
    }

    const signature = req.get("x-paystack-signature");
    const rawBody = req.rawBody;

    if (!signature || !rawBody) {
      return res.sendStatus(400);
    }

    const expected = createHmac("sha512", PAYSTACK_SECRET_KEY)
      .update(rawBody)
      .digest();

    const supplied = Buffer.from(signature, "hex");

    if (
      supplied.length !== expected.length ||
      !timingSafeEqual(supplied, expected)
    ) {
      return res.sendStatus(401);
    }

    const event = req.body;

    if (
      event?.event === "charge.success" &&
      event?.data?.reference
    ) {
      console.log(
        "Verified Paystack payment:",
        event.data.reference
      );
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error(
      "Paystack webhook error:",
      error.message
    );

    return res.sendStatus(500);
  }
});


// ---------------- END PAYSTACK PAYMENTS ----------------

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Punuti Health Teacher AI running on port ${PORT}`);
});
