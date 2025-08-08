import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Play, Pause, Loader2 } from "lucide-react";

export default function ConversationAnalysis() {
  const [audioFile, setAudioFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState({
    transcript: "",
    diarization: "",
    summary: ""
  });
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith("audio/")) {
      setAudioFile(file);
      setAudioUrl(URL.createObjectURL(file));
      setResults({ transcript: "", diarization: "", summary: "" });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/*": [".mp3", ".wav", ".m4a", ".ogg"]
    },
    multiple: false
  });

  const processAudio = async () => {
    if (!audioFile) return;

    setIsProcessing(true);
    
    try {
      // Simulate API calls for speech-to-text and diarization
      // In a real implementation, you would call actual APIs here
      
      // Mock transcript
      const transcript = "Hello, this is a sample conversation. How are you doing today? I'm doing great, thank you for asking. That's wonderful to hear.";
      
      // Mock diarization with speaker identification
      const diarization = `Speaker 1: Hello, this is a sample conversation. How are you doing today?
Speaker 2: I'm doing great, thank you for asking.
Speaker 1: That's wonderful to hear.`;

      // Mock summary
      const summary = "A brief conversation where two speakers exchange pleasantries, with Speaker 1 initiating the conversation and asking about Speaker 2's well-being.";

      setResults({
        transcript,
        diarization,
        summary
      });

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error("Error processing audio:", error);
      alert("Error processing audio file. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
        audio.onended = () => setIsPlaying(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Conversation Analysis
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Upload an audio file to convert speech to text and perform speaker diarization
        </p>
      </div>

      {/* File Upload */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        {isDragActive ? (
          <p className="text-blue-600 dark:text-blue-400">Drop the audio file here...</p>
        ) : (
          <div>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Drag & drop an audio file here, or click to select
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Supports MP3, WAV, M4A, OGG (max 2 speakers)
            </p>
          </div>
        )}
      </div>

      {/* Audio Preview */}
      {audioFile && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {audioFile.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {(audioFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={toggleAudio}
              className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
          </div>
        </div>
      )}

      {/* Process Button */}
      {audioFile && (
        <div className="text-center">
          <button
            onClick={processAudio}
            disabled={isProcessing}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto space-x-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Processing...</span>
              </>
            ) : (
              <span>Process Audio</span>
            )}
          </button>
        </div>
      )}

      {/* Results */}
      {results.transcript && (
        <div className="space-y-6">
          {/* Transcript */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Transcript
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                {results.transcript}
              </p>
            </div>
          </div>

          {/* Diarization */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Speaker Diarization
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                {results.diarization}
              </p>
            </div>
          </div>

          {/* Summary */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Summary
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-gray-800 dark:text-gray-200">
                {results.summary}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 