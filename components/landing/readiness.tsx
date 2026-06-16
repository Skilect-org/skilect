"use client";

import { motion, useMotionValue, useTransform, animate, useInView, Variants } from "framer-motion";
import { useEffect, useRef } from "react";
import { CheckCircle2, Zap } from "lucide-react";

const textContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const textItemVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  },
};

export default function Readiness() {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, 85, { duration: 1.2, ease: "easeOut" });
      return controls.stop;
    }
  }, [isInView, count]);

  return (
    <section id="readiness" className="bg-[#f8f9fc] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-16 lg:grid-cols-2 items-center">
          
          {/* Left: Circular Progress */}
          <div className="order-2 lg:order-1 flex justify-center" ref={ref}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, margin: "-50px" }}
              className="relative h-64 w-64 md:h-[340px] md:w-[340px] rounded-[2.5rem] bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-gray-50 flex items-center justify-center transition-transform hover:scale-[1.02] duration-500 group"
            >
              
              {/* SVG Ring */}
              <div className="relative h-44 w-44 md:h-60 md:w-60 flex items-center justify-center">
                <svg className="absolute inset-0 h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                  {/* Background track */}
                  <circle
                    className="text-gray-50 stroke-current"
                    strokeWidth="6"
                    cx="50"
                    cy="50"
                    r="42"
                    fill="transparent"
                  />
                  {/* Progress arc (85%) */}
                  <motion.circle
                    className="text-blue-600 stroke-current"
                    strokeWidth="6"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="42"
                    fill="transparent"
                    strokeDasharray="263.89"
                    initial={{ strokeDashoffset: 263.89 }}
                    animate={isInView ? { strokeDashoffset: 39.58 } : { strokeDashoffset: 263.89 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                </svg>
                {/* Center text */}
                <div className="relative z-10 flex flex-col items-center justify-center pt-2">
                  <span className="text-3xl md:text-5xl font-light tracking-tighter text-[#1a202c] leading-none mb-3">
                    <motion.span className="tabular-nums">{rounded}</motion.span><span className="text-blue-600">%</span>
                  </span>
                  <span className="text-[11px] font-bold tracking-[0.15em] text-gray-400 uppercase">Readiness Score</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Content */}
          <motion.div 
            variants={textContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="order-1 lg:order-2 space-y-10 lg:pl-10"
          >
            <motion.div variants={textItemVariants}>
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50/50 border border-blue-100/50 px-4 py-2 text-xs font-semibold tracking-wide text-blue-600 mb-6">
                <Zap className="w-3.5 h-3.5 fill-blue-600" />
                The Skilect Standard
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Know Exactly When You&apos;re <span className="text-blue-600">Ready to Apply.</span>
              </h2>
            </motion.div>
            
            <motion.p variants={textItemVariants} className="text-lg text-gray-500">
              The Skilect Readiness Score aggregates data from your assessments, task completion, and mock interviews to provide a single, actionable metric. Stop relying on feeling ready, and start relying on hard data.
            </motion.p>

            <motion.ul variants={textItemVariants} className="space-y-5">
              {[
                "Benchmarked against thousands of successful candidates.",
                "Role-specific scoring (SDE, Data Analyst, Product Manager).",
                "Predicts likelihood of interview success accurately."
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm text-blue-600">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span className="text-[15px] text-gray-600 font-medium">{item}</span>
                </li>
              ))}
            </motion.ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
