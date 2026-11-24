import Link from 'next/link'
import { Ticket } from 'lucide-react'
import { cn } from '@/lib/utils'

// One line about the monthly $100 draw for new players, placed next to the Hype.bet sign-up
// buttons (casino page and guide boxes), where readers decide whether to sign up.
export function DrawNote({ className }: { className?: string }) {
  return (
    <p className={cn('flex items-start gap-2 text-sm leading-6 text-slate-200', className)}>
      <Ticket size={16} className="mt-1 shrink-0 text-hype" />
      <span>
        <strong className="text-white">New players:</strong> sign up through our link and you&apos;re in our monthly $100
        draw.{' '}
        <Link href="/draw" className="text-brand-400 underline underline-offset-2 hover:text-brand-300">
          How the draw works
        </Link>
      </span>
    </p>
  )
}
