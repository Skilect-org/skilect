"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex min-h-screen flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6">
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <img 
            src="/logo/brand-logo.png" 
            alt="Skilect Logo" 
            className="h-20 w-auto object-contain drop-shadow-sm" 
          />
        </motion.div>
        
        {/* Fading text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-[13px] font-semibold tracking-widest text-gray-400 uppercase"
        >
          Loading
        </motion.p>
      </div>
    </div>
  );
}
