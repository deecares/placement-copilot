"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { 
  LogOut, 
  FileText, 
  CheckCircle2, 
  RefreshCw, 
  HelpCircle, 
  Heart,
  LayoutDashboard, 
  ShieldAlert
} from "lucide-react";

import { API } from "@/lib/api";
import UploadCard from "@/components/UploadCard";
import ScoreCard from "@/components/ScoreCard";
import SkillList from "@/components/SkillList";
import RecommendationCard from "@/components/RecommendationCard";
import JobDescriptionCard from "@/components/JobDescriptionCard";
import AtsResults from "@/components/AtsResults";
import InterviewPrep from "@/components/InterviewPrep";
import LearningRoadmap from "@/components/LearningRoadmap";

interface AnalysisResults {
  score: number;
  detectedSkills: string[];
  missingSkills: string[];
  recommendedRoles: string[];
  recommendations: string[];
  resumeLength: number;
  quality?: string;
  formattingScore?: number;
  atsFriendliness?: number;
  sectionsPresent?: string[];
}

interface AtsAnalysisResults {
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  recommendations: string[];
  inferredRole?: string;
}

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [results, setResults] = useState<AnalysisResults | null>(null);

  // ATS Matching state
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isComparing, setIsComparing] = useState(false);
  const [atsResults, setAtsResults] = useState<AtsAnalysisResults | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Hydrate User and check cached resume
    fetch(`${API}/auth/me`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Auth session expired");
        return res.json();
      })
      .then((data) => {
        setUserName(data.name || "User");
        setIsAuthLoading(false);
        // Load cached resume
        return fetch(`${API}/api/resume/me`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
      })
      .then((res) => {
        if (res && res.ok) {
          return res.json();
        }
        return null;
      })
      .then((resumeData) => {
        if (resumeData && resumeData.hasResume) {
          setResults({
            score: resumeData.score,
            detectedSkills: resumeData.detectedSkills,
            missingSkills: resumeData.missingSkills,
            recommendedRoles: resumeData.recommendedRoles,
            recommendations: resumeData.recommendations,
            resumeLength: resumeData.resume_text ? resumeData.resume_text.length : 0,
            quality: resumeData.quality,
            formattingScore: resumeData.formattingScore,
            atsFriendliness: resumeData.atsFriendliness,
            sectionsPresent: resumeData.sectionsPresent,
          });
          setResumeText(resumeData.resume_text || "");
        }
      })
      .catch((err) => {
        console.error(err);
        localStorage.removeItem("token");
        router.push("/login");
      });
  }, [router]);

  const uploadResume = async () => {
    if (!file) {
      setErrorMessage("Please select a PDF file first");
      return;
    }

    setIsUploading(true);
    setErrorMessage("");
    setResults(null);
    setAtsResults(null);
    setResumeText("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API}/api/upload-resume`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.analysis) {
        setResults({
          score: data.score ?? 75,
          detectedSkills: data.detectedSkills ?? [],
          missingSkills: data.missingSkills ?? [],
          recommendedRoles: data.recommendedRoles ?? [],
          recommendations: data.recommendations ?? [],
          resumeLength: data.resume_text ? data.resume_text.length : 0,
          quality: data.quality ?? "Good",
          formattingScore: data.formattingScore ?? 75,
          atsFriendliness: data.atsFriendliness ?? 80,
          sectionsPresent: data.sectionsPresent ?? [],
        });
        if (data.resume_text) {
          setResumeText(data.resume_text);
        }
        // Confetti celebration
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else {
        setErrorMessage("Invalid response format received from analysis backend.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during resume analysis."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const analyzeATS = async () => {
    if (!resumeText) {
      setErrorMessage("Please upload a resume before running the ATS analysis.");
      return;
    }
    if (!jobDescription.trim()) {
      setErrorMessage("Please paste a job description to perform matching.");
      return;
    }

    setIsComparing(true);
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API}/api/analyze-job`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          resumeText,
          jobDescription,
        }),
      });

      if (!response.ok) {
        throw new Error(`ATS matching request failed with status: ${response.status}`);
      }

      const data = await response.json();
      setAtsResults(data);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during ATS analysis."
      );
    } finally {
      setIsComparing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResults(null);
    setAtsResults(null);
    setResumeText("");
    setJobDescription("");
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center text-slate-800 font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-slate-300 border-t-[#A294B2] rounded-full animate-spin" />
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Validating session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 font-sans flex flex-col relative overflow-hidden">
      {/* Light Header Bar */}
      <header className="border-b border-[#EDE9E3] bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#A294B2] to-[#92A18F] flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
              P
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-tight text-slate-800">
                Placement Copilot
              </h1>
              <p className="text-[10px] font-bold text-[#A294B2] tracking-wider uppercase">
                Personal Career Space
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-bold text-slate-500 bg-[#FAF8F5] border border-[#EDE9E3] px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <LayoutDashboard className="w-3.5 h-3.5 text-[#A294B2]" />
              Welcome back, {userName}
            </span>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/login");
              }}
              className="text-[10px] font-bold text-[#9E6F7E] uppercase tracking-wider bg-[#FAF8F5] hover:bg-[#F9EFF2] border border-[#EDE9E3] transition-all px-3 py-1.5 rounded-lg flex items-center gap-1 active:scale-95 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Welcoming Greeting block */}
      <div className="max-w-5xl w-full mx-auto px-6 pt-10 pb-4">
        <h2 className="text-3xl font-extrabold text-slate-850 tracking-tight">
          Let's improve your resume today.
        </h2>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1.5">
          Follow the progress stages below to optimize your profile and practice skills.
        </p>
      </div>

      {/* Main Content Vertical Stack */}
      <main className="max-w-5xl w-full mx-auto px-6 pb-20 flex flex-col gap-12 z-10">
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="p-4 bg-[#FFF0EB] border border-[#FBD5CC] rounded-2xl flex items-center justify-between text-[#B97262] text-xs font-semibold"
            >
              <span className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-[#EFA694]" />
                {errorMessage}
              </span>
              <button
                onClick={() => setErrorMessage("")}
                className="text-[10px] uppercase tracking-wider font-bold hover:underline"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1. Resume Upload */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b border-[#EDE9E3] pb-2">
            <div className="w-6 h-6 rounded-md bg-[#F0ECF4] border border-[#E2DBE8] flex items-center justify-center text-xs font-bold text-[#7B6E8B]">
              01
            </div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-450">
              Resume Upload
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            <div className="md:col-span-2">
              {!results ? (
                <UploadCard
                  file={file}
                  setFile={setFile}
                  onUpload={uploadResume}
                  isUploading={isUploading}
                />
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="soft-card p-6 flex flex-col gap-4 h-full justify-between"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#A294B2]" />
                      Active Profile Session
                    </span>
                    <button
                      onClick={handleReset}
                      className="text-[9px] font-bold text-[#9E6F7E] bg-white border border-[#EDE9E3] px-2.5 py-1 rounded-md flex items-center gap-1 hover:bg-[#F9EFF2] transition-all active:scale-95 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Reset Profile
                    </button>
                  </div>
                  <div className="p-3 bg-[#FAF8F5] border border-[#EDE9E3] rounded-xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#EBF1EA] text-[#6A7868] flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-700 truncate">
                        {file ? file.name : "Active Resume Profile"}
                      </p>
                      <p className="text-[9px] text-[#92A18F] font-extrabold uppercase tracking-wider">Loaded successfully</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="soft-card p-6 text-slate-500 text-xs flex flex-col justify-center">
              <h4 className="font-extrabold text-slate-700 mb-2.5 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#EFA694]" />
                Analysis Tips
              </h4>
              <ul className="list-disc pl-4 space-y-1.5 leading-relaxed font-semibold">
                <li>Make sure your PDF has copyable text rather than scanned images.</li>
                <li>Incorporate standard industry keywords into your projects.</li>
                <li>Check for proper formatting and clear heading structures.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 2. Overall Resume Analysis */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b border-[#EDE9E3] pb-2">
            <div className="w-6 h-6 rounded-md bg-[#F0ECF4] border border-[#E2DBE8] flex items-center justify-center text-xs font-bold text-[#7B6E8B]">
              02
            </div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-455">
              Resume Analysis
            </h3>
          </div>

          <AnimatePresence mode="wait">
            {isUploading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <div className="h-44 bg-[#FAF8F5] border border-[#EDE9E3] animate-pulse rounded-2xl" />
                <div className="md:col-span-2 h-44 bg-[#FAF8F5] border border-[#EDE9E3] animate-pulse rounded-2xl" />
              </motion.div>
            ) : results ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch"
              >
                <div className="lg:col-span-1">
                  <ScoreCard
                    score={results.score}
                    resumeLength={results.resumeLength}
                    quality={results.quality}
                    formattingScore={results.formattingScore}
                    atsFriendliness={results.atsFriendliness}
                    sectionsPresent={results.sectionsPresent}
                  />
                </div>

                <div className="lg:col-span-2 flex flex-col gap-6">
                  {/* Skills Lists */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <SkillList
                      title="Detected Technical Skills"
                      skills={results.detectedSkills}
                      variant="detected"
                      emptyMessage="No skills detected yet."
                    />
                    <SkillList
                      title="Recommended Skill Upgrades"
                      skills={results.missingSkills}
                      variant="missing"
                      emptyMessage="All clear! No missing core skills."
                    />
                  </div>

                  {/* Recommendations Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <RecommendationCard
                      title="Target Industry Roles"
                      items={results.recommendedRoles}
                      type="roles"
                    />
                    <RecommendationCard
                      title="Resume Suggestions"
                      items={results.recommendations}
                      type="general"
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="soft-card p-8 text-center flex flex-col items-center justify-center min-h-[160px]"
              >
                <Heart className="w-6 h-6 text-[#D1A2B0] mb-2.5" />
                <p className="text-xs text-slate-450 font-extrabold uppercase tracking-wider">Awaiting Profile Analysis</p>
                <p className="text-xs text-slate-500 max-w-sm mt-1 font-semibold">Upload your technical resume in Stage 1 to unlock metrics and quality audits.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* 3. Job Description / ATS Analysis */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b border-[#EDE9E3] pb-2">
            <div className="w-6 h-6 rounded-md bg-[#F0ECF4] border border-[#E2DBE8] flex items-center justify-center text-xs font-bold text-[#7B6E8B]">
              03
            </div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-455">
              ATS Matching
            </h3>
          </div>

          <div className="flex flex-col gap-6">
            <JobDescriptionCard
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
              onAnalyze={analyzeATS}
              isComparing={isComparing}
              hasResume={!!resumeText}
            />

            {/* ATS Match results appear directly beneath input */}
            <AnimatePresence>
              {atsResults && (
                <AtsResults
                  matchScore={atsResults.matchScore}
                  matchingSkills={atsResults.matchingSkills}
                  missingSkills={atsResults.missingSkills}
                  recommendations={atsResults.recommendations}
                />
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* 4. Interview Simulator */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b border-[#EDE9E3] pb-2">
            <div className="w-6 h-6 rounded-md bg-[#F0ECF4] border border-[#E2DBE8] flex items-center justify-center text-xs font-bold text-[#7B6E8B]">
              04
            </div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-455">
              Interview Simulator
            </h3>
          </div>

          {results ? (
            <InterviewPrep resumeSkills={results.detectedSkills} />
          ) : (
            <div className="soft-card p-8 text-center flex flex-col items-center justify-center min-h-[160px]">
              <HelpCircle className="w-6 h-6 text-slate-300 mb-2.5" />
              <p className="text-xs text-slate-450 font-extrabold uppercase tracking-wider">Simulator Locked</p>
              <p className="text-xs text-slate-500 max-w-sm mt-1 font-semibold">Upload your resume profile in Stage 1 to construct category drills.</p>
            </div>
          )}
        </section>

        {/* 5. Learning Roadmap */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b border-[#EDE9E3] pb-2">
            <div className="w-6 h-6 rounded-md bg-[#F0ECF4] border border-[#E2DBE8] flex items-center justify-center text-xs font-bold text-[#7B6E8B]">
              05
            </div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-455">
              Learning Roadmap
            </h3>
          </div>

          {results ? (
            <LearningRoadmap
              resumeSkills={results.detectedSkills}
              missingSkills={atsResults ? atsResults.missingSkills : results.missingSkills}
              inferredRole={atsResults?.inferredRole || (results.recommendedRoles.length > 0 ? results.recommendedRoles[0] : undefined)}
            />
          ) : (
            <div className="soft-card p-8 text-center flex flex-col items-center justify-center min-h-[160px]">
              <HelpCircle className="w-6 h-6 text-slate-300 mb-2.5" />
              <p className="text-xs text-slate-455 font-extrabold uppercase tracking-wider">Roadmap Planner Locked</p>
              <p className="text-xs text-slate-500 max-w-sm mt-1 font-semibold">First upload your profile in Stage 1 to construct structured timelines.</p>
            </div>
          )}
        </section>

        {/* 6. Resume History */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b border-[#EDE9E3] pb-2">
            <div className="w-6 h-6 rounded-md bg-[#F0ECF4] border border-[#E2DBE8] flex items-center justify-center text-xs font-bold text-[#7B6E8B]">
              06
            </div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-455">
              Resume History
            </h3>
          </div>

          <div className="soft-card p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#EDE9E3] pb-3">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Profile Versioning & Progression
              </span>
              <span className="text-[10px] font-extrabold text-slate-500 uppercase">
                Active Sessions
              </span>
            </div>

            {results ? (
              <div className="space-y-3">
                {/* Active cached resume */}
                <div className="flex items-center justify-between p-3.5 bg-white border border-[#92A18F]/30 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#EBF1EA] text-[#6A7868] flex items-center justify-center">
                      <CheckCircle2 className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">Active Profile Session</p>
                      <p className="text-[9px] text-[#6A7868] font-bold uppercase tracking-wider">Currently Loaded</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-slate-700 bg-[#FAF8F5] border border-[#EDE9E3] px-2.5 py-1 rounded-md">
                      Score: {results.score}%
                    </span>
                  </div>
                </div>

                {/* Mock historical versions to illustrate evolution */}
                <div className="flex items-center justify-between p-3.5 bg-[#FAF8F5]/50 border border-[#EDE9E3] rounded-xl opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500">Initial Import Version (v1.0)</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Archived Draft</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-500 bg-[#FAF8F5] border border-[#EDE9E3] px-2.5 py-1 rounded-md">
                      Score: 61%
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 border border-dashed border-[#EDE9E3] rounded-xl text-center text-xs text-slate-400 font-medium">
                No active session logs found. Upload your resume to see progression history.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}