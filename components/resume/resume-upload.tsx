"use client";

import { type ChangeEvent, useRef, useState } from "react";

interface ResumeUploadProps {
  onUpload?: (file: File) => void;
  className?: string;
}

export function ResumeUpload({ onUpload, className = "" }: ResumeUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file: File) => {
    setFileName(file.name);
    onUpload?.(file);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className={`rounded-xl border-2 border-dashed transition-colors ${
        dragging
          ? "border-indigo-400 bg-indigo-50"
          : "border-foreground/20 bg-background"
      } p-8 text-center ${className}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={handleChange}
      />

      <div className="flex flex-col items-center gap-2">
        <span className="text-4xl">📄</span>
        {fileName ? (
          <p className="text-sm font-medium text-foreground">{fileName}</p>
        ) : (
          <>
            <p className="text-sm text-foreground/60">
              Drag & drop your resume here, or{" "}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="font-medium text-indigo-600 hover:text-indigo-700"
              >
                browse
              </button>
            </p>
            <p className="text-xs text-foreground/40">
              Supports PDF, DOC, DOCX
            </p>
          </>
        )}
      </div>
    </div>
  );
}
