"use client";
import { API } from "@/lib/api";
import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const uploadResume = async () => {
    if (!file) {
      setMessage("Please select a PDF");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `${API}/api/upload-resume`,
        {
          method: "POST",
          body: formData,
        }
);

      const data = await response.json();

      setMessage(data.analysis);
    } catch (error) {
      console.error(error);
      setMessage("Upload failed");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-10">
      <h1 className="text-4xl font-bold">
        Placement Copilot
      </h1>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => {
          if (e.target.files) {
            setFile(e.target.files[0]);
          }
        }}
      />

      <button
        onClick={uploadResume}
        className="bg-black text-white px-6 py-3 rounded-xl"
      >
        Upload Resume
      </button>

      <div className="max-w-3xl whitespace-pre-wrap border p-4 rounded-xl">
        {message}
      </div>
    </main>
  );
}