"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, HelpCircle, ArrowLeft, ArrowRight, Play, CheckCircle2, Award, Zap, Code, ShieldCheck, MessageSquare, AlertCircle } from "lucide-react";

interface Question {
  category: "HR" | "Technical" | "Coding" | "System Design" | "Behavioral";
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  expectedTime?: string;
  hints?: string[];
  idealAnswer?: string;
}

interface EvaluationResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  missingConcepts: string[];
  idealAnswer: string;
  followUpQuestion: string;
  confidenceLevel: string;
}

interface InterviewPrepProps {
  resumeSkills: string[];
}

export default function InterviewPrep({ resumeSkills }: InterviewPrepProps) {
  const [role, setRole] = useState("Software Engineer");
  const [difficulty, setDifficulty] = useState("Medium");
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [showHints, setShowHints] = useState(false);

  const [answers, setAnswers] = useState<string[]>([]);
  const [evaluations, setEvaluations] = useState<(EvaluationResult | null)[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const generateInterview = async () => {
    setIsGenerating(true);
    setErrorMessage("");
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers([]);
    setEvaluations([]);
    setShowHints(false);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/generate-interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          role,
          difficulty,
          resumeSkills,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate interview questions. Status: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.questions) {
        setQuestions(data.questions);
        setAnswers(new Array(data.questions.length).fill(""));
        setEvaluations(new Array(data.questions.length).fill(null));
      } else {
        setErrorMessage("Invalid question schema received from backend.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during interview generation."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerChange = (text: string) => {
    const updated = [...answers];
    updated[currentIndex] = text;
    setAnswers(updated);
  };

  const evaluateAnswer = async () => {
    const currentAnswer = answers[currentIndex] || "";
    if (!currentAnswer.trim()) {
      setErrorMessage("Please enter an answer to evaluate.");
      return;
    }

    setIsEvaluating(true);
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/evaluate-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          question: questions[currentIndex].question,
          answer: currentAnswer,
          role,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to evaluate answer. Status: ${response.status}`);
      }

      const data = await response.json();
      const updated = [...evaluations];
      updated[currentIndex] = data;
      setEvaluations(updated);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during evaluation."
      );
    } finally {
      setIsEvaluating(false);
    }
  };

  const getDifficultyColor = (diff: string) => {
    const d = diff.toLowerCase();
    if (d === "easy") return "bg-[#EBF1EA] text-[#6A7868] border-[#D6E2D4]";
    if (d === "medium") return "bg-[#F0ECF4] text-[#7B6E8B] border-[#E2DBE8]";
    return "bg-[#FFF0EB] text-[#B97262] border-[#FBD5CC]";
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-[#6A7868] border-[#D6E2D4] bg-[#EBF1EA]";
    if (score >= 5) return "text-[#B97262] border-[#FBD5CC] bg-[#FFF0EB]";
    return "text-[#9E6F7E] border-[#F1D4DC] bg-[#F9EFF2]";
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "Coding":
        return <Code className="w-3.5 h-3.5 text-[#92A18F]" />;
      case "Technical":
        return <Zap className="w-3.5 h-3.5 text-[#A294B2]" />;
      case "System Design":
        return <ShieldCheck className="w-3.5 h-3.5 text-[#D1A2B0]" />;
      default:
        return <Users className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const currentEval = evaluations[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 pt-8 border-t border-[#EDE9E3] flex flex-col gap-6"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#EDE9E3] flex items-center justify-center text-[#A294B2] shadow-sm">
          <Users className="w-4 h-4" />
        </div>
        <h2 className="text-base font-extrabold text-slate-800">Mock Interview Simulator</h2>
      </div>

      {/* Control Setup Card */}
      <div className="soft-card p-6 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            Target Career Goal
          </label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={isGenerating || isEvaluating}
            placeholder="e.g. Full Stack Developer, Devops Engineer..."
            className="w-full h-11 px-3 border border-[#EDE9E3] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#A294B2]/10 focus:border-[#A294B2] text-sm font-semibold text-slate-700 bg-[#FAF8F5] transition-all"
          />
        </div>

        <div className="md:w-44 w-full flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            Difficulty
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            disabled={isGenerating || isEvaluating}
            className="w-full h-11 px-3 border border-[#EDE9E3] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#A294B2]/10 focus:border-[#A294B2] text-sm font-semibold text-slate-700 bg-[#FAF8F5] transition-all cursor-pointer"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <button
          onClick={generateInterview}
          disabled={isGenerating || isEvaluating}
          className={`w-full md:w-auto h-11 px-6 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border shrink-0 ${
            isGenerating || isEvaluating
              ? "bg-[#FAF8F5] text-slate-400 border-[#EDE9E3] cursor-not-allowed"
              : "bg-gradient-to-r from-[#A294B2] to-[#92A18F] hover:from-[#9587A5] hover:to-[#849381] border-transparent text-white shadow-sm active:scale-[0.98]"
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-355 border-t-[#A294B2] rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              Start Drills
            </>
          )}
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 bg-[#EF4444]/5 border border-[#EF4444]/20 rounded-2xl text-[#c53030] text-xs font-semibold">
          {errorMessage}
        </div>
      )}

      {/* Questions Carousel Section */}
      {questions.length > 0 && (
        <div className="flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="soft-card p-8 flex flex-col gap-6 relative overflow-hidden"
          >
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EDE9E3] pb-4">
              <span className="text-[10px] font-extrabold text-[#7B6E8B] uppercase tracking-wider bg-[#F0ECF4] border border-[#E2DBE8] px-3 py-1 rounded-xl">
                Question {currentIndex + 1} of {questions.length}
              </span>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-[#EDE9E3]">
                  {getCategoryIcon(questions[currentIndex].category)}
                  {questions[currentIndex].category}
                </div>
                <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-lg border ${getDifficultyColor(questions[currentIndex].difficulty)}`}>
                  {questions[currentIndex].difficulty}
                </span>
              </div>
            </div>

            {/* Question Text */}
            <div>
              <p className="text-base font-bold text-slate-800 leading-relaxed">
                {questions[currentIndex].question}
              </p>
              {questions[currentIndex].expectedTime && (
                <span className="inline-block mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Expected duration: {questions[currentIndex].expectedTime}
                </span>
              )}
            </div>

            {/* Hint Toggler */}
            {questions[currentIndex].hints && questions[currentIndex].hints!.length > 0 && (
              <div>
                <button
                  onClick={() => setShowHints(!showHints)}
                  className="text-xs font-extrabold text-[#A294B2] hover:text-[#92A18F] transition-colors flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  {showHints ? "Hide hints" : "Need a hint?"}
                </button>
                <AnimatePresence>
                  {showHints && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-2.5 p-3.5 bg-[#FAF8F5] border border-[#EDE9E3] rounded-xl space-y-1.5"
                    >
                      {questions[currentIndex].hints!.map((hint, idx) => (
                        <div key={idx} className="text-xs text-slate-500 flex items-start gap-2 leading-relaxed font-semibold">
                          <span className="text-[#A294B2] font-black mt-0.5">•</span>
                          <p className="flex-1">{hint}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Answer Input */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Your Answer
              </label>
              <textarea
                value={answers[currentIndex] || ""}
                onChange={(e) => handleAnswerChange(e.target.value)}
                disabled={isEvaluating}
                placeholder="Type your response to the question in detail..."
                className="w-full h-32 px-4 py-3 text-sm border border-[#EDE9E3] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#A294B2]/10 focus:border-[#A294B2] transition-all resize-none text-slate-700 placeholder:text-slate-400 bg-[#FAF8F5]"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center border-t border-[#EDE9E3] pt-4">
              <button
                onClick={evaluateAnswer}
                disabled={isEvaluating || !(answers[currentIndex] || "").trim()}
                className={`px-5 py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-2 border ${
                  isEvaluating || !(answers[currentIndex] || "").trim()
                    ? "bg-[#FAF8F5] text-slate-350 border-[#EDE9E3] cursor-not-allowed"
                    : "bg-[#92A18F] hover:bg-[#849381] text-white border-transparent shadow-sm active:scale-[0.98]"
                }`}
              >
                {isEvaluating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-300 border-t-[#92A18F] rounded-full animate-spin" />
                    Reviewing...
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4" />
                    Submit Answer
                  </>
                )}
              </button>

              {currentEval && (
                <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-xs font-black uppercase tracking-wider ${getScoreColor(currentEval.score)}`}>
                  Score: {currentEval.score} / 10
                </div>
              )}
            </div>
          </motion.div>

          {/* Answer Evaluation results details */}
          <AnimatePresence mode="wait">
            {currentEval && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Score breakdown metrics card */}
                <div className="soft-card p-6 rounded-2xl flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-[#EDE9E3] pb-3">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Grade Analysis
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      Confidence Level: <span className="text-[#92A18F] font-black uppercase tracking-wide">{currentEval.confidenceLevel}</span>
                    </span>
                  </div>

                  {/* Strengths */}
                  <div className="flex flex-col gap-2">
                    <h5 className="text-[10px] font-extrabold text-[#6A7868] uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#92A18F]" />
                      Key Strengths
                    </h5>
                    <ul className="space-y-2">
                      {currentEval.strengths.map((str, idx) => (
                        <li key={idx} className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed font-semibold">
                          <span className="text-[#92A18F] font-bold mt-0.5">•</span>
                          <span className="flex-1">{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Areas to Improve */}
                  <div className="flex flex-col gap-2">
                    <h5 className="text-[10px] font-extrabold text-[#9E6F7E] uppercase tracking-wider flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-[#D1A2B0]" />
                      Areas to Improve
                    </h5>
                    <ul className="space-y-2">
                      {currentEval.weaknesses.map((weak, idx) => (
                        <li key={idx} className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed font-semibold">
                          <span className="text-[#D1A2B0] font-bold mt-0.5">•</span>
                          <span className="flex-1">{weak}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Study & follow up card */}
                <div className="soft-card p-6 rounded-2xl flex flex-col gap-4">
                  {/* Missing tech concepts */}
                  {currentEval.missingConcepts && currentEval.missingConcepts.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                        Suggested Concept Upgrades
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                        {currentEval.missingConcepts.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 bg-[#FFF0EB] border border-[#FBD5CC] text-[#B97262] text-[10px] font-extrabold uppercase rounded-lg"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sample Ideal Response */}
                  <div className="flex flex-col gap-2">
                    <h5 className="text-[10px] font-extrabold text-[#7B6E8B] uppercase tracking-wider flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-[#A294B2]" />
                      Model Response Example
                    </h5>
                    <p className="text-xs text-slate-600 bg-[#FAF8F5] p-4 border border-[#EDE9E3] rounded-xl leading-relaxed italic max-h-[140px] overflow-y-auto pr-1 font-medium">
                      "{currentEval.idealAnswer}"
                    </p>
                  </div>

                  {/* Recommendation Follow-Up Question */}
                  {currentEval.followUpQuestion && (
                    <div className="mt-2 p-3.5 bg-[#F0ECF4] border border-[#E2DBE8] rounded-xl">
                      <h6 className="text-[9px] font-bold text-[#7B6E8B] uppercase tracking-wider mb-1">
                        Recommended Next Question
                      </h6>
                      <p className="text-xs text-[#524461] font-bold leading-relaxed">
                        {currentEval.followUpQuestion}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center gap-4 mt-2">
            <button
              onClick={() => {
                setCurrentIndex((prev) => Math.max(0, prev - 1));
                setShowHints(false);
              }}
              disabled={currentIndex === 0 || isEvaluating}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                currentIndex === 0 || isEvaluating
                  ? "bg-[#FAF8F5] text-slate-450 border-[#EDE9E3] cursor-not-allowed"
                  : "bg-white text-slate-600 border-[#EDE9E3] hover:bg-[#FAF8F5] active:scale-[0.98]"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            <button
              onClick={() => {
                setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1));
                setShowHints(false);
              }}
              disabled={currentIndex === questions.length - 1 || isEvaluating}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                currentIndex === questions.length - 1 || isEvaluating
                  ? "bg-[#FAF8F5] text-slate-450 border-[#EDE9E3] cursor-not-allowed"
                  : "bg-white text-slate-600 border-[#EDE9E3] hover:bg-[#FAF8F5] active:scale-[0.98]"
              }`}
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
