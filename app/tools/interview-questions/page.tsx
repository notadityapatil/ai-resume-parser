'use client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useState } from 'react';
import { FiHelpCircle, FiCopy, FiChevronDown, FiChevronUp } from 'react-icons/fi';

type QAPair = {
  question: string;
  answer: string;
};

export default function InterviewQuestionGenerator() {
  const [jobDescription, setJobDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [qaPairs, setQaPairs] = useState<QAPair[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const generateQuestions = async () => {
    if (!jobDescription.trim()) {
      alert('Please enter a job description');
      return;
    }

    setIsGenerating(true);
    setQaPairs([]);

    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;
      if (!apiKey) throw new Error('API key not configured');

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
      Generate 10 interview questions with answers based on this job description. Use technical questions.
      Return ONLY a JSON array of objects with "question" and "answer" properties like:
      [{"question": "...", "answer": "..."}]
      
      Job Description:
      ${jobDescription}
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonStart = text.indexOf('[');
      const jsonEnd = text.lastIndexOf(']') + 1;
      const jsonString = text.substring(jsonStart, jsonEnd);
      
      setQaPairs(JSON.parse(jsonString));
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate questions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleAnswer = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FiHelpCircle className="text-blue-500" />
          Interview Question Generator
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <label className="block text-gray-700 mb-2 font-medium">
            Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            className="w-full h-40 p-3 border border-gray-300 rounded-lg mb-4"
          />
          <button
            onClick={generateQuestions}
            disabled={isGenerating}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isGenerating ? 'Generating...' : 'Generate Questions'}
          </button>
        </div>

        {qaPairs.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Generated Questions
              </h2>
              <button
                onClick={() => copyToClipboard(qaPairs.map(q => q.question).join('\n'))}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <FiCopy /> Copy All
              </button>
            </div>

            <div className="space-y-3">
              {qaPairs.map((qa, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleAnswer(index)}
                    className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
                  >
                    <span className="font-medium">{index + 1}. {qa.question}</span>
                    {expandedIndex === index ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                  
                  {expandedIndex === index && (
                    <div className="p-4 bg-white border-t border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-700">Model Answer:</h3>
                        <button
                          onClick={() => copyToClipboard(qa.answer)}
                          className="text-gray-500 hover:text-blue-600"
                        >
                          <FiCopy size={14} />
                        </button>
                      </div>
                      <p className="text-gray-600 whitespace-pre-line">{qa.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}