// api/gemini/image.js
import forward from "./_forward.js";

export default async (req, res) => {
  try {
    const body = req.body || (await parseJson(req));
    const instruction = `You are an image captioning assistant. Given an image provided as a base64 data URL in 'data', generate:
1) A short caption.
2) A detailed descriptive paragraph mentioning objects, setting, colors, likely actions, moods, and any notable details.
3) A list of tags / keywords.

Return a JSON object: { caption: "...", description: "...", tags: ["..."] }`;

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
