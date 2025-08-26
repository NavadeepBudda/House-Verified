"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FileDrop } from "@/components/file-drop"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProofPanel } from "@/components/proof-panel"
import { CheckCircle, XCircle, AlertTriangle, Copy } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

// Mock verification results based on filename
const mockResults = {
  "broadband-grant.pdf": {
    state: "verified" as const,
    issuer: "U.S. House of Representatives",
    signedAt: "2025-08-10T14:22:11Z",
    chain: "valid" as const,
    assetHash: "sha256:8f3a...c21",
    manifestUrl: "https://trust.house.gov/manifests/abc.json",
    references: [{ label: "Congress.gov bill", url: "https://www.congress.gov/bill/..." }],
  },
  "town-hall.png": {
    state: "failed" as const,
    issuer: "Office of Rep. Smith",
    signedAt: "2025-08-09T10:15:30Z",
    chain: "valid" as const,
    assetHash: "sha256:2b4f...d89",
    manifestUrl: "https://trust.house.gov/manifests/def.json",
  },
  "floor-clip.mp4": {
    state: "unknown" as const,
    issuer: "Unknown Signer",
    signedAt: "2025-08-08T16:45:22Z",
    chain: "missing" as const,
    assetHash: "sha256:9c7e...f12",
  },
}

export default function VerifyPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [urlInput, setUrlInput] = useState("")
  const [verificationResult, setVerificationResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showProofPanel, setShowProofPanel] = useState(false)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    performVerification(file.name)
  }

  const handleUrlCheck = () => {
    if (urlInput) {
      const filename = urlInput.split("/").pop() || ""
      performVerification(filename)
    }
  }

  const performVerification = async (filename: string) => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock result based on filename
    const result =
      Object.entries(mockResults).find(([key]) => filename.toLowerCase().includes(key.split(".")[0]))?.[1] ||
      mockResults["floor-clip.mp4"] // Default to unknown

    setVerificationResult(result)
    setIsLoading(false)
  }

  const copyResult = () => {
    if (verificationResult) {
      navigator.clipboard.writeText(JSON.stringify(verificationResult, null, 2))
    }
  }

  const getStateIcon = (state: string) => {
    switch (state) {
      case "verified":
        return <CheckCircle className="h-6 w-6 text-green-600" />
      case "failed":
        return <XCircle className="h-6 w-6 text-red-600" />
      case "unknown":
        return <AlertTriangle className="h-6 w-6 text-amber-600" />
      default:
        return null
    }
  }

  const getStateColor = (state: string) => {
    switch (state) {
      case "verified":
        return "text-green-600"
      case "failed":
        return "text-red-600"
      case "unknown":
        return "text-amber-600"
      default:
        return ""
    }
  }

  const getStateBanner = (state: string) => {
    switch (state) {
      case "failed":
        return "This file's signature doesn't match the original."
      case "unknown":
        return "Signature present, but not from a trusted House key."
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Verify a House file</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="file" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="file">File</TabsTrigger>
                  <TabsTrigger value="url">URL</TabsTrigger>
                </TabsList>

                <TabsContent value="file" className="space-y-4">
                  <FileDrop onFileSelect={handleFileSelect} />
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground text-center">Selected: {selectedFile.name}</p>
                  )}
                </TabsContent>

                <TabsContent value="url" className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://example.com/file.pdf"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                    />
                    <Button onClick={handleUrlCheck} disabled={!urlInput || isLoading}>
                      Check
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              {isLoading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Verifying...</p>
                </div>
              )}

              {verificationResult && !isLoading && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Verification Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* State Banner */}
                    {getStateBanner(verificationResult.state) && (
                      <div
                        className={`p-3 rounded-md text-sm font-medium ${
                          verificationResult.state === "failed"
                            ? "bg-red-50 text-red-800"
                            : "bg-amber-50 text-amber-800"
                        }`}
                      >
                        {getStateBanner(verificationResult.state)}
                      </div>
                    )}

                    {/* Large State Row */}
                    <div className="flex items-center gap-3 py-2">
                      {getStateIcon(verificationResult.state)}
                      <span className={`text-xl font-semibold ${getStateColor(verificationResult.state)}`}>
                        {verificationResult.state === "verified"
                          ? "Verified"
                          : verificationResult.state === "failed"
                            ? "Failed (tampered)"
                            : "Unknown signer"}
                      </span>
                    </div>

                    {/* Key Rows */}
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Issuer</span>
                        <span className="font-medium">{verificationResult.issuer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Signed at</span>
                        <span className="font-medium">{new Date(verificationResult.signedAt).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Asset hash</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs">{verificationResult.assetHash}</span>
                          <Button variant="ghost" size="sm" onClick={copyResult}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Trust chain</span>
                        <span className="font-medium capitalize">{verificationResult.chain}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t">
                      <Button variant="outline" size="sm" onClick={() => setShowProofPanel(true)}>
                        View proof
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/asset/1">Open asset</Link>
                      </Button>
                      <Button variant="outline" size="sm" onClick={copyResult}>
                        Copy verification result
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />

      <ProofPanel isOpen={showProofPanel} onClose={() => setShowProofPanel(false)} data={verificationResult || {}} />
    </div>
  )
}
