"use client";

import React, { useState } from "react";
import { API } from "@/lib/api";
import { motion } from "framer-motion";
import { Map, BookOpen, Clock, Compass, Bookmark, CheckSquare } from "lucide-react";

interface WeekPlan {
  week: string;
  topic: string;
  project: string;
  hours: number;
  resources: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  milestones?: string[];
}

interface LearningRoadmapProps {
  resumeSkills: string[];
  missingSkills: string[];
  inferredRole?: string;
}

export default function LearningRoadmap({
  resumeSkills,
  missingSkills,
  inferredRole,
}: LearningRoadmapProps) {
  const [targetRole, setTargetRole] = useState(inferredRole || "Full Stack Developer");
  const [isGenerating, setIsGenerating] = useState(false);
  const [weeks, setWeeks] = useState<WeekPlan[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  React.useEffect(() => {
    if (inferredRole) {
      setTargetRole(inferredRole);
    }
  }, [inferredRole]);

  const generateRoadmap = async () => {
    setIsGenerating(true);
    setErrorMessage("");
    setWeeks([]);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API}/api/generate-roadmap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          resumeSkills,
          missingSkills,
          targetRole,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate study roadmap. Status: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.weeks) {
        setWeeks(data.weeks);
      } else {
        setErrorMessage("Invalid roadmap structure received from backend.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during roadmap generation."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const getDifficultyColor = (diff: string) => {
    const d = diff.toLowerCase();
    if (d === "easy") return "bg-[#EBF1EA] text-[#6A7868] border-[#D6E2D4]";
    if (d === "medium") return "bg-[#F0ECF4] text-[#7B6E8B] border-[#E2DBE8]";
    return "bg-[#FFF0EB] text-[#B97262] border-[#FBD5CC]";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 pt-8 border-t border-[#EDE9E3] flex flex-col gap-6"
    >
      {/* Title Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#EDE9E3] flex items-center justify-center text-[#A294B2] shadow-sm">
          <Map className="w-4 h-4" />
        </div>
        <h2 className="text-base font-extrabold text-slate-800">
          Personalized Learning Roadmap
        </h2>
      </div>

      {/* Settings Selection card */}
      <div className="soft-card p-6 flex flex-col md:flex-row gap-4 items-end">
        {/* Role Selector */}
        <div className="flex-1 w-full flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            Target Career Goal
          </label>
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            disabled={isGenerating}
            placeholder="e.g. AI Engineer, Devops Architect, Game Developer..."
            className="w-full h-11 px-3 border border-[#EDE9E3] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#A294B2]/10 focus:border-[#A294B2] text-sm font-semibold text-slate-700 bg-[#FAF8F5] transition-all"
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={generateRoadmap}
          disabled={isGenerating || !targetRole.trim()}
          className={`w-full md:w-auto h-11 px-6 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border shrink-0 ${
            isGenerating || !targetRole.trim()
              ? "bg-[#FAF8F5] text-slate-400 border-[#EDE9E3] cursor-not-allowed"
              : "bg-gradient-to-r from-[#A294B2] to-[#92A18F] hover:from-[#9587A5] hover:to-[#849381] border-transparent text-white shadow-sm active:scale-[0.98]"
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-350 border-t-[#A294B2] rounded-full animate-spin" />
              Building Path...
            </>
          ) : (
            <>
              <Compass className="w-3.5 h-3.5" />
              Generate Roadmap
            </>
          )}
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 bg-[#EF4444]/5 border border-[#EF4444]/20 rounded-2xl text-[#c53030] text-xs font-semibold">
          {errorMessage}
        </div>
      )}

      {/* Timeline view */}
      {weeks.length > 0 && (
        <div className="relative border-l-2 border-[#EDE9E3] ml-4 pl-8 space-y-8 mt-4">
          {weeks.map((week, idx) => (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              key={idx}
              className="relative"
            >
              {/* Timeline dot */}
              <div className="absolute -left-[45px] top-1.5 w-8 h-8 rounded-full border-4 border-[#FAF8F5] flex items-center justify-center text-[10px] font-bold text-white shadow-sm bg-[#A294B2] ring-4 ring-[#A294B2]/10">
                {idx + 1}
              </div>

              {/* Weekly Card */}
              <div className="soft-card p-6 flex flex-col gap-4">
                {/* Header elements */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EDE9E3] pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                      {week.week}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Est Hours */}
                    <span className="text-xs font-bold text-slate-500 bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-[#EDE9E3] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {week.hours} hrs
                    </span>

                    {/* Difficulty */}
                    <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md border ${getDifficultyColor(week.difficulty)}`}>
                      {week.difficulty}
                    </span>
                  </div>
                </div>

                {/* Topic and Project details */}
                <div>
                  <h4 className="text-base font-bold text-slate-800 leading-snug">
                    {week.topic}
                  </h4>
                  <div className="mt-3 p-4 bg-[#FAF8F5] border border-[#EDE9E3] rounded-xl">
                    <h5 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                      Hands-on Mini Project
                    </h5>
                    <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                      {week.project}
                    </p>
                  </div>
                </div>

                {/* Weekly Milestones */}
                {week.milestones && week.milestones.length > 0 && (
                  <div className="flex flex-col gap-2 pt-2">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <CheckSquare className="w-3 h-3 text-[#92A18F]" />
                      Milestones
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {week.milestones.map((m, mIdx) => (
                        <div key={mIdx} className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#92A18F]" />
                          {m}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resources */}
                {week.resources && week.resources.length > 0 && (
                  <div className="flex flex-col gap-2 pt-3 border-t border-[#EDE9E3]">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-[#A294B2]" />
                      Recommended Study Material
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {week.resources.map((res, rIdx) => (
                        <span
                          key={rIdx}
                          className="px-2.5 py-1 bg-[#F0ECF4] border border-[#E2DBE8] text-[#7B6E8B] text-xs font-semibold rounded-lg flex items-center gap-1.5 hover:bg-[#EAE4F0]"
                        >
                          <Bookmark className="w-3.5 h-3.5 text-[#A294B2]" />
                          {res}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
