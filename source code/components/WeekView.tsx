import { useState } from 'react'
import { StudySession } from '../types'
import SessionCard from './SessionCard'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

interface DayColumnProps {
  date: Date
  sessions: StudySession[]
  isStudyDay: boolean
  onToggle: (id: string) => void
  onStartFocus?: (session: StudySession) => void
  onMoveSession: (id: string, newDate: Date) => void
}

function DayColumn({ date, sessions, isStudyDay, onToggle, onStartFocus, onMoveSession }: DayColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const isToday = isSameDay(date, new Date())

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(false)
    const id = e.dataTransfer.getData('text/plain')
    if (!id) return
    const newDate = new Date(date)
    newDate.setHours(10, 0, 0, 0)
    onMoveSession(id, newDate)
  }

  const completedCount = sessions.filter(s => s.completed).length

  return (
    <div
      className="flex flex-col min-w-[130px] flex-1"
      onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
      onDragLeave={e => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragOver(false)
      }}
      onDrop={handleDrop}
    >
      {/* Day header */}
      <div
        className={`
          rounded-xl py-2 px-3 mb-2 text-center transition-colors
          ${isToday ? 'bg-[#E8631C] text-white' : isStudyDay ? 'bg-[#FFF0E6] text-[#2C1810]' : 'bg-[#F5EDE8] text-[#7A6352]'}
          ${isDragOver ? 'ring-2 ring-[#E8631C]/40' : ''}
        `}
      >
        <div className="text-xs font-semibold opacity-70">{DAY_NAMES[date.getDay()]}</div>
        <div className="text-lg font-bold leading-none mt-0.5">{date.getDate()}</div>
        {sessions.length > 0 && (
          <div className="text-[10px] mt-1 opacity-60">
            {completedCount}/{sessions.length} done
          </div>
        )}
      </div>

      {/* Drop zone */}
      <div
        className={`
          flex-1 rounded-xl p-2 min-h-[200px] space-y-2 transition-all duration-150
          ${isDragOver ? 'bg-[#E8631C]/5 ring-2 ring-[#E8631C]/30 ring-dashed' : 'bg-transparent'}
          ${!isStudyDay && !isDragOver ? 'opacity-50' : ''}
        `}
      >
        {sessions.map(s => (
          <SessionCard
            key={s.id}
            session={s}
            onToggle={onToggle}
            onStartFocus={onStartFocus}
            compact
          />
        ))}
        {sessions.length === 0 && isDragOver && (
          <div className="flex items-center justify-center h-20 text-xs text-[#E8631C] font-medium">
            Drop here
          </div>
        )}
        {sessions.length === 0 && !isDragOver && isStudyDay && (
          <div className="flex items-center justify-center h-20 text-xs text-[#C4B5A5] text-center">
            No sessions<br />drag one here
          </div>
        )}
      </div>
    </div>
  )
}

interface Props {
  sessions: StudySession[]
  weekStart: Date
  studyDays: number[]
  onToggle: (id: string) => void
  onStartFocus?: (session: StudySession) => void
  onMoveSession: (id: string, newDate: Date) => void
}

export default function WeekView({ sessions, weekStart, studyDays, onToggle, onStartFocus, onMoveSession }: Props) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    return d
  })

  const weekSessions = sessions.filter(s => {
    const d = new Date(s.date)
    const end = new Date(weekStart)
    end.setDate(weekStart.getDate() + 7)
    return d >= weekStart && d < end
  })

  return (
    <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
      {days.map(day => (
        <DayColumn
          key={day.toISOString()}
          date={day}
          sessions={weekSessions.filter(s => isSameDay(new Date(s.date), day))}
          isStudyDay={studyDays.includes(day.getDay())}
          onToggle={onToggle}
          onStartFocus={onStartFocus}
          onMoveSession={onMoveSession}
        />
      ))}
    </div>
  )
}

