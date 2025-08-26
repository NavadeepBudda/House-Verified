"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { VerifiedBadge } from "@/components/verified-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, ExternalLink, FileText, Copy } from "lucide-react"
import { notFound } from "next/navigation"

// Mock asset data
const mockAssets: Record<string, any> = {
  "1": {
    id: "1",
    title: "Press Release — Broadband Grant",
    type: "PDF",
    issuedBy: "Committee on Energy & Commerce",
    signedAt: "2025-08-10T14:22:11Z",
    status: "verified",
    thumbnail: "/pdf-document-preview.png",
    downloadUrl: "#",
    provenance: {
      issuer: "U.S. House of Representatives (Committee on Energy & Commerce)",
      certThumbprint: "SHA1: A1B2C3...",
      trustChain: "Valid",
      signatureAlgorithm: "RSA-SHA256",
    },
    references: [
      { label: "Congress.gov Bill H.R. 1234", url: "https://www.congress.gov/bill/..." },
      { label: "Committee Markup", url: "https://docs.house.gov/..." },
    ],
    technical: {
      assetHash: "sha256:8f3a4b2c1d9e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c",
      manifestUrl: "https://trust.house.gov/manifests/abc.json",
      c2paVersion: "1.3",
    },
  },
  "2": {
    id: "2",
    title: "District Town Hall Flyer",
    type: "Image",
    issuedBy: "Office of Rep. Smith",
    signedAt: "2025-08-09T10:15:30Z",
    status: "failed",
    thumbnail: "/placeholder-6j8ii.png",
    downloadUrl: "#",
    provenance: {
      issuer: "Office of Rep. Smith",
      certThumbprint: "SHA1: D4E5F6...",
      trustChain: "Valid",
      signatureAlgorithm: "RSA-SHA256",
    },
    technical: {
      assetHash: "sha256:2b4f8a1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c",
      manifestUrl: "https://trust.house.gov/manifests/def.json",
      c2paVersion: "1.3",
    },
  },
}

export default function AssetPage({ params }: { params: { id: string } }) {
  const asset = mockAssets[params.id]

  if (!asset) {
    notFound()
  }

  const copyHash = () => {
    navigator.clipboard.writeText(asset.technical.assetHash)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header Area */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{asset.title}</h1>
                <Badge variant="secondary">{asset.type}</Badge>
              </div>
              <p className="text-muted-foreground">
                Issued by {asset.issuedBy} · Signed at {new Date(asset.signedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {asset.status === "verified" ? (
                <VerifiedBadge />
              ) : asset.status === "failed" ? (
                <Badge variant="destructive">Failed (tampered)</Badge>
              ) : (
                <Badge variant="secondary">Unknown signer</Badge>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Preview Panel */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center mb-4">
                    <img
                      src={asset.thumbnail || "/placeholder.svg"}
                      alt="Asset preview"
                      className="max-w-full max-h-full object-contain rounded"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button asChild>
                      <a href={asset.downloadUrl} download>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </a>
                    </Button>
                    <Button variant="outline">Open proof</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Details Sidebar */}
            <div className="space-y-6">
              {/* Provenance */}
              <Card>
                <CardHeader>
                  <CardTitle>Provenance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <div className="text-muted-foreground">Issuer</div>
                    <div className="font-medium">{asset.provenance.issuer}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Cert thumbprint</div>
                    <div className="font-mono text-xs">{asset.provenance.certThumbprint}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Trust chain status</div>
                    <div className="font-medium">{asset.provenance.trustChain}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Signature algorithm</div>
                    <div className="font-medium">{asset.provenance.signatureAlgorithm}</div>
                  </div>
                </CardContent>
              </Card>

              {/* References */}
              {asset.references && (
                <Card>
                  <CardHeader>
                    <CardTitle>References</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {asset.references.map((ref: any, index: number) => (
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
                  </CardContent>
                </Card>
              )}

              {/* Technical */}
              <Card>
                <CardHeader>
                  <CardTitle>Technical</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <div className="text-muted-foreground">Asset hash</div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded break-all">{asset.technical.assetHash}</code>
                      <Button variant="ghost" size="sm" onClick={copyHash}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  {asset.technical.manifestUrl && (
                    <div>
                      <div className="text-muted-foreground">Manifest URL</div>
                      <a
                        href={asset.technical.manifestUrl}
                        className="text-primary hover:underline text-xs break-all"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {asset.technical.manifestUrl}
                      </a>
                    </div>
                  )}
                  <div>
                    <div className="text-muted-foreground">C2PA version</div>
                    <div className="font-medium">{asset.technical.c2paVersion}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Related Section */}
          <section className="mt-12">
            <h2 className="text-xl font-bold mb-6">More from this office</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="aspect-video bg-muted rounded mb-3"></div>
                    <h3 className="font-semibold text-sm mb-1">Related Document {i}</h3>
                    <p className="text-xs text-muted-foreground">PDF · 2025-08-0{i}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
