import { StudySession } from '../types'
import { buildCalendarLink } from '../utils/calendarLink'

const TYPE_CONFIG = {
  reading: { icon: '📖', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', label: 'Reading' },
  review: { icon: '🔄', bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-800', label: 'Review' },
  practice: { icon: '✏️', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', label: 'Practice' },
  'exam-prep': { icon: '🎯', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-800', label: 'Exam Prep' },
  assignment: { icon: '📝', bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-800', label: 'Assignment' },
}

const DIFF_DOT = ['', '●', '●●', '●●●']
const DIFF_COLOR = ['', 'text-emerald-500', 'text-amber-500', 'text-rose-500']

interface Props {
  session: StudySession
  onToggle: (id: string) => void
  onStartFocus?: (session: StudySession) => void
  compact?: boolean
}

export default function SessionCard({ session, onToggle, onStartFocus, compact = false }: Props) {
  const cfg = TYPE_CONFIG[session.sessionType]
  const calLink = buildCalendarLink(session)

  function handleDragStart(e: React.DragEvent) {
    e.dataTransfer.setData('text/plain', session.id)
    e.dataTransfer.effectAllowed = 'move'
  }

  if (compact) {
    return (
      <div
        draggable
        onDragStart={handleDragStart}
        className={`
          border rounded-xl p-2.5 cursor-grab active:cursor-grabbing select-none relative
          ${cfg.bg} ${cfg.border}
          ${session.completed ? 'opacity-60 bg-emerald-50/40 border-emerald-200/60' : ''}
          transition-all duration-200 hover:shadow-sm group
        `}
      >
        <div className="flex items-start gap-2">
          <button
            onClick={e => { e.stopPropagation(); onToggle(session.id) }}
            className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all flex items-center justify-center ${
              session.completed
                ? 'bg-[#5BA07A] border-[#5BA07A] text-white scale-105'
                : `border-current/40 hover:border-current hover:scale-110 ${cfg.text}`
            }`}
            title={session.completed ? 'Mark incomplete' : 'Mark complete (Cross out)'}
          >
            {session.completed && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            )}
          </button>
          <div className="flex-1 min-w-0">
            <p
              className={`text-xs font-semibold leading-tight truncate transition-all duration-200 ${cfg.text} ${
                session.completed
                  ? 'line-through text-[#7A6352] decoration-[#E8631C] decoration-2'
                  : ''
              }`}
            >
              {session.topic}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs">{cfg.icon}</span>
              <span className={`text-xs font-medium tracking-tight ${DIFF_COLOR[session.difficulty]}`}>
                {DIFF_DOT[session.difficulty]}
              </span>
              <span className="text-xs text-current/50 ml-auto">{session.duration}m</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-2 grid grid-cols-2 gap-1">
          {/* Start Focus Session with Moki button */}
          <button
            onClick={e => {
              e.stopPropagation()
              onStartFocus?.(session)
            }}
            className="flex items-center justify-center gap-1 text-[10px] font-bold py-1 px-1.5 rounded-lg bg-[#FFF0E6] hover:bg-[#FFE3D1] text-[#E8631C] border border-[#F5D9C8] transition-colors"
            title="Start focus session with Moki"
          >
            <span>🐾</span>
            <span>Focus</span>
          </button>

          {/* Add to Google Calendar button */}
          <a
            href={calLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="flex items-center justify-center gap-1 text-[10px] font-semibold py-1 px-1.5 rounded-lg bg-white/70 hover:bg-white transition-colors text-current/70 hover:text-current"
            title="Add to Google Calendar"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            <span>Cal</span>
          </a>
        </div>
      </div>
    )
  }

  // Full card (list view)
  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`
        border rounded-2xl p-4 cursor-grab active:cursor-grabbing select-none relative
        ${cfg.bg} ${cfg.border}
        ${session.completed ? 'opacity-70 bg-emerald-50/30 border-emerald-200/70' : ''}
        transition-all duration-200 hover:shadow-md group
      `}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={e => { e.stopPropagation(); onToggle(session.id) }}
          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all flex items-center justify-center ${
            session.completed
              ? 'bg-[#5BA07A] border-[#5BA07A] text-white scale-110'
              : `border-current/40 hover:border-current hover:scale-110 ${cfg.text}`
          }`}
          title={session.completed ? 'Mark incomplete' : 'Mark complete (Cross out)'}
        >
          {session.completed && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          )}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p
              className={`text-sm font-semibold leading-snug transition-all duration-200 ${cfg.text} ${
                session.completed
                  ? 'line-through text-[#7A6352] decoration-[#E8631C] decoration-2'
                  : ''
              }`}
            >
              {session.topic}
            </p>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {session.completed && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#5BA07A] text-white">
                  ✓ Completed
                </span>
              )}
              <span className={`text-xs font-bold ${DIFF_COLOR[session.difficulty]}`} title="Difficulty">
                {DIFF_DOT[session.difficulty]}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-1.5">
            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-white/50 ${cfg.text}`}>
              {cfg.icon} {cfg.label}
            </span>
            <span className="text-xs text-current/60">{session.duration} min</span>
          </div>

          {session.subtopics.length > 0 && (
            <ul className="mt-2 space-y-0.5">
              {session.subtopics.slice(0, 3).map((sub, i) => (
                <li
                  key={i}
                  className={`text-xs text-current/70 pl-2 border-l-2 border-current/20 ${
                    session.completed ? 'line-through opacity-70' : ''
                  }`}
                >
                  {sub}
                </li>
              ))}
              {session.subtopics.length > 3 && (
                <li className="text-xs text-current/50 pl-2">+{session.subtopics.length - 3} more</li>
              )}
            </ul>
          )}
        </div>
      </div>

      {/* Buttons row */}
      <div className="mt-3 flex items-center gap-2">
        {/* Start Focus Session Button */}
        <button
          onClick={e => {
            e.stopPropagation()
            onStartFocus?.(session)
          }}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2 px-3 rounded-xl bg-[#FFF0E6] hover:bg-[#FFE3D1] text-[#E8631C] border border-[#F5D9C8] transition-all duration-150 shadow-sm hover:shadow"
        >
          <span className="text-sm">🐾</span>
          <span>Start Focus Session</span>
        </button>

        {/* Add to Google Calendar Button */}
        <a
          href={calLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className={`flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-xl bg-white/80 hover:bg-white border border-[#E8DDD3] transition-colors ${cfg.text}`}
          title="Add to Google Calendar"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          <span>Google Calendar</span>
        </a>
      </div>
    </div>
  )
}

