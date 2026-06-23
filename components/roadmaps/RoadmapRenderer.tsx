"use client";
import { motion } from "framer-motion";

// 1. Define the shape of your data
interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface Node {
  id: string;
  name: string;
  description: string;
  status: string;
  tasks: Task[];
}

interface RoadmapRendererProps {
  nodes: Node[];
}

export const RoadmapRenderer = ({ nodes }: RoadmapRendererProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-10">
      {nodes.map((node, index) => {
        // 2. Logic: The first node is always open. Subsequent nodes open if previous one is completed.
        const isUnlocked = index === 0 || nodes[index - 1].status === 'completed';
        
        return (
          <motion.div
            key={node.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-6 border rounded-xl shadow-lg transition-all duration-500
              ${!isUnlocked ? "blur-sm grayscale pointer-events-none" : "blur-none"}`}
          >
            <h3 className="font-bold text-lg">{node.name}</h3>
            <p className="text-sm text-gray-600">{node.description}</p>
            
            <ul className="mt-4 space-y-2">
              {(node.tasks || []).map((task, i) => (
                <li key={i} className="text-xs flex items-center gap-2">
                  <input type="checkbox" checked={task.completed} readOnly />
                  {task.title}
                </li>
              ))}
            </ul>
          </motion.div>
        );
      })}
    </div>
  );
};