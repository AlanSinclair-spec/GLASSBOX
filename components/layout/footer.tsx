import Link from 'next/link'
import { GlassBoxLogo } from '@/components/logo'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <GlassBoxLogo className="h-6 w-6" />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with ❤️ for the AI agent community.
          </p>
        </div>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <Link href="/docs" className="hover:text-foreground">
            Docs
          </Link>
          <Link href="/pricing" className="hover:text-foreground">
            Pricing
          </Link>
          <Link href="/support" className="hover:text-foreground">
            Support
          </Link>
        </div>
      </div>
    </footer>
  )
}
