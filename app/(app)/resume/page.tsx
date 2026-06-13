"use client";

import { useState } from "react";
import {
  UploadCloud,
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Map,
  ListChecks,
  Briefcase,
  GraduationCap,
  Award,
  Code2,
  FileCode2,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const mockAnalysis = {
  resumeScore: 78,
  atsScore: 82,
  verdict: "Strong Candidate",
  verdictDescription:
    "Your resume is well-structured and highlights strong technical projects, but lacks some keyword optimization for ATS systems.",
  sectionScores: [
    { label: "Skills", score: 90, icon: Code2, color: "bg-blue-500" },
    { label: "Projects", score: 85, icon: FileCode2, color: "bg-indigo-500" },
    { label: "Experience", score: 60, icon: Briefcase, color: "bg-amber-500" },
    { label: "Education", score: 95, icon: GraduationCap, color: "bg-emerald-500" },
    { label: "Certifications", score: 40, icon: Award, color: "bg-gray-400" },
  ],
  detectedSkills: [
    "React",
    "TypeScript",
    "Next.js",
    "Node.js",
    "PostgreSQL",
    "Python",
    "Java",
    "SQL",
    "Tailwind CSS",
    "Git",
  ],
  missingSkills: ["Docker", "System Design", "AWS", "CI/CD", "GraphQL"],
  suggestions: [
    "Add measurable project outcomes (e.g., 'Reduced load time by 30%')",
    "Improve project descriptions with STAR method",
    "Add GitHub repository links for all technical projects",
    "Elaborate on internship experience achievements",
    "Improve keyword density based on the target Job Description",
  ],
  strengths: [
    "Strong technical projects section",
    "Excellent, comprehensive skills section",
    "Consistent and clean formatting",
    "Relevant modern technologies included",
  ],
};

/* ------------------------------------------------------------------ */
/*  Components                                                         */
/* ------------------------------------------------------------------ */

function CircularProgress({
  score,
  label,
  colorClass,
}: {
  score: number;
  label: string;
  colorClass: string;
}) {
  const size = 140;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90 transform">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-gray-100"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`transition-all duration-1000 ease-out ${colorClass}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold tracking-tight text-gray-900">
            {score}
            <span className="text-xl text-gray-400">%</span>
          </span>
        </div>
      </div>
      <p className="mt-4 text-[13px] font-semibold tracking-wide text-gray-500 uppercase">
        {label}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ResumePage() {
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [jobDescription, setJobDescription] = useState("");

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setIsAnalyzing(false);
      setIsAnalyzed(true);
    }, 1500);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 px-5 py-4 pb-12 lg:px-8 lg:py-6 max-w-6xl mx-auto w-full">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Resume Analyzer
        </h1>
        <p className="mt-1 text-[13px] text-gray-500 max-w-2xl">
          Analyze your resume against job descriptions, identify critical skill
          gaps, and generate actionable steps to improve your placement readiness.
        </p>
      </div>

      {/* ── Top Section: Upload & JD ───────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Upload Card */}
        <div
          className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:shadow-md"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <FileText size={16} className="text-blue-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">Your Resume</h3>
          </div>
          
          <div className="group relative flex flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-8 text-center transition-all hover:border-blue-300 hover:bg-blue-50/50">
            <div className="mb-3 rounded-full bg-white p-3 shadow-sm ring-1 ring-gray-900/5 group-hover:ring-blue-600/10">
              <UploadCloud size={24} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
            <h4 className="text-[14px] font-medium text-gray-900">
              Click to upload or drag and drop
            </h4>
            <p className="mt-1 text-[12px] text-gray-500">
              PDF or DOCX (max. 5MB)
            </p>
            <input 
              type="file" 
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              accept=".pdf,.doc,.docx"
            />
          </div>
        </div>

        {/* Job Description Card */}
        <div
          className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:shadow-md"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50">
              <Search size={16} className="text-violet-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">Target Job Description</h3>
            <span className="ml-auto rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
              Optional
            </span>
          </div>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here to get tailored ATS analysis and keyword matching..."
            className="flex-1 w-full resize-none rounded-xl border border-gray-200 bg-gray-50/50 p-4 text-[13px] text-gray-900 placeholder:text-gray-400 focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100 transition-colors"
          />

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-[13px] font-medium text-white shadow-sm transition-all hover:bg-gray-800 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
          >
            {isAnalyzing ? (
              <>
                <Sparkles size={16} className="animate-pulse" />
                Analyzing Resume...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Analyze Resume
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Analysis Results ───────────────────────────────────────── */}
      {isAnalyzed && (
        <div className="mt-4 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Main Scores & Verdict */}
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Scores (Spans 2 cols) */}
            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-12 rounded-2xl border border-gray-100 bg-white p-8 lg:col-span-2"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
            >
              <CircularProgress
                score={mockAnalysis.resumeScore}
                label="Overall Resume Score"
                colorClass="text-blue-500"
              />
              <div className="hidden sm:block h-32 w-px bg-gray-100" />
              <CircularProgress
                score={mockAnalysis.atsScore}
                label="ATS Match Score"
                colorClass="text-violet-500"
              />
            </div>

            {/* Final Verdict */}
            <div
              className="flex flex-col justify-center rounded-2xl border border-gray-100 bg-white p-8"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 mb-4">
                <CheckCircle2 size={24} className="text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {mockAnalysis.verdict}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-gray-500">
                {mockAnalysis.verdictDescription}
              </p>
            </div>
          </div>

          {/* Section Scores & Action Items */}
          <div className="grid gap-4 lg:grid-cols-3">
            
            {/* Left Col: Section Scores */}
            <div
              className="rounded-2xl border border-gray-100 bg-white p-6 lg:col-span-1"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
            >
              <h3 className="text-sm font-semibold text-gray-900 mb-5">
                Section Analysis
              </h3>
              <div className="space-y-4">
                {mockAnalysis.sectionScores.map((section) => {
                  const Icon = section.icon;
                  return (
                    <div key={section.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <Icon size={14} className="text-gray-400" />
                          <span className="text-[13px] font-medium text-gray-700">
                            {section.label}
                          </span>
                        </div>
                        <span className="text-[12px] font-semibold text-gray-900">
                          {section.score}/100
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${section.color}`}
                          style={{ width: `${section.score}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Col: Skills & Suggestions */}
            <div className="grid gap-4 lg:col-span-2">
              
              {/* Skills Card */}
              <div
                className="rounded-2xl border border-gray-100 bg-white p-6"
                style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
              >
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Detected Skills */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-500" />
                      Detected Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {mockAnalysis.detectedSkills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing Skills */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <AlertTriangle size={16} className="text-amber-500" />
                      Missing from JD
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {mockAnalysis.missingSkills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center rounded-md bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700 border border-amber-200/50"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Feedback Card */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* Strengths */}
                <div
                  className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-6"
                >
                  <h3 className="text-sm font-semibold text-emerald-900 mb-4">
                    Resume Strengths
                  </h3>
                  <ul className="space-y-3">
                    {mockAnalysis.strengths.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[13px] text-emerald-800">
                        <CheckCircle2 size={16} className="shrink-0 text-emerald-500 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Suggestions */}
                <div
                  className="rounded-2xl border border-gray-100 bg-white p-6"
                  style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
                >
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    Actionable Improvements
                  </h3>
                  <ul className="space-y-3">
                    {mockAnalysis.suggestions.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[13px] text-gray-600">
                        <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-100 mt-0.5">
                          <span className="text-[9px] font-bold text-blue-700">{i + 1}</span>
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          </div>

          {/* ── Action Integration Section ─────────────────────────────── */}
          <div
            className="mt-2 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-6"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
          >
            <div>
              <h3 className="text-[15px] font-semibold text-gray-900">
                Ready to improve?
              </h3>
              <p className="mt-1 text-[13px] text-gray-500">
                Turn these suggestions into actionable tasks or create a learning roadmap.
              </p>
            </div>
            
            <div className="flex w-full sm:w-auto items-center gap-3">
              <button className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[13px] font-medium text-gray-700 transition-all hover:bg-gray-50 active:scale-[0.98]">
                <Map size={16} className="text-blue-500" />
                Generate Roadmap
              </button>
              <button className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-[13px] font-medium text-white transition-all hover:bg-gray-800 active:scale-[0.98]">
                <ListChecks size={16} className="text-violet-400" />
                Generate Tasks
                <ArrowRight size={14} className="ml-1 opacity-70" />
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
