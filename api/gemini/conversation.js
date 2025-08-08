// api/gemini/conversation.js
const forward = require("./_forward");

module.exports = async (req, res) => {
  try {
    const body = req.body || (await parseJson(req));
    // We expect: { fileName, mimeType, data }
    // Build an instruction for the provider to do STT, diarization (2 speakers) and summary
    const instruction = `You are a helpful assistant. 
Given an audio file (base64 data URL) produce:
1) A plain transcript of the audio.
2) A diarized transcript labeling up to two speakers (Speaker 1 / Speaker 2) with text chunks.
3) A concise summary (3-4 lines).
Return a JSON object: { transcript: "...", diarization: "...", summary: "..." }`;

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
