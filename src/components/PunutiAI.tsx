import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type PunutiAIProps = {
  context?: string;
};

export default function PunutiAI({ context = "" }: PunutiAIProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const text = message.trim();

    if (!text || loading) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: text },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(
        `${supabaseUrl}/functions/v1/ai-assistant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({
            message: text,
            context,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const answer =
        data?.answer ||
        "Sorry, I couldn't get an answer right now.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: answer,
        },
      ]);
    } catch (error) {
      console.error("PUNUTIE AI error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? `AI error: ${error.message}`
              : "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((value) => !value)}
        aria-label="Open PUNUTIE AI"
        style={{
          position: "fixed",
          right: "20px",
          bottom: "20px",
          width: "58px",
          height: "58px",
          borderRadius: "50%",
          border: "none",
          background: "#111827",
          color: "white",
          fontSize: "20px",
          fontWeight: 700,
          cursor: "pointer",
          zIndex: 9999,
          boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
        }}
      >
        {open ? "×" : "AI"}
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            right: "20px",
            bottom: "90px",
            width: "min(380px, calc(100vw - 40px))",
            height: "min(560px, calc(100vh - 120px))",
            background: "white",
            borderRadius: "18px",
            overflow: "hidden",
            boxShadow: "0 15px 45px rgba(0,0,0,0.25)",
            zIndex: 9998,
            display: "flex",
            flexDirection: "column",
            border: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              padding: "16px",
              background: "#111827",
              color: "white",
            }}
          >
            <strong style={{ fontSize: "17px" }}>
              PUNUTIE AI
            </strong>

            <div
              style={{
                fontSize: "12px",
                opacity: 0.8,
                marginTop: "3px",
              }}
            >
              Health education assistant
            </div>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "15px",
              background: "#f9fafb",
            }}
          >
            {messages.length === 0 && (
              <div
                style={{
                  background: "white",
                  padding: "14px",
                  borderRadius: "12px",
                  color: "#374151",
                  fontSize: "14px",
                  lineHeight: 1.5,
                }}
              >
                Hello! I'm PUNUTIE AI. Ask me a question about
                health education or the content on this website.
              </div>
            )}

            {messages.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent:
                    item.role === "user"
                      ? "flex-end"
                      : "flex-start",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    maxWidth: "85%",
                    padding: "11px 13px",
                    borderRadius: "14px",
                    background:
                      item.role === "user"
                        ? "#111827"
                        : "white",
                    color:
                      item.role === "user"
                        ? "white"
                        : "#1f2937",
                    fontSize: "14px",
                    lineHeight: 1.5,
                    whiteSpace: "pre-wrap",
                    boxShadow:
                      item.role === "assistant"
                        ? "0 1px 4px rgba(0,0,0,0.08)"
                        : "none",
                  }}
                >
                  {item.content}
                </div>
              </div>
            ))}

            {loading && (
              <div
                style={{
                  color: "#6b7280",
                  fontSize: "13px",
                  padding: "8px",
                }}
              >
                PUNUTIE AI is thinking...
              </div>
            )}
          </div>

          <div
            style={{
              padding: "10px",
              background: "white",
              borderTop: "1px solid #e5e7eb",
              display: "flex",
              gap: "8px",
            }}
          >
            <textarea
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask a health question..."
              rows={2}
              disabled={loading}
              style={{
                flex: 1,
                resize: "none",
                border: "1px solid #d1d5db",
                borderRadius: "10px",
                padding: "9px",
                outline: "none",
                fontSize: "14px",
              }}
            />

            <button
              onClick={sendMessage}
              disabled={loading || !message.trim()}
              style={{
                alignSelf: "stretch",
                border: "none",
                borderRadius: "10px",
                padding: "0 14px",
                background:
                  loading || !message.trim()
                    ? "#d1d5db"
                    : "#111827",
                color: "white",
                cursor:
                  loading || !message.trim()
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
