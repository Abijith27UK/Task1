# AI Playground - Multi-Modal AI Tasks

A React application that provides a playground for exploring multi-modal AI capabilities including conversation analysis, image analysis, and document/URL summarization using Google's Gemini API.

## Features

- **Conversation Analysis**: Upload audio files for speech-to-text, speaker diarization, and summarization
- **Image Analysis**: Upload images to generate detailed descriptions and captions
- **Document/URL Summarization**: Upload documents (PDF, DOC) or provide URLs for content summarization

## Setup Instructions

### Prerequisites

1. **Google Cloud Project**: You need a Google Cloud project with Gemini API enabled
2. **API Key**: Generate an API key from Google AI Studio (https://makersuite.google.com/app/apikey)

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
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
   - Add the following variable:
     - `GEMINI_API_KEY`: Your Google Gemini API key

3. **Redeploy after setting environment variables:**
   ```bash
   vercel --prod
   ```

## Getting Your Gemini API Key

1. **Visit Google AI Studio**: Go to https://makersuite.google.com/app/apikey
2. **Sign in**: Use your Google account
3. **Create API Key**: Click "Create API Key" and copy the generated key
4. **Set Environment Variable**: Add this key to your Vercel environment variables

## API Configuration

The application uses Google's Gemini API through serverless functions. The API:
- Accepts text, image, and document inputs
- Returns AI-generated responses based on the task
- Handles authentication via API key in the URL

## Troubleshooting

### Common Issues:

1. **401 UNAUTHENTICATED Error**: 
   - Check that `GEMINI_API_KEY` is set correctly in Vercel
   - Verify your API key is valid and not expired
   - Ensure you have enabled the Gemini API in your Google Cloud project

2. **FUNCTION_INVOCATION_FAILED**: 
   - Check Vercel function logs for detailed error messages
   - Verify environment variables are set correctly

3. **Module Import Errors**:
   - The project uses ES modules (`"type": "module"` in package.json)
   - All API functions use ES module syntax

## Project Structure

```
plivo/
├── api/gemini/          # Serverless API functions
│   ├── _forward.js      # Gemini API integration
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
- Google Gemini AI API
