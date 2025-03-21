import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiUser, FiPhone, FiTool, FiBriefcase, FiBook, FiCode, FiSave } from "react-icons/fi";
import { SummarySections } from "@/lib/types";


const sectionIcons = {
  "Name": FiUser,
  "Contact Info": FiPhone,
  "Skills": FiTool,
  "Experience": FiBriefcase,
  "Education": FiBook,
  "Projects": FiCode,
};

const sectionColors = {
  "Name": "bg-pink-100 text-pink-600",
  "Contact Info": "bg-blue-100 text-blue-600",
  "Skills": "bg-green-100 text-green-600",
  "Experience": "bg-purple-100 text-purple-600",
  "Education": "bg-orange-100 text-orange-600",
  "Projects": "bg-cyan-100 text-cyan-600",
};

export function StructuredSummary({ data }: { data: SummarySections }) {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSaveProfile = () => {
    try {
      // Get existing profiles from localStorage
      const storedProfiles = localStorage.getItem('resumeProfiles');
      const profiles = storedProfiles ? JSON.parse(storedProfiles) : [];
      
      // Create new profile with timestamp
      const newProfile = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...data
      };

      // Save updated profiles array
      localStorage.setItem('resumeProfiles', JSON.stringify([...profiles, newProfile]));
      
      // Show success feedback
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Error saving profile. Please try again.');
    }
  };




  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg p-6 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header section remains the same */}
      <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <FiUser className="w-6 h-6 text-blue-500" />
        Candidate Profile
      </h3>

      <div className="space-y-6">
        {data.name && (
          <Section 
            title="Name" 
            content={data.name}
            icon={sectionIcons.Name}
            color={sectionColors.Name}
          />
        )}

        {data.contactInfo && (
          <Section
            title="Contact Info"
            content={data.contactInfo}
            icon={sectionIcons["Contact Info"]}
            color={sectionColors["Contact Info"]}
          />
        )}

        <Section
          title="Skills"
          items={data.skills}
          icon={sectionIcons.Skills}
          color={sectionColors.Skills}
        />

        <Section
          title="Experience"
          items={data.experience}
          icon={sectionIcons.Experience}
          color={sectionColors.Experience}
        />

        <Section
          title="Education"
          items={data.education}
          icon={sectionIcons.Education}
          color={sectionColors.Education}
        />

        <Section
          title="Projects"
          items={data.projects}
          icon={sectionIcons.Projects}
          color={sectionColors.Projects}
        />
      </div>

      <div className="mt-8 flex justify-end">
        <motion.button
          onClick={handleSaveProfile}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiSave className="w-4 h-4" />
          Save Profile
        </motion.button>
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-4 right-4 bg-green-100 text-green-700 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FiSave className="w-4 h-4" />
            Profile saved successfully!
          </motion.div>
        )}
      </AnimatePresence>


    </motion.div>
  );
}

function Section({ 
  title, 
  content, 
  items, 
  icon: Icon,
  color
}: { 
  title: string; 
  content?: string; 
  items?: string[];
  icon: React.ElementType;
  color: string;
}) {
  const hasContent = content || (items && items.length > 0);

  return (
    <motion.div 
      className="group relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex gap-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>

        <div className="flex-1">
          <h4 className="text-lg font-semibold text-slate-800 mb-2">{title}</h4>
          
          {!hasContent && (
            <p className="text-slate-400 text-sm">No {title.toLowerCase()} information provided</p>
          )}

          {content && (
            <p className="text-slate-600 mb-3 leading-relaxed">{content}</p>
          )}

          {items && items.length > 0 && (
            <ul className="space-y-2">
              {items.map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-start before:content-['▹'] before:text-blue-400 before:mr-2 before:mt-1"
                  whileHover={{ x: 5 }}
                >
                  <span className="text-slate-600">{item}</span>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-slate-100 transition-colors group-hover:bg-blue-100" />
    </motion.div>
  );
}