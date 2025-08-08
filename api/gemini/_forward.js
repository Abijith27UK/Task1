// api/gemini/_forward.js
const forward = async ({ reqBody, taskHint }) => {
    // Endpoint and API key must be set in Vercel env:
    // GEMINI_ENDPOINT and GEMINI_API_KEY
    const endpoint = process.env.GEMINI_ENDPOINT;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!endpoint || !apiKey) {
      return { status: 500, body: { error: "Server config missing GEMINI_ENDPOINT/GEMINI_API_KEY" } };
    }
    console.log("KEY:", process.env.GEMINI_API_KEY);
    console.log("ENDPOINT:", process.env.GEMINI_ENDPOINT);
    // Build a generic prompt payload that includes the data.
    // Many providers accept a JSON "input" or "instances" key, but shape differs.
    // We send a minimal generic payload and rely on you to set GEMINI_ENDPOINT to a compatible endpoint.
    const payload = {
      taskHint,
      // include raw content your provider expects; we include fields commonly used:
      input: {
        // full prompt / instruction
        prompt: taskHint?.instruction || "",
        // file data raw (data URL) if provided
        fileName: reqBody.fileName,
        mimeType: reqBody.mimeType,
        data: reqBody.data,   // data URL (base64)
        url: reqBody.url,
        extra: reqBody.extra || {}
      }
    };
  
    // Forward request to provider
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload),
    });
  
    if (!response.ok) {
      const txt = await response.text();
      return { status: response.status, body: { error: txt || "Upstream error" } };
    }
  
    // provider response expected to be JSON
    const json = await response.json();
    return { status: 200, body: json };
  };
  
  export default forward;
  