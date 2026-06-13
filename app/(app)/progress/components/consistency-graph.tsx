"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity } from "lucide-react";

export function ConsistencyGraph() {
  const data = [
    { name: "Mon", tasks: 4, interviews: 1 },
    { name: "Tue", tasks: 7, interviews: 0 },
    { name: "Wed", tasks: 5, interviews: 2 },
    { name: "Thu", tasks: 12, interviews: 1 },
    { name: "Fri", tasks: 8, interviews: 0 },
    { name: "Sat", tasks: 15, interviews: 3 },
    { name: "Sun", tasks: 10, interviews: 1 },
  ];

  return (
    <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
          <Activity size={16} className="text-emerald-600" />
        </div>
        <div>
          <h3 className="text-[15px] font-semibold text-gray-900">Consistency Activity</h3>
          <p className="text-[12px] text-gray-500">Tasks and Interviews over the last 7 days</p>
        </div>
      </div>
      
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorInterviews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#9ca3af' }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#9ca3af' }} 
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
            />
            <Area 
              type="monotone" 
              dataKey="tasks" 
              name="Tasks Completed"
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorTasks)" 
            />
            <Area 
              type="monotone" 
              dataKey="interviews" 
              name="Mock Interviews"
              stroke="#8b5cf6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorInterviews)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
