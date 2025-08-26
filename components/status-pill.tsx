import { cn } from "@/lib/utils"

interface StatusPillProps {
  status: "verified" | "failed" | "unknown"
  className?: string
}

export function StatusPill({ status, className }: StatusPillProps) {
  const variants = {
    verified: "border-green-200 text-green-800 bg-green-50",
    failed: "border-red-200 text-red-800 bg-red-50",
    unknown: "border-amber-200 text-amber-800 bg-amber-50",
  }

  const labels = {
    verified: "Verified",
    failed: "Failed (tampered)",
    unknown: "Unknown signer",
  }

  const dots = {
    verified: "bg-green-500",
    failed: "bg-red-500",
    unknown: "bg-amber-500",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs border font-medium",
        variants[status],
        className,
      )}
    >
      <div className={cn("h-1.5 w-1.5 rounded-full", dots[status])} />
      {labels[status]}
    </span>
  )
}
