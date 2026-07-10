"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, AlertTriangle, HelpCircle } from "lucide-react";

interface SkillListProps {
  title: string;
  skills: string[];
  variant: "detected" | "missing";
  emptyMessage?: string;
}

export default function SkillList({
  title,
  skills,
  variant,
  emptyMessage,
}: SkillListProps) {
  const isDetected = variant === "detected";
  
  const badgeClass = isDetected
    ? "bg-[#EBF1EA] text-[#556353] border-[#D6E2D4] hover:bg-[#DFE7DE]"
    : "bg-[#FFF0EB] text-[#B97262] border-[#FBD5CC] hover:bg-[#FCE6E0]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="soft-card p-6 flex flex-col h-full"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
          {title}
        </h3>
        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black border ${isDetected ? "bg-[#EBF1EA] text-[#6A7868] border-[#D6E2D4]" : "bg-[#FFF0EB] text-[#B97262] border-[#FBD5CC]"}`}>
          {skills.length}
        </span>
      </div>

      {skills.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center border border-dashed border-[#EDE9E3] rounded-xl bg-[#FAF8F5] min-h-[120px]">
          <HelpCircle className="w-6 h-6 text-slate-300 mb-2" />
          <p className="text-xs text-slate-400 font-medium">
            {emptyMessage || (isDetected ? "No skills detected yet" : "No missing skills")}
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 flex-1 content-start">
          {skills.map((skill, index) => (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
              whileHover={{ scale: 1.03 }}
              key={skill}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-default ${badgeClass}`}
            >
              {isDetected ? (
                <Check className="w-3.5 h-3.5 text-[#6A7868] shrink-0" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-[#B97262] shrink-0" />
              )}
              {skill}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
