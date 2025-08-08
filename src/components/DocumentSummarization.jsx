import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Link, Loader2 } from "lucide-react";

export default function DocumentSummarization() {
  const [documentFile, setDocumentFile] = useState(null);
  const [url, setUrl] = useState("");
  const [inputType, setInputType] = useState("file"); // "file" or "url"
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setDocumentFile(file);
      setSummary("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"]
    },
    multiple: false
  });

  const processInput = async () => {
    if ((inputType === "file" && !documentFile) || (inputType === "url" && !url.trim())) {
      alert("Please provide input before processing");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate API call for document/URL summarization
      // In a real implementation, you would call an AI summarization API here
      
      let mockSummary = "";
      
      if (inputType === "file") {
        mockSummary = `This document appears to be a comprehensive report covering various topics. The content includes detailed analysis and insights on the subject matter. Key points discussed include important findings, recommendations, and conclusions drawn from the research. The document is well-structured and provides valuable information for stakeholders.`;
      } else {
        mockSummary = `The webpage at ${url} contains informative content about various topics. The page includes detailed information, analysis, and insights that are relevant to the subject matter. Key highlights from the content include important points, data, and conclusions that provide value to readers.`;
      }
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSummary(mockSummary);
      
    } catch (error) {
      console.error("Error processing input:", error);
      alert("Error processing input. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Document/URL Summarization
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Upload documents or provide URLs to obtain concise summaries
        </p>
      </div>

      {/* Input Type Selection */}
      <div className="flex space-x-4 justify-center">
        <button
          onClick={() => {
            setInputType("file");
            setDocumentFile(null);
            setUrl("");
            setSummary("");
          }}
          className={`px-4 py-2 rounded-lg transition-colors ${
            inputType === "file"
              ? "bg-purple-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          Upload Document
        </button>
        <button
          onClick={() => {
            setInputType("url");
            setDocumentFile(null);
            setUrl("");
            setSummary("");
          }}
          className={`px-4 py-2 rounded-lg transition-colors ${
            inputType === "url"
              ? "bg-purple-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          Enter URL
        </button>
      </div>

      {/* File Upload */}
      {inputType === "file" && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
              : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
          }`}
        >
          <input {...getInputProps()} />
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          {isDragActive ? (
            <p className="text-purple-600 dark:text-purple-400">Drop the document here...</p>
          ) : (
            <div>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Drag & drop a document here, or click to select
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Supports PDF, DOC, DOCX, TXT
              </p>
            </div>
          )}
        </div>
      )}

      {/* URL Input */}
      {inputType === "url" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Website URL
            </label>
            <div className="flex">
              <div className="flex-1">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/article"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div className="flex items-center px-3 bg-gray-100 dark:bg-gray-700 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-lg">
                <Link className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* File Preview */}
      {documentFile && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-purple-500" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {documentFile.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {(documentFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Process Button */}
      {((inputType === "file" && documentFile) || (inputType === "url" && url.trim())) && (
        <div className="text-center">
          <button
            onClick={processInput}
            disabled={isProcessing}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto space-x-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Processing...</span>
              </>
            ) : (
              <span>Generate Summary</span>
            )}
          </button>
        </div>
      )}

      {/* Results */}
      {summary && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Summary
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
              {summary}
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 