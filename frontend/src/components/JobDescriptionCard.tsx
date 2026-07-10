"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, AlertCircle, Send } from "lucide-react";

interface JobDescriptionCardProps {
  jobDescription: string;
  setJobDescription: (val: string) => void;
  onAnalyze: () => void;
  isComparing: boolean;
  hasResume: boolean;
}

export default function JobDescriptionCard({
  jobDescription,
  setJobDescription,
  onAnalyze,
  isComparing,
  hasResume,
}: JobDescriptionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="soft-card p-6"
    >
      <h2 className="text-base font-extrabold text-slate-800 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-[#A294B2]" />
        Job Description Matcher
      </h2>

      {/* Helper Warning */}
      <AnimatePresence mode="wait">
        {!hasResume && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-4 p-3.5 bg-[#FFF0EB] border border-[#FBD5CC] rounded-xl flex items-start gap-2.5 text-[#B97262] text-xs leading-normal font-semibold animate-shake"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-[#EFA694] mt-0.5" />
            <div>
              Please upload your resume above to unlock the comparative ATS analysis tool.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          disabled={isComparing || !hasResume}
          placeholder={
            hasResume
              ? "Paste the target job description details here..."
              : "First upload a resume to unlock job description analysis."
          }
          className={`w-full h-36 px-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-4 focus:ring-[#A294B2]/10 focus:border-[#A294B2] transition-all resize-none ${
            !hasResume
              ? "bg-[#FAF8F5] border-[#EDE9E3] text-[#A79E94] cursor-not-allowed"
              : "border-[#EDE9E3] text-[#2C3539] placeholder:text-[#A79E94] bg-[#FAF8F5]"
          }`}
        />
      </div>

      {/* Button */}
      <button
        onClick={onAnalyze}
        disabled={isComparing || !hasResume || !jobDescription.trim()}
        className={`w-full mt-3 py-3 px-4 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border ${
          isComparing
            ? "bg-[#FAF8F5] text-slate-400 border-[#EDE9E3] cursor-not-allowed"
            : !hasResume || !jobDescription.trim()
            ? "bg-[#FAF8F5] border-[#EDE9E3] text-slate-300 cursor-not-allowed"
            : "bg-gradient-to-r from-[#A294B2] to-[#92A18F] hover:from-[#9587A5] hover:to-[#849381] border-transparent text-white shadow-sm active:scale-[0.98]"
        }`}
      >
        {isComparing ? (
          <>
            <div className="w-4 h-4 border-2 border-slate-300 border-t-[#A294B2] rounded-full animate-spin" />
            Analyzing Match...
          </>
        ) : (
          <>
            <Send className="w-3.5 h-3.5" />
            Analyze ATS Match
          </>
        )}
      </button>
    </motion.div>
  );
}
