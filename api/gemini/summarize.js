// api/gemini/summarize.js
import forward from "./_forward.js";

export default async (req, res) => {
  try {
    const body = req.body || (await parseJson(req));
    const instruction = `You are an assistant that summarizes content. Input may include:
- 'url' pointing to a public webpage
- OR a file (data URL) in 'data' (PDF / DOC as base64). If the file is a PDF/DOC, extract the text and summarize.

Please provide your response in the following format:

**Summary:**
[A concise summary (4-6 lines) of the content]

**Key Points:**
• [First key point]
• [Second key point]
• [Third key point]
• [Fourth key point]
• [Fifth key point]
• [Sixth key point]

Make sure to provide a natural, readable response without JSON formatting.`;

    const reply = await forward({ reqBody: body, taskHint: { instruction } });
    res.status(reply.status).json(reply.body);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  }
};

function parseJson(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => (raw += chunk));
    req.on("end", () => {
      try {
        const v = JSON.parse(raw || "{}");
        resolve(v);
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}
