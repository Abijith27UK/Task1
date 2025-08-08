import { useState, useEffect } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chatMessages");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [count, setCount] = useState(
    parseInt(sessionStorage.getItem("queryCount") || "0")
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages.slice(-3)));
  }, [messages]);

  useEffect(() => {
    sessionStorage.setItem("queryCount", count);
  }, [count]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    if (count >= 5) {
      alert("Rate limit reached (5 queries per session)");
      return;
    }

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setCount(count + 1);
    setLoading(true);

    try {
      const prompt = `Answer like you're a helpful assistant. ${input}`;
      const res = await fetch(
        "https://api-inference.huggingface.co/models/gpt2",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ inputs: prompt }),
        }
      );

      const data = await res.json();
      const botMessage = {
        role: "bot",
        text:
          data?.[0]?.generated_text?.replace(prompt, "").trim() ||
          "Sorry, I couldn't get a response.",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Error fetching AI response." },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-blue-700">
        AskMe Bot
      </h2>

      <div className="w-full max-w-2xl flex flex-col flex-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg">
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg max-w-xs ${
                msg.role === "user"
                  ? "bg-blue-600 text-white self-end ml-auto"
                  : "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100 self-start"
              }`}
            >
              {msg.text}
            </div>
          ))}
          {loading && (
            <div className="bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100 p-3 rounded-lg max-w-xs">
              Thinking...
            </div>
          )}
        </div>

        {/* Input box */}
        <div className="flex gap-2 border-t border-gray-300 dark:border-gray-700 p-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 px-3 py-2 rounded-lg border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
