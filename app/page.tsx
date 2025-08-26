import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { StatusPill } from "@/components/status-pill"
import { VerifiedBadge } from "@/components/verified-badge"
import { Shield, FileText, Video, ImageIcon, Zap, Lock, CheckCircle } from "lucide-react"
import Link from "next/link"

const sampleAssets = [
  {
    id: "1",
    title: "Press Release — Broadband Grant",
    type: "PDF",
    icon: FileText,
    issuedBy: "Committee on Energy & Commerce",
    signedAt: "2025-08-10",
    status: "verified" as const,
  },
  {
    id: "2",
    title: "District Town Hall Flyer",
    type: "Image",
    icon: ImageIcon,
    issuedBy: "Office of Rep. Smith",
    signedAt: "2025-08-09",
    status: "failed" as const,
  },
  {
    id: "3",
    title: "Floor Clip — H.R. 1234",
    type: "Video",
    icon: Video,
    issuedBy: "House Recording Studio",
    signedAt: "2025-08-08",
    status: "unknown" as const,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="relative py-24 px-4 bg-gradient-to-br from-background via-secondary/20 to-accent/10 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container mx-auto max-w-5xl text-center relative">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              Next-gen verification platform
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
              Verify. Trust. Secure.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Advanced cryptographic verification for digital assets. Instantly verify authenticity with
              blockchain-powered security.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                asChild
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Link href="/verify">Start Verification</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="text-lg px-8 py-6 border-2 hover:bg-accent/5 transition-all duration-300 bg-transparent"
              >
                <Link href="/asset/1">View Demo</Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm rounded-lg p-4">
                <div className="bg-accent/10 p-2 rounded-lg">
                  <Lock className="h-5 w-5 text-accent" />
                </div>
                <span className="font-medium">Military-grade encryption</span>
              </div>
              <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm rounded-lg p-4">
                <div className="bg-accent/10 p-2 rounded-lg">
                  <Zap className="h-5 w-5 text-accent" />
                </div>
                <span className="font-medium">Instant verification</span>
              </div>
              <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm rounded-lg p-4">
                <div className="bg-accent/10 p-2 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-accent" />
                </div>
                <span className="font-medium">100% tamper-proof</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Verified Assets Showcase</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore real-world examples of verified digital assets with cryptographic proof
              </p>
            </div>

            <div className="space-y-6">
              {sampleAssets.map((asset, index) => {
                const IconComponent = asset.icon
                return (
                  <Card
                    key={asset.id}
                    className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-r from-card to-card/50 backdrop-blur-sm"
                  >
                    <CardContent className="p-8">
                      <Link href={`/asset/${asset.id}`} className="block">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            <div className="relative">
                              <div className="rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 p-4 group-hover:scale-110 transition-transform duration-300">
                                <IconComponent className="h-8 w-8 text-accent" />
                              </div>
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse"></div>
                            </div>
                            <div>
                              <h3 className="font-bold text-xl mb-2 group-hover:text-accent transition-colors">
                                {asset.title}
                              </h3>
                              <p className="text-muted-foreground">
                                <span className="font-medium">{asset.type}</span> · {asset.issuedBy} · {asset.signedAt}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <StatusPill status={asset.status} />
                            {asset.status === "verified" && <VerifiedBadge variant="compact" />}
                          </div>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-gradient-to-b from-background to-secondary/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How Verification Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our three-step process ensures maximum security and transparency
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Shield className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent/20 rounded-full animate-ping"></div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 bg-accent text-white text-sm font-bold px-3 py-1 rounded-full">
                    01
                  </div>
                </div>
                <h3 className="font-bold text-xl mb-3">Cryptographic Signing</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Advanced C2PA manifest with military-grade cryptographic signatures embedded at creation
                </p>
              </div>

              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <VerifiedBadge variant="compact" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary/20 rounded-full animate-ping"></div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 bg-primary text-white text-sm font-bold px-3 py-1 rounded-full">
                    02
                  </div>
                </div>
                <h3 className="font-bold text-xl mb-3">Visual Verification</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Instant visual confirmation with our verified badge system and real-time status indicators
                </p>
              </div>

              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <FileText className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent/20 rounded-full animate-ping"></div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 bg-accent text-white text-sm font-bold px-3 py-1 rounded-full">
                    03
                  </div>
                </div>
                <h3 className="font-bold text-xl mb-3">Detailed Proof</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Complete cryptographic verification details with blockchain-level transparency and audit trails
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
