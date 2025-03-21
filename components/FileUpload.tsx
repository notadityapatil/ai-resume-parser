import React, { useState, useCallback } from "react";
import { FiUploadCloud, FiFile, FiX } from "react-icons/fi";

type FileUploadProps = {
  onFileChange: (file: File) => void;
  disabled?: boolean;
};

export function FileUpload({ onFileChange, disabled }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      onFileChange(file);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      onFileChange(file);
    }
  }, [onFileChange]);

  const removeFile = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    onFileChange(null!); // Reset the file selection
  }, [onFileChange]);

  return (
    <div 
      className={`relative w-full max-w-2xl transition-all duration-300  ml-[100px] ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <label
        className={`flex flex-col items-center justify-center p-8 border-4 border-dashed rounded-2xl space-y-4
          ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400 bg-white"}
          ${disabled ? "pointer-events-none" : ""}`}
      >
        <div className="relative">
          <FiUploadCloud className={`w-12 h-12 mb-4 ${
            isDragging ? "text-blue-500 animate-bounce" : "text-gray-400"
          }`} />
          
          {selectedFile && (
            <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md">
              <FiFile className="w-6 h-6 text-blue-500" />
            </div>
          )}
        </div>

        <div className="text-center">
          {selectedFile ? (
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">{selectedFile.name}</span>
              <button
                type="button"
                onClick={removeFile}
                className="p-1 hover:bg-gray-100 rounded-full"
                aria-label="Remove file"
              >
                <FiX className="w-5 h-5 text-red-500" />
              </button>
            </div>
          ) : (
            <>
              <p className="text-lg font-semibold text-gray-700">
                Drag and drop your PDF here
              </p>
              <p className="text-gray-500">or click to browse</p>
              <p className="text-sm text-gray-400 mt-2">(Only *.pdf files accepted)</p>
            </>
          )}
        </div>

        <input
          type="file"
          accept=".pdf"
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
          aria-label="PDF file input"
        />
      </label>

      {/* Animated border effect */}
      {isDragging && (
        <div className="absolute inset-0 border-4 border-blue-200 rounded-2xl animate-pulse pointer-events-none" />
      )}
    </div>
  );
}