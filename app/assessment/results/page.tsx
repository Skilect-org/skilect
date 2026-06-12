"use client";

import Link from "next/link";
import { AssessmentLayout } from "@/components/assessment";
import { ScoreCard } from "@/components/assessment/score-card";
import { StrengthsCard } from "@/components/assessment/strengths-card";
import { GapsCard } from "@/components/assessment/gaps-card";
import { RecommendationCard } from "@/components/assessment/recommendation-card";

/* ------------------------------------------------------------------ */
/*  Mock data — replace with API response once Gemini is wired up      */
/* ------------------------------------------------------------------ */

const MOCK_RESULTS = {
  readinessScore: 82,
  scoreLabel: "Above Average — You're well-prepared with targeted practice",

  strengths: [
    {
      skill: "Java",
      level: 85,
      description:
        "Strong OOP fundamentals with hands-on Spring Boot experience",
    },
    {
      skill: "Data Structures & Algorithms",
      level: 90,
      description:
        "Excellent problem-solving skills with optimal time-complexity solutions",
    },
    {
      skill: "Problem Solving",
      level: 88,
      description:
        "Strong analytical thinking and systematic debugging approach",
    },
    {
      skill: "Git & Version Control",
      level: 80,
      description:
        "Proficient with branching strategies, merging, and team collaboration",
    },
    {
      skill: "REST APIs",
      level: 78,
      description:
        "Good understanding of RESTful design principles and HTTP methods",
    },
  ],

  gaps: [
    {
      skill: "SQL & Databases",
      priority: "high" as const,
      description:
        "Need to learn query optimization, indexing strategies, and normalized schema design",
    },
    {
      skill: "React & Frontend Frameworks",
      priority: "high" as const,
      description:
        "Limited experience with component-driven architecture and modern state management",
    },
    {
      skill: "System Design",
      priority: "medium" as const,
      description:
        "Need exposure to scalability patterns, load balancing, and distributed systems",
    },
    {
      skill: "Docker & DevOps",
      priority: "medium" as const,
      description:
        "Basic containerization, CI/CD pipelines, and cloud deployment knowledge needed",
    },
    {
      skill: "Testing & TDD",
      priority: "low" as const,
      description:
        "Should learn unit testing frameworks, integration testing, and test-driven development",
    },
  ],

  recommendation: {
    title: "Full Stack Developer",
    match: 82,
    description:
      "Based on your strong Java backend skills and excellent problem-solving ability, transitioning to full stack development would leverage your existing strengths while strategically addressing your frontend gaps. This path offers the highest ROI given your current skill profile.",
    nextSteps: [
      "Master React fundamentals — components, hooks, and state management",
      "Learn SQL deeply — joins, indexing, query optimization",
      "Study system design basics — load balancers, caching, databases at scale",
      "Build 2–3 full stack projects to connect frontend and backend skills",
      "Practice mock interviews focusing on your gap areas",
      "Learn Docker basics for containerized deployment workflows",
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function AssessmentResultsPage() {
  return (
    <AssessmentLayout>
      {/* Header */}
      <div className="text-center mb-10 results-fade-in">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700 mb-5">
          <svg
            className="w-4 h-4"
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
          Analysis Complete
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Assessment Complete! 🎉
        </h1>
        <p className="mt-3 text-base text-gray-500 max-w-md mx-auto">
          Here&apos;s your personalized AI-powered skill analysis and career
          recommendations.
        </p>
      </div>

      {/* Score Card */}
      <div className="results-fade-in" style={{ animationDelay: "100ms" }}>
        <ScoreCard
          score={MOCK_RESULTS.readinessScore}
          label={MOCK_RESULTS.scoreLabel}
        />
      </div>

      {/* Strengths + Gaps */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 results-fade-in"
        style={{ animationDelay: "250ms" }}
      >
        <StrengthsCard strengths={MOCK_RESULTS.strengths} />
        <GapsCard gaps={MOCK_RESULTS.gaps} />
      </div>

      {/* Recommendation */}
      <div
        className="mt-8 results-fade-in"
        style={{ animationDelay: "400ms" }}
      >
        <RecommendationCard
          title={MOCK_RESULTS.recommendation.title}
          match={MOCK_RESULTS.recommendation.match}
          description={MOCK_RESULTS.recommendation.description}
          nextSteps={MOCK_RESULTS.recommendation.nextSteps}
        />
      </div>

      {/* CTA */}
      <div
        className="mt-12 text-center results-fade-in"
        style={{ animationDelay: "550ms" }}
      >
        <Link
          href="/roadmaps"
          className="group inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/30 active:from-blue-800 active:to-indigo-800"
        >
          Generate My Roadmap
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </Link>
        <p className="mt-3 text-xs text-gray-400">
          We&apos;ll create a personalized learning roadmap based on your gaps
        </p>
      </div>

      {/* Bottom spacer */}
      <div className="h-16" />
    </AssessmentLayout>
  );
}
