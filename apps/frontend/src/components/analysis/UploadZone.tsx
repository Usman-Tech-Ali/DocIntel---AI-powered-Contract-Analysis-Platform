"use client";

import { useCallback, useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
  isAnalyzing: boolean;
}

export function UploadZone({ onUpload, isUploading, isAnalyzing }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) await onUpload(file);
    },
    [onUpload]
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) await onUpload(file);
    },
    [onUpload]
  );

  const isProcessing = isUploading || isAnalyzing;

  return (
    <div className="text-center max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-2">Upload Contract</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Upload a document to analyze with AI
      </p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-12 transition-all cursor-pointer",
          isDragging ? "border-foreground bg-secondary/50" : "border-border hover:border-foreground/50",
          isProcessing && "pointer-events-none opacity-60"
        )}
      >
        <input
          type="file"
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
          className="hidden"
          id="file-upload"
          disabled={isProcessing}
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          {isProcessing ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin mb-4" />
              <p className="text-sm font-medium">
                {isUploading ? "Uploading..." : "Analyzing..."}
              </p>
              <p className="text-xs text-muted-foreground mt-1">This may take a moment</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="h-8 w-8 mb-4 text-muted-foreground" />
              <p className="text-sm font-medium mb-1">Drop file here or click to browse</p>
              <p className="text-xs text-muted-foreground">PDF, Word, or Images up to 50MB</p>
            </div>
          )}
        </label>
      </div>
    </div>
  );
}
