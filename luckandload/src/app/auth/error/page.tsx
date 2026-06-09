'use client'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 mb-5">
          <AlertTriangle size={24} className="text-red-400" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Sign in failed</h1>
        <p className="text-slate-400 text-sm mb-6">Something went wrong. Please try again.</p>
        <Link href="/auth/signin">
          <Button>Try again</Button>
        </Link>
      </div>
    </div>
  )
}
