import { createBrowserClient } from '@supabase/ssr'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

export function createServerSupabaseClient() {
  const cookieStore = cookies()
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) { return cookieStore.get(name)?.value },
      set(name: string, value: string, options: Record<string, unknown>) {
        try { cookieStore.set({ name, value, ...options as object }) } catch {}
      },
      remove(name: string, options: Record<string, unknown>) {
        try { cookieStore.set({ name, value: '', ...options as object }) } catch {}
      },
    },
  })
}

export function createAdminClient() {
  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
