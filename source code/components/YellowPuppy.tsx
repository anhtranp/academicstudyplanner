import React, { useEffect, useState } from 'react'

export type PuppyMood = 'studying' | 'paused' | 'celebrating'

interface Props {
  mood: PuppyMood
  size?: 'sm' | 'md' | 'lg'
  showMessage?: boolean
  customMessage?: string
}

const ENCOURAGING_QUOTES = [
  "You've got this! Moki is keeping watch 🐾",
  "Deep focus mode! One concept at a time ✨",
  "Great job staying focused! Keep going! 📖",
  "Your future self will thank you for this session! 🌟",
  "Smart study session in progress! 🧠",
  "Almost there! Sweet vanilla ice cream awaits! 🍦",
]

export default function YellowPuppy({
  mood,
  size = 'md',
  showMessage = true,
  customMessage,
}: Props) {
  const [quoteIndex, setQuoteIndex] = useState(0)

  // Rotate encouraging quote every 20 seconds while studying
  useEffect(() => {
    if (mood !== 'studying') return
    const interval = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % ENCOURAGING_QUOTES.length)
    }, 20000)
    return () => clearInterval(interval)
  }, [mood])

  const dimensions = {
    sm: { w: 100, h: 100, text: 'text-xs' },
    md: { w: 140, h: 140, text: 'text-sm' },
    lg: { w: 180, h: 180, text: 'text-base' },
  }[size]

  let bubbleText = customMessage
  if (!bubbleText) {
    if (mood === 'celebrating') {
      bubbleText = 'YAY! Session finished! You did it! 🍦🎉'
    } else if (mood === 'paused') {
      bubbleText = "Timer paused! Take a quick sip of water 🐾"
    } else {
      bubbleText = ENCOURAGING_QUOTES[quoteIndex]
    }
  }

  return (
    <div className="flex flex-col items-center select-none">
      {/* Speech Bubble */}
      {showMessage && (
        <div className="relative mb-2 px-3.5 py-2 bg-white rounded-2xl border-2 border-[#F6C85F] shadow-sm text-center max-w-xs animate-[pulseSubtle_3s_ease-in-out_infinite]">
          <p className="text-xs sm:text-sm font-bold text-[#2C1810] leading-snug">
            {bubbleText}
          </p>
          {/* Bubble tail */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#F6C85F]" />
        </div>
      )}

      {/* Puppy Illustration */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: dimensions.w,
          height: dimensions.h,
          animation: mood === 'studying' ? 'puppyHeadBob 4s ease-in-out infinite' : undefined,
        }}
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Wagging Tail */}
          <g
            style={{
              transformOrigin: '145px 145px',
              animation: mood === 'celebrating'
                ? 'puppyTailWag 0.35s ease-in-out infinite'
                : 'puppyTailWag 1.1s ease-in-out infinite',
            }}
          >
            <path
              d="M140 145 C165 140, 185 115, 175 90 C165 80, 150 100, 140 120 Z"
              fill="#F6C85F"
              stroke="#DEAA3B"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </g>

          {/* Body */}
          <ellipse
            cx="100"
            cy="145"
            rx="52"
            ry="42"
            fill="#F6C85F"
            stroke="#DEAA3B"
            strokeWidth="3.5"
          />

          {/* Puppy Chest / Tummy Fur */}
          <ellipse
            cx="100"
            cy="148"
            rx="32"
            ry="26"
            fill="#FFF5DE"
          />

          {/* Left Ear */}
          <g
            style={{
              transformOrigin: '55px 65px',
              animation: 'puppyEarLeft 2.4s ease-in-out infinite',
            }}
          >
            <path
              d="M58 65 C30 75, 25 125, 45 130 C60 134, 70 105, 68 75 Z"
              fill="#E5B242"
              stroke="#C99426"
              strokeWidth="3.5"
            />
            <path
              d="M45 80 C36 90, 36 115, 48 120 C54 115, 58 98, 54 82 Z"
              fill="#D49C26"
              opacity="0.4"
            />
          </g>

          {/* Right Ear */}
          <g
            style={{
              transformOrigin: '145px 65px',
              animation: 'puppyEarRight 2.4s ease-in-out infinite',
            }}
          >
            <path
              d="M142 65 C170 75, 175 125, 155 130 C140 134, 130 105, 132 75 Z"
              fill="#E5B242"
              stroke="#C99426"
              strokeWidth="3.5"
            />
            <path
              d="M155 80 C164 90, 164 115, 152 120 C146 115, 142 98, 146 82 Z"
              fill="#D49C26"
              opacity="0.4"
            />
          </g>

          {/* Head */}
          <ellipse
            cx="100"
            cy="82"
            rx="46"
            ry="42"
            fill="#F6C85F"
            stroke="#DEAA3B"
            strokeWidth="3.5"
          />

          {/* Sweet Rosy Cheeks */}
          <ellipse cx="68" cy="94" rx="9" ry="6" fill="#FCA5A5" opacity="0.45" />
          <ellipse cx="132" cy="94" rx="9" ry="6" fill="#FCA5A5" opacity="0.45" />

          {/* Muzzle (creamy white) */}
          <ellipse
            cx="100"
            cy="96"
            rx="24"
            ry="18"
            fill="#FFF9ED"
            stroke="#DEAA3B"
            strokeWidth="2.5"
          />

          {/* Puppy Nose */}
          <path
            d="M93 88 C93 84, 107 84, 107 88 C107 94, 102 96, 100 96 C98 96, 93 94, 93 88 Z"
            fill="#2C1810"
          />
          {/* Nose shine */}
          <ellipse cx="98" cy="87" rx="2" ry="1.2" fill="#FFFFFF" opacity="0.8" />

          {/* Mouth & Tongue */}
          <path
            d="M94 96 C97 101, 100 102, 100 96 C100 102, 103 101, 106 96"
            stroke="#2C1810"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {mood !== 'paused' && (
            <path
              d="M97 100 C97 106, 103 106, 103 100 Z"
              fill="#FB7185"
            />
          )}

          {/* Big Sparkling Puppy Eyes (with blinking animation) */}
          <g style={{ transformOrigin: '100px 76px', animation: 'puppyBlink 3.8s ease-in-out infinite' }}>
            {/* Left Eye */}
            <circle cx="78" cy="74" r="7" fill="#2C1810" />
            <circle cx="76" cy="72" r="2.5" fill="#FFFFFF" />
            <circle cx="80" cy="76" r="1" fill="#FFFFFF" />

            {/* Right Eye */}
            <circle cx="122" cy="74" r="7" fill="#2C1810" />
            <circle cx="120" cy="72" r="2.5" fill="#FFFFFF" />
            <circle cx="124" cy="76" r="1" fill="#FFFFFF" />

            {/* Cute Eyebrows */}
            <ellipse cx="78" cy="62" rx="4" ry="2" fill="#C99426" />
            <ellipse cx="122" cy="62" rx="4" ry="2" fill="#C99426" />
          </g>

          {/* Adorable Study Spectacles (Glasses) */}
          <g opacity="0.9">
            {/* Left lens frame */}
            <circle cx="78" cy="74" r="13" fill="none" stroke="#2C1810" strokeWidth="2.5" />
            {/* Right lens frame */}
            <circle cx="122" cy="74" r="13" fill="none" stroke="#2C1810" strokeWidth="2.5" />
            {/* Bridge */}
            <path d="M91 74 C96 71, 104 71, 109 74" fill="none" stroke="#2C1810" strokeWidth="2.5" strokeLinecap="round" />
            {/* Lens subtle glass reflection */}
            <path d="M72 68 L78 64" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            <path d="M116 68 L122 64" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          </g>

          {/* Front Paws resting comfortably */}
          <g style={{ animation: 'puppyPaws 2.2s ease-in-out infinite' }}>
            {/* Left paw */}
            <ellipse
              cx="74"
              cy="166"
              rx="15"
              ry="11"
              fill="#FFF5DE"
              stroke="#DEAA3B"
              strokeWidth="3"
            />
            <path d="M69 168 L69 174 M74 169 L74 175 M79 168 L79 174" stroke="#DEAA3B" strokeWidth="2" strokeLinecap="round" />

            {/* Right paw */}
            <ellipse
              cx="126"
              cy="166"
              rx="15"
              ry="11"
              fill="#FFF5DE"
              stroke="#DEAA3B"
              strokeWidth="3"
            />
            <path d="M121 168 L121 174 M126 169 L126 175 M131 168 L131 174" stroke="#DEAA3B" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* Celebration Party Hat when completed */}
          {mood === 'celebrating' && (
            <g transform="translate(100, 42) rotate(10)">
              {/* Cone */}
              <polygon points="-16,0 16,0 0,-34" fill="#E8631C" stroke="#FFF8EF" strokeWidth="2" />
              {/* Stripes */}
              <line x1="-8" y1="-8" x2="8" y2="-8" stroke="#FDE047" strokeWidth="3" />
              <line x1="-5" y1="-18" x2="5" y2="-18" stroke="#38BDF8" strokeWidth="3" />
              {/* Pompom */}
              <circle cx="0" cy="-36" r="5" fill="#FDE047" />
            </g>
          )}
        </svg>
      </div>

      {/* Moki Name Tag */}
      <div className="mt-1 flex items-center gap-1 bg-[#FFF0E6] text-[#E8631C] px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-[#F5D9C8]">
        <span>🐾 Moki</span>
        <span className="text-[10px] text-[#7A6352]">• Study Buddy</span>
      </div>
    </div>
  )
}
