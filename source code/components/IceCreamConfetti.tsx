import { useEffect, useState } from 'react'

interface ConfettiPiece {
  id: number
  emoji: string
  left: number // percentage 0-100
  size: number // px
  duration: number // seconds
  delay: number // seconds
  sway: number // px
  rot: number // degrees
}

interface Props {
  triggerCount: number
}

function playCelebrationChime() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    const now = ctx.currentTime
    // Pleasant high major triad chord arpeggio
    const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + idx * 0.08)

      gain.gain.setValueAtTime(0.001, now + idx * 0.08)
      gain.gain.exponentialRampToValueAtTime(0.12, now + idx * 0.08 + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.6)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now + idx * 0.08)
      osc.stop(now + idx * 0.08 + 0.65)
    })
  } catch {
    // Audio might be blocked or unsupported; ignore silently
  }
}

export default function IceCreamConfetti({ triggerCount }: Props) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    if (triggerCount === 0) return

    playCelebrationChime()
    setShowToast(true)

    // Generate ~55 small vanilla ice cream emoji particles
    const emojis = ['🍦', '🍦', '🍦', '🍦', '🍨']
    const newPieces: ConfettiPiece[] = Array.from({ length: 55 }, (_, i) => ({
      id: Date.now() + i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      left: Math.random() * 96 + 2, // 2% to 98%
      size: Math.floor(Math.random() * 14) + 16, // 16px to 30px (many small vanilla ice creams)
      duration: 2.0 + Math.random() * 1.6, // 2.0s to 3.6s
      delay: Math.random() * 0.65, // 0s to 0.65s staggered
      sway: (Math.random() - 0.5) * 90, // -45px to +45px horizontal drift
      rot: (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 360),
    }))

    setPieces(newPieces)

    const timer = setTimeout(() => {
      setPieces([])
      setShowToast(false)
    }, 4000)

    return () => clearTimeout(timer)
  }, [triggerCount])

  if (pieces.length === 0 && !showToast) return null

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      aria-hidden="true"
    >
      {/* Toast notification badge */}
      {showToast && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-none animate-bounce flex items-center gap-2 bg-[#2C1810] text-[#FFF8EF] px-4 py-2 rounded-full shadow-xl border border-amber-200/20 text-xs font-bold tracking-wide">
          <span className="text-base">🍦</span>
          <span>Session completed! Sweet progress!</span>
          <span className="text-base">✨</span>
        </div>
      )}

      {/* Confetti pieces */}
      {pieces.map(p => (
        <div
          key={p.id}
          className="absolute select-none will-change-transform"
          style={
            {
              left: `${p.left}%`,
              top: 0,
              fontSize: `${p.size}px`,
              animation: `iceCreamFall ${p.duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${p.delay}s forwards`,
              '--sway': `${p.sway}px`,
              '--rot': `${p.rot}deg`,
            } as React.CSSProperties
          }
        >
          {p.emoji}
        </div>
      ))}
    </div>
  )
}
