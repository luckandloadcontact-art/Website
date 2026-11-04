import Link from 'next/link'
import { cn } from '@/lib/utils'

export function GamblingNotice({ className }: { className?: string }) {
  return (
    <p className={cn('text-xs text-slate-500', className)}>
      18+ · Gamble responsibly ·{' '}
      <Link href="/responsible-gambling" className="underline underline-offset-2 hover:text-slate-300 transition-colors">
        Get help
      </Link>
    </p>
  )
}
