"use client";

import { motion, Variants } from "framer-motion";
import { BookOpen, Users, Sparkles, Rocket } from "lucide-react";

const stats = [
  { 
    value: "500+", 
    label: "Curated", 
    subLabel: "Questions",
    icon: BookOpen,
  },
  { 
    value: "50+", 
    label: "Interview", 
    subLabel: "Experiences",
    icon: Users,
  },
  { 
    value: "24/7", 
    label: "AI", 
    subLabel: "Guidance",
    icon: Sparkles,
  },
  { 
    value: "6", 
    label: "Placement", 
    subLabel: "Modules",
    icon: Rocket,
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  },
};

export default function Stats() {
  return (
    <section className="bg-[#f8f9fc] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Built for students who want results
          </h2>
        </div>

        <motion.div 
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                className="group flex flex-col items-center text-center p-10 bg-white border border-gray-200 rounded-xl transition-all duration-300 hover:border-gray-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
              >
                <div className="mb-6 text-gray-400 transition-colors duration-300 group-hover:text-gray-900">
                  <Icon className="h-6 w-6" strokeWidth={1.25} />
                </div>
                
                <span className="text-lg font-bold text-gray-900 mb-1 mt-4">
                  {stat.value}
                </span>
                
                <div className="flex flex-col gap-1">
                  <span className="text-[14px] leading-relaxed text-gray-500">
                    {stat.label} {stat.subLabel}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
