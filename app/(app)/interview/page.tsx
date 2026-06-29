"use client";

import { useState } from "react";
import { InterviewSetup } from "./components/interview-setup";
import { InterviewSession } from "./components/interview-session";
import { InterviewResults } from "./components/interview-results";
import { InterviewPhase, SetupData } from "./types";
import { useInterview } from "@/hooks/use-interview";

export default function InterviewPage() {
  const [phase, setPhase] = useState<InterviewPhase>("setup");
  const [setupData, setSetupData] = useState<SetupData>({
    type: null,
    role: "Frontend Developer",
    difficulty: "Intermediate",
    jobDescription: "",
  });

  const { results, aggregateScore, reset } = useInterview();

  const handleStart = (data: SetupData) => {
    setSetupData(data);
    setPhase("session");
  };

  const handleEnd = () => {
    setPhase("results");
  };

  const handleRetake = () => {
    reset();
    setPhase("setup");
  };

  return (
    <div className="flex flex-1 flex-col px-5 py-4 lg:px-8 lg:py-6">
      {phase === "setup" && <InterviewSetup onStart={handleStart} />}
      {phase === "session" && (
        <InterviewSession setupData={setupData} onEnd={handleEnd} />
      )}
      {phase === "results" && (
        <InterviewResults
          onRetake={handleRetake}
          results={results}
          aggregateScore={aggregateScore}
        />
      )}
    </div>
  );
}
