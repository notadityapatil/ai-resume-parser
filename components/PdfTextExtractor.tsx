"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { extractTextFromPdf } from "@/services/pdf-service";
import { generateStructuredSummary } from "@/services/gemini-service";
import { FileUpload } from "@/components/FileUpload";
import { StructuredSummary } from "@/components/StructuredSummary";
import { SummarySections } from "@/lib/types";
import { FiAlertTriangle, FiRefreshCw, FiUser } from "react-icons/fi";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const childVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function PdfTextExtractor() {
  const [summary, setSummary] = useState<Maybe<SummarySections>>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Maybe<string>>(null);

  const handleFileUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
      setError("Please select a valid PDF file.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSummary(null);

    try {
      const extractedText = await extractTextFromPdf(file);
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;
      if (!apiKey) throw new Error("API key not configured");
      
      const structuredSummary = await generateStructuredSummary(extractedText, apiKey);
      setSummary(structuredSummary);
    } catch (err) {
      console.error("Processing error:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          className="text-4xl font-bold text-slate-800 mb-8 text-center"
          variants={childVariants}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
            Resume Analyzer Tool
          </span>
        </motion.h1>

        <motion.div variants={childVariants}>
          <FileUpload 
            onFileChange={handleFileUpload} 
            disabled={isLoading} 
          />
        </motion.div>

        <AnimatePresence>
          {isLoading && (
            <motion.div
              className="mt-8 flex flex-col items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FiRefreshCw className="w-12 h-12 text-blue-500 animate-spin" />
              <div className="space-y-2 text-center">
                <p className="font-medium text-slate-700">Analyzing Resume</p>
                <p className="text-sm text-slate-500">Extracting insights...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div
              className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <FiAlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <p className="font-medium text-red-700">Error occurred</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {summary && (
          <motion.div 
            className="mt-8 space-y-8"
            variants={containerVariants}
          >
            <motion.div variants={childVariants}>
              <StructuredSummary data={summary} />
            </motion.div>

            <motion.div 
              className="text-center flex flex-col gap-4 items-center"
              variants={childVariants}
            >
              <div className="flex gap-4">
                <Link
                  href="/candidatesInfo"
                  className="inline-flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 transition-colors px-6 py-2 rounded-full shadow-sm hover:shadow-md transition-all"
                >
                  <FiUser className="w-4 h-4" />
                  View Candidate Info
                </Link>

                <button
                  onClick={() => setSummary(null)}
                  className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors px-6 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all"
                >
                  <FiRefreshCw className="w-4 h-4" />
                  Analyze Another
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}