import { Shield } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8" />
          <span className="text-xl font-bold">House Verified</span>
        </div>
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary-foreground/80">
            Showcase
          </Link>
          <Link href="/verify" className="text-sm font-medium hover:text-primary-foreground/80">
            Verify
          </Link>
          <Link href="/docs" className="text-sm font-medium hover:text-primary-foreground/80">
            Docs
          </Link>
        </nav>
      </div>
    </header>
  )
}
