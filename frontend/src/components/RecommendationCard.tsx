"use client";

import React from "react";
import { motion } from "framer-motion";
import { Briefcase, Compass, Lightbulb, Star } from "lucide-react";

interface RecommendationCardProps {
  title: string;
  items: string[];
  type: "roles" | "general";
}

export default function RecommendationCard({
  title,
  items,
  type,
}: RecommendationCardProps) {
  const isRoles = type === "roles";

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemAnim = {
    hidden: { x: -10, opacity: 0 },
    show: { x: 0, opacity: 1 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="soft-card p-6 flex flex-col h-full"
    >
      <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
        {isRoles ? (
          <Briefcase className="w-4 h-4 text-[#A294B2]" />
        ) : (
          <Lightbulb className="w-4 h-4 text-[#EFA694]" />
        )}
        {title}
      </h3>

      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center border border-dashed border-[#EDE9E3] rounded-xl bg-[#FAF8F5]">
          <p className="text-xs text-slate-400 font-medium">
            {isRoles ? "No matching roles found yet" : "No recommendations available"}
          </p>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex-1 flex flex-col gap-3 justify-center"
        >
          {items.map((item, index) => (
            <motion.div
              variants={itemAnim}
              whileHover={{ x: 3 }}
              key={index}
              className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                isRoles
                  ? "bg-[#F0ECF4] border-[#E2DBE8] hover:bg-[#EAE4F0]"
                  : "bg-[#FFF0EB] border-[#FBD5CC] hover:bg-[#FCE6E0]"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-bold ${
                  isRoles ? "bg-[#E2DBE8] text-[#7B6E8B]" : "bg-[#FBD5CC] text-[#B97262]"
                }`}
              >
                {isRoles ? <Star className="w-3 h-3 fill-current" /> : index + 1}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-700 leading-snug">
                  {item}
                </p>
                {isRoles && (
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Matches your active tech capabilities.
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
