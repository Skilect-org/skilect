"use client";

import { useState, useEffect } from "react";

export default function RoadmapsPage() {
  const [loading, setLoading] = useState(false);
  const [roadmaps, setRoadmaps] = useState<any[]>([]); // This stores your list of roadmaps
  const [selectedRoadmap, setSelectedRoadmap] = useState<any>(null); // This stores the currently open roadmap
  const [activeNode, setActiveNode] = useState<any>(null);
  const [error, setError] = useState("");

  // 1. Fetch saved roadmaps when component loads
  useEffect(() => {
    async function loadRoadmaps() {
      try {
        const res = await fetch("/api/roadmaps"); // Ensure you have this GET endpoint
        if (res.ok) {
          const data = await res.json();
          setRoadmaps(data.roadmaps || []);
        }
      } catch (err) {
        console.error("Failed to fetch roadmaps", err);
      }
    }
    loadRoadmaps();
  }, []);

  // 2. Generate a new roadmap
  const generateDemoRoadmap = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/roadmaps/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRole: "Full Stack Developer",
          skillGaps: ["React Hooks", "TypeScript Generics", "API Integration"]
        }),
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const data = await response.json();
      
      const newRoadmap = data.roadmap;
      // Add to list and select it immediately
      setRoadmaps((prev) => [newRoadmap, ...prev]);
      setSelectedRoadmap(newRoadmap);
    } catch (err: any) {
      setError(err.message || "Failed to generate roadmap.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Logic to handle task status
  const handleToggleTask = async (nodeId: string, taskId: string, currentStatus: boolean) => {
    if (!selectedRoadmap) return;

    const currentNodes = selectedRoadmap.skill_nodes || [];
    const updatedNodes = currentNodes.map((node: any) => {
      if (node.id !== nodeId) return node;

      const tasks = Array.isArray(node.tasks) ? node.tasks : JSON.parse(node.tasks || "[]");
      const mutatedTasks = tasks.map((t: any) => 
        t.id === taskId ? { ...t, completed: !currentStatus } : t
      );

      const allDone = mutatedTasks.every((t: any) => t.completed);
      
      return {
        ...node,
        tasks: mutatedTasks,
        status: allDone ? "completed" : "in_progress"
      };
    });

    const refreshedRoadmap = { ...selectedRoadmap, skill_nodes: updatedNodes };
    setSelectedRoadmap(refreshedRoadmap);
    setActiveNode(updatedNodes.find((n: any) => n.id === nodeId));
  };

  // --- VIEW A: DASHBOARD (List) ---
  if (!selectedRoadmap) {
    return (
      <main className="flex flex-1 flex-col p-8 max-w-5xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Development Path</h1>
            <p className="text-muted-foreground mt-1">Select an active roadmap or create a new one.</p>
          </div>
          <button
            onClick={generateDemoRoadmap}
            disabled={loading}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Create New AI Roadmap"}
          </button>
        </div>

        {error && <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-xl border border-red-200">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roadmaps.map((r) => (
            <div key={r.id} onClick={() => setSelectedRoadmap(r)} className="p-6 border rounded-2xl cursor-pointer hover:border-indigo-500 bg-white shadow-sm hover:shadow-md transition-all">
              <h3 className="font-bold text-xl text-slate-900">{r.title}</h3>
              <p className="text-gray-500 text-sm mt-2 line-clamp-2">{r.description}</p>
              <div className="mt-4 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                {r.skill_nodes?.length || 0} Milestones
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  // --- VIEW B: ROADMAP GRAPH ---
  const nodes = [...(selectedRoadmap.skill_nodes || [])].sort((a: any, b: any) => (a.step_index || 0) - (b.step_index || 0));

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      <div className="flex-1 p-8 overflow-y-auto">
        <button onClick={() => setSelectedRoadmap(null)} className="text-sm font-medium text-indigo-600 mb-6 hover:underline">&larr; Back to Dashboard</button>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">{selectedRoadmap.title}</h2>
        <p className="text-slate-500 mb-12 max-w-2xl">{selectedRoadmap.description}</p>
        
        <div className="flex flex-col items-center gap-8 py-12">
          {nodes.map((node: any, index: number) => {
            const isPrevCompleted = index === 0 || nodes[index - 1].status === "completed";
            const tasks = Array.isArray(node.tasks) ? node.tasks : JSON.parse(node.tasks || "[]");
            const completedCount = tasks.filter((t: any) => t.completed).length;

            return (
              <div key={node.id} className={`w-full max-w-md transition-all duration-500 ${!isPrevCompleted ? "opacity-40 grayscale blur-[1px]" : "opacity-100"}`}>
                {index > 0 && <div className="h-8 w-0.5 bg-slate-300 mx-auto my-2" />}
                
                <div 
                  onClick={() => isPrevCompleted && setActiveNode(node)}
                  className={`p-6 bg-white border-2 rounded-2xl shadow-sm ${isPrevCompleted ? "cursor-pointer hover:border-indigo-400" : "cursor-not-allowed"} ${node.status === "completed" ? "border-emerald-500" : "border-slate-100"}`}
                >
                  <h4 className="font-bold text-lg text-slate-900">{node.name}</h4>
                  <p className="text-sm text-slate-500 mt-1">{completedCount}/{tasks.length} tasks completed</p>
                  {!isPrevCompleted && <p className="text-xs text-red-500 mt-2 font-medium">🔒 Locked: Complete previous step</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sidebar for Tasks */}
      {activeNode && (
        <div className="w-96 border-l bg-white p-6 shadow-xl overflow-y-auto">
          <button onClick={() => setActiveNode(null)} className="text-xs font-bold uppercase text-slate-400 mb-4 hover:text-slate-600">Close Panel</button>
          <h3 className="text-xl font-bold text-slate-900 mb-4">{activeNode.name}</h3>
          <p className="text-slate-600 text-sm mb-6">{activeNode.description}</p>
          <div className="space-y-3">
             {(Array.isArray(activeNode.tasks) ? activeNode.tasks : JSON.parse(activeNode.tasks || "[]")).map((task: any) => (
                <label key={task.id} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" checked={task.completed} onChange={() => handleToggleTask(activeNode.id, task.id, task.completed)} />
                  <span className={task.completed ? "line-through text-slate-400" : "text-slate-700"}>{task.title}</span>
                </label>
             ))}
          </div>
        </div>
      )}
    </div>
  );
}