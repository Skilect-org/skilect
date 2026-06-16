"use client";

import { motion, Variants } from "framer-motion";

const testimonials = [
  {
    name: "Alex Chen",
    role: "Software Engineer I @ FAANG",
    initial: "A",
    quote:
      "Skilect's dynamic roadmap stripped away all the noise. I knew exactly what to study, and when, which dramatically reduced my anxiety and helped me land my dream role.",
  },
  {
    name: "Sarah Jenkins",
    role: "Data Science Manager",
    initial: "S",
    quote:
      "The readiness score was a game-changer. It told me I was weak on system design, so the platform automatically adjusted my tasks to compensate before my final loop.",
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

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-[#f8f9fc] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
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
          className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto"
        >
          {testimonials.map(({ name, role, quote, initial }) => (
            <motion.div
              key={name}
              variants={itemVariants}
              className="group rounded-xl border border-gray-200 bg-white p-10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between transition-all duration-300 hover:border-gray-300 hover:shadow-[0_4px_30px_rgba(0,0,0,0.05)] relative overflow-hidden"
            >
              {/* Subtle quote mark in background */}
              <div className="absolute top-4 right-8 text-8xl font-serif text-gray-50 opacity-50 select-none pointer-events-none group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                &rdquo;
              </div>
              
              <p className="relative z-10 text-[15px] leading-relaxed text-gray-600 font-medium tracking-wide">
                &ldquo;{quote}&rdquo;
              </p>
              
              <div className="mt-10 flex items-center gap-4 relative z-10">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 font-semibold text-gray-900 transition-colors group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white">
                  {initial}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 tracking-wide uppercase">{name}</p>
                  <p className="text-[13px] font-medium text-gray-500 tracking-wide uppercase">{role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
