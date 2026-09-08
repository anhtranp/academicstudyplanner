import { useMemo, useState } from 'react'
import { StudySession, ParsedSyllabus, SyllabusConfig, ViewMode } from '../types'
import WeekView from './WeekView'
import SessionCard from './SessionCard'
import StatsPanel from './StatsPanel'
import IceCreamConfetti from './IceCreamConfetti'
import FocusModal from './FocusModal'
import { downloadIcsCalendar } from '../utils/calendarLink'

function getMonday(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d
}

function fmtRange(start: Date): string {
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  return `${start.toLocaleDateString('en-US', opts)} – ${end.toLocaleDateString('en-US', opts)}`
}

interface Props {
  sessions: StudySession[]
  parsed: ParsedSyllabus
  config: SyllabusConfig
  onBack: () => void
  onToggle: (id: string) => void
  onMoveSession: (id: string, newDate: Date) => void
}

export default function StudyPlan({
  sessions,
  parsed,
  config,
  onBack,
  onToggle,
  onMoveSession,
}: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>('week')
  const [weekIndex, setWeekIndex] = useState(0)
  const [activeFocusSession, setActiveFocusSession] = useState<StudySession | null>(null)
  const [confettiCount, setConfettiCount] = useState(0)

  const weekStarts = useMemo(() => {
    const seen = new Set<string>()
    const starts: Date[] = []
    sessions.forEach(s => {
      const m = getMonday(new Date(s.date))
      const key = m.toISOString()
      if (!seen.has(key)) {
        seen.add(key)
        starts.push(m)
      }
    })
    return starts.sort((a, b) => a.getTime() - b.getTime())
  }, [sessions])

  const currentWeekStart = weekStarts[weekIndex] ?? getMonday(new Date())
  const totalWeeks = weekStarts.length
  const completed = sessions.filter(s => s.completed).length
  const completionPercentage = sessions.length > 0 ? Math.round((completed / sessions.length) * 100) : 0

  const weeksByNumber = useMemo(() => {
    const map = new Map<number, StudySession[]>()
    sessions.forEach(s => {
      const arr = map.get(s.weekNumber) ?? []
      arr.push(s)
      map.set(s.weekNumber, arr)
    })
    return map
  }, [sessions])

  function handleToggleSession(id: string) {
    const s = sessions.find(item => item.id === id)
    // If the session is about to be completed, trigger ice cream confetti!
    if (s && !s.completed) {
      setConfettiCount(c => c + 1)
    }
    onToggle(id)
  }

  function handleStartFocus(session: StudySession) {
    setActiveFocusSession(session)
  }

  function handleCompleteFromFocus(sessionId: string) {
    const s = sessions.find(item => item.id === sessionId)
    if (s && !s.completed) {
      setConfettiCount(c => c + 1)
      onToggle(sessionId)
    }
  }

  function handleExportCalendar() {
    downloadIcsCalendar(parsed.courseName, sessions)
  }

  return (
    <div className="min-h-screen bg-[#FFF8EF] flex flex-col relative">
      {/* Vanilla Ice Cream Emoji Confetti Celebration */}
      <IceCreamConfetti triggerCount={confettiCount} />

      {/* Focus Mode & Countdown Clock Modal with Yellow Puppy */}
      {activeFocusSession && (
        <FocusModal
          session={activeFocusSession}
          isOpen={Boolean(activeFocusSession)}
          onClose={() => setActiveFocusSession(null)}
          onCompleteSession={handleCompleteFromFocus}
        />
      )}

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-20 bg-[#FFF8EF]/95 backdrop-blur border-b border-[#E8DDD3] px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Back button & Title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onBack}
              className="text-[#7A6352] hover:text-[#2C1810] transition-colors text-sm flex items-center gap-1.5 flex-shrink-0"
              title="Return to syllabus upload"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>New plan</span>
            </button>

            <div className="min-w-0">
              <h1
                className="text-base sm:text-lg font-bold text-[#2C1810] truncate leading-tight"
                style={{ fontFamily: 'Fraunces, serif' }}
              >
                {parsed.courseName}
              </h1>
              <p className="text-xs text-[#7A6352]">
                <span className="font-semibold text-[#2C1810]">{completed}</span> of {sessions.length} sessions done
              </p>
            </div>
          </div>

          {/* Progress Bar (Always visible) */}
          <div className="flex items-center gap-2.5 flex-1 max-w-[220px] min-w-[140px]">
            <div className="flex-1 h-2.5 bg-[#E8DDD3] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#E8631C] to-[#5BA07A] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <span className="text-xs font-bold text-[#E8631C] w-9 text-right">
              {completionPercentage}%
            </span>
          </div>

          {/* Actions & View toggle */}
          <div className="flex items-center gap-2">
            {/* Export all to Google Calendar (.ics) */}
            <button
              onClick={handleExportCalendar}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-[#7A6352] hover:text-[#2C1810] border border-[#E8DDD3] text-xs font-semibold shadow-sm transition-colors"
              title="Download calendar file for Google Calendar, Apple Calendar, or Outlook"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              <span>Sync All</span>
            </button>

            {/* View toggle (Week / List) */}
            <div className="flex items-center bg-[#F0E8E0] rounded-xl p-1 gap-1">
              {(['week', 'list'] as ViewMode[]).map(m => (
                <button
                  key={m}
                  onClick={() => setViewMode(m)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    viewMode === m
                      ? 'bg-white text-[#2C1810] shadow-sm'
                      : 'text-[#7A6352] hover:text-[#2C1810]'
                  }`}
                >
                  {m === 'week' ? '📅 Week' : '📋 List'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex gap-6">
        <div className="flex-1 min-w-0">
          {viewMode === 'week' ? (
            <>
              {/* Week navigator */}
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => setWeekIndex(i => Math.max(0, i - 1))}
                  disabled={weekIndex === 0}
                  className="w-8 h-8 rounded-lg bg-white border border-[#E8DDD3] flex items-center justify-center text-[#7A6352] hover:text-[#2C1810] disabled:opacity-30 transition-colors"
                  title="Previous week"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>

                <div className="flex-1 text-center">
                  <p className="text-sm font-semibold text-[#2C1810]">
                    Week {weekIndex + 1} of {totalWeeks}
                  </p>
                  <p className="text-xs text-[#7A6352]">{fmtRange(currentWeekStart)}</p>
                </div>

                <button
                  onClick={() => setWeekIndex(i => Math.min(totalWeeks - 1, i + 1))}
                  disabled={weekIndex >= totalWeeks - 1}
                  className="w-8 h-8 rounded-lg bg-white border border-[#E8DDD3] flex items-center justify-center text-[#7A6352] hover:text-[#2C1810] disabled:opacity-30 transition-colors"
                  title="Next week"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>

              <WeekView
                sessions={sessions}
                weekStart={currentWeekStart}
                studyDays={config.studyDays}
                onToggle={handleToggleSession}
                onStartFocus={handleStartFocus}
                onMoveSession={onMoveSession}
              />
            </>
          ) : (
            <ListView
              weeksByNumber={weeksByNumber}
              parsed={parsed}
              onToggle={handleToggleSession}
              onStartFocus={handleStartFocus}
            />
          )}
        </div>

        {/* Stats sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <StatsPanel
              sessions={sessions}
              events={parsed.events}
              weekStart={currentWeekStart}
            />
          </div>
        </aside>
      </main>
    </div>
  )
}

function ListView({
  weeksByNumber,
  parsed,
  onToggle,
  onStartFocus,
}: {
  weeksByNumber: Map<number, StudySession[]>
  parsed: ParsedSyllabus
  onToggle: (id: string) => void
  onStartFocus: (session: StudySession) => void
}) {
  const [openWeeks, setOpenWeeks] = useState<Set<number>>(new Set([1]))

  function toggle(n: number) {
    setOpenWeeks(prev => {
      const s = new Set(prev)
      s.has(n) ? s.delete(n) : s.add(n)
      return s
    })
  }

  const weekNums = [...weeksByNumber.keys()].sort((a, b) => a - b)

  return (
    <div className="space-y-3">
      {weekNums.map(wn => {
        const wSessions = weeksByNumber.get(wn)!
        const done = wSessions.filter(s => s.completed).length
        const isOpen = openWeeks.has(wn)
        const sylWeek = parsed.weeks.find(w => w.number === wn)

        return (
          <div key={wn} className="bg-white rounded-2xl border border-[#E8DDD3] overflow-hidden">
            <button
              onClick={() => toggle(wn)}
              className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-[#FFF8EF] transition-colors"
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  done === wSessions.length ? 'bg-[#5BA07A] text-white' : 'bg-[#FFF0E6] text-[#E8631C]'
                }`}
              >
                {done === wSessions.length ? '✓' : wn}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#2C1810] text-sm">
                  {sylWeek ? sylWeek.title : `Week ${wn}`}
                </p>
                <p className="text-xs text-[#7A6352]">
                  {done}/{wSessions.length} sessions · {wSessions.reduce((a, s) => a + s.duration, 0)} min total
                </p>
              </div>
              <div className="flex-shrink-0 flex items-center gap-2">
                <div className="w-16 h-1.5 bg-[#E8DDD3] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#5BA07A] rounded-full transition-all"
                    style={{ width: `${(done / wSessions.length) * 100}%` }}
                  />
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`text-[#7A6352] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </button>

            {isOpen && (
              <div className="px-4 pb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {wSessions
                  .slice()
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map(s => (
                    <SessionCard
                      key={s.id}
                      session={s}
                      onToggle={onToggle}
                      onStartFocus={onStartFocus}
                      compact={false}
                    />
                  ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
