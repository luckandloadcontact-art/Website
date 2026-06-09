import { cn } from '@/lib/utils'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40': variant === 'primary',
            'bg-surface-600 text-slate-200 border border-white/10 hover:bg-surface-500 hover:border-white/20': variant === 'secondary',
            'text-slate-400 hover:text-white hover:bg-white/5': variant === 'ghost',
            'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20': variant === 'danger',
          },
          {
            'px-3 py-1.5 text-xs': size === 'sm',
            'px-4 py-2.5 text-sm': size === 'md',
            'px-6 py-3 text-base': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
