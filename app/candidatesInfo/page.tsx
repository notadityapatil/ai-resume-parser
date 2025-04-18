"use client";

import { useState, useEffect } from 'react';
import { FiTrash2, FiUserX, FiSearch, FiCheckSquare, FiMapPin, FiBook, FiBriefcase } from 'react-icons/fi';
import Link from 'next/link';

type Candidate = {
  id: number;
  timestamp: string;
  name?: string;
  contactInfo?: string;
  skills?: string[];
  experience?: string[];
  education?: string[];
  projects?: string[];
  yearsOfExperience: number;
  educationLevel: string;
  location: string;
};

type ExperienceLevel = 'all' | 'entry' | 'mid' | 'senior';
type EducationLevel = 'all' | 'highschool' | 'bachelors' | 'masters' | 'phd';

export default function CandidatesInfo() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [allSkills, setAllSkills] = useState<string[]>([]);
  const [experienceFilter, setExperienceFilter] = useState<ExperienceLevel>('all');
  const [educationFilter, setEducationFilter] = useState<EducationLevel>('all');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    const loadCandidates = () => {
      const storedCandidates = localStorage.getItem('resumeProfiles');
      if (storedCandidates) {
        const parsedCandidates: Candidate[] = JSON.parse(storedCandidates);
        setCandidates(parsedCandidates);
        
        // Extract all unique skills
        const skills = parsedCandidates.reduce<string[]>((acc, candidate) => {
          if (candidate.skills) {
            return [...acc, ...candidate.skills];
          }
          return acc;
        }, []);
        setAllSkills([...new Set(skills)].sort());
      }
    };
    loadCandidates();
  }, []);

  const handleDelete = (id: number) => {
    const updatedCandidates = candidates.filter(candidate => candidate.id !== id);
    setCandidates(updatedCandidates);
    localStorage.setItem('resumeProfiles', JSON.stringify(updatedCandidates));
  };

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const filteredCandidates = candidates.filter(candidate => {
    // Search filter
    const matchesSearch = 
      (candidate.name?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
      (candidate.contactInfo?.toLowerCase().includes(searchQuery.toLowerCase()) || '');
    
    // Skills filter
    const matchesSkills = selectedSkills.length === 0 || 
      (candidate.skills && selectedSkills.every(skill => 
        candidate.skills?.includes(skill)
      ));
    
    // Experience level filter
    const matchesExperience = experienceFilter === 'all' || 
      (experienceFilter === 'entry' && candidate.yearsOfExperience <= 2) ||
      (experienceFilter === 'mid' && candidate.yearsOfExperience > 2 && candidate.yearsOfExperience <= 5) ||
      (experienceFilter === 'senior' && candidate.yearsOfExperience > 5);
    
    // Education level filter
    const matchesEducation = educationFilter === 'all' || 
      candidate.educationLevel.toLowerCase() === educationFilter.toLowerCase();
    
    // Location filter
    const matchesLocation = !locationFilter || 
    (candidate.location?.toLowerCase().includes(locationFilter.toLowerCase()) ?? false);
  
    
    return matchesSearch && matchesSkills && matchesExperience && matchesEducation && matchesLocation;
  });




  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedSkills([]);
    setExperienceFilter('all');
    setEducationFilter('all');
    setLocationFilter('');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-2">
          <FiUserX className="w-8 h-8 text-blue-600" />
          Saved Candidates
        </h1>

        {/* Search and Filter Controls */}
        <div className="mb-6 space-y-4">
          {/* Search and Skills Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or contact..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FiSearch className="absolute left-3 top-3 text-slate-400" />
            </div>

            <div className="relative group">
              <button className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 text-left flex items-center gap-2">
                <FiCheckSquare className="text-slate-400" />
                {selectedSkills.length > 0 
                  ? `${selectedSkills.length} skills selected`
                  : "Filter by skills"}
              </button>
              
              <div className="absolute hidden group-hover:block w-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200 z-10 max-h-60 overflow-y-auto">
                <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {allSkills.map(skill => (
                    <label 
                      key={skill}
                      className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSkills.includes(skill)}
                        onChange={() => handleSkillToggle(skill)}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300"
                      />
                      <span className="text-slate-700">{skill}</span>
                    </label>
                  ))}
                  {allSkills.length === 0 && (
                    <p className="p-2 text-slate-500">No skills found in database</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Experience Level Filter */}
            <div className="relative">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <FiBriefcase className="w-4 h-4" />
                <span className="text-sm">Experience</span>
              </div>
              <select
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(e.target.value as ExperienceLevel)}
                className="w-full pl-3 pr-8 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Experience Levels</option>
                <option value="entry">Entry Level (0-2 yrs)</option>
                <option value="mid">Mid Level (3-5 yrs)</option>
                <option value="senior">Senior Level (5+ yrs)</option>
              </select>
            </div>

            {/* Education Level Filter */}
            <div className="relative">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <FiBook className="w-4 h-4" />
                <span className="text-sm">Education</span>
              </div>
              <select
                value={educationFilter}
                onChange={(e) => setEducationFilter(e.target.value as EducationLevel)}
                className="w-full pl-3 pr-8 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Education Levels</option>
                <option value="highschool">High School</option>
                <option value="bachelors">Bachelor's Degree</option>
                <option value="masters">Master's Degree</option>
                <option value="phd">PhD</option>
              </select>
            </div>

            {/* Location Filter */}
            <div className="relative">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <FiMapPin className="w-4 h-4" />
                <span className="text-sm">Location</span>
              </div>
              <input
                type="text"
                placeholder="Filter by location..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
              <FiSearch className="absolute left-3 top-9 text-slate-400" />
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="flex justify-end">
            <button
              onClick={clearAllFilters}
              className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
            >
              Clear all filters
            </button>
          </div>
        </div>

        {filteredCandidates.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-slate-600 mb-4">No candidates match your criteria</p>
            <button
              onClick={clearAllFilters}
              className="text-blue-600 hover:text-blue-700"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-slate-700 font-medium">Name</th>
                  <th className="px-6 py-4 text-left text-slate-700 font-medium">Contact</th>
                  <th className="px-6 py-4 text-left text-slate-700 font-medium">Skills</th>
                  <th className="px-6 py-4 text-left text-slate-700 font-medium">Experience</th>
                  <th className="px-6 py-4 text-left text-slate-700 font-medium">Education</th>
                  <th className="px-6 py-4 text-left text-slate-700 font-medium">Location</th>
                  <th className="px-6 py-4 text-left text-slate-700 font-medium">Date Added</th>
                  <th className="px-6 py-4 text-left text-slate-700 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map((candidate) => (
                  <tr 
                    key={candidate.id} 
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 text-slate-800">
                      <Link
                        href={`/candidatesInfo/${candidate.id}`}
                        className="text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        {candidate.name || 'N/A'}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-slate-600 max-w-[200px] truncate">
                      {candidate.contactInfo || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {candidate.skills?.slice(0, 3).map((skill, index) => (
                          <span 
                            key={index}
                            className={`px-2 py-1 rounded-full text-sm ${
                              selectedSkills.includes(skill)
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {skill}
                          </span>
                        ))}
                        {candidate.skills && candidate.skills.length > 3 && (
                          <span className="px-2 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                            +{candidate.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {candidate.yearsOfExperience} yrs
                    </td>
                    <td className="px-6 py-4 text-slate-600 capitalize">
                      {candidate.educationLevel}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {candidate.location}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(candidate.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(candidate.id)}
                        className="text-red-600 hover:text-red-700 flex items-center gap-2"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}