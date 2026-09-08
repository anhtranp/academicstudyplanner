import { describe, it, expect } from 'vitest'
import { buildCalendarLink } from '../src/utils/calendarLink'
import { StudySession } from '../src/types'

describe('calendarLink', () => {
  const mockSession: StudySession = {
    id: 's1',
    subject: 'Biology 101',
    topic: 'Cellular Respiration & Krebs Cycle',
    subtopics: ['Glycolysis', 'Electron Transport Chain'],
    date: new Date('2026-09-08T10:00:00.000Z'),
    duration: 90,
    difficulty: 2,
    sessionType: 'reading',
    completed: false,
    weekNumber: 1,
  }

  it('generates a valid Google Calendar render template URL', () => {
    const urlString = buildCalendarLink(mockSession)
    const url = new URL(urlString)

    expect(url.origin).toBe('https://calendar.google.com')
    expect(url.pathname).toBe('/calendar/render')
    expect(url.searchParams.get('action')).toBe('TEMPLATE')
  })

  it('includes session topic, subject, and duration in calendar parameters', () => {
    const urlString = buildCalendarLink(mockSession)
    const url = new URL(urlString)

    const text = url.searchParams.get('text')
    const details = url.searchParams.get('details')

    expect(text).toContain('Study: Cellular Respiration & Krebs Cycle')
    expect(details).toContain('Subject: Biology 101')
    expect(details).toContain('Duration: 90 min')
    expect(details).toContain('Type: reading')
  })

  it('formats calendar event dates with compact ISO datetime span', () => {
    const urlString = buildCalendarLink(mockSession)
    const url = new URL(urlString)

    const dates = url.searchParams.get('dates')
    expect(dates).toBeDefined()
    expect(dates).toContain('/')

    const [startPart, endPart] = (dates || '').split('/')
    expect(startPart).toMatch(/^\d{8}T\d{6}$/)
    expect(endPart).toMatch(/^\d{8}T\d{6}$/)
  })
})
