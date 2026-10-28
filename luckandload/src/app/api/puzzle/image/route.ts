import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase'
import { WHEEL_GAMES } from '@/lib/slotWheel'
import {
  getPuzzleDay, PUZZLE_ATTEMPTS, isDateInRange, getPuzzleCropConfig,
  PUZZLE_SAFE_HEIGHT_FRACTION, PUZZLE_OUTPUT_SIZE,
} from '@/lib/slotPuzzle'

// sharp er en native binding -- må kjøre i Node.js-runtimen, ikke Edge.
export const runtime = 'nodejs'

function contentTypeFor(file: string): string {
  if (file.endsWith('.png')) return 'image/png'
  if (file.endsWith('.webp')) return 'image/webp'
  return 'image/jpeg'
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const today = getPuzzleDay()
  const date = req.nextUrl.searchParams.get('date') || today
  if (!isDateInRange(date, today)) return NextResponse.json({ error: 'Invalid date' }, { status: 400 })

  const supabase = createAdminClient()
  const { data: puzzleDay } = await supabase
    .from('puzzle_days').select('game_id').eq('puzzle_date', date).maybeSingle()
  if (!puzzleDay) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const game = WHEEL_GAMES.find(g => g.id === puzzleDay.game_id)
  if (!game) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  let guesses: string[] = []
  let solved = false
  if (session?.user?.dbId) {
    const { data: attempt } = await supabase
      .from('puzzle_attempts').select('guesses, solved')
      .eq('user_id', session.user.dbId).eq('puzzle_date', date).maybeSingle()
    if (attempt) { guesses = attempt.guesses ?? []; solved = attempt.solved }
  }
  const attemptsUsed = guesses.length
  const gameOver = solved || attemptsUsed >= PUZZLE_ATTEMPTS
  const zoomLevel = Math.min(attemptsUsed, PUZZLE_ATTEMPTS - 1)

  const filePath = path.join(process.cwd(), 'public', game.image)
  const original = await readFile(filePath)

  // Løst/ferdig -- trygt å sende hele originalbildet, navnet er uansett avslørt i svaret.
  // VIKTIG: no-store her også -- URL-en (?date=...&v=forsøk-ferdig) er IKKE unik per spill, så
  // hvis admin "reroller" dagens spill kan et gammelt cachet svar fra FØR rerollet ellers havne
  // sammen med riktig svar/navn fra ETTER rerollet (dette var en reell bug: banneren viste
  // riktig navn, men et cachet cover-bilde fra det forrige spillet).
  if (gameOver) {
    return new NextResponse(new Uint8Array(original), {
      headers: { 'Content-Type': contentTypeFor(game.image), 'Cache-Control': 'private, no-store' },
    })
  }

  // Fortsatt uløst -- bygg et faktisk, server-rendret beskåret/uskarpt/svart-hvitt utsnitt.
  // VIKTIG: dette må skje i selve bildedataene (ikke CSS), ellers kan brukeren hente ut det
  // skarpe originalbildet via nettleserens "Lagre bilde"/"Del"/Live Text-funksjoner.
  const meta = await sharp(original).metadata()
  const w = meta.width ?? 420
  const h = meta.height ?? 594
  const safeH = Math.round(h * PUZZLE_SAFE_HEIGHT_FRACTION)
  const baseSize = Math.min(w, safeH)

  const cfg = getPuzzleCropConfig(zoomLevel, game.id)
  const cropSize = Math.max(16, Math.min(baseSize, Math.round(baseSize / cfg.scale)))
  const left = Math.max(0, Math.min(w - cropSize, Math.round((cfg.originX / 100) * w - cropSize / 2)))
  const top = Math.max(0, Math.min(safeH - cropSize, Math.round((cfg.originY / 100) * safeH - cropSize / 2)))

  let pipeline = sharp(original)
    .extract({ left, top, width: cropSize, height: cropSize })
    .resize(PUZZLE_OUTPUT_SIZE, PUZZLE_OUTPUT_SIZE)

  if (cfg.grayscale > 0) pipeline = pipeline.grayscale()
  if (cfg.blur > 0) pipeline = pipeline.blur(cfg.blur)

  const output = await pipeline.jpeg({ quality: 82 }).toBuffer()
  return new NextResponse(new Uint8Array(output), {
    headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'private, no-store' },
  })
}
