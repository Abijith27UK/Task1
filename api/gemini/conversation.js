// api/gemini/conversation.js
import forward from "./_forward.js";

export default async (req, res) => {
  try {
    const body = req.body || (await parseJson(req));
    // We expect: { fileName, mimeType, data }
    // Build an instruction for the provider to do STT, diarization (2 speakers) and summary
    const instruction = `You are a helpful assistant. 
Given an audio file (base64 data URL) produce a comprehensive analysis.

Please provide your response in the following format:

**Transcript:**
[Plain transcript of the audio content]

**Speaker Diarization:**
[Transcript with speaker labels (Speaker 1 / Speaker 2) for up to two speakers]

**Summary:**
[A concise summary (3-4 lines) of the conversation]

Make sure to provide a natural, readable response without JSON formatting.`;

    const reply = await forward({ reqBody: body, taskHint: { instruction } });

    res.status(reply.status).json(reply.body);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  }
};

// simple body parser if needed
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
