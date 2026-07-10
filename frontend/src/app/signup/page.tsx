"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, User, Mail, Lock, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated, redirect immediately to dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Registration failed. Email may already exist.");
      }

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        router.push("/");
      } else {
        throw new Error("Invalid response received from auth server.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : "An unexpected error occurred during signup.");
    } finally {
      setIsLoading(false);
    }
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
            Create Account
          </h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1.5">
            Join Placement Copilot Today
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-[#FFF0EB] border border-[#FBD5CC] text-[#B97262] text-xs font-semibold animate-shake">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-[#EDE9E3] rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#A294B2]/10 focus:border-[#A294B2] text-sm font-semibold transition-all"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

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
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-[#EDE9E3] rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#A294B2]/10 focus:border-[#A294B2] text-sm font-semibold transition-all"
                placeholder="Min. 6 characters"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-[#EDE9E3] rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#A294B2]/10 focus:border-[#A294B2] text-sm font-semibold transition-all"
                placeholder="Confirm password"
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
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#EDE9E3] text-center text-sm text-slate-500 font-semibold">
          Already have an account?{" "}
          <Link href="/login" className="text-[#A294B2] hover:text-[#92A18F] font-bold transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
