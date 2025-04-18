'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiFileText } from 'react-icons/fi';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600 flex items-center gap-2">
              <FiFileText className="w-6 h-6" />
              ResumeIQ
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">
              Home
            </Link>
            <Link href="/analyzer" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">
              Resume Analyzer
            </Link>
<Link href="/candidatesInfo" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">
  Candidates
</Link>

<Link href="/tools" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">
  Tools
</Link>

<Link href="/contact" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">
              Contact
            </Link>

            <Link href="/about" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">
              About
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-blue-600 hover:bg-slate-100"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/" className="block px-3 py-2 rounded-md text-slate-600 hover:bg-slate-50">
              Home
            </Link>
            <Link href="/analyzer" className="block px-3 py-2 rounded-md text-slate-600 hover:bg-slate-50">
              Resume Analyzer
            </Link>
<Link href="/candidatesInfo" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">
  Candidates
</Link>

<Link href="/tools" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">
  Tools
</Link>

<Link href="/contact" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">
              Contact
            </Link>
            <Link href="/about" className="block px-3 py-2 rounded-md text-slate-600 hover:bg-slate-50">
              About
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}