'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiArrowLeft, FiMail, FiBriefcase, FiBook, FiCode, FiDownload, FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Candidate } from '@/lib/types';

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function CandidateDetail() {
  const router = useRouter();
  const params = useParams();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedCandidates = localStorage.getItem('resumeProfiles');
    if (storedCandidates) {
      const candidates: Candidate[] = JSON.parse(storedCandidates);
      const foundCandidate = candidates.find(c => c.id.toString() === params.id);
      setCandidate(foundCandidate || null);
    }
    setLoading(false);
  }, [params.id]);

  const handleDownload = () => {
    if (!candidate) return;
    const jsonString = JSON.stringify(candidate, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${candidate.name?.replace(/ /g, '_') || 'candidate'}_profile.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 p-8">
        <div className="max-w-4xl mx-auto animate-pulse space-y-8">
          <div className="h-12 bg-slate-200 rounded w-40 mb-8"></div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="h-6 bg-slate-200 rounded w-48"></div>
              <div className="h-4 bg-slate-200 rounded w-64"></div>
              <div className="h-4 bg-slate-200 rounded w-72"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 p-8">
        <div className="max-w-4xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">
            Candidate not found
          </h1>
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-2 justify-center"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to candidates list
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.button
          onClick={() => router.back()}
          className="mb-8 text-blue-600 hover:text-blue-700 flex items-center gap-2 group"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <FiArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span className="font-medium">Back to Candidates</span>
        </motion.button>

        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                {candidate.name || 'Unnamed Candidate'}
              </h1>
              {candidate.contactInfo && (
                <div className="flex items-center gap-2 text-slate-600">
                  <FiMail className="w-5 h-5" />
                  <a 
                    href={`mailto:${candidate.contactInfo}`} 
                    className="hover:text-blue-600 transition-colors"
                  >
                    {candidate.contactInfo}
                  </a>
                </div>
              )}
            </div>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <FiDownload className="w-5 h-5" />
              Export
            </button>
          </div>

          <div className="space-y-8">
            {candidate.skills?.length > 0 && (
              <motion.div 
                className="space-y-4"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="flex items-center gap-3">
                  <FiStar className="w-6 h-6 text-amber-500" />
                  <h2 className="text-xl font-semibold text-slate-800">Skills</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {candidate.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {candidate.experience?.length > 0 && (
              <motion.div 
                className="space-y-4"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="flex items-center gap-3">
                  <FiBriefcase className="w-6 h-6 text-emerald-500" />
                  <h2 className="text-xl font-semibold text-slate-800">Experience</h2>
                </div>
                <ul className="space-y-4">
                  {candidate.experience.map((exp, index) => (
                    <li 
                      key={index}
                      className="pl-4 border-l-2 border-blue-200 py-2"
                    >
                      <p className="text-slate-600">{exp}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {candidate.education?.length > 0 && (
              <motion.div 
                className="space-y-4"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="flex items-center gap-3">
                  <FiBook className="w-6 h-6 text-purple-500" />
                  <h2 className="text-xl font-semibold text-slate-800">Education</h2>
                </div>
                <ul className="space-y-4">
                  {candidate.education.map((edu, index) => (
                    <li 
                      key={index}
                      className="pl-4 border-l-2 border-blue-200 py-2"
                    >
                      <p className="text-slate-600">{edu}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {candidate.projects?.length > 0 && (
              <motion.div 
                className="space-y-4"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="flex items-center gap-3">
                  <FiCode className="w-6 h-6 text-cyan-500" />
                  <h2 className="text-xl font-semibold text-slate-800">Projects</h2>
                </div>
                <ul className="space-y-4">
                  {candidate.projects.map((project, index) => (
                    <li 
                      key={index}
                      className="pl-4 border-l-2 border-blue-200 py-2"
                    >
                      <p className="text-slate-600">{project}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}