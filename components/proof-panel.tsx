"use client"

import { X, ShieldCheck, AlertTriangle, XCircle, Copy, Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

interface ProofPanelProps {
  isOpen: boolean
  onClose: () => void
  data: {
    state: "verified" | "failed" | "unknown"
    issuer: string
    signedAt: string
    chain: "valid" | "missing" | "revoked"
    assetHash: string
    manifestUrl?: string
    references?: Array<{ label: string; url: string }>
  }
}

export function ProofPanel({ isOpen, onClose, data }: ProofPanelProps) {
  const [showRawJson, setShowRawJson] = useState(false)

  if (!isOpen) return null

  const stateConfig = {
    verified: {
      icon: ShieldCheck,
      label: "Verified",
      color: "text-green-600",
    },
    failed: {
      icon: XCircle,
      label: "Failed (tampered)",
      color: "text-red-600",
    },
    unknown: {
      icon: AlertTriangle,
      label: "Unknown signer",
      color: "text-amber-600",
    },
  }

  const config = stateConfig[data.state]
  const StateIcon = config.icon

  const copyResult = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <StateIcon className={`h-6 w-6 ${config.color}`} />
            <CardTitle className={config.color}>{config.label}</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary */}
          <div className="space-y-3">
            <h3 className="font-semibold">Summary</h3>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Issuer</span>
                <span className="font-medium">{data.issuer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Signed at</span>
                <span className="font-medium">{new Date(data.signedAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Chain</span>
                <span className="font-medium capitalize">{data.chain}</span>
              </div>
            </div>
          </div>

          {/* Manifest Contents */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Manifest contents</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowRawJson(!showRawJson)}>
                {showRawJson ? "Hide" : "View raw JSON"}
              </Button>
            </div>
            {showRawJson && (
              <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">{JSON.stringify(data, null, 2)}</pre>
            )}
          </div>

          {/* References */}
          {data.references && data.references.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Links</h3>
              <div className="space-y-2">
                {data.references.map((ref, index) => (
                  <a
                    key={index}
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {ref.label}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            <Button onClick={copyResult} variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Copy result JSON
            </Button>
            {data.manifestUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={data.manifestUrl} download>
                  <Download className="h-4 w-4 mr-2" />
                  Download manifest
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
