"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";
import { useEffect, useState } from "react";

const codeLines = [
  "const candidate = new Profile();",
  "await candidate.takeAssessment('SDE-2');",
  "// Analyzing skill gaps...",
  "const roadmap = generateRoadmap({",
  "  targetRole: 'Senior Engineer',",
  "  focusAreas: ['System Design', 'React']",
  "});",
  "",
  "candidate.startTraining(roadmap);",
  "console.log('Offer received! 🎉');"
];

export default function Hero() {
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(0);

  useEffect(() => {
    if (currentLineIndex >= codeLines.length) return;

    const currentLine = codeLines[currentLineIndex];
    
    if (currentCharIndex < currentLine.length) {
      const timeout = setTimeout(() => {
        setCurrentCharIndex(prev => prev + 1);
      }, Math.random() * 30 + 20); // random typing speed between 20-50ms
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentLineIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      }, 400); // pause at end of line
      return () => clearTimeout(timeout);
    }
  }, [currentLineIndex, currentCharIndex]);

  return (
    <>
      <section className="bg-[#f8f9fc] min-h-[90vh] flex flex-col justify-center items-center py-20 overflow-hidden relative">
        <div className="w-full max-w-7xl px-6 mx-auto">
          
          {/* Top Section: 2 Columns Centered */}
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            
            {/* Left Column: Text Content */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full max-w-xl mx-auto lg:mx-0"
            >
              <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl leading-[1.1] mb-8">
                Turn Skill Gaps Into Job Offers
              </h1>
              
              <p className="text-xl font-medium text-gray-500 leading-relaxed mb-12">
                The placement preparation platform that tracks your readiness, curates personalized roadmaps, and guides you definitively to your dream career.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <a
                  href="/assessment"
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-10 py-4 text-[16px] font-bold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-95"
                >
                  Start Your Assessment
                </a>

                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-10 py-4 text-[16px] font-bold text-gray-900 shadow-sm transition-all hover:bg-gray-50 hover:border-gray-300 active:scale-95"
                >
                  How It Works
                </a>
              </div>
            </motion.div>
            
            {/* Right Column: Terminal Mock UI */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="relative w-full max-w-[600px] mx-auto h-[440px] flex items-center justify-center"
            >
              {/* Soft decorative glow */}
              <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full z-0" />
              
              {/* Terminal Window */}
              <div className="relative z-10 w-full h-full rounded-2xl bg-[#0d1117] border border-gray-800 shadow-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-2 border-b border-gray-800 bg-[#161b22] px-5 py-4">
                  <div className="h-3.5 w-3.5 rounded-full bg-[#ff5f56]"></div>
                  <div className="h-3.5 w-3.5 rounded-full bg-[#ffbd2e]"></div>
                  <div className="h-3.5 w-3.5 rounded-full bg-[#27c93f]"></div>
                  <div className="ml-3 flex items-center gap-2 text-sm font-medium text-gray-500">
                    <Terminal className="w-4 h-4" />
                    <span>skilect-cli</span>
                  </div>
                </div>
                
                {/* Body */}
                <div className="flex-1 p-6 font-mono text-[15px] leading-relaxed overflow-hidden whitespace-pre-wrap">
                  {codeLines.map((line, i) => {
                    if (i > currentLineIndex) return null;
                    
                    const isCurrentLine = i === currentLineIndex;
                    const displayedLine = isCurrentLine ? line.slice(0, currentCharIndex) : line;
                    
                    return (
                      <div 
                        key={i}
                        className={`min-h-[1.5rem]
                          ${line.startsWith('//') ? 'text-gray-500' : ''}
                          ${line.includes('const') ? 'text-purple-400' : ''}
                          ${line.includes('candidate') || line.includes('roadmap') ? 'text-blue-300' : ''}
                          ${line.includes('(') ? 'text-gray-300' : ''}
                          ${line.includes("'") ? 'text-green-300' : ''}
                          ${!line.startsWith('//') && !line.includes('const') && !line.includes("'") ? 'text-gray-300' : ''}
                        `}
                      >
                        {displayedLine}
                        {isCurrentLine && (
                          <motion.span 
                            animate={{ opacity: [1, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                            className="w-2 h-4 bg-gray-400 ml-1 inline-block align-middle mb-1"
                          />
                        )}
                      </div>
                    );
                  })}
                  {currentLineIndex >= codeLines.length && (
                    <div className="min-h-[1.5rem]">
                      <motion.span 
                        animate={{ opacity: [1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="w-2 h-4 bg-gray-400 ml-1 inline-block align-middle mb-1"
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Dashboard Preview Image Section (Below the fold) */}
      <section className="bg-[#f8f9fc] pb-32">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
            className="w-full relative"
          >
            {/* Subtle glow behind dashboard */}
            <div className="absolute inset-0 -z-10 bg-blue-500/5 blur-[100px] rounded-full" />
            
            <div className="rounded-2xl border border-gray-200/60 bg-white/50 backdrop-blur-sm p-2 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
              <div className="overflow-hidden rounded-xl border border-gray-100 bg-gray-50 shadow-sm relative aspect-[16/10] sm:aspect-auto sm:h-auto">
                <Image
                  src="/images/landing/landing-dashboard.png"
                  alt="Skilect Dashboard Preview"
                  width={1200}
                  height={800}
                  priority
                  className="w-full h-full object-cover sm:h-auto"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
