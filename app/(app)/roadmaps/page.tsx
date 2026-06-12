"use client";

import { useState } from "react";
import { RoadmapCard, RoadmapTimeline } from "@/components/roadmaps";

export default function RoadmapsPage() {
  const [loading, setLoading] = useState(false);
  const [roadmapData, setRoadmapData] = useState<any>(null);
  const [error, setError] = useState("");

  // This function tests your backend API endpoint
  const generateDemoRoadmap = async () => {
    setLoading(true);
    setError("");
    setRoadmapData(null);
    
    try {
      // Calling the exact endpoint you just wrote!
      const response = await fetch("/api/roadmaps/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRole: "Full Stack Developer",
          skillGaps: ["React Hooks", "TypeScript Generics", "API Integration"]
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: Status ${response.status}`);
      }

      const data = await response.json();
      setRoadmapData(data.roadmap);
    } catch (err: any) {
      setError(err.message || "Failed to generate roadmap.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-1 flex-col p-6 max-w-4xl mx-auto w-full">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Roadmaps</h1>
          <p className="mt-2 text-foreground/60">
            AI-generated learning roadmaps tailored to your skill gaps.
          </p>
        </div>
        
        {/* Our Test Trigger Button */}
        <button
          onClick={generateDemoRoadmap}
          disabled={loading}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 transition-all"
        >
          {loading ? "Generating via Gemini..." : "Generate Demo Roadmap"}
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
      )}

      {/* Success State: Rendering Meet's Components with Your API Data */}
      {roadmapData && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Top Summary Card */}
          <RoadmapCard
            title={roadmapData.title}
            description={roadmapData.description}
            progress={0} // Starting at 0% for a brand new roadmap
            totalSteps={roadmapData.nodes.length}
            completedSteps={0}
          />

          {/* Detailed Timeline Steps */}
          <div className="rounded-xl border border-foreground/10 bg-background p-6">
            <h3 className="mb-6 text-lg font-semibold tracking-tight">Your Custom Learning Path</h3>
            <RoadmapTimeline
              // We map your backend 'nodes' array into the format Meet's timeline expects
              steps={roadmapData.nodes.map((node: any, index: number) => ({
                id: node.id,
                title: node.name,
                description: node.description,
                status: index === 0 ? "in-progress" : "upcoming" 
              }))}
            />
          </div>

        </div>
      )}
    </main>
  );
}