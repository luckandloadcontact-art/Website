'use client'

import { useState } from 'react'
import { ExternalLink, Play } from 'lucide-react'
import type { SocialPost } from '@/lib/socialFeed'
import { formatRelativeTime } from '@/lib/utils'

const PLATFORM_LABEL: Record<SocialPost['platform'], string> = {
  youtube: 'YouTube',
  instagram: 'Instagram',
}

const PLATFORM_COLOR: Record<SocialPost['platform'], string> = {
  youtube: 'bg-red-500/15 text-red-400 border-red-500/30',
  instagram: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
}

/**
 * Viser ett innlegg -- enten med direkte avspilling (embeddable) eller som et miniatyrbilde
 * med lenke ut til plattformen (ikke embeddable, f.eks. en aldersbegrenset YouTube-video eller
 * en Instagram-video med lisensiert lyd). Spilleren lastes først når man trykker play, slik at
 * ikke alle kortene prøver å laste video/iframe samtidig.
 */
export function MediaCard({ post }: { post: SocialPost }) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-surface-800">
      <div className="relative aspect-[9/16] sm:aspect-square bg-black">
        {playing && post.embeddable && post.embedUrl ? (
          post.platform === 'youtube' ? (
            <iframe
              src={`${post.embedUrl}?autoplay=1`}
              title={post.title}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={post.embedUrl}
              poster={post.thumbnailUrl ?? undefined}
              className="absolute inset-0 h-full w-full object-contain"
              controls
              autoPlay
            />
          )
        ) : (
          <button
            type="button"
            onClick={() => (post.embeddable ? setPlaying(true) : window.open(post.permalink, '_blank', 'noopener,noreferrer'))}
            className="group absolute inset-0 flex items-center justify-center"
          >
            {post.thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.thumbnailUrl}
                alt={post.title || PLATFORM_LABEL[post.platform]}
                className="absolute inset-0 h-full w-full object-cover transition-opacity group-hover:opacity-80"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-600 text-sm">
                {PLATFORM_LABEL[post.platform]}
              </div>
            )}
            <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/35" />
            <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-black shadow-lg">
              {post.embeddable ? <Play size={20} className="ml-0.5" fill="currentColor" /> : <ExternalLink size={18} />}
            </span>
            {!post.embeddable && (
              <span className="absolute bottom-2 left-2 right-2 rounded-lg bg-black/70 px-2 py-1 text-center text-[11px] text-slate-200">
                Only viewable on {PLATFORM_LABEL[post.platform]}
              </span>
            )}
          </button>
        )}
      </div>

      <div className="p-3">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${PLATFORM_COLOR[post.platform]}`}>
            {PLATFORM_LABEL[post.platform]}
          </span>
          <span className="text-[11px] text-slate-600">{formatRelativeTime(post.publishedAt)}</span>
        </div>
        {post.title && <p className="line-clamp-2 text-sm text-slate-300">{post.title}</p>}
        <a
          href={post.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-brand-400 hover:text-brand-300"
        >
          View on {PLATFORM_LABEL[post.platform]} <ExternalLink size={11} />
        </a>
      </div>
    </div>
  )
}
