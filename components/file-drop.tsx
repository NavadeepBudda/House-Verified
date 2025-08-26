"use client"

import type React from "react"

import { Upload, type File } from "lucide-react"
import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"

interface FileDropProps {
  onFileSelect: (file: File) => void
  className?: string
}

export function FileDrop({ onFileSelect, className }: FileDropProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        onFileSelect(files[0])
      }
    },
    [onFileSelect],
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      if (files.length > 0) {
        onFileSelect(files[0])
      }
    },
    [onFileSelect],
  )

  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors",
        isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50",
        className,
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileInput}
        accept=".pdf,.png,.jpg,.jpeg,.mp4"
      />
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-full bg-muted p-4">
          <Upload className="h-8 w-8 text-muted-foreground" />
        </div>
        <div>
          <p className="text-lg font-medium">Drag & drop or click to upload</p>
          <p className="text-sm text-muted-foreground mt-1">PDF, PNG/JPG, MP4 files supported</p>
        </div>
      </div>
    </div>
  )
}
