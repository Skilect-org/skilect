"use client";

import { useState, useEffect, useCallback } from "react";
import { Sparkles, Target, Archive } from "lucide-react";

export default function RoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState<any>(null);
  const [activeNode, setActiveNode] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadRoadmaps = useCallback(async () => {
    try {
      const res = await fetch("/api/roadmaps");
      if (res.ok) {
        const data = await res.json();
        setRoadmaps(data.roadmaps || []);
      }
    } catch (err) {
      console.error("Failed to fetch roadmaps", err);
    }
  }, []);

  useEffect(() => {
    if (selectedRoadmap) {
      const updatedRoadmap = roadmaps.find((r: any) => r.id === selectedRoadmap.id);
      if (updatedRoadmap) {
        setSelectedRoadmap(updatedRoadmap);
        if (activeNode) {
          const updatedNode = updatedRoadmap.skill_nodes?.find((n: any) => n.id === activeNode.id);
          setActiveNode(updatedNode || null);
        }
      } else {
        setSelectedRoadmap(null);
        setActiveNode(null);
      }
    }
  }, [roadmaps, selectedRoadmap?.id, activeNode?.id]);

  useEffect(() => {
    loadRoadmaps();
  }, [loadRoadmaps]);

const handleToggleTask = async (nodeId: string, taskId: string, currentStatus: boolean) => {
  if (!selectedRoadmap) return;

  const isActionUncheck = currentStatus === true;
  
  // 1. Sort nodes by step_index to ensure accurate cascading
  const currentNodes = [...(selectedRoadmap.skill_nodes || [])].sort(
    (a: any, b: any) => (a.step_index || 0) - (b.step_index || 0)
  );
  
  const targetIndex = currentNodes.findIndex((n: any) => n.id === nodeId);

  // 2. Calculate the new state for all nodes
  const updatedNodes = currentNodes.map((n: any, index: number) => {
    const tasks = typeof n.tasks === 'string' ? JSON.parse(n.tasks) : n.tasks;

    // CASE A: The node being toggled
    if (index === targetIndex) {
      const updatedTasks = tasks.map((t: any) => 
        t.id === taskId ? { ...t, completed: !currentStatus } : t
      );
      const isNodeComplete = updatedTasks.every((t: any) => t.completed);
      
      return { 
        ...n, 
        tasks: updatedTasks, 
        status: isNodeComplete ? "completed" : "in_progress" 
      };
    }

    // CASE B: Reset all future nodes if we are unchecking
    if (isActionUncheck && index > targetIndex) {
      const resetTasks = tasks.map((t: any) => ({ ...t, completed: false }));
      return { 
        ...n, 
        tasks: resetTasks, 
        status: "in_progress" 
      };
    }

    return n;
  });

  // 3. Determine global roadmap state
  const isRoadmapComplete = updatedNodes.every((n: any) => n.status === "completed");
  const nextIsActive = !isRoadmapComplete;

  const updatedRoadmap = { 
    ...selectedRoadmap, 
    skill_nodes: updatedNodes,
    is_active: nextIsActive 
  };

  // --- OPTIMISTIC UI UPDATES (Makes it instant) ---
  setSelectedRoadmap(updatedRoadmap);
  setRoadmaps(prev => prev.map(r => r.id === selectedRoadmap.id ? updatedRoadmap : r));

  try {
    // 4. API Call to persist changes silently in the background
    await fetch("/api/roadmaps/nodes/updates", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roadmapId: selectedRoadmap.id,
        isActive: nextIsActive,
        allNodes: updatedNodes.map((n: any) => ({
          id: n.id,
          status: n.status,
          tasks: typeof n.tasks === 'string' ? n.tasks : JSON.stringify(n.tasks)
        }))
      }),
    });

    // CRITICAL FIX: We removed `await loadRoadmaps();` from here.
    // The UI stays settled using our clean local state update.

  } catch (err) {
    console.error("Failed to save progress", err);
    // ONLY re-fetch if something breaks, acting as our safety net
    loadRoadmaps(); 
    alert("Could not save progress. Please check your connection.");
  }
};

  const generateDemoRoadmap = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/roadmaps/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const data = await response.json();
      setRoadmaps((prev) => [data.roadmap, ...prev]);
      setSelectedRoadmap(data.roadmap);
    } catch (err: any) {
      setError(err.message || "Failed to generate roadmap.");
    } finally {
      setLoading(false);
    }
  };

  const activeRoadmaps = roadmaps.filter((r) => r.is_active !== false);
  const completedRoadmaps = roadmaps.filter((r) => r.is_active === false);

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

        <h2 className="flex items-center gap-2 text-lg font-semibold mb-4 text-indigo-600">
          <Target size={18} /> Active Roadmaps
        </h2>
        
        {activeRoadmaps.length === 0 ? (
           <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center mb-10">
              <p className="text-gray-500">No active roadmaps found.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {activeRoadmaps.map((r) => (
              <div key={r.id} onClick={() => setSelectedRoadmap(r)} className="p-6 border rounded-2xl cursor-pointer hover:border-indigo-500 bg-white shadow-sm hover:shadow-md transition-all">
                <h3 className="font-bold text-xl text-slate-900">{r.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{r.skill_nodes?.length || 0} Milestones</p>
              </div>
            ))}
          </div>
        )}

        {completedRoadmaps.length > 0 && (
          <>
            <h2 className="flex items-center gap-2 text-lg font-semibold mb-4 text-gray-400">
              <Archive size={18} /> Completed
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60">
              {completedRoadmaps.map((r) => (
                <div key={r.id} onClick={() => setSelectedRoadmap(r)} className="p-6 border rounded-2xl cursor-pointer bg-gray-50">
                  <h3 className="font-bold text-gray-600">{r.title}</h3>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    );
  }

  const nodes = [...(selectedRoadmap.skill_nodes || [])].sort((a: any, b: any) => (a.step_index || 0) - (b.step_index || 0));

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      <div className="flex-1 p-8 overflow-y-auto">
        <button onClick={() => setSelectedRoadmap(null)} className="text-sm font-medium text-indigo-600 mb-6 hover:underline">&larr; Back to Dashboard</button>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">{selectedRoadmap.title}</h2>
        <p className="text-slate-500 mb-12 max-w-2xl">{selectedRoadmap.description}</p>
        
        <div className="flex flex-col items-center gap-8 py-12">
          {nodes.map((node: any, index: number) => {
            const isLocked = nodes.slice(0, index).some((n) => n.status !== "completed");
            const tasks = Array.isArray(node.tasks) ? node.tasks : JSON.parse(node.tasks || "[]");
            const completedCount = tasks.filter((t: any) => t.completed).length;

            return (
              <div key={node.id} className={`w-full max-w-md transition-all duration-500 ${isLocked ? "opacity-40 grayscale blur-[1px]" : "opacity-100"}`}>
                {index > 0 && <div className="h-8 w-0.5 bg-slate-300 mx-auto my-2" />}
                <div 
                  onClick={() => !isLocked && setActiveNode(node)}
                  className={`p-6 bg-white border-2 rounded-2xl shadow-sm ${!isLocked ? "cursor-pointer hover:border-indigo-400" : "cursor-not-allowed"} ${node.status === "completed" ? "border-emerald-500" : "border-slate-100"}`}
                >
                  <h4 className="font-bold text-lg text-slate-900">{node.name}</h4>
                  <p className="text-sm text-slate-500 mt-1">{completedCount}/{tasks.length} tasks completed</p>
                  {isLocked && <p className="text-xs text-red-500 mt-1 font-medium">Locked</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {activeNode && (
        <div className="w-96 border-l bg-white p-6 shadow-xl overflow-y-auto">
          <button onClick={() => setActiveNode(null)} className="text-xs font-bold uppercase text-slate-400 mb-4 hover:text-slate-600">Close Panel</button>
          <h3 className="text-xl font-bold text-slate-900 mb-4">{activeNode.name}</h3>
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