"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Users, Layers, UploadCloud, FileText, Trash2, ChevronDown, Sparkles, Calendar, ChevronRight, X, Trophy, TrendingUp, Target, Briefcase, Gauge } from "lucide-react";
import { InterviewType, ROLES, SetupData } from "../types";

interface InterviewSetupProps {
  onStart: (data: SetupData) => void;
}

export function InterviewSetup({ onStart }: InterviewSetupProps) {
  const [selectedType, setSelectedType] = useState<InterviewType | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("Frontend Developer");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("Intermediate");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced", "Expert"];

  const mockHistory = [
    { id: "1", type: "Technical Interview", role: "Frontend Developer", score: 85, date: "Oct 24, 2025" },
    { id: "2", type: "HR Interview", role: "Frontend Developer", score: 92, date: "Oct 20, 2025" },
    { id: "3", type: "Mixed Interview", role: "Full Stack Developer", score: 78, date: "Oct 15, 2025" },
    { id: "4", type: "Technical Interview", role: "React Developer", score: 88, date: "Oct 10, 2025" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleStart = () => {
    if (selectedType) {
      onStart({ 
        type: selectedType, 
        role: selectedRole,
        difficulty: selectedDifficulty,
        jobDescription: jobDescription,
      });
    }
  };

  return (
    <div className="flex flex-1 flex-col max-w-6xl mx-auto w-full pb-20 animate-in fade-in duration-500">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* ── Left Column: Configuration ─────────────────────────────── */}
        <div className="flex flex-col gap-8 lg:col-span-2">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Mock Interview</h1>
        <p className="mt-2 text-[14px] text-gray-500">
          Practice technical and HR interviews with AI-powered simulations.
        </p>
      </div>

      {/* 1. Interview Type */}
      <div className="space-y-4">
        <h2 className="text-[15px] font-semibold text-gray-900 border-b border-gray-100 pb-2">
          1. Interview Type
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedType("technical")}
            className={`group relative flex flex-col items-start rounded-2xl border p-5 transition-all duration-200 text-left ${
              selectedType === "technical"
                ? "border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-600"
                : "border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50"
            }`}
          >
            <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
              selectedType === "technical" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600"
            }`}>
              <Code2 size={20} />
            </div>
            <h3 className={`text-[14px] font-semibold ${selectedType === "technical" ? "text-blue-900" : "text-gray-900"}`}>
              Technical Interview
            </h3>
            <p className={`mt-1.5 text-[12px] leading-relaxed ${selectedType === "technical" ? "text-blue-700/80" : "text-gray-500"}`}>
              Programming, DSA, system design, frameworks.
            </p>
            {selectedType === "technical" && (
              <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-blue-600" />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedType("hr")}
            className={`group relative flex flex-col items-start rounded-2xl border p-5 transition-all duration-200 text-left ${
              selectedType === "hr"
                ? "border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-600"
                : "border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50"
            }`}
          >
            <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
              selectedType === "hr" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600"
            }`}>
              <Users size={20} />
            </div>
            <h3 className={`text-[14px] font-semibold ${selectedType === "hr" ? "text-blue-900" : "text-gray-900"}`}>
              HR Interview
            </h3>
            <p className={`mt-1.5 text-[12px] leading-relaxed ${selectedType === "hr" ? "text-blue-700/80" : "text-gray-500"}`}>
              Behavioral, communication, leadership questions.
            </p>
            {selectedType === "hr" && (
              <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-blue-600" />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedType("mixed")}
            className={`group relative flex flex-col items-start rounded-2xl border p-5 transition-all duration-200 text-left ${
              selectedType === "mixed"
                ? "border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-600"
                : "border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50"
            }`}
          >
            <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
              selectedType === "mixed" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600"
            }`}>
              <Layers size={20} />
            </div>
            <h3 className={`text-[14px] font-semibold ${selectedType === "mixed" ? "text-blue-900" : "text-gray-900"}`}>
              Mixed Interview
            </h3>
            <p className={`mt-1.5 text-[12px] leading-relaxed ${selectedType === "mixed" ? "text-blue-700/80" : "text-gray-500"}`}>
              Technical + HR combined experience.
            </p>
            {selectedType === "mixed" && (
              <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-blue-600" />
            )}
          </motion.button>
        </div>
      </div>

      {/* 2. Interview Configuration */}
      <div className="space-y-4">
        <h2 className="text-[15px] font-semibold text-gray-900 border-b border-gray-100 pb-2">
          2. Interview Configuration
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="relative">
            <label className="mb-2 block text-[12px] font-medium text-gray-500">
              Target Job Role
            </label>
            <div className="relative">
              <Briefcase size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white pl-11 pr-10 py-3.5 text-[14px] font-medium text-gray-900 transition-all hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 shadow-sm cursor-pointer"
              >
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={18}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          <div className="relative">
            <label className="mb-2 block text-[12px] font-medium text-gray-500">
              Difficulty Level
            </label>
            <div className="relative">
              <Gauge size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white pl-11 pr-10 py-3.5 text-[14px] font-medium text-gray-900 transition-all hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 shadow-sm cursor-pointer"
              >
                {DIFFICULTIES.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={18}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Interview Context */}
      <div className="space-y-4">
        <h2 className="text-[15px] font-semibold text-gray-900 border-b border-gray-100 pb-2">
          3. Interview Context
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Resume Upload */}
          <div className="flex flex-col">
            <label className="mb-2 text-[12px] font-medium text-gray-500">
              Resume <span className="font-normal">(Optional)</span>
            </label>
            {!uploadedFile ? (
              <div className="group relative flex w-full flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-8 text-center transition-all hover:border-blue-300 hover:bg-blue-50/30 min-h-[160px]">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 group-hover:ring-blue-600/10">
                  <UploadCloud size={20} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <p className="text-[14px] font-medium text-gray-900">Upload Resume</p>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
              </div>
            ) : (
              <div className="flex w-full flex-1 items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm min-h-[160px]">
                <div className="flex flex-col items-center justify-center w-full gap-3 overflow-hidden">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    <FileText size={24} className="text-blue-600" />
                  </div>
                  <div className="min-w-0 text-center">
                    <p className="truncate text-[14px] font-medium text-gray-900">
                      {uploadedFile.name}
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <label className="text-[12px] font-medium text-blue-600 hover:text-blue-700 cursor-pointer">
                        Replace File
                        <input type="file" onChange={handleFileChange} className="hidden" />
                      </label>
                    </div>
                  </div>
                  <button
                    onClick={() => setUploadedFile(null)}
                    className="mt-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    title="Remove Resume"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Job Description */}
          <div className="flex flex-col">
            <label className="mb-2 text-[12px] font-medium text-gray-500">
              Target Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the JD here. The AI will tailor the interview questions..."
              className="w-full flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50/50 p-4 text-[13px] text-gray-900 placeholder:text-gray-400 transition-colors hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 min-h-[160px]"
            />
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="pt-8">
        <button
          onClick={handleStart}
          disabled={!selectedType}
          className="flex w-full md:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-10 py-4 text-[15px] font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
        >
          <Sparkles size={18} />
          Start Mock Interview
        </button>
      </div>
        </div>

        {/* ── Right Column: Analytics & History ──────────────────────── */}
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[12px] font-medium text-gray-500">Total Interviews</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">12</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                <Trophy size={18} className="text-blue-600" />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[12px] font-medium text-gray-500">Average Score</p>
                <p className="mt-1 text-2xl font-bold text-emerald-600">78%</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50">
                <TrendingUp size={18} className="text-emerald-600" />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[12px] font-medium text-gray-500">Areas to Improve</p>
                <p className="mt-1 text-[13px] font-bold text-gray-900">System Design</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50">
                <Target size={18} className="text-amber-600" />
              </div>
            </div>
          </div>

          <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-50 px-5 py-4">
              <h3 className="text-[14px] font-semibold text-gray-900">
                Recent Interviews
              </h3>
            </div>
            <div className="flex flex-col divide-y divide-gray-50">
              {mockHistory.slice(0, 4).map((item) => (
                <div key={item.id} className="group flex flex-col p-5 transition-colors hover:bg-gray-50/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[13px] font-semibold text-gray-900">
                        {item.type}
                      </p>
                      <p className="mt-1 text-[11px] font-medium text-gray-500">
                        {item.role}
                      </p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-bold text-gray-700">
                      {item.score}%
                    </span>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                      <Calendar size={12} />
                      <span>{item.date}</span>
                    </div>
                    <button 
                      onClick={() => alert("Feedback view coming soon!")}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 transition-colors hover:text-blue-700"
                    >
                      View Feedback
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-50 px-5 py-3 text-center">
              <button 
                onClick={() => setIsHistoryOpen(true)}
                className="text-[11px] font-medium text-gray-400 transition-colors hover:text-gray-600"
              >
                View all history
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── All History Modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {isHistoryOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="flex flex-col w-full max-w-2xl max-h-[85vh] rounded-2xl bg-white shadow-xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <div>
                  <h2 className="text-[15px] font-semibold text-gray-900">
                    All Interview History
                  </h2>
                  <p className="mt-0.5 text-[12px] text-gray-500">
                    Review your past mock interviews and their feedback.
                  </p>
                </div>
                <button
                  onClick={() => setIsHistoryOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-2">
                <div className="flex flex-col divide-y divide-gray-50">
                  {mockHistory.map((item) => (
                    <div key={item.id} className="group flex flex-col p-4 transition-colors hover:bg-gray-50/50 rounded-xl">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[14px] font-semibold text-gray-900">
                            {item.type}
                          </p>
                          <p className="mt-1 text-[12px] font-medium text-gray-500">
                            {item.role}
                          </p>
                        </div>
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-[12px] font-bold text-gray-700">
                          {item.score}%
                        </span>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[12px] text-gray-400">
                          <Calendar size={14} />
                          <span>{item.date}</span>
                        </div>
                        <button 
                          onClick={() => alert("Feedback view coming soon!")}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                        >
                          View Feedback
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
