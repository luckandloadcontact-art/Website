'use client'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#181828',
            color: '#e2e8f0',
            border: '1px solid rgba(249,115,22,0.2)',
            borderRadius: '10px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#f97316', secondary: '#0d0d14' } },
        }}
      />
    </SessionProvider>
  )
}
