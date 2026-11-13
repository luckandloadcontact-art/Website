import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { GUIDES, formatGuideDate, getAuthor, getGuide } from '@/lib/guides'

// Share image for each guide (Discord, X, Kick chat): the guide's title on our dark brand
// background, so a shared link shows what the article is about instead of just the logo.
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'LuckAndLoadTV guide'

export function generateStaticParams() {
  return GUIDES.map(guide => ({ slug: guide.slug }))
}

export default async function GuideShareImage({ params }: { params: { slug: string } }) {
  const guide = getGuide(params.slug)
  const author = guide && getAuthor(guide.authorSlug)
  const title = guide?.title ?? 'LuckAndLoadTV Guides'

  // A guide with its own designed thumbnail shares that instead of the title card.
  // Falls back to the title card if the file can't be read.
  const file = guide?.shareImage
    ? await readFile(join(process.cwd(), 'public', guide.shareImage)).catch(() => null)
    : null
  if (file) {
    const src = `data:image/jpeg;base64,${file.toString('base64')}`
    return new ImageResponse(
      (
        <div style={{ width: '100%', height: '100%', display: 'flex', background: '#050e1c' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" width={size.width} height={size.height} style={{ objectFit: 'cover' }} />
        </div>
      ),
      size
    )
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: 'linear-gradient(135deg, #050e1c 0%, #08202a 60%, #0b2e33 100%)',
          color: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', fontSize: 28, fontWeight: 700, letterSpacing: 2, color: '#2dd4bf' }}>
            LUCKANDLOADTV
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 2,
              color: '#050e1c',
              background: '#1ce479',
              padding: '6px 14px',
              borderRadius: 8,
            }}
          >
            GUIDE
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: title.length > 50 ? 64 : 76, fontWeight: 800, lineHeight: 1.1 }}>
          {title}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 26, color: '#94a3b8' }}>
          <div style={{ display: 'flex' }}>
            {author ? `By ${author.name}` : 'LuckAndLoadTV'}
            {guide ? ` · ${formatGuideDate(guide.updated)}` : ''}
          </div>
          <div style={{ display: 'flex', color: '#e2e8f0' }}>luckandloadtv.com</div>
        </div>
      </div>
    ),
    size
  )
}
