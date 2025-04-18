'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  FiFileText, 
  FiSearch, 
  FiHelpCircle, 
  FiTrendingUp,
  FiUsers,
  FiBarChart2,
  FiAward,
  FiCheckCircle,
  FiArrowRight
} from 'react-icons/fi';

export default function ToolsPage() {
  const tools = [
    {
      icon: FiUsers,
      title: "Multi-Resume Comparison",
      description: "Compare multiple candidates side-by-side with visual analytics",
      href: "/tools/comparison",
      color: "bg-purple-100 text-purple-600",
      available: true
    },
    {
      icon: FiSearch,
      title: "Job Description Matching",
      description: "Match resumes against job descriptions with compatibility scoring",
      href: "/tools/job-matching",
      color: "bg-blue-100 text-blue-600",
      available: true
    },
    {
      icon: FiHelpCircle,
      title: "Interview Question Generator",
      description: "Generate tailored interview questions based on resume content",
      href: "/tools/interview-questions",
      color: "bg-amber-100 text-amber-600",
      available: true
    },
    {
      icon: FiTrendingUp,
      title: "Resume Scoring & Optimization",
      description: "Get ATS compatibility scores and optimization suggestions",
      href: "/tools/resume-scoring",
      color: "bg-green-100 text-green-600",
      available: true
    },
    // {
    //   icon: FiBarChart2,
    //   title: "Skills Gap Analysis",
    //   description: "Identify team skill gaps and training opportunities",
    //   href: "/tools/skills-gap",
    //   color: "bg-cyan-100 text-cyan-600",
    //   available: false
    // },
    // {
    //   icon: FiAward,
    //   title: "Candidate Ranking",
    //   description: "AI-powered ranking of candidates based on your criteria",
    //   href: "/tools/candidate-ranking",
    //   color: "bg-pink-100 text-pink-600",
    //   available: false
    // }
  ];

  return (
    <div className="bg-gradient-to-b from-slate-50 to-blue-50/30 min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 leading-tight"
          >
            Power Up Your Hiring With<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
              Advanced Recruitment Tools
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto"
          >
            Our specialized tools help you streamline every stage of the hiring process with AI-powered insights.
          </motion.p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all ${!tool.available ? 'opacity-70' : ''}`}
              >
                <Link href={tool.available ? tool.href : '#'} className="block h-full">
                  <div className="p-8 h-full flex flex-col">
                    <div className={`w-14 h-14 rounded-lg mb-6 flex items-center justify-center ${tool.color}`}>
                      <tool.icon className="w-6 h-6" />
                    </div>
                    
                    <h3 className="text-2xl font-semibold text-slate-900 mb-3">{tool.title}</h3>
                    <p className="text-slate-600 mb-6 flex-grow">{tool.description}</p>
                    
                    <div className="flex items-center justify-between">
                      {tool.available ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-800">
                          Coming Soon
                        </span>
                      )}
                      <span className="text-slate-400 group-hover:text-blue-600 transition-colors">
                        <FiArrowRight className="w-5 h-5" />
                      </span>
                    </div>
                  </div>
                </Link>
                
                {!tool.available && (
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
                    <span className="bg-white px-4 py-2 rounded-full shadow-sm text-sm font-medium">
                      Coming in next release
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Need Help Choosing the Right Tool?
          </h2>
          <p className="text-lg text-blue-50 mb-8 max-w-xl mx-auto">
            Our hiring experts can guide you to the tools that best fit your recruitment workflow.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-3 bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-all"
            >
              Contact Our Team
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center gap-3 border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white/10 transition-all"
            >
              Request a Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}