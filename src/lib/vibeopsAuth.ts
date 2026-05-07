const ACCESS_TOKEN_KEY = 'reportly_access_token'
const REFRESH_TOKEN_KEY = 'reportly_refresh_token'

function apiUrl() { return import.meta.env.VITE_REPORTLY_API_URL || 'http://localhost:5292/api/v1' }
function supabaseUrl() { return import.meta.env.VITE_SUPABASE_URL || '' }
function supabaseAnonKey() { return import.meta.env.VITE_SUPABASE_ANON_KEY || '' }

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${apiUrl()}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
  })
  const payload = await response.json().catch(() => null)
  if (!response.ok || payload?.ok === false) {
    throw new Error(payload?.error?.message ?? payload?.message ?? `Request failed (${response.status})`)
  }
  return (payload?.data ?? payload) as T
}

export interface VibeOpsUser {
  userId: string
  email: string
  role: string
  fullName?: string
  avatarUrl?: string
}

export async function loginWithEmail(email: string, password: string): Promise<void> {
  const data = await request<{ accessToken: string; refreshToken: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  setTokens(data.accessToken, data.refreshToken)
}

export async function registerWithEmail(email: string, password: string): Promise<void> {
  const data = await request<{ accessToken: string; refreshToken: string }>('/auth/register-with-code', {
    method: 'POST',
    body: JSON.stringify({ email, password, inviteCode: null }),
  })
  setTokens(data.accessToken, data.refreshToken)
}

export async function fetchUser(): Promise<VibeOpsUser | null> {
  const token = getAccessToken()
  if (!token) return null
  try {
    return await request<VibeOpsUser>('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
  } catch {
    clearTokens()
    return null
  }
}

export function startGoogleSignIn(): void {
  const url = new URL('/auth/v1/authorize', supabaseUrl())
  url.searchParams.set('provider', 'google')
  url.searchParams.set('redirect_to', window.location.origin + '/')
  url.searchParams.set('apikey', supabaseAnonKey())
  window.location.assign(url.toString())
}

export function consumeOAuthCallback(): { accessToken: string; refreshToken: string } | null {
  const hash = window.location.hash
  if (!hash) return null
  const params = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash)
  const accessToken = params.get('access_token')
  const refreshToken = params.get('refresh_token')
  if (!accessToken || !refreshToken) return null
  window.history.replaceState(null, '', window.location.pathname + window.location.search)
  setTokens(accessToken, refreshToken)
  return { accessToken, refreshToken }
}

export async function syncSocialUser(accessToken: string): Promise<void> {
  try {
    await request('/auth/social-sync', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  } catch { /* fallback to /me */ }
}
