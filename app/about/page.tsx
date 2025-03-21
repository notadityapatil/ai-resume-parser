// app/about/page.tsx
'use client';

import { motion } from 'framer-motion';
import { FiUsers, FiTarget, FiAward, FiHeart, FiGlobe } from 'react-icons/fi';
// import TeamMemberCard from '@/components/TeamMemberCard';

export default function about() {
  const coreValues = [
    { icon: FiTarget, title: "Our Mission", description: "Revolutionize hiring through AI-powered insights" },
    { icon: FiAward, title: "Excellence", description: "Deliver exceptional accuracy in resume analysis" },
    { icon: FiHeart, title: "Passion", description: "Driven by innovation in HR technology" },
    { icon: FiGlobe, title: "Global Impact", description: "Serving teams worldwide" }
  ];

  const team = [
    { name: "Sarah Johnson", role: "CEO & Founder", bio: "AI & HR Tech visionary", image: "/team/sarah.jpg" },
    { name: "Michael Chen", role: "Lead Developer", bio: "Full-stack & AI specialist", image: "/team/michael.jpg" },
    { name: "Emma Wilson", role: "Product Designer", bio: "UX & Interaction expert", image: "/team/emma.jpg" },
    { name: "David Kim", role: "Data Scientist", bio: "NLP & ML engineer", image: "/team/david.jpg" }
  ];

  return (
    <div className="bg-gradient-to-b from-slate-50 to-blue-50/30">
      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold text-slate-900 mb-8 leading-tight"
          >
            Transforming Hiring Through<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
              Intelligent Technology
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto"
          >
            At ResumeIQ, we're redefining recruitment with AI-powered solutions that bring efficiency and insight to talent acquisition.
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <div className="text-blue-600 text-lg font-medium">Our Journey</div>
              <h2 className="text-3xl font-bold text-slate-900">Pioneers in AI Recruitment</h2>
              <p className="text-slate-600 leading-relaxed">
                Founded in 2020 by HR tech veterans, we've grown from a startup to a global platform serving 
                500+ companies. Our AI models have analyzed over 1 million resumes, constantly learning to 
                deliver unparalleled accuracy.
              </p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
            >
              <div className="bg-blue-100 p-6 rounded-2xl">
                <div className="text-3xl font-bold text-blue-600 mb-2">1M+</div>
                <div className="text-slate-600">Resumes Analyzed</div>
              </div>
              <div className="bg-purple-100 p-6 rounded-2xl">
                <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
                <div className="text-slate-600">Happy Companies</div>
              </div>
              <div className="bg-cyan-100 p-6 rounded-2xl">
                <div className="text-3xl font-bold text-cyan-600 mb-2">95%</div>
                <div className="text-slate-600">Accuracy Rate</div>
              </div>
              <div className="bg-pink-100 p-6 rounded-2xl">
                <div className="text-3xl font-bold text-pink-600 mb-2">4.9★</div>
                <div className="text-slate-600">Average Rating</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Core Values</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              The principles that guide every decision we make and feature we build
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
                  <value.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{value.title}</h3>
                <p className="text-slate-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Meet Our Team</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Diverse experts united by a passion for transforming recruitment
            </p>
          </div>

          {/* <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <TeamMemberCard
                key={member.name}
                name={member.name}
                role={member.role}
                bio={member.bio}
                image={member.image}
                index={index}
              />
            ))}
          </div> */}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Hiring?
          </h2>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a
              href="/analyzer"
              className="inline-flex items-center justify-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-blue-50 transition-all"
            >
              Start Free Analysis
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}