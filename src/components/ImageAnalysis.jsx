import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";

export default function ImageAnalysis() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [description, setDescription] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setDescription("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".bmp", ".webp"]
    },
    multiple: false
  });

  const analyzeImage = async () => {
    if (!imageFile) return;

    setIsProcessing(true);
    
    try {
      // Simulate API call for image analysis
      // In a real implementation, you would call an AI vision API here
      
      // Mock image description
      const mockDescription = "This image shows a beautiful landscape with rolling green hills, a clear blue sky with scattered white clouds, and a small lake reflecting the sky. The scene appears to be from a rural countryside setting, possibly during spring or summer. The composition is peaceful and serene, with natural elements creating a harmonious balance.";
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setDescription(mockDescription);
      
    } catch (error) {
      console.error("Error analyzing image:", error);
      alert("Error analyzing image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Image Analysis
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Upload an image to generate detailed textual descriptions
        </p>
      </div>

      {/* File Upload */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-green-500 bg-green-50 dark:bg-green-900/20"
            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
        }`}
      >
        <input {...getInputProps()} />
        <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        {isDragActive ? (
          <p className="text-green-600 dark:text-green-400">Drop the image here...</p>
        ) : (
          <div>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Drag & drop an image here, or click to select
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Supports JPEG, PNG, GIF, BMP, WebP
            </p>
          </div>
        )}
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="text-center">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
            />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {imageFile?.name}
            </p>
          </div>
        </div>
      )}

      {/* Analyze Button */}
      {imageFile && (
        <div className="text-center">
          <button
            onClick={analyzeImage}
            disabled={isProcessing}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto space-x-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Analyzing...</span>
              </>
            ) : (
              <span>Analyze Image</span>
            )}
          </button>
        </div>
      )}

      {/* Results */}
      {description && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Image Description
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 