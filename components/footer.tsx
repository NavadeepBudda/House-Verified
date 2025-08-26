export function Footer() {
  return (
    <footer className="border-t bg-muted/30 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground">
              Accessibility
            </a>
            <a href="#" className="hover:text-foreground">
              Open Source
            </a>
          </div>
          <div className="text-sm text-muted-foreground">Build: abc123def</div>
        </div>
      </div>
    </footer>
  )
}
