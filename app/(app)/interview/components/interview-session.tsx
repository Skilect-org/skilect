"use client";

import { useState, useEffect } from "react";
import { Mic, Square, ChevronLeft, ChevronRight, CheckCircle2, UserCircle2, Code2, RefreshCcw, Settings, Maximize, Play, CloudUpload, CheckCircle, ChevronDown } from "lucide-react";
import { SetupData, MOCK_QUESTIONS, MockQuestion } from "../types";

interface InterviewSessionProps {
  setupData: SetupData;
  onEnd: () => void;
}

export function InterviewSession({ setupData, onEnd }: InterviewSessionProps) {
  const questions = MOCK_QUESTIONS[setupData.type || "mixed"];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const currentQ = questions[currentIndex];
  const progressPct = Math.round(((currentIndex + 1) / questions.length) * 100);

  // Mock recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => setRecordingSeconds((s) => s + 1), 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleNext = () => {
    setIsRecording(false);
    if (currentIndex < questions.length - 1) setCurrentIndex((i) => i + 1);
    else onEnd();
  };

  const handlePrev = () => {
    setIsRecording(false);
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className={`flex flex-1 flex-col mx-auto w-full pb-20 animate-in fade-in duration-500 gap-6 ${currentQ.isCoding ? "max-w-7xl" : "max-w-5xl"}`}>
      
      {/* Top Navigation & Progress */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[13px] font-semibold tracking-wide text-gray-500 uppercase">
            Question {currentIndex + 1} of {questions.length}
          </h2>
          <div className="mt-2 flex w-64 h-1.5 overflow-hidden rounded-full bg-gray-100">
            <div 
              className="h-full bg-blue-600 transition-all duration-500" 
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
        <button
          onClick={onEnd}
          className="rounded-lg bg-red-50 px-4 py-2 text-[13px] font-medium text-red-600 transition-colors hover:bg-red-100"
        >
          End Interview
        </button>
      </div>

      {/* Main Content Area */}
      {currentQ.isCoding ? (
        <CodingWorkspace currentQ={currentQ} answers={answers} setAnswers={setAnswers} />
      ) : (
        <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
          {/* Question Area */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className={`inline-flex items-center rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                currentQ.type === "technical" ? "bg-blue-50 text-blue-700" : "bg-violet-50 text-violet-700"
              }`}>
                {currentQ.type === "technical" ? "Technical" : "HR / Behavioral"}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900 leading-snug">
              {currentQ.question}
            </h1>
          </div>

          {/* Dynamic Input Area */}
          {currentQ.type === "technical" ? (
            <div className="flex flex-col gap-4">
              <textarea
                value={answers[currentQ.id] || ""}
                onChange={(e) => setAnswers({ ...answers, [currentQ.id]: e.target.value })}
                placeholder="Type your answer here..."
                className="w-full h-[240px] resize-none rounded-xl border border-gray-200 bg-gray-50/50 p-5 text-[14px] text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-8 py-6">
              <div className="flex flex-col items-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 shadow-inner">
                  <UserCircle2 size={64} className="text-gray-400" strokeWidth={1} />
                </div>
                <p className="mt-3 text-[13px] font-medium text-gray-500">AI Interviewer</p>
              </div>

              <div className="flex w-full max-w-lg flex-col items-center rounded-2xl border border-gray-100 bg-gray-50/50 p-8 text-center">
                {!isRecording ? (
                  <button
                    onClick={() => setIsRecording(true)}
                    className="group flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg hover:scale-105"
                  >
                    <Mic size={24} />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsRecording(false)}
                    className="group flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 transition-all hover:bg-red-200 hover:scale-105"
                  >
                    <Square size={20} className="fill-current" />
                  </button>
                )}
                
                <div className="mt-4 h-6">
                  {isRecording ? (
                    <div className="flex items-center gap-2 text-red-500 animate-pulse">
                      <span className="h-2 w-2 rounded-full bg-red-500"></span>
                      <span className="text-[13px] font-semibold font-mono">{formatTime(recordingSeconds)}</span>
                    </div>
                  ) : (
                    <span className="text-[13px] font-medium text-gray-500">
                      Click to Start Recording
                    </span>
                  )}
                </div>
                
                {/* Mock Transcript */}
                {isRecording && recordingSeconds > 2 && (
                  <div className="mt-6 w-full rounded-xl bg-white p-4 text-left shadow-sm border border-gray-100">
                    <p className="text-[13px] leading-relaxed text-gray-600 italic">
                      "Hello, my name is Meet, and I'd like to share my experience regarding..."
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-[14px] font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
        >
          <ChevronLeft size={16} />
          Previous
        </button>
        
        <button
          onClick={handleNext}
          className="flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-2.5 text-[14px] font-medium text-white transition-all hover:bg-gray-800"
        >
          {currentIndex === questions.length - 1 ? (
            <>
              Finish <CheckCircle2 size={16} />
            </>
          ) : (
            <>
              Next Question <ChevronRight size={16} />
            </>
          )}
        </button>
      </div>

    </div>
  );
}

// ── Coding Workspace Subcomponent ──────────────────────────────────────────────

function CodingWorkspace({ currentQ, answers, setAnswers }: { currentQ: MockQuestion, answers: Record<string, string>, setAnswers: any }) {
  const [activeTab, setActiveTab] = useState("testcase");
  const [activeTestCase, setActiveTestCase] = useState(1);

  // Initialize with default code if not set
  useEffect(() => {
    if (!answers[currentQ.id] && currentQ.defaultCode) {
      setAnswers({ ...answers, [currentQ.id]: currentQ.defaultCode });
    }
  }, [currentQ.id]);

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-auto min-h-[600px]">
      
      {/* Left Panel: Problem Description */}
      <div className="flex flex-col w-full lg:w-[40%] rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-[16px] font-bold text-gray-900">{currentQ.title || currentQ.question}</h2>
          {currentQ.difficulty && (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider ${
              currentQ.difficulty === 'EASY' ? 'bg-emerald-100 text-emerald-700' :
              currentQ.difficulty === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
              'bg-red-100 text-red-700'
            }`}>
              {currentQ.difficulty}
            </span>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 text-[14px] text-gray-700 leading-relaxed">
          {currentQ.description ? (
            currentQ.description.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))
          ) : (
            <p>{currentQ.question}</p>
          )}

          {currentQ.examples && currentQ.examples.length > 0 && (
            <div className="mt-4 flex flex-col gap-4">
              {currentQ.examples.map((ex, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <p className="font-bold text-gray-900 text-[13px]">Example {i + 1}:</p>
                  <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-4 font-mono text-[12px] text-gray-800 whitespace-pre-wrap">
                    <span className="font-semibold">Input:</span> {ex.input}
                    <br />
                    <span className="font-semibold">Output:</span> {ex.output}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Editor and Console */}
      <div className="flex flex-col w-full lg:w-[60%] rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2 bg-gray-50/50">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 rounded-lg bg-white border border-gray-200 px-3 py-1.5 text-[12px] font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
              <Code2 size={14} className="text-blue-600" />
              Python 3
              <ChevronDown size={14} className="text-gray-400 ml-1" />
            </button>
            <button 
              onClick={() => alert("Code reset coming soon")}
              className="text-gray-400 hover:text-gray-600 transition-colors" title="Reset Code"
            >
              <RefreshCcw size={14} />
            </button>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <button 
              onClick={() => alert("Editor settings coming soon")}
              className="hover:text-gray-600 transition-colors"
            >
              <Settings size={15} />
            </button>
            <button 
              onClick={() => alert("Fullscreen mode coming soon")}
              className="hover:text-gray-600 transition-colors"
            >
              <Maximize size={15} />
            </button>
          </div>
        </div>

        {/* Code Editor Area */}
        <div className="flex-1 bg-[#1e1e1e] relative group flex flex-col overflow-hidden">
          {/* Fake line numbers for effect */}
          <div className="absolute left-0 top-0 bottom-0 w-10 bg-[#1e1e1e] border-r border-[#333] flex flex-col items-center pt-4 text-[12px] font-mono text-[#666] select-none pointer-events-none overflow-hidden">
            {Array.from({length: 20}).map((_, i) => (
              <span key={i} className="leading-6">{i + 1}</span>
            ))}
          </div>
          
          <textarea
            value={answers[currentQ.id] || ""}
            onChange={(e) => setAnswers({ ...answers, [currentQ.id]: e.target.value })}
            className="flex-1 w-full bg-transparent pl-14 pr-4 py-4 text-[13px] text-gray-100 font-mono resize-none focus:outline-none leading-6"
            spellCheck={false}
          />
        </div>

        {/* Bottom Tabs (Test Case / Console) */}
        <div className="flex flex-col border-t border-gray-200 bg-white">
          <div className="flex items-center gap-6 px-6 pt-3 border-b border-gray-100">
            <button 
              onClick={() => setActiveTab("testcase")}
              className={`pb-3 text-[13px] font-semibold border-b-2 transition-colors ${activeTab === "testcase" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            >
              Test Case
            </button>
            <button 
              onClick={() => setActiveTab("console")}
              className={`pb-3 text-[13px] font-semibold border-b-2 transition-colors ${activeTab === "console" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            >
              Console
            </button>
          </div>

          <div className="p-4 flex flex-col gap-4">
            {/* Test Case Pills */}
            <div className="flex gap-3">
              {[1, 2, 3].map((caseNum) => (
                <button 
                  key={caseNum}
                  onClick={() => setActiveTestCase(caseNum)}
                  className={`flex flex-col items-center gap-1 rounded-xl px-6 py-2.5 transition-all ${
                    activeTestCase === caseNum 
                      ? "bg-white border-2 border-blue-600 shadow-sm" 
                      : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
                  }`}
                >
                  <span className={`text-[13px] font-bold ${activeTestCase === caseNum ? "text-gray-900" : "text-gray-600"}`}>Case {caseNum}</span>
                  {caseNum === 1 && <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600"><CheckCircle size={10} /> Passed</span>}
                  {caseNum !== 1 && <span className="text-[10px] font-medium text-gray-400">Not Run</span>}
                </button>
              ))}
            </div>

            {/* Run / Submit Bar */}
            <div className="flex items-center justify-end gap-3 pt-2 mt-2">
              <button 
                onClick={() => alert("Running code...")}
                className="flex items-center gap-2 rounded-lg bg-gray-50 border border-gray-200 px-5 py-2.5 text-[13px] font-semibold text-gray-700 transition-colors hover:bg-gray-100"
              >
                <Play size={14} className="text-gray-500" />
                Run Code
              </button>
              <button 
                onClick={() => alert("Solution submitted!")}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-[13px] font-semibold text-white shadow-md shadow-blue-500/25 transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30"
              >
                <CloudUpload size={14} />
                Submit Solution
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
