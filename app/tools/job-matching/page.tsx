'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FiUploadCloud, 
  FiX, 
  FiFileText, 
  FiBriefcase, 
  FiBarChart2, 
  FiCheckCircle, 
  FiDownload,
  FiArrowLeft
} from 'react-icons/fi';
import Link from 'next/link';
import { extractTextFromPdf } from '@/services/pdf-service';
import { GoogleGenerativeAI } from '@google/generative-ai';

type ResumeData = {
  id: string;
  file: File;
  text: string;
  name?: string;
  matchScore?: number;
  strengths?: string[];
  gaps?: string[];
  error?: string;
};

export default function JobMatchingTool() {
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
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

  const analyzeJobMatch = async () => {
    if (resumes.length === 0 || !jobDescription.trim()) {
      alert('Please upload at least one resume and enter a job description');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

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

      // Then send to Gemini for analysis
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;
      if (!apiKey) throw new Error('API key not configured');

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
      Analyze and compare these ${processedResumes.length} resumes against the following job description. 
      For each resume, calculate:
      1. Match score (0-100%) based on required skills and qualifications
      2. Key strengths that align with the job
      3. Missing qualifications or gaps
      4. Overall recommendation (Strong, Moderate, Weak match)
      
      Also provide:
      - Top 3 candidates ranked by match score
      - Common missing qualifications across candidates
      - Suggested interview questions probing the gaps
      
      Job Description:
      ${jobDescription}
      
      Resume texts:
      ${processedResumes.map((r, i) => `\n\nRESUME ${i+1}:\n${r.text}`).join('')}
      
      Return the analysis in this JSON format:
      {
        "analysis": [
          {
            "candidateName": string,
            "matchScore": number,
            "strengths": string[],
            "gaps": string[],
            "recommendation": "Strong" | "Moderate" | "Weak"
          }
        ],
        "topCandidates": string[],
        "commonGaps": string[],
        "interviewQuestions": string[]
      }
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean up the response to extract JSON
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      const jsonString = text.substring(jsonStart, jsonEnd);
      
      const resultData = JSON.parse(jsonString);
      setAnalysisResult(resultData);

      // Update resumes with analysis data
      setResumes(prev => prev.map((resume, i) => ({
        ...resume,
        name: resultData.analysis[i]?.candidateName || `Candidate ${i+1}`,
        matchScore: resultData.analysis[i]?.matchScore,
        strengths: resultData.analysis[i]?.strengths,
        gaps: resultData.analysis[i]?.gaps
      })));

    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze job match. Please try again.');
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
              <FiBriefcase className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Job Description Matching</h1>
                <p className="opacity-90">Match resumes against job descriptions with AI-powered analysis</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {/* Job Description Input */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Job Description</h2>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-sm text-gray-500 mt-2">
                Include key requirements, skills, and qualifications for accurate matching
              </p>
            </div>

            {/* Resume Upload Area */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Candidate Resumes</h2>
              <div 
                onClick={triggerFileInput}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
              >
                <FiUploadCloud className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">Upload candidate resumes (PDF)</p>
                <p className="text-gray-500 mb-4">Drag and drop files or click to browse</p>
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
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Uploaded Resumes ({resumes.length})</h3>
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

            {/* Action Button */}
            <div className="flex justify-center mb-8">
              <button
                onClick={analyzeJobMatch}
                disabled={isAnalyzing || resumes.length === 0 || !jobDescription.trim()}
                className={`px-8 py-3 rounded-lg flex items-center gap-2 ${
                  isAnalyzing || resumes.length === 0 || !jobDescription.trim() 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
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
                    Analyze Job Match
                  </>
                )}
              </button>
            </div>

            {/* Results Section */}
            {analysisResult && (
              <div className="mt-8 space-y-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Matching Results</h2>
                
                {/* Top Candidates */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Top Candidates</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {analysisResult.topCandidates.map((candidateName: string, index: number) => {
                      const candidate = analysisResult.analysis.find((a: any) => a.candidateName === candidateName);
                      return (
                        <div key={index} className={`p-6 rounded-xl border ${
                          index === 0 ? 'border-amber-300 bg-amber-50' : 
                          index === 1 ? 'border-blue-300 bg-blue-50' : 
                          'border-purple-300 bg-purple-50'
                        }`}>
                          <div className="flex items-center justify-between mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              index === 0 ? 'bg-amber-100 text-amber-800' : 
                              index === 1 ? 'bg-blue-100 text-blue-800' : 
                              'bg-purple-100 text-purple-800'
                            }`}>
                              #{index + 1} Rank
                            </span>
                            <span className={`text-lg font-bold ${
                              index === 0 ? 'text-amber-600' : 
                              index === 1 ? 'text-blue-600' : 
                              'text-purple-600'
                            }`}>
                              {candidate.matchScore}%
                            </span>
                          </div>
                          <h4 className="text-lg font-semibold mb-2">{candidateName}</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            <span className="font-medium">Recommendation:</span> {candidate.recommendation}
                          </p>
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Strengths:</p>
                              <ul className="list-disc pl-5 text-sm text-gray-600">
                                {candidate.strengths.slice(0, 3).map((strength: string, i: number) => (
                                  <li key={i}>{strength}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Detailed Analysis */}
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Match Details */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Candidate Match Details</h3>
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fit</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {analysisResult.analysis.map((candidate: any, index: number) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="font-medium">{candidate.candidateName}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                                    <div 
                                      className={`h-2.5 rounded-full ${
                                        candidate.matchScore > 75 ? 'bg-green-500' :
                                        candidate.matchScore > 50 ? 'bg-amber-500' :
                                        'bg-red-500'
                                      }`} 
                                      style={{ width: `${candidate.matchScore}%` }}
                                    ></div>
                                  </div>
                                  <span>{candidate.matchScore}%</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  candidate.recommendation === 'Strong' ? 'bg-green-100 text-green-800' :
                                  candidate.recommendation === 'Moderate' ? 'bg-amber-100 text-amber-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {candidate.recommendation}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Common Gaps */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Common Qualification Gaps</h3>
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      {analysisResult.commonGaps.length > 0 ? (
                        <ul className="space-y-3">
                          {analysisResult.commonGaps.map((gap: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <FiX className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{gap}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No significant common gaps found across candidates
                        </div>
                      )}
                    </div>


                  </div>
                </div>

                {/* Export Button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      const dataStr = JSON.stringify(analysisResult, null, 2);
                      const blob = new Blob([dataStr], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = 'job-matching-results.json';
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
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}