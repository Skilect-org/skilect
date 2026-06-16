"use client";

import { motion, Variants } from "framer-motion";

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

export default function Features() {
  return (
    <section id="features" className="bg-[#f8f9fc] py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            Enterprise-Grade Preparation Tools
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-gray-500"
          >
            Everything you need to level up, built into one cohesive, distraction-free environment.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 lg:grid-cols-3"
        >
          {/* Top Row: Two wide/tall cards */}
          <motion.div variants={itemVariants} className="lg:col-span-2 rounded-xl border border-gray-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col relative group transition-all duration-300 hover:border-gray-300 hover:shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
            <div className="p-8 pb-0 z-10 bg-gradient-to-b from-white via-white to-transparent">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-gray-900 mb-6 group-hover:border-blue-600 group-hover:text-blue-600 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Dynamic AI Roadmaps</h3>
              <p className="text-sm text-gray-500 max-w-md leading-relaxed">
                Stop guessing what to study. Skilect generates adaptive curriculum paths that evolve as you improve, ensuring every concept is solid before you move on.
              </p>
            </div>
            {/* Minimal SVG abstraction instead of messy divs */}
            <div className="mt-8 relative h-[250px] w-full bg-gray-50 border-t border-gray-100 flex items-end justify-end overflow-hidden p-8">
              <div className="relative w-full max-w-[400px] h-[180px] bg-white rounded-t-xl border-t border-x border-gray-200 shadow-sm p-6 transform translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500">
                <div className="flex gap-2 mb-6">
                  <div className="h-2 w-12 bg-blue-600 rounded-full" />
                  <div className="h-2 w-8 bg-gray-200 rounded-full" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-16 rounded-lg border border-gray-100 bg-gray-50" />
                  <div className="h-16 rounded-lg border border-gray-100 bg-gray-50" />
                  <div className="h-16 rounded-lg border border-gray-100 bg-gray-50" />
                  <div className="h-16 rounded-lg border border-gray-100 bg-gray-50" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="rounded-xl border border-gray-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col group transition-all duration-300 hover:border-gray-300 hover:shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
            <div className="p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-gray-900 mb-6 group-hover:border-blue-600 group-hover:text-blue-600 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Task Management</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Break down monumental goals into actionable daily tasks integrated directly with your workflow.
              </p>
            </div>
            <div className="mt-auto px-8 pb-0 h-[220px]">
              <div className="w-full h-full bg-gray-50 rounded-t-xl border-x border-t border-gray-200 p-6 transform translate-y-4 group-hover:translate-y-2 transition-transform duration-500">
                 <div className="flex flex-col gap-4">
                   <div className="h-2 w-1/3 bg-gray-300 rounded-full" />
                   <div className="h-10 w-full bg-white border border-gray-200 rounded-lg shadow-sm" />
                   <div className="h-10 w-full bg-white border border-gray-200 rounded-lg shadow-sm" />
                 </div>
              </div>
            </div>
          </motion.div>

          {/* Bottom Row: Three equal cards */}
          <motion.div variants={itemVariants} className="rounded-xl border border-gray-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col group transition-all duration-300 hover:border-gray-300 hover:shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
            <div className="p-8 pb-0 z-10 bg-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-gray-900 mb-6 group-hover:border-blue-600 group-hover:text-blue-600 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Resume Parsing</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Instantly score your resume against target job descriptions to ensure you pass the initial screen.
              </p>
            </div>
            {/* Mobile Mockup */}
            <div className="mt-8 h-[200px] w-full bg-gray-50 flex justify-center items-end overflow-hidden pt-8 border-t border-gray-100">
              <div className="relative w-[160px] h-[200px] bg-white rounded-t-2xl border-x-4 border-t-4 border-gray-900 overflow-hidden shadow-sm transform translate-y-4 group-hover:translate-y-2 transition-transform duration-500">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-4 bg-gray-900 rounded-b-xl z-10" />
                 <div className="w-full h-full p-4 pt-8 bg-gray-50">
                   <div className="w-full h-20 bg-blue-50 border border-blue-100 rounded-lg mb-4 flex items-center justify-center text-blue-400 text-xs font-semibold tracking-widest uppercase">ATS</div>
                   <div className="w-3/4 h-1.5 bg-gray-300 rounded-full mb-3" />
                   <div className="w-full h-1 bg-gray-200 rounded-full mb-2" />
                   <div className="w-5/6 h-1 bg-gray-200 rounded-full mb-2" />
                 </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="rounded-xl border border-gray-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col group transition-all duration-300 hover:border-gray-300 hover:shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
             <div className="p-8 pb-0 z-10 bg-white">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-gray-900 mb-6 group-hover:border-blue-600 group-hover:text-blue-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">AI Mock Interviews</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Practice behavioral and technical rounds with our specialized AI persona, complete with instant feedback.
                </p>
             </div>
             {/* Abstract Video Call UI */}
             <div className="mt-8 h-[200px] w-full bg-gray-50 flex justify-center items-end overflow-hidden pt-8 border-t border-gray-100 px-6">
                <div className="relative w-full h-[180px] bg-white rounded-t-xl border-x border-t border-gray-200 shadow-sm p-4 transform translate-y-4 group-hover:translate-y-2 transition-transform duration-500">
                  <div className="flex gap-4 h-full">
                     <div className="flex-1 bg-gray-100 rounded-lg h-full overflow-hidden relative">
                        {/* Placeholder for AI Face */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center backdrop-blur-sm shadow-sm">
                            <div className="w-8 h-8 bg-blue-100 rounded-full" />
                          </div>
                        </div>
                     </div>
                     <div className="w-1/3 flex flex-col gap-3">
                        <div className="flex-1 bg-blue-50 rounded-lg border border-blue-100 relative overflow-hidden">
                           {/* User mini feed */}
                           <div className="absolute bottom-2 right-2 w-4 h-4 bg-white/60 rounded-full" />
                        </div>
                        <div className="h-10 bg-gray-100 rounded-lg flex items-center justify-center gap-2">
                           <div className="w-3 h-3 rounded-full bg-gray-300" />
                           <div className="w-3 h-3 rounded-full bg-gray-300" />
                           <div className="w-3 h-3 rounded-full bg-red-400" />
                        </div>
                     </div>
                  </div>
                </div>
             </div>
          </motion.div>

          <motion.div variants={itemVariants} className="rounded-xl border border-gray-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col group transition-all duration-300 hover:border-gray-300 hover:shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
             <div className="p-8 pb-0 z-10 bg-white">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-gray-900 mb-6 group-hover:border-blue-600 group-hover:text-blue-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Granular Analytics</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Track your proficiency across hundreds of micro-skills. Know exactly where you stand before applying.
                </p>
             </div>
             {/* Abstract Charts UI */}
             <div className="mt-8 h-[200px] w-full bg-gray-50 flex justify-center items-end overflow-hidden pt-8 border-t border-gray-100 px-6">
                <div className="relative w-full h-[180px] bg-white rounded-t-xl border-x border-t border-gray-200 shadow-sm p-5 transform translate-y-4 group-hover:translate-y-2 transition-transform duration-500 flex flex-col justify-end gap-3">
                   {/* Bar chart placeholder */}
                   <div className="flex items-end justify-between h-20 w-full px-2">
                     <div className="w-6 bg-gray-100 rounded-t-sm h-[40%] group-hover:bg-blue-100 transition-colors delay-75" />
                     <div className="w-6 bg-blue-100 rounded-t-sm h-[70%] group-hover:bg-blue-200 transition-colors delay-100" />
                     <div className="w-6 bg-gray-100 rounded-t-sm h-[30%] group-hover:bg-gray-200 transition-colors delay-150" />
                     <div className="w-6 bg-blue-600 rounded-t-sm h-[90%] shadow-sm" />
                     <div className="w-6 bg-gray-100 rounded-t-sm h-[50%] group-hover:bg-gray-200 transition-colors delay-200" />
                     <div className="w-6 bg-blue-200 rounded-t-sm h-[80%] group-hover:bg-blue-300 transition-colors delay-300" />
                   </div>
                   <div className="w-full h-[1px] bg-gray-100 mb-1" />
                   <div className="w-full h-8 bg-gray-50 rounded-md border border-gray-100 flex items-center justify-between px-3">
                      <div className="w-12 h-2 bg-gray-200 rounded-full" />
                      <div className="flex gap-1">
                         <div className="w-1 h-1 bg-gray-300 rounded-full" />
                         <div className="w-1 h-1 bg-gray-300 rounded-full" />
                         <div className="w-1 h-1 bg-gray-300 rounded-full" />
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
