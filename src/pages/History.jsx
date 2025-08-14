import { useState, useEffect } from "react";

export default function History() {
  const [history, setHistory] = useState([]);

  // Utility function to ensure history is always limited to 10 items
  const enforceHistoryLimit = (historyArray) => {
    if (Array.isArray(historyArray) && historyArray.length > 10) {
      return historyArray.slice(0, 10);
    }
    return historyArray;
  };

  useEffect(() => {
    // Load history from localStorage on component mount
    const savedHistory = localStorage.getItem("aiPlaygroundHistory");
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        const limitedHistory = enforceHistoryLimit(parsedHistory);
        
        // If we had to limit the history, save it back
        if (limitedHistory.length !== parsedHistory.length) {
          localStorage.setItem("aiPlaygroundHistory", JSON.stringify(limitedHistory));
        }
        
        setHistory(limitedHistory);
      } catch (error) {
        console.error("Error parsing history:", error);
        localStorage.removeItem("aiPlaygroundHistory");
        setHistory([]);
      }
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("aiPlaygroundHistory");
    setHistory([]);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getSkillDisplayName = (skill) => {
    switch (skill) {
      case "conversation":
        return "Conversation Analysis";
      case "image":
        return "Image Analysis";
      case "document-url":
        return "Document/URL Summarization";
      default:
        return skill;
    }
  };

  const renderResult = (result, skill) => {
    if (!result) return <div style={{ color: "var(--text-muted, #666)" }}>No result available</div>;

    switch (skill) {
      case "conversation":
        return (
          <div style={{ spaceY: 2 }}>
            {result.transcript && (
              <div style={{ marginBottom: 8 }}>
                <strong style={{ color: "var(--text-color, #000)" }}>Transcript:</strong>
                <div style={{ ...resultContainerStyle, marginTop: 4 }}>{result.transcript}</div>
              </div>
            )}
            {result.diarization && (
              <div style={{ marginBottom: 8 }}>
                <strong style={{ color: "var(--text-color, #000)" }}>Diarization:</strong>
                <div style={{ ...resultContainerStyle, marginTop: 4 }}>{result.diarization}</div>
              </div>
            )}
            {result.summary && (
              <div style={{ marginBottom: 8 }}>
                <strong style={{ color: "var(--text-color, #000)" }}>Summary:</strong>
                <div style={{ ...resultContainerStyle, marginTop: 4 }}>{result.summary}</div>
              </div>
            )}
            {result.text && !result.transcript && !result.diarization && !result.summary && (
              <div style={{ ...resultContainerStyle }}>{result.text}</div>
            )}
          </div>
        );

      case "image":
        return (
          <div>
            {result.caption && (
              <div style={{ marginBottom: 8 }}>
                <strong style={{ color: "var(--text-color, #000)" }}>Caption:</strong>
                <div style={{ ...resultContainerStyle, marginTop: 4 }}>{result.caption}</div>
              </div>
            )}
            {result.description && (
              <div style={{ marginBottom: 8 }}>
                <strong style={{ color: "var(--text-color, #000)" }}>Description:</strong>
                <div style={{ ...resultContainerStyle, marginTop: 4 }}>{result.description}</div>
              </div>
            )}
            {result.tags && (
              <div style={{ marginBottom: 8 }}>
                <strong style={{ color: "var(--text-color, #000)" }}>Tags:</strong>
                <div style={{ ...resultContainerStyle, marginTop: 4 }}>
                  {Array.isArray(result.tags) ? result.tags.join(", ") : result.tags}
                </div>
              </div>
            )}
            {result.text && !result.caption && !result.description && (
              <div style={{ ...resultContainerStyle }}>{result.text}</div>
            )}
          </div>
        );

      case "document-url":
        return (
          <div>
            {result.summary && (
              <div style={{ marginBottom: 8 }}>
                <strong style={{ color: "var(--text-color, #000)" }}>Summary:</strong>
                <div style={{ ...resultContainerStyle, marginTop: 4 }}>{result.summary}</div>
              </div>
            )}
            {result.key_points && (
              <div style={{ marginBottom: 8 }}>
                <strong style={{ color: "var(--text-color, #000)" }}>Key Points:</strong>
                <div style={{ ...resultContainerStyle, marginTop: 4 }}>
                  {Array.isArray(result.key_points) ? result.key_points.join("\n• ") : result.key_points}
                </div>
              </div>
            )}
            {result.text && !result.summary && (
              <div style={{ ...resultContainerStyle }}>{result.text}</div>
            )}
          </div>
        );

      default:
        return <div style={{ ...resultContainerStyle }}>{JSON.stringify(result, null, 2)}</div>;
    }
  };

  // Dynamic styles that respond to dark mode
  const containerStyle = {
    border: "1px solid var(--border-color, #e0e0e0)",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    background: "var(--card-bg, #fff)",
    color: "var(--text-color, #000)"
  };

  const resultContainerStyle = {
    whiteSpace: "pre-wrap",
    padding: 12,
    borderRadius: 8,
    background: "var(--result-bg, #f5f5f5)",
    color: "var(--text-color, #000)",
    border: "1px solid var(--border-color, #e0e0e0)",
    fontSize: "14px",
    maxHeight: "200px",
    overflowY: "auto"
  };

  const buttonStyle = {
    padding: "8px 16px",
    borderRadius: 8,
    background: "var(--button-bg, #007bff)",
    color: "var(--button-text, #fff)",
    border: "none",
    cursor: "pointer",
    marginBottom: 16
  };

  return (
    <div style={{ maxWidth: 1000, margin: "24px auto", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ color: "var(--text-color, #000)", margin: 0 }}>AI Playground History</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: "var(--text-muted, #666)", fontSize: "14px" }}>
            Showing {history.length} of 10 most recent interactions
          </span>
          {history.length > 0 && (
            <button onClick={clearHistory} style={{ ...buttonStyle, background: "var(--button-secondary-bg, #dc3545)", marginBottom: 0 }}>
              Clear History
            </button>
          )}
        </div>
      </div>

      {history.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted, #666)" }}>
          <h3>No History Yet</h3>
          <p>Your AI interactions will appear here once you start using the playground.</p>
          <p style={{ fontSize: "14px", marginTop: 8 }}>History is automatically limited to the 10 most recent interactions.</p>
        </div>
      ) : (
        <div>
          {history.map((item, index) => (
            <div key={index} style={containerStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div>
                  <span style={{ 
                    background: "var(--button-bg, #007bff)", 
                    color: "white", 
                    padding: "4px 8px", 
                    borderRadius: 4, 
                    fontSize: "12px",
                    fontWeight: "bold"
                  }}>
                    {getSkillDisplayName(item.skill)}
                  </span>
                  <span style={{ 
                    marginLeft: 12, 
                    color: "var(--text-muted, #666)", 
                    fontSize: "14px" 
                  }}>
                    {formatDate(item.timestamp)}
                  </span>
                </div>
                <span style={{ 
                  color: "var(--text-muted, #666)", 
                  fontSize: "12px",
                  background: "var(--result-bg, #f5f5f5)",
                  padding: "2px 6px",
                  borderRadius: 4
                }}>
                  #{history.length - index}
                </span>
              </div>

              <div style={{ marginBottom: 16 }}>
                <h4 style={{ color: "var(--text-color, #000)", marginBottom: 8 }}>Input:</h4>
                <div style={{ ...resultContainerStyle, background: "var(--input-bg, #f8f9fa)" }}>
                  {item.fileName && (
                    <div style={{ marginBottom: 8 }}>
                      <strong>File:</strong> {item.fileName} ({Math.round(item.fileSize / 1024)} KB)
                    </div>
                  )}
                  {item.url && (
                    <div style={{ marginBottom: 8 }}>
                      <strong>URL:</strong> {item.url}
                    </div>
                  )}
                  {item.skill === "conversation" && (
                    <div>Audio file uploaded for conversation analysis</div>
                  )}
                  {item.skill === "image" && (
                    <div>Image file uploaded for analysis</div>
                  )}
                  {item.skill === "document-url" && (
                    <div>Document or URL submitted for summarization</div>
                  )}
                </div>
              </div>

              <div>
                <h4 style={{ color: "var(--text-color, #000)", marginBottom: 8 }}>Output:</h4>
                {renderResult(item.result, item.skill)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 