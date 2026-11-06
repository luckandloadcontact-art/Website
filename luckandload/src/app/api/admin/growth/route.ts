import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getGrowthData } from '@/lib/growth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user.role !== 'admin' && session.user.role !== 'mod')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    return NextResponse.json(await getGrowthData())
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 })
  }
}
