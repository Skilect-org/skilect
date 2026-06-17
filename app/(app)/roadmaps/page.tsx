"use client";

import { useState } from "react";
import { RoadmapCard, RoadmapTimeline } from "@/components/roadmaps";
import { Sparkles, Plus } from "lucide-react";

interface RoadmapNode {
  id: string;
  name: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  estimatedDays: number;
  resources: { title: string; url: string; type: string }[];
}

interface Roadmap {
  id: string;
  title: string;
  description: string;
  estimatedWeeks: number;
  nodes: RoadmapNode[];
}

const ROLES = [
  "Frontend Developer", "Backend Developer", "Full Stack Developer",
  "AI Engineer", "Data Scientist", "DevOps Engineer", "Software Engineer",
];

const COMMON_SKILL_GAPS: Record<string, string[]> = {
  "Frontend Developer": ["React Hooks", "TypeScript", "CSS Grid", "Accessibility", "Performance Optimization"],
  "Backend Developer": ["System Design", "SQL Optimization", "REST API Design", "Security", "Docker"],
  "Full Stack Developer": ["React", "Node.js", "Databases", "API Integration", "TypeScript"],
  "AI Engineer": ["PyTorch", "LLMs", "Vector Databases", "Prompt Engineering", "MLOps"],
  "Data Scientist": ["Statistics", "Pandas", "Machine Learning", "Data Visualization", "SQL"],
  "DevOps Engineer": ["Kubernetes", "CI/CD", "Terraform", "Monitoring", "Linux"],
  "Software Engineer": ["Data Structures", "System Design", "Algorithms", "Clean Code", "Testing"],
};

export default function RoadmapsPage() {
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [error, setError] = useState("");
  const [targetRole, setTargetRole] = useState("Full Stack Developer");
  const [customGaps, setCustomGaps] = useState("");
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setRoadmap(null);
    setCompletedSteps(new Set());

    const skillGaps = customGaps.trim()
      ? customGaps.split(",").map((s) => s.trim()).filter(Boolean)
      : COMMON_SKILL_GAPS[targetRole] ?? ["Problem Solving", "Communication", "System Design"];

    try {
      const res = await fetch("/api/roadmaps/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole, skillGaps }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Generation failed");
      }
      const data = await res.json();
      setRoadmap(data.roadmap);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate roadmap");
    } finally {
      setLoading(false);
    }
  };

  const toggleStep = (nodeId: string) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  };

  return (
    <main className="flex flex-1 flex-col gap-6 px-5 py-4 lg:px-8 lg:py-6 max-w-5xl mx-auto w-full">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Roadmaps</h1>
        <p className="mt-1 text-[13px] text-gray-500">AI-generated learning roadmaps tailored to your skill gaps.</p>
      </div>

      {/* Generator card */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <h2 className="text-[15px] font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles size={16} className="text-blue-500" /> Generate New Roadmap
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-gray-500">Target Role</label>
            <select value={targetRole} onChange={(e) => setTargetRole(e.target.value)}
              className="h-10 rounded-lg border border-gray-200 bg-gray-50/50 px-3.5 text-[13px] text-gray-900 focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100">
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-gray-500">
              Custom Skill Gaps <span className="font-normal">(optional, comma-separated)</span>
            </label>
            <input type="text" placeholder="e.g., React Hooks, TypeScript, Docker"
              value={customGaps} onChange={(e) => setCustomGaps(e.target.value)}
              className="h-10 rounded-lg border border-gray-200 bg-gray-50/50 px-3.5 text-[13px] text-gray-900 placeholder:text-gray-400 focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100" />
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3">
            <p className="text-[12px] text-red-600">{error}</p>
          </div>
        )}

        <button onClick={handleGenerate} disabled={loading}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 disabled:opacity-50">
          {loading ? <><Sparkles size={15} className="animate-pulse" /> Generating via Gemini...</> : <><Plus size={15} /> Generate Roadmap</>}
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="space-y-4 animate-pulse">
          <div className="h-28 rounded-2xl bg-gray-100" />
          <div className="h-96 rounded-2xl bg-gray-100" />
        </div>
      )}

      {/* Roadmap result */}
      {roadmap && !loading && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <RoadmapCard
            title={roadmap.title}
            description={roadmap.description}
            progress={roadmap.nodes.length > 0 ? Math.round((completedSteps.size / roadmap.nodes.length) * 100) : 0}
            totalSteps={roadmap.nodes.length}
            completedSteps={completedSteps.size}
          />

          <div className="rounded-xl border border-gray-100 bg-white p-6" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[15px] font-semibold text-gray-900">Your Learning Path</h3>
              <span className="text-[12px] text-gray-400">Est. {roadmap.estimatedWeeks} weeks</span>
            </div>

            <RoadmapTimeline
              steps={roadmap.nodes.map((node, index) => ({
                id: node.id,
                title: node.name,
                description: node.description,
                status: completedSteps.has(node.id)
                  ? "completed"
                  : index === [...completedSteps].length
                  ? "in-progress"
                  : "upcoming",
              }))}
            />

            {/* Resources per node */}
            <div className="mt-8 space-y-4">
              <h4 className="text-[14px] font-semibold text-gray-900">Resources</h4>
              {roadmap.nodes.map((node) => (
                <div key={node.id} className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[13px] font-semibold text-gray-900">{node.name}</p>
                    <button onClick={() => toggleStep(node.id)}
                      className={`rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${completedSteps.has(node.id) ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                      {completedSteps.has(node.id) ? "✓ Done" : "Mark Done"}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {node.resources.map((r, i) => (
                      <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-medium text-blue-600 transition-colors hover:bg-blue-50 hover:border-blue-200">
                        {r.title}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
