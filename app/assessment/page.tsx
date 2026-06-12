"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AssessmentLayout,
  ProgressBar,
  QuestionCard,
  NavigationButtons,
} from "@/components/assessment";

/* ------------------------------------------------------------------ */
/*  Static Data                                                        */
/* ------------------------------------------------------------------ */

const STEPS = [
  { label: "Basic Info" },
  { label: "Career Goal" },
  { label: "Skills" },
  { label: "Experience" },
  { label: "Review" },
];

const STEP_TITLES = [
  "Tell us about yourself",
  "What's your career goal?",
  "What skills do you have?",
  "What's your experience level?",
  "Review your responses",
];

const STEP_DESCRIPTIONS = [
  "We need some basic information to personalize your learning path.",
  "Choose the career path you're most interested in — we'll tailor your roadmap around it.",
  "Select all the technologies and tools you're currently familiar with.",
  "Help us understand where you are in your journey so we calibrate the right difficulty.",
  "Double-check everything looks good before we generate your AI-powered analysis.",
];

const YEAR_OPTIONS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate"];

const CAREER_GOALS = [
  {
    id: "frontend",
    label: "Frontend Developer",
    emoji: "🎨",
    description: "Build beautiful, responsive interfaces",
    bg: "bg-pink-50",
    border: "border-pink-200",
  },
  {
    id: "backend",
    label: "Backend Developer",
    emoji: "⚙️",
    description: "Design scalable APIs & server logic",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  {
    id: "fullstack",
    label: "Full Stack Developer",
    emoji: "🔗",
    description: "End-to-end web development",
    bg: "bg-violet-50",
    border: "border-violet-200",
  },
  {
    id: "data-science",
    label: "Data Scientist",
    emoji: "📊",
    description: "Analyze data & uncover insights",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  {
    id: "ml-ai",
    label: "ML / AI Engineer",
    emoji: "🤖",
    description: "Build intelligent systems & models",
    bg: "bg-cyan-50",
    border: "border-cyan-200",
  },
  {
    id: "devops",
    label: "DevOps Engineer",
    emoji: "🚀",
    description: "Automate & scale infrastructure",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  {
    id: "mobile",
    label: "Mobile Developer",
    emoji: "📱",
    description: "Build native iOS & Android apps",
    bg: "bg-sky-50",
    border: "border-sky-200",
  },
  {
    id: "cybersecurity",
    label: "Cybersecurity Analyst",
    emoji: "🔒",
    description: "Protect systems & data from threats",
    bg: "bg-red-50",
    border: "border-red-200",
  },
];

const SKILL_CATEGORIES = [
  {
    name: "Programming Languages",
    skills: [
      "Python",
      "JavaScript",
      "TypeScript",
      "Java",
      "C++",
      "C",
      "Go",
      "Rust",
      "Ruby",
      "PHP",
      "Kotlin",
      "Swift",
    ],
  },
  {
    name: "Frontend",
    skills: [
      "React",
      "Next.js",
      "Vue.js",
      "Angular",
      "HTML / CSS",
      "Tailwind CSS",
      "Svelte",
    ],
  },
  {
    name: "Backend",
    skills: [
      "Node.js",
      "Express",
      "Django",
      "Flask",
      "Spring Boot",
      "FastAPI",
      "Ruby on Rails",
      ".NET",
    ],
  },
  {
    name: "Database & Cloud",
    skills: [
      "MySQL",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Firebase",
      "AWS",
      "GCP",
      "Azure",
      "Docker",
      "Kubernetes",
    ],
  },
  {
    name: "Other",
    skills: [
      "Git",
      "Linux",
      "REST APIs",
      "GraphQL",
      "CI/CD",
      "TensorFlow",
      "PyTorch",
      "Figma",
    ],
  },
];

const EXPERIENCE_LEVELS = [
  {
    id: "beginner",
    label: "Beginner",
    emoji: "🌱",
    description: "Just starting out — learning the fundamentals",
    bg: "bg-emerald-50",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    emoji: "🌿",
    description: "Built a few projects — comfortable with basics",
    bg: "bg-blue-50",
  },
  {
    id: "advanced",
    label: "Advanced",
    emoji: "🌳",
    description: "Strong portfolio & deep understanding",
    bg: "bg-violet-50",
  },
];

const PROJECT_COUNTS = ["0 – 2", "3 – 5", "6 – 10", "10+"];

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface AssessmentData {
  fullName: string;
  email: string;
  college: string;
  branch: string;
  yearOfStudy: string;
  targetRole: string;
  skills: string[];
  experienceLevel: string;
  projectCount: string;
  hasInternship: string;
}

const INITIAL_DATA: AssessmentData = {
  fullName: "",
  email: "",
  college: "",
  branch: "",
  yearOfStudy: "",
  targetRole: "",
  skills: [],
  experienceLevel: "",
  projectCount: "",
  hasInternship: "",
};

/* ------------------------------------------------------------------ */
/*  Input styles (shared)                                              */
/* ------------------------------------------------------------------ */

const inputClass =
  "w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function AssessmentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<AssessmentData>(INITIAL_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  /* helpers */

  const updateField = <K extends keyof AssessmentData>(
    key: K,
    value: AssessmentData[K]
  ) => {
    setData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const toggleSkill = (skill: string) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
    if (errors.skills) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.skills;
        return next;
      });
    }
  };

  /* validation */

  const validateStep = (): boolean => {
    const e: Record<string, string> = {};

    switch (currentStep) {
      case 0:
        if (!data.fullName.trim()) e.fullName = "Name is required";
        if (!data.email.trim()) e.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(data.email))
          e.email = "Enter a valid email address";
        if (!data.college.trim()) e.college = "College is required";
        if (!data.branch.trim()) e.branch = "Branch is required";
        if (!data.yearOfStudy) e.yearOfStudy = "Select your year of study";
        break;
      case 1:
        if (!data.targetRole) e.targetRole = "Select a career goal";
        break;
      case 2:
        if (data.skills.length === 0)
          e.skills = "Select at least one skill";
        break;
      case 3:
        if (!data.experienceLevel)
          e.experienceLevel = "Select your experience level";
        if (!data.projectCount)
          e.projectCount = "Select your project count";
        if (!data.hasInternship) e.hasInternship = "Answer this question";
        break;
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 0:
        return !!(
          data.fullName.trim() &&
          data.email.trim() &&
          data.college.trim() &&
          data.branch.trim() &&
          data.yearOfStudy
        );
      case 1:
        return !!data.targetRole;
      case 2:
        return data.skills.length > 0;
      case 3:
        return !!(
          data.experienceLevel &&
          data.projectCount &&
          data.hasInternship
        );
      case 4:
        return true;
      default:
        return false;
    }
  };

  /* nav */

  const handleNext = () => {
    if (currentStep === STEPS.length - 1) {
      handleSubmit();
      return;
    }
    if (validateStep()) {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    setCurrentStep((s) => Math.max(s - 1, 0));
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const jumpToStep = (step: number) => {
    setCurrentStep(step);
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* submit */

  const handleSubmit = () => {
    console.log("Assessment submitted:", data);
    setIsSubmitted(true);
    // Show the "analyzing" screen briefly, then navigate to results
    setTimeout(() => {
      router.push("/assessment/results");
    }, 2000);
  };

  /* ---------------------------------------------------------------- */
  /*  Submitted confirmation screen                                    */
  /* ---------------------------------------------------------------- */

  if (isSubmitted) {
    return (
      <AssessmentLayout>
        <div className="assessment-step-enter flex flex-col items-center justify-center py-20 text-center">
          {/* Animated checkmark circle */}
          <div className="relative mb-8">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="absolute -inset-3 rounded-full bg-blue-400/20 animate-ping" />
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Assessment Complete!
          </h2>
          <p className="mt-3 text-base text-gray-500 max-w-md">
            We&apos;re analyzing your profile with AI to generate a personalized
            roadmap. This usually takes a few seconds.
          </p>

          {/* Loading indicator */}
          <div className="mt-8 flex items-center gap-2 text-sm font-medium text-blue-600">
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Generating your personalized analysis…
          </div>
        </div>
      </AssessmentLayout>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Step Content Renderers                                           */
  /* ---------------------------------------------------------------- */

  const renderBasicInfo = () => (
    <div className="space-y-5">
      {/* Name + Email */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className={labelClass}>
            Full Name <span className="text-red-400">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            value={data.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            placeholder="John Doe"
            className={`${inputClass} ${errors.fullName ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : ""}`}
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email <span className="text-red-400">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="john@example.com"
            className={`${inputClass} ${errors.email ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : ""}`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>
      </div>

      {/* College + Branch */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="college" className={labelClass}>
            College / University <span className="text-red-400">*</span>
          </label>
          <input
            id="college"
            type="text"
            value={data.college}
            onChange={(e) => updateField("college", e.target.value)}
            placeholder="e.g. MIT, Stanford"
            className={`${inputClass} ${errors.college ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : ""}`}
          />
          {errors.college && (
            <p className="mt-1 text-xs text-red-500">{errors.college}</p>
          )}
        </div>
        <div>
          <label htmlFor="branch" className={labelClass}>
            Branch / Major <span className="text-red-400">*</span>
          </label>
          <input
            id="branch"
            type="text"
            value={data.branch}
            onChange={(e) => updateField("branch", e.target.value)}
            placeholder="e.g. Computer Science"
            className={`${inputClass} ${errors.branch ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : ""}`}
          />
          {errors.branch && (
            <p className="mt-1 text-xs text-red-500">{errors.branch}</p>
          )}
        </div>
      </div>

      {/* Year of Study */}
      <div>
        <label className={labelClass}>
          Year of Study <span className="text-red-400">*</span>
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-1">
          {YEAR_OPTIONS.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => updateField("yearOfStudy", year)}
              className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                data.yearOfStudy === year
                  ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
        {errors.yearOfStudy && (
          <p className="mt-1.5 text-xs text-red-500">{errors.yearOfStudy}</p>
        )}
      </div>
    </div>
  );

  const renderCareerGoal = () => (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CAREER_GOALS.map((goal) => {
          const isSelected = data.targetRole === goal.id;
          return (
            <button
              key={goal.id}
              type="button"
              onClick={() => updateField("targetRole", goal.id)}
              className={`group relative flex items-start gap-4 rounded-2xl border p-5 text-left transition-all ${
                isSelected
                  ? "border-blue-500 bg-blue-50/60 shadow-sm ring-1 ring-blue-500/20"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              {/* Emoji container */}
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl transition-transform group-hover:scale-105 ${
                  isSelected ? "bg-blue-100" : goal.bg
                }`}
              >
                {goal.emoji}
              </div>

              <div className="min-w-0">
                <p
                  className={`text-sm font-semibold ${
                    isSelected ? "text-blue-700" : "text-gray-900"
                  }`}
                >
                  {goal.label}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {goal.description}
                </p>
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
      {errors.targetRole && (
        <p className="mt-3 text-xs text-red-500">{errors.targetRole}</p>
      )}
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-6">
      {SKILL_CATEGORIES.map((category) => (
        <div key={category.name}>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            {category.name}
          </h3>
          <div className="flex flex-wrap gap-2">
            {category.skills.map((skill) => {
              const isSelected = data.skills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                  }`}
                >
                  {isSelected && (
                    <span className="mr-1.5">✓</span>
                  )}
                  {skill}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Selected count */}
      {data.skills.length > 0 && (
        <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700">
          <svg
            className="w-4 h-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-medium">{data.skills.length}</span> skill
          {data.skills.length !== 1 ? "s" : ""} selected
        </div>
      )}

      {errors.skills && (
        <p className="text-xs text-red-500">{errors.skills}</p>
      )}
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-8">
      {/* Experience Level */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Overall Experience Level
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {EXPERIENCE_LEVELS.map((level) => {
            const isSelected = data.experienceLevel === level.id;
            return (
              <button
                key={level.id}
                type="button"
                onClick={() => updateField("experienceLevel", level.id)}
                className={`group flex flex-col items-center gap-2 rounded-2xl border p-5 text-center transition-all ${
                  isSelected
                    ? "border-blue-500 bg-blue-50/60 shadow-sm ring-1 ring-blue-500/20"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                <span className="text-2xl transition-transform group-hover:scale-110">
                  {level.emoji}
                </span>
                <p
                  className={`text-sm font-semibold ${
                    isSelected ? "text-blue-700" : "text-gray-900"
                  }`}
                >
                  {level.label}
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {level.description}
                </p>
              </button>
            );
          })}
        </div>
        {errors.experienceLevel && (
          <p className="mt-1.5 text-xs text-red-500">
            {errors.experienceLevel}
          </p>
        )}
      </div>

      {/* Project count */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          How many projects have you built?
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PROJECT_COUNTS.map((count) => {
            const isSelected = data.projectCount === count;
            return (
              <button
                key={count}
                type="button"
                onClick={() => updateField("projectCount", count)}
                className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {count} projects
              </button>
            );
          })}
        </div>
        {errors.projectCount && (
          <p className="mt-1.5 text-xs text-red-500">{errors.projectCount}</p>
        )}
      </div>

      {/* Internship */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Do you have any internship experience?
        </h3>
        <div className="grid grid-cols-2 gap-3 max-w-xs">
          {["Yes", "No"].map((option) => {
            const isSelected = data.hasInternship === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => updateField("hasInternship", option)}
                className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {option === "Yes" ? "✓ " : "✗ "}
                {option}
              </button>
            );
          })}
        </div>
        {errors.hasInternship && (
          <p className="mt-1.5 text-xs text-red-500">{errors.hasInternship}</p>
        )}
      </div>
    </div>
  );

  const renderReview = () => {
    const selectedGoal = CAREER_GOALS.find((g) => g.id === data.targetRole);
    const selectedLevel = EXPERIENCE_LEVELS.find(
      (l) => l.id === data.experienceLevel
    );

    return (
      <div className="space-y-5">
        {/* Basic Info */}
        <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 text-xs font-bold text-blue-600">
                1
              </span>
              Basic Information
            </h3>
            <button
              type="button"
              onClick={() => jumpToStep(0)}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Edit
            </button>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div>
              <span className="text-gray-400">Name</span>
              <p className="font-medium text-gray-900">{data.fullName}</p>
            </div>
            <div>
              <span className="text-gray-400">Email</span>
              <p className="font-medium text-gray-900">{data.email}</p>
            </div>
            <div>
              <span className="text-gray-400">College</span>
              <p className="font-medium text-gray-900">{data.college}</p>
            </div>
            <div>
              <span className="text-gray-400">Branch</span>
              <p className="font-medium text-gray-900">{data.branch}</p>
            </div>
            <div>
              <span className="text-gray-400">Year</span>
              <p className="font-medium text-gray-900">{data.yearOfStudy}</p>
            </div>
          </div>
        </div>

        {/* Career Goal */}
        <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 text-xs font-bold text-blue-600">
                2
              </span>
              Career Goal
            </h3>
            <button
              type="button"
              onClick={() => jumpToStep(1)}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Edit
            </button>
          </div>
          {selectedGoal && (
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${selectedGoal.bg}`}
              >
                {selectedGoal.emoji}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {selectedGoal.label}
                </p>
                <p className="text-xs text-gray-500">
                  {selectedGoal.description}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Skills */}
        <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 text-xs font-bold text-blue-600">
                3
              </span>
              Current Skills
              <span className="ml-1 text-xs font-normal text-gray-400">
                ({data.skills.length})
              </span>
            </h3>
            <button
              type="button"
              onClick={() => jumpToStep(2)}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Edit
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 text-xs font-bold text-blue-600">
                4
              </span>
              Experience
            </h3>
            <button
              type="button"
              onClick={() => jumpToStep(3)}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Edit
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Level</span>
              <p className="font-medium text-gray-900 flex items-center gap-1">
                {selectedLevel?.emoji} {selectedLevel?.label}
              </p>
            </div>
            <div>
              <span className="text-gray-400">Projects</span>
              <p className="font-medium text-gray-900">{data.projectCount}</p>
            </div>
            <div>
              <span className="text-gray-400">Internship</span>
              <p className="font-medium text-gray-900">{data.hasInternship}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ---------------------------------------------------------------- */
  /*  Step router                                                      */
  /* ---------------------------------------------------------------- */

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderBasicInfo();
      case 1:
        return renderCareerGoal();
      case 2:
        return renderSkills();
      case 3:
        return renderExperience();
      case 4:
        return renderReview();
      default:
        return null;
    }
  };

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <AssessmentLayout>
      <ProgressBar steps={STEPS} currentStep={currentStep} />

      <div key={currentStep}>
        <QuestionCard
          stepNumber={currentStep + 1}
          totalSteps={STEPS.length}
          title={STEP_TITLES[currentStep]}
          description={STEP_DESCRIPTIONS[currentStep]}
        >
          {renderStepContent()}

          <NavigationButtons
            onPrevious={handlePrevious}
            onNext={handleNext}
            isFirstStep={currentStep === 0}
            isLastStep={currentStep === STEPS.length - 1}
            canProceed={canProceed()}
          />
        </QuestionCard>
      </div>

      {/* Bottom spacer */}
      <div className="h-12" />
    </AssessmentLayout>
  );
}
