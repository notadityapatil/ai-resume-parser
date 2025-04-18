'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiUploadCloud, FiX, FiUsers, FiBarChart2, FiAward, FiCheckCircle, FiDownload, FiArrowLeft, FiFileText } from 'react-icons/fi';
import Link from 'next/link';
import { extractTextFromPdf } from '@/services/pdf-service';
import { GoogleGenerativeAI } from '@google/generative-ai';

type ResumeData = {
  id: string;
  file: File;
  text: string;
  name?: string;
  analysis?: any;
  error?: string;
};

export default function MultiResumeComparison() {
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newResumes: ResumeData[] = [];
      
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        if (file.type === 'application/pdf') {
          newResumes.push({
            id: Math.random().toString(36).substring(2, 9),
            file,
            text: ''
          });
        }
      }

      setResumes([...resumes, ...newResumes]);
    }
  };

  const removeResume = (id: string) => {
    setResumes(resumes.filter(resume => resume.id !== id));
  };

  const analyzeResumes = async () => {
    if (resumes.length < 2) {
      alert('Please upload at least 2 resumes to compare');
      return;
    }

    setIsAnalyzing(true);
    setComparisonResult(null);

    try {
      // First extract text from all PDFs
      const processedResumes = await Promise.all(
        resumes.map(async (resume) => {
          try {
            const text = await extractTextFromPdf(resume.file);
            return { ...resume, text };
          } catch (error) {
            return { ...resume, error: 'Failed to extract text' };
          }
        })
      );

      setResumes(processedResumes);

      // Then send to Gemini for comparison
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;
      if (!apiKey) throw new Error('API key not configured');

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
      Analyze and compare these ${processedResumes.length} resumes. For each resume, extract:
      1. Candidate name (if available)
      2. Key skills (categorize as Technical, Soft, etc.)
      3. Years of experience
      4. Education level
      5. Notable achievements
      
      Then provide a comparison table showing:
      - Skills overlap
      - Experience comparison
      - Strengths/weaknesses relative to each other
      - Overall ranking based on typical hiring criteria
      
      Return the analysis in this JSON format:
      {
        "candidates": [
          {
            "name": string,
            "skills": { "technical": string[], "soft": string[] },
            "experience": number,
            "education": string,
            "achievements": string[]
          }
        ],
        "comparison": {
          "skillsOverlap": string[],
          "uniqueSkills": { "candidate1": string[], "candidate2": string[] },
          "experienceComparison": string,
          "ranking": [string] // names in order
        }
      }
      
      Resume texts:
      ${processedResumes.map((r, i) => `\n\nRESUME ${i+1}:\n${r.text}`).join('')}
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean up the response to extract JSON
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      const jsonString = text.substring(jsonStart, jsonEnd);
      
      const resultData = JSON.parse(jsonString);
      setComparisonResult(resultData);

      // Update resumes with names if detected
      setResumes(prev => prev.map((resume, i) => ({
        ...resume,
        name: resultData.candidates[i]?.name || `Candidate ${i+1}`,
        analysis: resultData.candidates[i]
      })));

    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze resumes. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 to-blue-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <Link href="/tools" className="inline-flex items-center text-blue-600 hover:text-blue-700">
            <FiArrowLeft className="mr-2" />
            Back to Tools
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white">
            <div className="flex items-center gap-4">
              <FiUsers className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Multi-Resume Comparison</h1>
                <p className="opacity-90">Upload multiple resumes to compare candidates side-by-side</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {/* Upload Area */}
            <div className="mb-8">
              <div 
                onClick={triggerFileInput}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
              >
                <FiUploadCloud className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">Drag and drop PDF resumes here</p>
                <p className="text-gray-500 mb-4">or click to browse files</p>
                <button 
                  type="button"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Select Files
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf"
                  multiple
                />
              </div>
            </div>

            {/* Uploaded Files List */}
            {resumes.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Uploaded Resumes ({resumes.length})</h2>
                <div className="space-y-3">
                  {resumes.map((resume) => (
                    <div key={resume.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FiFileText className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">
                          {resume.file.name} 
                          {resume.name && ` (${resume.name})`}
                        </span>
                      </div>
                      <button
                        onClick={() => removeResume(resume.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <button
                onClick={triggerFileInput}
                className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <FiUploadCloud className="w-5 h-5" />
                Add More Resumes
              </button>
              
              <button
                onClick={analyzeResumes}
                disabled={isAnalyzing || resumes.length < 2}
                className={`px-6 py-2 rounded-lg flex items-center gap-2 ${isAnalyzing || resumes.length < 2 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                {isAnalyzing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FiBarChart2 className="w-5 h-5" />
                    Compare Resumes
                  </>
                )}
              </button>
            </div>

            {/* Results Section */}
            {comparisonResult && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Comparison Results</h2>
                
                {/* Summary Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <FiUsers className="w-6 h-6 text-blue-600" />
                      <h3 className="font-medium text-blue-800">Candidates Compared</h3>
                    </div>
                    <p className="text-3xl font-bold text-blue-900">{comparisonResult.candidates.length}</p>
                  </div>
                  
                  <div className="bg-green-50 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <FiCheckCircle className="w-6 h-6 text-green-600" />
                      <h3 className="font-medium text-green-800">Common Skills</h3>
                    </div>
                    <p className="text-3xl font-bold text-green-900">{comparisonResult.comparison.skillsOverlap.length}</p>
                  </div>
                  
                  <div className="bg-amber-50 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <FiAward className="w-6 h-6 text-amber-600" />
                      <h3 className="font-medium text-amber-800">Top Candidate</h3>
                    </div>
                    <p className="text-2xl font-bold text-amber-900 truncate">
                      {comparisonResult.comparison.ranking[0]}
                    </p>
                  </div>
                </div>

                {/* Detailed Comparison */}
                <div className="space-y-8">
                  {/* Skills Comparison */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Skills Comparison</h3>
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skill Type</th>
                            {comparisonResult.candidates.map((candidate: any, index: number) => (
                              <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {candidate.name || `Candidate ${index+1}`}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Technical Skills</td>
                            {comparisonResult.candidates.map((candidate: any, index: number) => (
                              <td key={index} className="px-6 py-4 whitespace-normal text-sm text-gray-500">
                                <ul className="list-disc pl-5 space-y-1">
                                  {candidate.skills.technical.slice(0, 5).map((skill: string, i: number) => (
                                    <li key={i}>{skill}</li>
                                  ))}
                                  {candidate.skills.technical.length > 5 && (
                                    <li className="text-gray-400">+{candidate.skills.technical.length - 5} more</li>
                                  )}
                                </ul>
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Soft Skills</td>
                            {comparisonResult.candidates.map((candidate: any, index: number) => (
                              <td key={index} className="px-6 py-4 whitespace-normal text-sm text-gray-500">
                                <ul className="list-disc pl-5 space-y-1">
                                  {candidate.skills.soft.slice(0, 3).map((skill: string, i: number) => (
                                    <li key={i}>{skill}</li>
                                  ))}
                                </ul>
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Experience & Education */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Experience Comparison</h3>
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <p className="text-gray-700 mb-3">{comparisonResult.comparison.experienceComparison}</p>
                        <div className="space-y-4">
                          {comparisonResult.candidates.map((candidate: any, index: number) => (
                            <div key={index} className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index === 0 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                {index + 1}
                              </div>
                              <div>
                                <p className="font-medium">{candidate.name || `Candidate ${index+1}`}</p>
                                <p className="text-sm text-gray-600">
                                  {candidate.experience} years experience • {candidate.education}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Unique Skills</h3>
                      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
                        {comparisonResult.candidates.map((candidate: any, index: number) => (
                          <div key={index}>
                            <p className="font-medium mb-2">{candidate.name || `Candidate ${index+1}`}</p>
                            <div className="flex flex-wrap gap-2">
                              {comparisonResult.comparison.uniqueSkills[`candidate${index+1}`]?.slice(0, 6).map((skill: string, i: number) => (
                                <span key={i} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Download Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        const dataStr = JSON.stringify(comparisonResult, null, 2);
                        const blob = new Blob([dataStr], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = 'resume-comparison-results.json';
                        link.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                    >
                      <FiDownload className="w-4 h-4" />
                      Export Results
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}