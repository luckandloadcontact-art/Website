import { cn } from '@/lib/utils'
import Image from 'next/image'

// ─── Badge ────────────────────────────────────────────────
interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          'bg-white/8 text-slate-300': variant === 'default',
          'bg-brand-500/15 text-brand-400': variant === 'brand',
          'bg-green-500/15 text-green-400': variant === 'success',
          'bg-yellow-500/15 text-yellow-400': variant === 'warning',
          'bg-red-500/15 text-red-400': variant === 'danger',
          'bg-blue-500/15 text-blue-400': variant === 'info',
        },
        className
      )}
    >
      {children}
    </span>
  )
}

// ─── Avatar ───────────────────────────────────────────────
interface AvatarProps {
  src?: string | null
  name: string
  size?: number
  className?: string
}

export function Avatar({ src, name, size = 36, className }: AvatarProps) {
  const initials = name.slice(0, 2).toUpperCase()
  const colors = [
    'bg-purple-500/30 text-purple-300',
    'bg-blue-500/30 text-blue-300',
    'bg-green-500/30 text-green-300',
    'bg-brand-500/30 text-brand-300',
    'bg-pink-500/30 text-pink-300',
  ]
  const colorClass = colors[name.charCodeAt(0) % colors.length]

  return (
    <div
      className={cn('shrink-0 overflow-hidden rounded-full', className)}
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image src={src} alt={name} width={size} height={size} className="object-cover" />
      ) : (
        <div
          className={cn('flex h-full w-full items-center justify-center text-xs font-bold', colorClass)}
        >
          {initials}
        </div>
      )}
    </div>
  )
}

// ─── Stat card ────────────────────────────────────────────
export function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl bg-surface-700/60 border border-white/5 p-4">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
  )
}
