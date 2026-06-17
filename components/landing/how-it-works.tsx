"use client";

import { motion, Variants } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Take Assessment",
    description:
      "Complete a comprehensive benchmark test to identify your current technical and behavioral baseline.",
  },
  {
    number: "02",
    title: "Get AI Analysis",
    description:
      "Our engine pinpoints exact skill gaps and compares your profile against target role requirements.",
  },
  {
    number: "03",
    title: "Follow Roadmap",
    description:
      "Execute a dynamically generated, day-by-day learning and practice plan tailored to you.",
  },
  {
    number: "04",
    title: "Crack Placements",
    description:
      "Walk into interviews with quantified confidence and secure offers from top-tier tech companies.",
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
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  },
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#f8f9fc] py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            Your Path to Placement
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-gray-500"
          >
            A systematic, data-driven approach to mastering the skills top employers demand.
          </motion.p>
        </div>

        {/* Steps Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 relative"
        >
          {/* Subtle connecting line behind steps (desktop only) */}
          <div className="hidden lg:block absolute top-6 left-[10%] right-[10%] h-px bg-gray-200" />
          
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              variants={itemVariants}
              className="relative group rounded-xl border border-gray-200 bg-white p-8 transition-all duration-300 hover:border-blue-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
            >
              {/* Number Badge */}
              <div className="relative z-10 mx-auto lg:mx-0 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-sm font-semibold tracking-widest text-gray-900 transition-colors duration-300 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white mb-8">
                {step.number}
              </div>

              {/* Title */}
              <h3 className="text-center lg:text-left text-lg font-bold text-gray-900 mb-3">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-center lg:text-left text-[14px] leading-relaxed text-gray-500">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}