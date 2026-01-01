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
    // 始终使用 anon key 用于 Supabase 的 JWT 验证
    'Authorization': `Bearer ${supabaseAnonKey}`
  }

  // 将自定义 token 放在请求体中，而不是 Authorization header
  const bodyPayload = token
    ? { ...payload, _customToken: token }
    : payload

  const response = await fetch(
    `${supabaseUrl}/functions/v1/${functionName}`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(bodyPayload),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.message || '请求失败')
  }

  return data
}
