import { useState } from "react";

/**
 * Chatbot Playground (multi-skill)
 * - conversation: upload audio -> server will transcribe/diarize/summarize
 * - image: upload image -> server will caption
 * - document/url: upload pdf/doc OR paste url -> server will summarize
 *
 * This frontend sends files as base64 to serverless endpoints under /api/gemini/*
 */

export default function Chatbot() {
  const [skill, setSkill] = useState("conversation");
  const [file, setFile] = useState(null);           // File object
  const [filePreview, setFilePreview] = useState(""); // Data URL for preview
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // Read file as dataURL (base64)
  const handleFile = async (e) => {
    setResult(null);
    setError("");
    const f = e.target.files?.[0];
    if (!f) {
      setFile(null);
      setFilePreview("");
      return;
    }
    setFile(f);
    // preview for images
    if (f.type.startsWith("image/")) {
      const url = URL.createObjectURL(f);
      setFilePreview(url);
    } else {
      setFilePreview("");
    }
  };

  // helper: read file as base64 data URL
  const fileToDataUrl = (f) =>
    new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result);
      reader.onerror = rej;
      reader.readAsDataURL(f);
    });

  const handleSubmit = async () => {
    setError("");
    setResult(null);

    if (skill === "conversation" && !file) {
      setError("Please upload an audio file for Conversation Analysis.");
      return;
    }

    if (skill === "image" && !file) {
      setError("Please upload an image for Image Analysis.");
      return;
    }

    if (skill === "document-url" && !file && !urlInput.trim()) {
      setError("Please upload a PDF/DOC or provide a URL.");
      return;
    }

    setLoading(true);

    try {
      let body = { }; 
      if (file) {
        const dataUrl = await fileToDataUrl(file); // "data:...;base64,AAAA..."
        body.fileName = file.name;
        body.mimeType = file.type;
        body.data = dataUrl;
      }
      if (urlInput) body.url = urlInput;

      let endpoint = "";
      if (skill === "conversation") endpoint = "/api/gemini/conversation";
      if (skill === "image") endpoint = "/api/gemini/image";
      if (skill === "document-url") endpoint = "/api/gemini/summarize";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Server error");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Dynamic styles that respond to dark mode
  const containerStyle = {
    border: "1px solid rgba(128,128,128,0.25)",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    background: "var(--card-bg, #fff)",
    color: "var(--text-color, #000)"
  };

  const resultContainerStyle = {
    whiteSpace: "pre-wrap",
    padding: 12,
    borderRadius: 8,
    background: "var(--result-bg, #f5f5f5)",
    color: "var(--text-color, #000)",
    border: "1px solid var(--border-color, #e0e0e0)"
  };

  const buttonStyle = {
    padding: "8px 16px",
    borderRadius: 8,
    background: "var(--button-bg, #007bff)",
    color: "var(--button-text, #fff)",
    border: "none",
    cursor: "pointer"
  };

  const inputStyle = {
    padding: "8px 12px",
    borderRadius: 6,
    border: "1px solid var(--border-color, #ccc)",
    background: "var(--input-bg, #fff)",
    color: "var(--text-color, #000)",
    flex: 1
  };

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: 16 }}>
      <h1 style={{ marginBottom: 12, color: "var(--text-color, #000)" }}>AI Playground — Multi-skill</h1>

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
        <label style={{ fontWeight: 600, color: "var(--text-color, #000)" }}>Select Skill</label>
        <select 
          value={skill} 
          onChange={(e) => { setSkill(e.target.value); setResult(null); setError(""); setFile(null); setFilePreview(""); setUrlInput(""); }}
          style={inputStyle}
        >
          <option value="conversation">Conversation Analysis</option>
          <option value="image">Image Analysis</option>
          <option value="document-url">Document / URL Summarization</option>
        </select>
      </div>

      {/* Dynamic input area */}
      <div style={containerStyle}>
        {skill === "conversation" && (
          <>
            <p><strong>Conversation Analysis</strong> — Upload an audio file (wav/mp3). We'll transcribe, diarize (max 2 speakers) and summarize.</p>
            <input type="file" accept="audio/*" onChange={handleFile} style={inputStyle} />
            {file && <div style={{ marginTop: 8, color: "var(--text-color, #000)" }}>Selected: {file.name} ({Math.round(file.size/1024)} KB)</div>}
          </>
        )}

        {skill === "image" && (
          <>
            <p><strong>Image Analysis</strong> — Upload an image. We'll generate a detailed description.</p>
            <input type="file" accept="image/*" onChange={handleFile} style={inputStyle} />
            {filePreview && <img src={filePreview} alt="preview" style={{ marginTop: 8, maxWidth: 320, borderRadius: 8, border: "1px solid var(--border-color, #ddd)" }} />}
          </>
        )}

        {skill === "document-url" && (
          <>
            <p><strong>Document / URL Summarization</strong> — Upload PDF/DOC or paste a URL.</p>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleFile} style={inputStyle} />
              <span style={{ color: "var(--text-muted, #666)" }}> — OR — </span>
              <input 
                style={inputStyle} 
                placeholder="https://example.com/article" 
                value={urlInput} 
                onChange={(e) => setUrlInput(e.target.value)} 
              />
            </div>
          </>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button onClick={handleSubmit} disabled={loading} style={buttonStyle}>
          {loading ? "Processing..." : "Run"}
        </button>
        <button 
          onClick={() => { setResult(null); setError(""); setFile(null); setFilePreview(""); setUrlInput(""); }} 
          style={{ ...buttonStyle, background: "var(--button-secondary-bg, #6c757d)" }}
        >
          Reset
        </button>
      </div>

      {error && <div style={{ marginTop: 12, color: "crimson" }}>{error}</div>}

      {/* Results */}
      {result && (
        <div style={{ marginTop: 18, borderTop: "1px solid var(--border-color, #eee)", paddingTop: 16 }}>
          <h3 style={{ color: "var(--text-color, #000)" }}>Results</h3>

          {skill === "conversation" && (
            <>
              <section style={{ marginBottom: 12 }}>
                <h4 style={{ color: "var(--text-color, #000)" }}>Conversation Analysis</h4>
                <pre style={resultContainerStyle}>{result.transcript || result.text || "No transcript returned"}</pre>
              </section>
            </>
          )}

          {skill === "image" && (
            <>
              <section style={{ marginBottom: 12 }}>
                <h4 style={{ color: "var(--text-color, #000)" }}>Image</h4>
                {filePreview && <img src={filePreview} alt="uploaded" style={{ maxWidth: 420, borderRadius: 8 }} />}
              </section>
              <section>
                <h4 style={{ color: "var(--text-color, #000)" }}>Caption / Description</h4>
                <div style={resultContainerStyle}>{result.caption || result.text || "No caption returned"}</div>
              </section>
            </>
          )}

          {skill === "document-url" && (
            <>
              <section>
                <h4 style={{ color: "var(--text-color, #000)" }}>Summary</h4>
                <div style={resultContainerStyle}>{result.summary || result.text || "No summary returned"}</div>
              </section>
            </>
          )}
        </div>
      )}
    </div>
  );
}
