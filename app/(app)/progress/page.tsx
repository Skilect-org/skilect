import { ReadinessHero } from "./components/readiness-hero";
import { StatsCards } from "./components/stats-cards";
import { SkillRadar } from "./components/skill-radar";
import { ConsistencyGraph } from "./components/consistency-graph";
import { AIInsights } from "./components/ai-insights";
import { JourneyTimeline } from "./components/journey-timeline";
import { Achievements } from "./components/achievements";

export default function ProgressPage() {
  return (
    <div className="flex flex-1 flex-col w-full h-full px-5 py-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Career Progress</h1>
        <p className="mt-1 text-[14px] text-gray-500">
          Track your placement readiness, consistency, and skill improvements.
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Left/Main Column */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <ReadinessHero />
          <StatsCards />
          
          <div className="grid gap-6 sm:grid-cols-2">
            <SkillRadar />
            <AIInsights />
          </div>

          <ConsistencyGraph />
          <Achievements />
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col gap-6">
          <JourneyTimeline />
        </div>
      </div>
    </div>
  );
}
