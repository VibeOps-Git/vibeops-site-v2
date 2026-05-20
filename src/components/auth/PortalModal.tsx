import { X, ArrowRight } from 'lucide-react'
import { getAccessToken, getRefreshToken } from '@/lib/vibeopsAuth'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const REPORTLY_URL = import.meta.env.VITE_REPORTLY_URL || 'https://reportly.ca'

function buildTokenRelayUrl(base: string): string {
  const at = getAccessToken()
  const rt = getRefreshToken()
  if (at && rt) {
    return `${base}/#access_token=${encodeURIComponent(at)}&refresh_token=${encodeURIComponent(rt)}`
  }
  return base
}

export default function PortalModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null

  const reportlyUrl = buildTokenRelayUrl(REPORTLY_URL)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0c0e14] shadow-2xl shadow-black/60"
        onClick={e => e.stopPropagation()}
      >
        <div className="h-[3px] bg-gradient-to-r from-[#00ffcc] to-emerald-400" />

        <div className="p-8">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <img src="/logo-wht-hrzntl.png" alt="VibeOps" className="h-6 mb-3 opacity-90" />
              <h2 className="text-xl font-bold text-white">You're signed in.</h2>
              <p className="mt-1 text-sm text-white/50">Where would you like to go?</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/40 transition-colors hover:border-white/20 hover:text-white/70"
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>

          <a
            href={reportlyUrl}
            className="group flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:border-[#00ffcc]/30 hover:bg-white/[0.06]"
          >
            <div>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-xl">
                📄
              </div>
              <h3 className="font-bold text-white">Reportly</h3>
              <p className="mt-2 text-xs leading-relaxed text-white/40">
                AI report automation for civil and construction teams. Templates in, polished reports out.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-[#00ffcc]/70 group-hover:text-[#00ffcc] transition-colors">
              Open <ArrowRight size={14} />
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
