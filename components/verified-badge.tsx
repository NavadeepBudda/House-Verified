"use client"

import { ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface VerifiedBadgeProps {
  variant?: "default" | "compact" | "muted"
  onClick?: () => void
  className?: string
}

export function VerifiedBadge({ variant = "default", onClick, className }: VerifiedBadgeProps) {
  const baseClasses =
    "inline-flex items-center gap-2 rounded-md px-2.5 py-1 border font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"

  const variants = {
    default: "bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100",
    compact: "bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100 px-2 py-1",
    muted: "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100",
  }

  return (
    <button
      onClick={onClick}
      className={cn(baseClasses, variants[variant], className)}
      aria-pressed={variant !== "muted"}
    >
      <ShieldCheck className="h-4 w-4" />
      {variant === "compact" ? null : "Verified by the House"}
    </button>
  )
}
