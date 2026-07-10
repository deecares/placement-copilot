"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, FileText, Sparkles, Heart } from "lucide-react";

interface ScoreCardProps {
  score: number;
  resumeLength?: number;
  quality?: string;
  formattingScore?: number;
  atsFriendliness?: number;
  sectionsPresent?: string[];
}

export default function ScoreCard({
  score,
  resumeLength,
  quality = "Good",
  formattingScore = 75,
  atsFriendliness = 80,
  sectionsPresent = ["Skills", "Experience", "Education"],
}: ScoreCardProps) {
  // SVG circular progress settings
  const radius = 60;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Determine colors based on score (Pastel Sage, Lavender, Peach, Rose)
  let strokeColor = "stroke-[#A294B2]"; // Lavender
  let textColor = "text-[#A294B2]";
  let bgColor = "bg-[#F0ECF4] border-[#E2DBE8]";
  
  if (score >= 85) {
    strokeColor = "stroke-[#92A18F]"; // Sage
    textColor = "text-[#6A7868]";
    bgColor = "bg-[#EBF1EA] border-[#D6E2D4]";
  } else if (score >= 70) {
    strokeColor = "stroke-[#A294B2]"; // Lavender
    textColor = "text-[#7B6E8B]";
    bgColor = "bg-[#F0ECF4] border-[#E2DBE8]";
  } else if (score >= 50) {
    strokeColor = "stroke-[#EFA694]"; // Peach
    textColor = "text-[#B97262]";
    bgColor = "bg-[#FFF0EB] border-[#FBD5CC]";
  } else {
    strokeColor = "stroke-[#D1A2B0]"; // Rose
    textColor = "text-[#9E6F7E]";
    bgColor = "bg-[#F9EFF2] border-[#F1D4DC]";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="soft-card p-6 flex flex-col justify-between h-full"
    >
      <div>
        <div className="flex justify-between items-center mb-6">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-[#D1A2B0]" />
            Resume Health Report
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider uppercase border ${bgColor} ${textColor}`}>
            {quality} Score
          </span>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
          {/* Radial Progress Ring */}
          <div className="relative flex items-center justify-center">
            <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
              <circle
                className="text-[#F3EFEA]"
                stroke="currentColor"
                fill="transparent"
                strokeWidth={strokeWidth}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <motion.circle
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`transition-all duration-300 ${strokeColor}`}
                stroke="currentColor"
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference + " " + circumference}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-slate-800 tracking-tight">{score}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Score</span>
            </div>
          </div>

          <div className="flex-1 space-y-3 w-full">
            {/* Formatting Score */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-655 mb-1">
                <span>Formatting & Design</span>
                <span className="text-slate-700 font-extrabold">{formattingScore}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#F3EFEA] rounded-full overflow-hidden border border-[#EDE9E3]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${formattingScore}%` }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="h-full bg-gradient-to-r from-[#A294B2] to-[#92A18F] rounded-full"
                />
              </div>
            </div>

            {/* ATS Friendliness */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-655 mb-1">
                <span>ATS Compatiblity</span>
                <span className="text-slate-700 font-extrabold">{atsFriendliness}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#F3EFEA] rounded-full overflow-hidden border border-[#EDE9E3]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${atsFriendliness}%` }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="h-full bg-gradient-to-r from-[#A294B2] to-[#EFA694] rounded-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Present Sections checklist */}
        <div className="mt-4 pt-4 border-t border-[#EDE9E3]">
          <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-2.5">
            Key Blocks Verified
          </p>
          <div className="flex flex-wrap gap-2">
            {sectionsPresent.map((sec, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF8F5] border border-[#EDE9E3] rounded-lg text-xs font-semibold text-slate-600 shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#92A18F]" />
                {sec}
              </span>
            ))}
          </div>
        </div>
      </div>

      {resumeLength !== undefined && resumeLength > 0 && (
        <div className="mt-6 pt-4 border-t border-[#EDE9E3] text-[10px] text-slate-450 flex justify-between items-center font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1 text-slate-400">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            Profile Length
          </span>
          <span className="text-slate-600">{resumeLength.toLocaleString()} chars</span>
        </div>
      )}
    </motion.div>
  );
}
