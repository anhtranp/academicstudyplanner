import { describe, it, expect } from 'vitest'
import { generateSessions } from '../src/utils/sessionGenerator'
import { parseSyllabus } from '../src/utils/parser'
import { ParsedSyllabus, SyllabusConfig } from '../src/types'

describe('studyPlanGenerator', () => {
  const sampleParsedSyllabus: ParsedSyllabus = {
    courseName: 'CS 101: Computer Science Fundamentals',
    weeks: [
      {
        number: 1,
        title: 'Introduction to Algorithms',
        topics: ['Big-O Notation', 'Linear and Binary Search'],
      },
      {
        number: 2,
        title: 'Data Structures',
        topics: ['Arrays and Linked Lists', 'Midterm Exam Preparation'],
      },
    ],
    events: [
      {
        title: 'Midterm Exam',
        type: 'exam',
      },
    ],
  }

  const sampleConfig: SyllabusConfig = {
    startDate: '2026-09-08',
    studyDays: [1, 3, 5], // Monday, Wednesday, Friday
    sessionDuration: 60,
  }

  it('generates study sessions matching the syllabus topics', () => {
    const sessions = generateSessions(sampleParsedSyllabus, sampleConfig)

    expect(sessions.length).toBeGreaterThan(0)
    expect(sessions[0].subject).toBe('CS 101: Computer Science Fundamentals')
    expect(sessions[0].duration).toBe(60)
    expect(sessions[0].completed).toBe(false)
  })

  it('aligns study sessions strictly to requested study days', () => {
    const sessions = generateSessions(sampleParsedSyllabus, sampleConfig)

    sessions.forEach(session => {
      const dayOfWeek = new Date(session.date).getDay()
      expect(sampleConfig.studyDays).toContain(dayOfWeek)
    })
  })

  it('derives appropriate session types and difficulty levels', () => {
    const sessions = generateSessions(sampleParsedSyllabus, sampleConfig)

    const examPrepSession = sessions.find(s => s.topic.includes('Midterm Exam Preparation'))
    if (examPrepSession) {
      expect(examPrepSession.sessionType).toBe('exam-prep')
      expect(examPrepSession.difficulty).toBe(3)
    }

    const readingSession = sessions.find(s => s.topic.includes('Big-O Notation'))
    if (readingSession) {
      expect(['reading', 'practice', 'review']).toContain(readingSession.sessionType)
    }
  })

  it('parses raw syllabus text into structured weeks and events', () => {
    const rawText = `
      PSYC 101: Introduction to Psychology
      Week 1: Foundations of Psychology
      - Historical perspectives
      - Research methods in behavioral science
      Week 2: Biological Basis of Behavior
      - Neurons and nervous system
      MIDTERM EXAM on Week 6
    `
    const parsed = parseSyllabus(rawText)

    expect(parsed.courseName).toContain('Psychology')
    expect(parsed.weeks.length).toBeGreaterThanOrEqual(1)
    expect(parsed.events.some(e => e.type === 'exam')).toBe(true)
  })
})
