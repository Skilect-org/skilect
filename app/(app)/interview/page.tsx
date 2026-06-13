"use client";

import { useState } from "react";
import { InterviewPhase, SetupData } from "./types";
import { InterviewSetup } from "./components/interview-setup";
import { InterviewSession } from "./components/interview-session";
import { InterviewResults } from "./components/interview-results";

export default function InterviewPage() {
  const [phase, setPhase] = useState<InterviewPhase>("setup");
  const [setupData, setSetupData] = useState<SetupData | null>(null);

  const handleStart = (data: SetupData) => {
    setSetupData(data);
    setPhase("session");
  };

  const handleEndSession = () => {
    setPhase("results");
  };

  const handleRetake = () => {
    setSetupData(null);
    setPhase("setup");
  };

  return (
    <div className="flex flex-1 flex-col w-full h-full px-5 py-6 lg:px-8 max-w-7xl mx-auto">
      {phase === "setup" && <InterviewSetup onStart={handleStart} />}
      {phase === "session" && setupData && (
        <InterviewSession setupData={setupData} onEnd={handleEndSession} />
      )}
      {phase === "results" && <InterviewResults onRetake={handleRetake} />}
    </div>
  );
}
