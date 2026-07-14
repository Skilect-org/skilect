"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Target, 
  Archive, 
  Trash2, 
  Compass, 
  Layers, 
  Calendar, 
  ArrowRight, 
  Loader2 
} from "lucide-react";

export default function RoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState<any>(null);
  const [activeNode, setActiveNode] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  // Sync state cleanly without triggering infinite rendering loops or overwriting fresh data
  useEffect(() => {
    if (selectedRoadmap) {
      const updatedRoadmap = roadmaps.find((r: any) => r.id === selectedRoadmap.id);
      if (updatedRoadmap) {
        if (JSON.stringify(updatedRoadmap) !== JSON.stringify(selectedRoadmap)) {
          setSelectedRoadmap(updatedRoadmap);
        }
        if (activeNode) {
          const updatedNode = updatedRoadmap.skill_nodes?.find((n: any) => n.id === activeNode.id);
          if (updatedNode && JSON.stringify(updatedNode) !== JSON.stringify(activeNode)) {
            setActiveNode(updatedNode);
          }
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

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); 
    if (!confirm("Are you sure you want to delete this roadmap and all its tracked tasks?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/roadmaps/${id}`, { method: "DELETE" });
      if (res.ok) {
        setRoadmaps((prev) => prev.filter((rm) => rm.id !== id));
        if (selectedRoadmap?.id === id) {
          setSelectedRoadmap(null);
          setActiveNode(null);
        }
      } else {
        alert("Failed to delete the roadmap. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting roadmap:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleTask = async (nodeId: string, taskId: string, currentStatus: boolean) => {
    if (!selectedRoadmap) return;

    const isActionUncheck = currentStatus === true;
    
    const currentNodes = [...(selectedRoadmap.skill_nodes || [])].sort(
      (a: any, b: any) => (a.step_index || 0) - (b.step_index || 0)
    );
    
    const targetIndex = currentNodes.findIndex((n: any) => n.id === nodeId);

    const updatedNodes = currentNodes.map((n: any, index: number) => {
      const tasks = typeof n.tasks === 'string' ? JSON.parse(n.tasks) : n.tasks;

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

    const isRoadmapComplete = updatedNodes.every((n: any) => n.status === "completed");
    const nextIsActive = !isRoadmapComplete;

    const updatedRoadmap = { 
      ...selectedRoadmap, 
      skill_nodes: updatedNodes,
      is_active: nextIsActive 
    };

    setSelectedRoadmap(updatedRoadmap);
    setRoadmaps(prev => prev.map(r => r.id === selectedRoadmap.id ? updatedRoadmap : r));

    try {
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
    } catch (err) {
      console.error("Failed to save progress", err);
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
      
      // ⚡ The Fix: Synchronize with a clean database fetch immediately after generation
      const freshRes = await fetch("/api/roadmaps");
      if (freshRes.ok) {
        const freshData = await freshRes.json();
        const freshList = freshData.roadmaps || [];
        
        setRoadmaps(freshList);
        
        // Find the populated roadmap directly from the fresh layout array
        const targetRoadmap = freshList.find((r: any) => r.id === data.roadmap?.id) || data.roadmap;
        setSelectedRoadmap(targetRoadmap);
      } else {
        // Fallback layout insertion if server sync fails
        setRoadmaps((prev) => [data.roadmap, ...prev]);
        setSelectedRoadmap(data.roadmap);
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate roadmap.");
    } finally {
      setLoading(false);
    }
  };

  const activeRoadmaps = roadmaps.filter((r) => r && r.is_active !== false);
  const completedRoadmaps = roadmaps.filter((r) => r && r.is_active === false);

  if (!selectedRoadmap) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col p-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Your Development Paths</h1>
            <p className="mt-1 text-slate-500">Manage your active professional tracks or build adaptive custom paths.</p>
          </div>
          <button
            onClick={generateDemoRoadmap}
            disabled={loading}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-indigo-700 active:scale-95 disabled:opacity-50"
          >
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</> : "Create New AI Roadmap"}
          </button>
        </div>

        {error && <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">{error}</div>}

        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-indigo-600">
          <Target size={18} /> Active Roadmaps
        </h2>
        
        {activeRoadmaps.length === 0 ? (
          <div className="mb-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
            <div className="rounded-full bg-indigo-50 p-3 text-indigo-600">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-gray-900">No active paths found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your primary career readiness track.</p>
          </div>
        ) : (
          <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activeRoadmaps.map((roadmap: any) => {
              const nodes = roadmap.skill_nodes || [];
              const totalNodes = nodes.length;
              const completedNodes = nodes.filter((n: any) => n.status === "completed").length;
              const percentage = totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;

              return (
                <div
                  key={roadmap.id}
                  onClick={() => setSelectedRoadmap(roadmap)}
                  className="group relative flex cursor-pointer flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600 transition-colors group-hover:bg-indigo-100">
                        <Layers className="h-5 w-5" />
                      </div>
                      
                      <button
                        onClick={(e) => handleDelete(e, roadmap.id)}
                        disabled={deletingId === roadmap.id}
                        className="cursor-pointer rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        title="Delete Roadmap"
                      >
                        {deletingId === roadmap.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </button>
                    </div>

                    <div className="mt-4">
                      <h3 className="line-clamp-1 font-bold text-gray-900 transition-colors group-hover:text-indigo-600">
                        {roadmap.title}
                      </h3>
                      <p className="mt-1 text-xs font-medium uppercase tracking-wider text-gray-400">
                        {roadmap.target_role || "Engineering Track"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
                      <span className="font-medium text-gray-700">{percentage}% Completed</span>
                      <span>{totalNodes} Milestones</span>
                    </div>
                    
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> Active Track
                      </span>
                      <span className="inline-flex items-center gap-1 font-medium text-indigo-600 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                        View Path <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {completedRoadmaps.length > 0 && (
          <>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-400">
              <Archive size={18} /> Completed
            </h2>
            <div className="grid grid-cols-1 gap-6 opacity-60 md:grid-cols-2 lg:grid-cols-3">
              {completedRoadmaps.map((r) => (
                <div key={r.id} onClick={() => setSelectedRoadmap(r)} className="cursor-pointer rounded-2xl border bg-gray-50 p-6">
                  <h3 className="font-bold text-gray-600">{r.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">Target Role: {r.target_role}</p>
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
      <div className="flex-1 overflow-y-auto p-8">
        <button
          onClick={() => { setSelectedRoadmap(null); setActiveNode(null); }}
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:text-gray-900 hover:shadow active:scale-[0.97]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to Dashboard
        </button>
        <h2 className="mb-2 text-3xl font-bold text-slate-900">{selectedRoadmap.title}</h2>
        <p className="mb-12 max-w-2xl text-slate-500">{selectedRoadmap.description}</p>
        
        <div className="flex flex-col items-center gap-8 py-12">
          {nodes.map((node: any, index: number) => {
            const isLocked = nodes.slice(0, index).some((n) => n.status !== "completed");
            const tasks = Array.isArray(node.tasks) ? node.tasks : JSON.parse(node.tasks || "[]");
            const completedCount = tasks.filter((t: any) => t.completed).length;

            return (
              <div key={node.id} className={`w-full max-w-md transition-all duration-500 ${isLocked ? "opacity-40 grayscale blur-[1px]" : "opacity-100"}`}>
                {index > 0 && <div className="mx-auto my-2 h-8 w-0.5 bg-slate-300" />}
                <div 
                  onClick={() => !isLocked && setActiveNode(node)}
                  className={`border-2 bg-white p-6 rounded-2xl shadow-sm ${!isLocked ? "cursor-pointer hover:border-indigo-400" : "cursor-not-allowed"} ${node.status === "completed" ? "border-emerald-500" : "border-slate-100"}`}
                >
                  <h4 className="text-lg font-bold text-slate-900">{node.name}</h4>
                  <p className="mt-1 text-sm text-slate-500">{completedCount}/{tasks.length} tasks completed</p>
                  {isLocked && <p className="mt-1 text-xs font-medium text-red-500">Locked</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {activeNode && (
        <div className="w-96 overflow-y-auto border-l bg-white p-6 shadow-xl">
          <button onClick={() => setActiveNode(null)} className="mb-4 text-xs font-bold uppercase text-slate-400 hover:text-slate-600">Close Panel</button>
          <h3 className="mb-4 text-xl font-bold text-slate-900">{activeNode.name}</h3>
          <div className="space-y-3">
             {(Array.isArray(activeNode.tasks) ? activeNode.tasks : JSON.parse(activeNode.tasks || "[]")).map((task: any) => (
                <label key={task.id} className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-slate-50">
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