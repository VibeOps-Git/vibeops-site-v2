import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { clearTokens, consumeOAuthCallback, fetchUser, syncSocialUser, VibeOpsUser } from '@/lib/vibeopsAuth'
import LoginModal from '@/components/auth/LoginModal'
import PortalModal from '@/components/auth/PortalModal'

interface AuthContextValue {
  user: VibeOpsUser | null | undefined
  openLogin: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<VibeOpsUser | null | undefined>(undefined)
  const [showLogin, setShowLogin] = useState(false)
  const [showPortal, setShowPortal] = useState(false)

  useEffect(() => {
    void (async () => {
      const callback = consumeOAuthCallback()
      if (callback) await syncSocialUser(callback.accessToken)
      const currentUser = await fetchUser()
      setUser(currentUser)
      if (callback && currentUser) setShowPortal(true)
    })()
  }, [])

  const openLogin = useCallback(() => setShowLogin(true), [])

  function logout() {
    clearTokens()
    setUser(null)
  }

  async function handleLoginSuccess() {
    const currentUser = await fetchUser()
    setUser(currentUser)
    setShowLogin(false)
    setShowPortal(true)
  }

  return (
    <AuthContext.Provider value={{ user, openLogin, logout }}>
      {children}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} onSuccess={handleLoginSuccess} />
      <PortalModal isOpen={showPortal} onClose={() => setShowPortal(false)} />
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
