import { motion } from "framer-motion";

// 1. Define strict types to eliminate the 'any' type TS errors
export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'completed';
  tasks: Task[];
  created_at?: string; 
}

// 2. Type the props explicitly
export const RoadmapRenderer = ({ nodes = [] }: { nodes: SkillNode[] }) => {
  
  // 3. Sort nodes by creation time to ensure the locking index logic works
  const sortedNodes = [...nodes].sort((a, b) => {
    return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-10">
      {sortedNodes.map((node, index) => {
        // Now index 0 is guaranteed to be the actual first node
        const isUnlocked = index === 0 || sortedNodes[index - 1].status === 'completed';

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
              {/* Type the task mapping to clear the final TS errors */}
              {(node.tasks || []).map((task: Task, i: number) => (
                <li key={task.id || i} className="text-xs flex items-center gap-2">
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