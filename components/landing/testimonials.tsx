"use client";

import { motion, Variants } from "framer-motion";

const testimonials = [
  {
    name: "Vaghamsi Chintan",
    role: "B.Tech Student, IIT Jodhpur",
    initials: "VC",
    quote:
      "Skilect helped me realize I was wasting time on random DSA sheets. After following its adaptive roadmap, my problem-solving speed doubled and I cracked my dream placement in just 3 months.",
  },
  {
    name: "Pansuriya Krish",
    role: "B.Tech Student, SVNIT",
    initials: "PK",
    quote:
      "I did 5 mock interviews on Skilect and discovered my system design answers were too shallow. The AI feedback was brutally honest — exactly what I needed to level up before the real thing.",
  },
  {
    name: "Kaneriya Jay",
    role: "B.Tech Student, Nirma University",
    initials: "KJ",
    quote:
      "Finally stopped studying blindly after seeing my readiness score at 34%. Skilect showed me exactly which gaps to close, and within weeks I was placement-ready with real confidence.",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  },
};

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-[#f8f9fc] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-sm font-medium text-gray-500 mb-3"
          >
            Real feedback from students using Skilect
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            Proven Results
          </motion.h2>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto"
        >
          {testimonials.map(({ name, role, quote, initials }) => (
            <motion.div
              key={name}
              variants={itemVariants}
              className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between transition-all duration-300 hover:border-gray-300 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
            >
              {/* Quote icon */}
              <div>
                <div className="mb-5">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-blue-600">
                    <path d="M10 8H6C4.9 8 4 8.9 4 10V14C4 15.1 4.9 16 6 16H8L6 20H8.5L10.5 16H10C10 16 11 16 11 15V9C11 8.45 10.55 8 10 8ZM10 14H6V10H10V14ZM20 8H16C14.9 8 14 8.9 14 10V14C14 15.1 14.9 16 16 16H18L16 20H18.5L20.5 16H20C20 16 21 16 21 15V9C21 8.45 20.55 8 20 8ZM20 14H16V10H20V14Z" fill="currentColor"/>
                  </svg>
                </div>
                
                <p className="text-[14.5px] leading-relaxed text-gray-600">
                  {quote}
                </p>
              </div>
              
              <div className="mt-8 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white tracking-wide">
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{name}</p>
                  <p className="text-xs text-gray-500">{role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

