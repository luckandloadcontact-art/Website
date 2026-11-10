import type { Metadata } from 'next'
import { ScaledFrame } from '@/components/overlay/ScaledFrame'

// Header bar placed on top of the Hype room's player list on stream. Add it in OBS as a Browser
// Source pointing to https://luckandloadtv.com/overlay/room-header, sized 320x44 (or any size with
// the same ratio).
export const metadata: Metadata = {
  title: 'Room header – LuckAndLoadTV',
  robots: { index: false, follow: false },
}

export default function RoomHeaderOverlayPage() {
  return (
    <ScaledFrame width={320} height={44}>
      <style>
        {
          // Calm "breathing" glow: the dot never fades out, only the soft halo swells slowly.
          '@keyframes room-dot{0%,100%{opacity:.8;box-shadow:0 0 2px 0 rgba(28,228,121,.3)}50%{opacity:1;box-shadow:0 0 6px 1px rgba(28,228,121,.55)}}'
        }
      </style>
      <div className="flex h-full w-full items-center justify-between rounded-t-[14px] border-2 border-b-0 border-indigo-400/40 bg-gradient-to-r from-[#161a3a] to-[#0f1229] px-4">
        <div className="flex items-center gap-2.5">
          <span
            className="h-2.5 w-2.5 rounded-full bg-hype"
            style={{ animation: 'room-dot 3.2s ease-in-out infinite' }}
          />
          <span className="text-[16px] font-black uppercase tracking-wider text-white">Room players</span>
        </div>
        <span className="text-[13px] font-bold uppercase tracking-wider text-slate-400">Balance</span>
      </div>
    </ScaledFrame>
  )
}
