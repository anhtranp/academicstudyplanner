import { useState, useEffect, useRef } from 'react'
import { StudySession } from '../types'
import YellowPuppy, { PuppyMood } from './YellowPuppy'

interface Props {
  session: StudySession
  isOpen: boolean
  onClose: () => void
  onCompleteSession: (sessionId: string) => void
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function FocusModal({
  session,
  isOpen,
  onClose,
  onCompleteSession,
}: Props) {
  const totalSeconds = session.duration * 60
  const [timeLeft, setTimeLeft] = useState(totalSeconds)
  const [isRunning, setIsRunning] = useState(true)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const timerRef = useRef<number | null>(null)

  // Reset when session changes
  useEffect(() => {
    setTimeLeft(session.duration * 60)
    setIsRunning(true)
    setIsCompleted(false)
    setIsMinimized(false)
  }, [session.id, session.duration])

  // Countdown timer loop
  useEffect(() => {
    if (isRunning && timeLeft > 0 && !isCompleted) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!)
            handleFinish(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRunning, timeLeft, isCompleted])

  function handleTogglePlay() {
    setIsRunning(prev => !prev)
  }

  function handleAddFiveMinutes() {
    setTimeLeft(prev => prev + 300)
  }

  function handleReset() {
    setIsRunning(false)
    setTimeLeft(session.duration * 60)
    setIsCompleted(false)
  }

  function handleFinish(auto = false) {
    setIsRunning(false)
    setIsCompleted(true)
    onCompleteSession(session.id)
  }

  if (!isOpen) return null

  const progressPct = ((totalSeconds - timeLeft) / totalSeconds) * 100
  const puppyMood: PuppyMood = isCompleted
    ? 'celebrating'
    : !isRunning
    ? 'paused'
    : 'studying'

  // Minimized floating picture-in-picture widget
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-[#F6C85F] p-3 flex items-center gap-3 animate-fade-in transition-all">
        <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
          <YellowPuppy mood={puppyMood} size="sm" showMessage={false} />
        </div>
        <div className="min-w-0 pr-1">
          <p className="text-xs font-bold text-[#2C1810] truncate max-w-[140px]">
            {session.topic}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-mono text-sm font-bold text-[#E8631C]">
              {formatTime(timeLeft)}
            </span>
            <button
              onClick={handleTogglePlay}
              className="text-xs font-bold text-[#7A6352] hover:text-[#2C1810]"
              title={isRunning ? 'Pause' : 'Play'}
            >
              {isRunning ? '⏸' : '▶'}
            </button>
          </div>
        </div>
        <button
          onClick={() => setIsMinimized(false)}
          className="w-8 h-8 rounded-xl bg-[#FFF8EF] hover:bg-[#FFF0E6] text-[#E8631C] flex items-center justify-center border border-[#E8DDD3] text-xs font-bold transition-colors"
          title="Expand focus view"
        >
          ↗
        </button>
      </div>
    )
  }

  // Full focus modal
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C1810]/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FFF8EF] rounded-3xl border-2 border-[#E8DDD3] shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-[#E8DDD3]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A6352]">
              Focus Session
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(true)}
              className="px-2.5 py-1 rounded-xl text-xs font-semibold text-[#7A6352] hover:text-[#2C1810] hover:bg-[#F0E8E0] transition-colors flex items-center gap-1"
              title="Minimize to corner"
            >
              <span>↘</span> Dock
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-[#7A6352] hover:text-[#2C1810] hover:bg-[#F0E8E0] transition-colors text-sm"
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex flex-col items-center text-center space-y-5">
          {/* Yellow Puppy Study Buddy */}
          <YellowPuppy mood={puppyMood} size="md" />

          {/* Session Info */}
          <div className="w-full">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF0E6] text-[#E8631C] border border-[#F5D9C8] mb-2">
              {session.subject}
            </span>
            <h2
              className="text-xl sm:text-2xl font-bold text-[#2C1810] leading-snug px-4"
              style={{ fontFamily: 'Fraunces, serif' }}
            >
              {session.topic}
            </h2>
            {session.subtopics.length > 0 && (
              <div className="mt-3 inline-flex flex-wrap justify-center gap-1.5 max-w-md">
                {session.subtopics.map((st, i) => (
                  <span
                    key={i}
                    className="text-xs bg-white text-[#7A6352] px-2.5 py-1 rounded-lg border border-[#E8DDD3]"
                  >
                    • {st}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Countdown Clock with Radial Ring */}
          <div className="relative w-56 h-56 flex items-center justify-center my-2">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r="84"
                fill="none"
                stroke="#E8DDD3"
                strokeWidth="12"
              />
              {/* Animated Progress Circle */}
              <circle
                cx="100"
                cy="100"
                r="84"
                fill="none"
                stroke={isCompleted ? '#5BA07A' : '#E8631C'}
                strokeWidth="12"
                strokeDasharray={2 * Math.PI * 84}
                strokeDashoffset={2 * Math.PI * 84 * (1 - (totalSeconds > 0 ? timeLeft / totalSeconds : 0))}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>

            {/* Digital Clock Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-4xl font-extrabold text-[#2C1810] tracking-tight">
                {formatTime(timeLeft)}
              </span>
              <span className="text-xs font-semibold text-[#7A6352] mt-1">
                {isCompleted
                  ? 'Done!'
                  : isRunning
                  ? 'Remaining'
                  : 'Paused'}
              </span>
            </div>
          </div>

          {/* Controls */}
          {!isCompleted ? (
            <div className="flex flex-wrap items-center justify-center gap-3 w-full">
              {/* Pause / Resume Button */}
              <button
                onClick={handleTogglePlay}
                className={`px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-sm transition-all transform active:scale-95 ${
                  isRunning
                    ? 'bg-white text-[#2C1810] border-2 border-[#E8DDD3] hover:bg-[#F0E8E0]'
                    : 'bg-[#E8631C] text-white hover:bg-[#C45215]'
                }`}
              >
                <span>{isRunning ? '⏸ Pause' : '▶ Resume'}</span>
              </button>

              {/* +5 Min Button */}
              <button
                onClick={handleAddFiveMinutes}
                className="px-4 py-3 rounded-2xl bg-white border border-[#E8DDD3] hover:bg-[#FFF0E6] text-xs font-bold text-[#7A6352] transition-colors"
                title="Add 5 minutes to timer"
              >
                +5 Min
              </button>

              {/* Reset Button */}
              <button
                onClick={handleReset}
                className="px-4 py-3 rounded-2xl bg-white border border-[#E8DDD3] hover:bg-rose-50 hover:text-rose-600 text-xs font-bold text-[#7A6352] transition-colors"
                title="Reset timer"
              >
                Reset
              </button>

              {/* Finish Early Button */}
              <button
                onClick={() => handleFinish(false)}
                className="w-full mt-2 py-3 px-4 rounded-2xl bg-[#5BA07A] hover:bg-[#468260] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>✓ Finish Session & Mark Done</span>
              </button>
            </div>
          ) : (
            <div className="w-full space-y-3">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800">
                <p className="font-bold text-base">🎉 Session Complete!</p>
                <p className="text-xs mt-1">
                  You studied for {session.duration} minutes with Moki! Enjoy some sweet vanilla ice cream! 🍦
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-[#E8631C] hover:bg-[#C45215] text-white font-bold text-sm transition-all"
              >
                Return to Study Schedule →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
