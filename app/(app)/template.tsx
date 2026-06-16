"use client";

import { motion } from "framer-motion";

export default function AppTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="flex flex-1 flex-col w-full"
    >
      {children}
    </motion.div>
  );
}
