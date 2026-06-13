"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Zap } from "lucide-react";

export function SkillRadar() {
  const data = [
    { subject: "DSA", A: 85, fullMark: 100 },
    { subject: "Frontend", A: 90, fullMark: 100 },
    { subject: "Backend", A: 75, fullMark: 100 },
    { subject: "Database", A: 65, fullMark: 100 },
    { subject: "Communication", A: 80, fullMark: 100 },
    { subject: "System Design", A: 60, fullMark: 100 },
  ];

  return (
    <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm min-h-[350px]">
      <div className="flex items-center gap-2 mb-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
          <Zap size={16} className="text-indigo-600" />
        </div>
        <h3 className="text-[15px] font-semibold text-gray-900">Skill Proficiency</h3>
      </div>
      
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#f3f4f6" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 500 }} 
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ color: '#4f46e5', fontWeight: 'bold' }}
            />
            <Radar
              name="Proficiency"
              dataKey="A"
              stroke="#4f46e5"
              fill="#4f46e5"
              fillOpacity={0.2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
