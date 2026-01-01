import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to call Edge Functions
export async function callEdgeFunction(
  functionName: string,
  payload: Record<string, any>,
  token?: string
) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'apikey': supabaseAnonKey,
    // 始终发送 Authorization header，没有 token 时使用 anon key
    'Authorization': `Bearer ${token || supabaseAnonKey}`
  }

  const response = await fetch(
    `${supabaseUrl}/functions/v1/${functionName}`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.message || '请求失败')
  }

  return data
}
