"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, CheckCircle2, FileText, Trash2 } from "lucide-react";

interface UploadCardProps {
  file: File | null;
  setFile: (file: File | null) => void;
  onUpload: () => void;
  isUploading: boolean;
}

export default function UploadCard({
  file,
  setFile,
  onUpload,
  isUploading,
}: UploadCardProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf" || droppedFile.name.endsWith(".pdf")) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="soft-card p-6"
    >
      <h2 className="text-base font-extrabold text-slate-800 mb-4 flex items-center gap-2">
        <UploadCloud className="w-5 h-5 text-[#A294B2]" />
        Resume Upload
      </h2>

      {/* Drag & Drop Area */}
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileSelect}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
          isDragOver
            ? "border-[#A294B2] bg-[#F0ECF4]/50"
            : file
            ? "border-[#92A18F]/40 bg-[#EBF1EA]/30"
            : "border-[#EDE9E3] hover:border-[#DCD7CE] hover:bg-[#FAF8F5]"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf"
          className="hidden"
        />

        {/* Upload Icon */}
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
            file ? "bg-[#EBF1EA] text-[#6A7868]" : "bg-[#F0ECF4] text-[#A294B2]"
          }`}
        >
          {file ? (
            <CheckCircle2 className="w-6 h-6" />
          ) : (
            <UploadCloud className="w-6 h-6" />
          )}
        </div>

        <p className="text-xs font-bold text-slate-700 mb-1 text-center uppercase tracking-wide">
          {file ? "Resume Loaded!" : "Drop your Resume here"}
        </p>
        <p className="text-[10px] text-slate-400 mb-4 text-center uppercase font-bold tracking-wider">
          PDF format only
        </p>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            triggerFileSelect();
          }}
          className="px-4 py-2 bg-white hover:bg-[#FAF8F5] text-slate-600 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-colors border border-[#EDE9E3]"
        >
          Select File
        </button>
      </motion.div>

      {/* Selected File Display */}
      {file && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-[#FAF8F5] border border-[#EDE9E3] rounded-xl flex items-center justify-between shadow-sm"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <FileText className="w-8 h-8 text-[#D1A2B0] shrink-0" />
            <div className="truncate">
              <p className="text-xs font-bold text-slate-700 truncate">{file.name}</p>
              <p className="text-[10px] text-slate-450 font-semibold">{formatFileSize(file.size)}</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFile(null);
            }}
            className="p-1.5 text-slate-400 hover:text-[#EF4444] rounded-lg hover:bg-slate-150 transition-colors"
            title="Remove file"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Upload Button */}
      <button
        onClick={onUpload}
        disabled={isUploading || !file}
        className={`w-full mt-4 py-3 px-4 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border ${
          isUploading
            ? "bg-[#FAF8F5] text-slate-400 border-[#EDE9E3] cursor-not-allowed"
            : !file
            ? "bg-[#FAF8F5] border-[#EDE9E3] text-slate-305 cursor-not-allowed"
            : "bg-gradient-to-r from-[#A294B2] to-[#92A18F] hover:from-[#9587A5] hover:to-[#849381] border-transparent text-white shadow-sm active:scale-[0.98]"
        }`}
      >
        {isUploading ? (
          <>
            <div className="w-4 h-4 border-2 border-slate-300 border-t-[#A294B2] rounded-full animate-spin" />
            Extracting Profile...
          </>
        ) : (
          "Upload & Analyze"
        )}
      </button>
    </motion.div>
  );
}
