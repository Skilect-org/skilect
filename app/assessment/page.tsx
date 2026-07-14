/**
 * app/assessment/page.tsx
 * Dynamic, gamified onboarding questionnaire.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { AssessmentLayout } from "@/components/assessment";

const SUGGESTED_ROLES = ["Full Stack Developer", "Game Developer", "Frontend Engineer", "Backend Engineer"];
const SUGGESTED_SKILLS = ["React", "TypeScript", "Java", "3D Modeling", "Node.js", "Data Structures", "Spring Boot", "Next.js"];

export default function AssessmentPage() {
  const router = useRouter();
  const { user } = useUser();

  // --- UI State ---
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Payload State ---
  const [targetRole, setTargetRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [skillsChecklist, setSkillsChecklist] = useState<string[]>([]);
  const [projectsBuilt, setProjectsBuilt] = useState("");
  const [hasInternship, setHasInternship] = useState<boolean | null>(null);
  const [learningGoal, setLearningGoal] = useState("");
  const [college, setCollege] = useState("");
  const [branch, setBranch] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("1");

  // --- Text Field Input Sanitizer (Prevents Numbers) ---
  const handleAlphabeticalInput = (value: string, setter: (val: string) => void) => {
    setError(null);
    // Regular expression removes all numeric digits instantly
    const cleanValue = value.replace(/[0-9]/g, "");
    setter(cleanValue);
  };

  const toggleSkill = (skill: string) => {
    setError(null);
    setSkillsChecklist((prev) => 
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const addCustomSkill = (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const trimmed = customSkillInput.trim();
    if (trimmed) {
      setError(null);
      if (!skillsChecklist.includes(trimmed)) {
        setSkillsChecklist([...skillsChecklist, trimmed]);
      }
    }
    setCustomSkillInput("");
  };

  const removeSkill = (skillToRemove: string) => {
    setSkillsChecklist(skillsChecklist.filter(s => s !== skillToRemove));
  };

  const handleContinue = () => {
    setError(null);
    if (step === 1) {
      if (!targetRole.trim()) return setError("Please specify your Target Role.");
      if (!experienceLevel) return setError("Please select your current starting experience level.");
    }
    if (step === 2 && skillsChecklist.length === 0) {
      return setError("Please add or select at least one skill.");
    }
    setStep((s) => Math.min(3, s + 1));
  };

  const submitAssessment = async () => {
    setError(null);
    if (!projectsBuilt) return setError("Please select how many projects you have built.");
    if (hasInternship === null) return setError("Please specify your internship status.");
    if (!learningGoal) return setError("Please select your immediate learning priority.");
    if (!college.trim()) return setError("College/University name cannot be blank.");
    if (!branch.trim()) return setError("Branch/Major of study cannot be blank.");

    setIsSubmitting(true);

    const payload = {
      fullName: user?.fullName || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Student",
      email: user?.primaryEmailAddress?.emailAddress || "no-email@example.com",
      college: college.trim(),
      branch: branch.trim(),
      yearOfStudy,
      targetRole: targetRole.trim(),
      skills: skillsChecklist,
      experienceLevel,
      projectCount: projectsBuilt,
      hasInternship,
    };

    try {
      const response = await fetch("/api/assessment/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to process assessment. Please try again.");
      router.push("/assessment/results");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  return (
    <AssessmentLayout>
      <div className="max-w-2xl mx-auto py-10 px-4">
        
        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex justify-between text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">
            <span>Step {step} of 3</span>
            <span>{Math.round((step / 3) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* --- STEP 1: Role & Experience --- */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">What are you building towards?</h1>
              <p className="text-gray-500">Let's set your target destination.</p>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-800">Target Role</label>
              <input
                type="text"
                placeholder="e.g., Full Stack Developer, Technical Artist..."
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-900 shadow-sm"
                value={targetRole}
                onChange={(e) => handleAlphabeticalInput(e.target.value, setTargetRole)}
              />
              <div className="flex flex-wrap gap-2 pt-2">
                {SUGGESTED_ROLES.map(role => (
                  <button
                    key={role}
                    onClick={() => { setError(null); setTargetRole(role); }}
                    className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <label className="block text-sm font-semibold text-gray-800">Where are you starting from?</label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { label: "Complete Beginner", desc: "Just starting to learn the ropes" },
                  { label: "Junior", desc: "Can build basic projects with some help" },
                  { label: "Mid-Level", desc: "Comfortable building and deploying independently" }
                ].map(level => (
                  <button
                    key={level.label}
                    onClick={() => { setError(null); setExperienceLevel(level.label); }}
                    className={`flex flex-col text-left p-4 rounded-xl border transition-all ${
                      experienceLevel === level.label 
                        ? "border-indigo-600 bg-indigo-50 shadow-sm ring-1 ring-indigo-600" 
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <span className={`font-semibold ${experienceLevel === level.label ? "text-indigo-900" : "text-gray-900"}`}>
                      {level.label}
                    </span>
                    <span className="text-sm text-gray-500 mt-1">{level.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- STEP 2: Skills Arsenal --- */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Current Arsenal</h1>
              <p className="text-gray-500">Add the languages, tools, or concepts you are familiar with.</p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a skill and hit enter..."
                className="flex-1 px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                onKeyDown={addCustomSkill}
              />
              <button 
                onClick={addCustomSkill}
                className="px-6 py-3.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
              >
                Add
              </button>
            </div>

            <div className="min-h-[100px] p-5 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-wrap gap-2 items-start">
              {skillsChecklist.length === 0 ? (
                <p className="text-gray-400 text-sm w-full text-center mt-4">No skills added yet.</p>
              ) : (
                skillsChecklist.map((skill) => (
                  <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 shadow-sm text-sm font-medium text-gray-800">
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="text-gray-400 hover:text-red-500">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </span>
                ))
              )}
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Add</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_SKILLS.filter(s => !skillsChecklist.includes(s)).map((skill) => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-600 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                  >
                    + {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- STEP 3: Background & Goals --- */}
        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Experience & Goals</h1>
              <p className="text-gray-500">Skip the essays. Just the facts.</p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-800">How many projects have you built?</label>
              <div className="flex gap-3">
                {["0", "1-2", "3-5", "5+"].map(num => (
                  <button
                    key={num}
                    onClick={() => { setError(null); setProjectsBuilt(num); }}
                    className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                      projectsBuilt === num ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <label className="block text-sm font-semibold text-gray-800">Have you completed any technical internships?</label>
              <div className="flex gap-3">
                <button
                  onClick={() => { setError(null); setHasInternship(true); }}
                  className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                    hasInternship === true ? "bg-indigo-50 text-indigo-700 border-indigo-200 ring-1 ring-indigo-600" : "bg-white text-gray-600 border-gray-200"
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => { setError(null); setHasInternship(false); }}
                  className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                    hasInternship === false ? "bg-indigo-50 text-indigo-700 border-indigo-200 ring-1 ring-indigo-600" : "bg-white text-gray-600 border-gray-200"
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <label className="block text-sm font-semibold text-gray-800">What is your immediate learning priority?</label>
              <select
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white shadow-sm cursor-pointer text-gray-900"
                value={learningGoal}
                onChange={(e) => { setError(null); setLearningGoal(e.target.value); }}
              >
                <option value="" disabled>Select your focus...</option>
                <option value="Building projects from scratch for muscle memory">Building projects from scratch for muscle memory</option>
                <option value="Grinding algorithmic problem-solving">Mastering algorithmic problem-solving</option>
                <option value="Learning system architecture and design">Learning system architecture and design</option>
                <option value="Preparing for job interviews">Preparing for job interviews</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-800">College / University</label>
                <input
                  type="text"
                  placeholder="e.g., Stanford University"
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-900 shadow-sm"
                  value={college}
                  onChange={(e) => handleAlphabeticalInput(e.target.value, setCollege)}
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-800">Branch / Major of Study</label>
                <input
                  type="text"
                  placeholder="e.g., Computer Science"
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-900 shadow-sm"
                  value={branch}
                  onChange={(e) => handleAlphabeticalInput(e.target.value, setBranch)}
                />
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <label className="block text-sm font-semibold text-gray-800">Year of Study</label>
              <select
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white shadow-sm cursor-pointer text-gray-900"
                value={yearOfStudy}
                onChange={(e) => { setError(null); setYearOfStudy(e.target.value); }}
              >
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="Graduate">Graduate / Post-Graduate</option>
              </select>
            </div>
          </div>
        )}

        {/* --- Shared Validation Alert Banner --- */}
        {error && (
          <div className="mt-8 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 flex items-center gap-2 animate-in fade-in duration-300">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* --- Navigation Controls --- */}
        <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-100">
          <button
            onClick={() => { setError(null); setStep((s) => Math.max(1, s - 1)); }}
            disabled={step === 1 || isSubmitting}
            className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
              step === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Back
          </button>

          {step < 3 ? (
            <button
              onClick={handleContinue}
              disabled={isSubmitting}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={submitAssessment}
              disabled={isSubmitting}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-md shadow-indigo-500/20"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Crunching Data...
                </>
              ) : (
                "Finish Assessment"
              )}
            </button>
          )}
        </div>

      </div>
    </AssessmentLayout>
  );
}