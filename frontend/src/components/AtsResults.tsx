"use client";

import React from "react";
import { motion } from "framer-motion";
import { BarChart3, CheckCircle, AlertOctagon, Lightbulb, TrendingUp } from "lucide-react";

interface AtsResultsProps {
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  recommendations: string[];
}

export default function AtsResults({
  matchScore,
  matchingSkills,
  missingSkills,
  recommendations,
}: AtsResultsProps) {
  // SVG progress ring configuration
  const radius = 60;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (matchScore / 100) * circumference;

  let strokeColor = "stroke-[#A294B2]"; // Lavender
  let textColor = "text-[#7B6E8B]";
  let bgColor = "bg-[#F0ECF4] border-[#E2DBE8]";
  let statusText = "Good Alignment";
  let assessment = "Good core alignment. Try adding the missing keywords to improve indexing.";

  if (matchScore >= 85) {
    strokeColor = "stroke-[#92A18F]"; // Sage
    textColor = "text-[#6A7868]";
    bgColor = "bg-[#EBF1EA] border-[#D6E2D4]";
    statusText = "Excellent Match";
    assessment = "Excellent match! Your profile aligns closely with the job requirements.";
  } else if (matchScore >= 60) {
    strokeColor = "stroke-[#A294B2]";
    textColor = "text-[#7B6E8B]";
    bgColor = "bg-[#F0ECF4] border-[#E2DBE8]";
    statusText = "Standard Match";
    assessment = "Average match. Add missing keywords to clear the ATS screen filters.";
  } else {
    strokeColor = "stroke-[#D1A2B0]"; // Rose
    textColor = "text-[#9E6F7E]";
    bgColor = "bg-[#F9EFF2] border-[#F1D4DC]";
    statusText = "Low Alignment";
    assessment = "High skill gap. Tailor your resume summary and projects around the missing keywords.";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 pt-8 border-t border-[#EDE9E3] flex flex-col gap-6"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#EDE9E3] flex items-center justify-center text-[#A294B2] shadow-sm">
          <BarChart3 className="w-4 h-4" />
        </div>
        <h2 className="text-base font-extrabold text-slate-800">Job-Specific ATS Match</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ATS Match Score Radial Progress */}
        <motion.div
          whileHover={{ y: -1 }}
          className="soft-card p-6 flex flex-col items-center justify-center text-center"
        >
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-4 w-full text-left">
            Match Percentage
          </span>
          <div className="relative flex items-center justify-center mb-4">
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
                transition={{ duration: 0.8, delay: 0.2 }}
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
              <span className="text-2xl font-extrabold text-slate-800">{matchScore}%</span>
            </div>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase border tracking-wider mb-3 ${bgColor} ${textColor}`}>
            {statusText}
          </span>
          <p className="text-xs text-slate-500 leading-relaxed max-w-[200px] font-medium">
            {assessment}
          </p>
        </motion.div>

        {/* Matches & Missing Skills */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Matching Keywords */}
          <motion.div
            whileHover={{ y: -1 }}
            className="soft-card p-6 flex flex-col h-full"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Matching Keywords
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-[#EBF1EA] text-[#6A7868] border border-[#D6E2D4]">
                {matchingSkills.length}
              </span>
            </div>
            {matchingSkills.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-4 text-center border border-dashed border-[#EDE9E3] rounded-xl bg-[#FAF8F5] min-h-[100px]">
                <p className="text-xs text-slate-400 font-medium">No matching skills identified.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 content-start overflow-y-auto max-h-[140px] pr-1">
                {matchingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#D6E2D4] bg-[#EBF1EA] text-[#556353] text-xs font-semibold hover:bg-[#DFE7DE] transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-[#6A7868]" />
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          {/* Missing Keywords */}
          <motion.div
            whileHover={{ y: -1 }}
            className="soft-card p-6 flex flex-col h-full"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Missing Keywords
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-[#FFF0EB] text-[#B97262] border border-[#FBD5CC]">
                {missingSkills.length}
              </span>
            </div>
            {missingSkills.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-4 text-center border border-dashed border-[#EDE9E3] rounded-xl bg-[#FAF8F5] min-h-[100px]">
                <p className="text-xs text-slate-400 font-medium">No missing keywords! Perfect match.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 content-start overflow-y-auto max-h-[140px] pr-1">
                {missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#FBD5CC] bg-[#FFF0EB] text-[#B97262] text-xs font-semibold hover:bg-[#FCE6E0] transition-colors"
                  >
                    <AlertOctagon className="w-3.5 h-3.5 text-[#B97262]" />
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Recommendations */}
      <motion.div
        whileHover={{ y: -1 }}
        className="soft-card p-6 w-full"
      >
        <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-[#EFA694]" />
          Role-Specific Suggestions
        </h3>
        {recommendations.length === 0 ? (
          <p className="text-xs text-slate-400 font-medium">No custom suggestions needed.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-[#FAF8F5] border border-[#EDE9E3] rounded-xl">
                <div className="w-5 h-5 rounded-md bg-[#F0ECF4] text-[#7B6E8B] border border-[#E2DBE8] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{rec}</p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
