"use client";

import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="relative w-full bg-[#f8f9fc] py-32 lg:py-40 overflow-hidden">
      {/* Animated Background Mesh & Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Subtle Grid overlay for light theme */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[700px] px-6 flex flex-col items-center text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          {/* Headline */}
          <h2 className="text-4xl md:text-5xl lg:text-[4rem] font-bold tracking-tight text-gray-900 leading-[1.1] mb-6">
            Ready to crack your next placement?
          </h2>
          
          {/* Subheadline */}
          <p className="text-lg md:text-xl text-gray-500 font-normal leading-relaxed mb-10 max-w-[600px]">
            Discover your skill gaps, get a personalized roadmap, improve your resume, and practice AI interviews with AI-powered guidance.
          </p>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto mb-8">
            {/* Primary CTA */}
            <a
              href="/assessment"
              className="relative inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-blue-600 px-8 py-4 text-[16px] font-semibold tracking-wide text-white transition-all hover:bg-blue-700 shadow-sm hover:shadow-md active:scale-95 group overflow-hidden"
            >
              <span className="relative z-10">Start Free Assessment</span>
            </a>
            
            {/* Secondary CTA */}
            <a
              href="#demo"
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl border border-gray-200 bg-white px-8 py-4 text-[16px] font-semibold tracking-wide text-gray-900 shadow-sm transition-all hover:bg-gray-50 hover:border-gray-300 active:scale-95"
            >
              Watch Demo
            </a>
          </div>
          
          {/* Supporting Text */}
          <p className="text-sm text-gray-500 font-medium">
            Takes less than 5 minutes
          </p>
        </motion.div>

      </div>
    </section>
  );
}
