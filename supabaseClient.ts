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
    'apikey': supabaseAnonKey,  // 添加 Supabase API Key
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
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
