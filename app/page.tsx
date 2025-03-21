'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowRight, FiFileText, FiUser, FiStar, FiCheckCircle, FiUsers, FiBarChart } from 'react-icons/fi';

export default function Home() {
  const features = [
    { icon: FiFileText, title: "Instant PDF Parsing", description: "Extract text from any resume PDF in seconds", color: "bg-blue-100" },
    { icon: FiUser, title: "Candidate Profiles", description: "Structured overview of skills and experience", color: "bg-purple-100" },
    { icon: FiStar, title: "AI Analysis", description: "Smart insights powered by generative AI", color: "bg-cyan-100" },
    { icon: FiCheckCircle, title: "ATS Optimization", description: "Ensure resume compatibility with tracking systems", color: "bg-pink-100" },
    { icon: FiUsers, title: "Team Collaboration", description: "Share and discuss candidate profiles with your team", color: "bg-orange-100" },
    { icon: FiBarChart, title: "Analytics Dashboard", description: "Track hiring metrics and candidate pipeline", color: "bg-green-100" }
  ];

  return (
    <div className="bg-gradient-to-b from-slate-50 to-blue-50/30">
      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-600/5 via-white to-white">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-blue-600/10 px-6 py-2 rounded-full mb-8"
          >
            <span className="text-blue-600 font-medium">New: AI-Powered Insights →</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-8 leading-tight"
          >
            Revolutionize Your Hiring with<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
              Intelligent Resume Analysis
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto"
          >
            Transform unstructured resumes into actionable insights with our AI-driven platform. Reduce screening time by 70% and identify top talent faster than ever.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
          >
            <Link
              href="/analyzer"
              className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all"
            >
              <FiArrowRight className="w-5 h-5" />
              Start Analyzing Now
            </Link>
          </motion.div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <motion.div 
              className="p-6 bg-white rounded-xl shadow-sm"
              whileHover={{ y: -5 }}
            >
              <div className="text-3xl font-bold text-blue-600 mb-2">1K+</div>
              <div className="text-slate-600">Resumes Analyzed</div>
            </motion.div>
            <motion.div 
              className="p-6 bg-white rounded-xl shadow-sm"
              whileHover={{ y: -5 }}
            >
              <div className="text-3xl font-bold text-purple-600 mb-2">85%</div>
              <div className="text-slate-600">Time Saved</div>
            </motion.div>
            <motion.div 
              className="p-6 bg-white rounded-xl shadow-sm"
              whileHover={{ y: -5 }}
            >
              <div className="text-3xl font-bold text-cyan-600 mb-2">4.9★</div>
              <div className="text-slate-600">User Rating</div>
            </motion.div>
            <motion.div 
              className="p-6 bg-white rounded-xl shadow-sm"
              whileHover={{ y: -5 }}
            >
              <div className="text-3xl font-bold text-green-600 mb-2">200+</div>
              <div className="text-slate-600">Teams Empowered</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Powerful Features for Modern Hiring</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to streamline your recruitment process and make data-driven hiring decisions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className={`p-8 rounded-2xl ${feature.color} relative overflow-hidden group`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-16 h-16 rounded-xl bg-white mb-6 flex items-center justify-center shadow-sm">
                  <feature.icon className="w-8 h-8 text-slate-700" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold text-white mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            Ready to Transform Your Hiring Process?
          </motion.h2>
          <p className="text-lg text-blue-50 mb-8 max-w-xl mx-auto">
            Join hundreds of companies already making smarter hiring decisions with our AI-powered platform
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/analyzer"
              className="inline-flex items-center justify-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-blue-50 transition-all"
            >
              <FiArrowRight className="w-5 h-5" />
              Start Your Free Analysis
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}