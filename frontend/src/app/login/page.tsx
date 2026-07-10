"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Key, Mail, Lock, ShieldCheck, ArrowLeft, Send } from "lucide-react";

type AuthMode = "login" | "forgot" | "reset";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");

  // Redirect if already authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Authentication failed. Please verify credentials.");
      }

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        router.push("/");
      } else {
        throw new Error("Invalid response received from auth server.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : "An unexpected error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg("Please enter your email.");
      return;
    }
    setIsLoading(true);
    setErrorMsg("");
    // Simulate API link sending
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg("We sent a recovery link to your inbox!");
      setMode("reset");
    }, 800);
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetToken.trim() || !newPassword.trim()) {
      setErrorMsg("Please fill in all fields.");
      return;
    }
    setIsLoading(true);
    setErrorMsg("");
    // Simulate password modification update
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg("Your password has been reset successfully! Please sign in.");
      setMode("login");
      setPassword("");
    }, 800);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#FAF8F5] px-4 py-12 text-slate-800 overflow-hidden font-sans">
      {/* Subtle floating pastel vector decorations */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-[15%] w-24 h-24 rounded-full bg-[#FAF0EC]/60 border border-[#FBD5CC]/30 pointer-events-none blur-sm"
      />
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-[15%] w-32 h-32 rounded-full bg-[#EBF1EA]/60 border border-[#D6E2D4]/30 pointer-events-none blur-sm"
      />
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-12 right-[20%] w-16 h-16 rounded-full bg-[#F0ECF4]/60 border border-[#E2DBE8]/30 pointer-events-none blur-sm"
      />

      <div className="w-full max-w-md soft-card p-8 bg-white border border-[#EDE9E3] shadow-md rounded-2xl relative z-10">
        
        {/* Brand header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A294B2] to-[#92A18F] flex items-center justify-center text-white font-extrabold text-xl shadow-sm mb-3">
            P
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-800">
            Placement Copilot
          </h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1.5">
            {mode === "login" && "Welcome back"}
            {mode === "forgot" && "Reset Password Link"}
            {mode === "reset" && "Update Password"}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-[#FFF0EB] border border-[#FBD5CC] text-[#B97262] text-xs font-semibold animate-shake">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-[#EBF1EA] border border-[#D6E2D4] text-[#556353] text-xs font-semibold">
            {successMsg}
          </div>
        )}

        <AnimatePresence mode="wait">
          {mode === "login" && (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onSubmit={handleLogin}
              className="space-y-5"
            >
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-[#EDE9E3] rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#A294B2]/10 focus:border-[#A294B2] text-sm font-semibold transition-all"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot");
                      setErrorMsg("");
                      setSuccessMsg("");
                    }}
                    className="text-[11px] text-[#A294B2] hover:text-[#92A18F] transition-colors font-bold"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-[#EDE9E3] rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#A294B2]/10 focus:border-[#A294B2] text-sm font-semibold transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#A294B2] to-[#92A18F] hover:from-[#9587A5] hover:to-[#849381] active:scale-[0.98] transition-all py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider text-white shadow-sm flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-300 border-t-white rounded-full animate-spin mr-2" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </motion.form>
          )}

          {mode === "forgot" && (
            <motion.form
              key="forgot"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onSubmit={handleForgot}
              className="space-y-5"
            >
              <p className="text-xs text-slate-500 leading-relaxed font-semibold text-center">
                Enter your account email. We'll send a warm recovery link to your inbox.
              </p>
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-[#EDE9E3] rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#A294B2]/10 focus:border-[#A294B2] text-sm font-semibold transition-all"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="flex-1 px-4 py-3 border border-[#EDE9E3] rounded-xl font-extrabold text-xs uppercase tracking-wider text-slate-500 hover:bg-[#FAF8F5] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-[#A294B2] to-[#92A18F] hover:from-[#9587A5] hover:to-[#849381] py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider text-white shadow-sm flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none cursor-pointer gap-1.5"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-slate-300 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Send Link
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          )}

          {mode === "reset" && (
            <motion.form
              key="reset"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onSubmit={handleReset}
              className="space-y-5"
            >
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                  Verification Code / Token
                </label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-[#EDE9E3] rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#A294B2]/10 focus:border-[#A294B2] text-sm font-semibold transition-all"
                    placeholder="Enter recovery code"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-[#EDE9E3] rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#A294B2]/10 focus:border-[#A294B2] text-sm font-semibold transition-all"
                    placeholder="Min. 6 characters"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="flex-1 px-4 py-3 border border-[#EDE9E3] rounded-xl font-extrabold text-xs uppercase tracking-wider text-slate-500 hover:bg-[#FAF8F5] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-[#A294B2] to-[#92A18F] hover:from-[#9587A5] hover:to-[#849381] py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider text-white shadow-sm flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-slate-300 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {mode === "login" && (
          <div className="mt-8 pt-6 border-t border-[#EDE9E3] text-center text-sm text-slate-500 font-semibold">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#A294B2] hover:text-[#92A18F] font-bold transition-colors">
              Create Account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
