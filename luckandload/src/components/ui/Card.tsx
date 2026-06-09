import { cn } from '@/lib/utils'

interface CardProps {
  className?: string
  children: React.ReactNode
  glow?: boolean
}

export function Card({ className, children, glow }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/8 bg-surface-800 bg-card-shine',
        glow && 'hover:border-brand-500/30 hover:shadow-lg hover:shadow-brand-500/10 transition-all',
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('px-5 pt-5 pb-0', className)}>{children}</div>
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('px-5 py-5', className)}>{children}</div>
}
