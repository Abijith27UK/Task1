# AI Playground - Multi-Modal AI Tasks

A React application that provides a playground for exploring multi-modal AI capabilities including conversation analysis, image analysis, and document/URL summarization.

## Features

- **Conversation Analysis**: Upload audio files for speech-to-text, speaker diarization, and summarization
- **Image Analysis**: Upload images to generate detailed descriptions and captions
- **Document/URL Summarization**: Upload documents (PDF, DOC) or provide URLs for content summarization

## Setup Instructions

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```
   GEMINI_ENDPOINT=your_gemini_api_endpoint
   GEMINI_API_KEY=your_gemini_api_key
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

### Vercel Deployment

1. **Deploy to Vercel:**
   ```bash
   npm run build
   vercel --prod
   ```

2. **Set environment variables in Vercel:**
   - Go to your Vercel project dashboard
   - Navigate to Settings > Environment Variables
   - Add the following variables:
     - `GEMINI_ENDPOINT`: Your Gemini API endpoint
     - `GEMINI_API_KEY`: Your Gemini API key

3. **Redeploy after setting environment variables:**
   ```bash
   vercel --prod
   ```

## API Configuration

The application uses serverless functions in the `/api/gemini/` directory that forward requests to your Gemini API provider. Make sure to:

1. Set the correct `GEMINI_ENDPOINT` pointing to your API provider
2. Set the `GEMINI_API_KEY` for authentication
3. Ensure your API provider accepts the payload format expected by the forward function

## Troubleshooting

### Common Issues:

1. **FUNCTION_INVOCATION_FAILED**: 
   - Check that environment variables are set in Vercel
   - Verify your API endpoint is accessible
   - Check Vercel function logs for detailed error messages

2. **Module Import Errors**:
   - The project uses ES modules (`"type": "module"` in package.json)
   - All API functions use ES module syntax

3. **CORS Issues**:
   - The API functions are designed to work with Vercel's serverless environment
   - No additional CORS configuration needed for Vercel deployment

## Project Structure

```
plivo/
├── api/gemini/          # Serverless API functions
│   ├── _forward.js      # Generic API forwarding logic
│   ├── conversation.js  # Audio processing endpoint
│   ├── image.js         # Image analysis endpoint
│   └── summarize.js     # Document/URL summarization endpoint
├── src/
│   ├── pages/
│   │   └── Chatbot.jsx  # Main playground interface
│   └── App.jsx          # React app with routing
└── vercel.json          # Vercel configuration
```

## Technologies Used

- React 19
- Vite
- Tailwind CSS
- Vercel Serverless Functions
- Google Gemini AI (via API)
