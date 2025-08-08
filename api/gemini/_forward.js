// api/gemini/_forward.js
const forward = async ({ reqBody, taskHint }) => {
    // For Google Gemini API, we need the API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { status: 500, body: { error: "Server config missing GEMINI_API_KEY" } };
    }

    // Google Gemini API endpoint
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    
    console.log("Using Gemini API with key:", apiKey ? "Present" : "Missing");

    // Build the payload for Gemini API
    const parts = [];
    
    // Add text instruction
    if (taskHint?.instruction) {
      parts.push({
        text: taskHint.instruction
      });
    }

    // Add file data if present
    if (reqBody.data) {
      // Extract base64 data from data URL
      const base64Data = reqBody.data.split(',')[1];
      parts.push({
        inlineData: {
          mimeType: reqBody.mimeType,
          data: base64Data
        }
      });
    }

    // Add URL if present
    if (reqBody.url) {
      parts.push({
        text: `Please analyze the content at this URL: ${reqBody.url}`
      });
    }

    const payload = {
      contents: [{
        parts: parts
      }]
    };

    console.log("Sending payload to Gemini API:", JSON.stringify(payload, null, 2));

    // Forward request to Gemini API
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const txt = await response.text();
      console.error("Gemini API error:", txt);
      return { status: response.status, body: { error: txt || "Upstream error" } };
    }

    // Parse Gemini API response
    const json = await response.json();
    console.log("Gemini API response:", JSON.stringify(json, null, 2));

    // Extract the generated text from Gemini response
    const generatedText = json.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated";
    
    return { 
      status: 200, 
      body: { 
        text: generatedText,
        raw: json 
      } 
    };
  };
  
  export default forward;
  