import { describe, it, expect } from 'vitest'
import { extractTextFromFile } from '../src/utils/fileExtractor'

describe('fileExtractor', () => {
  it('extracts plain text content and calculates file metadata', async () => {
    const rawContent = 'Course Syllabus\nWeek 1: Introduction to Psychology\nWeek 2: Research Methods'
    const blob = new Blob([rawContent], { type: 'text/plain' })
    const file = new File([blob], 'syllabus.txt', { type: 'text/plain' })

    const result = await extractTextFromFile(file)

    expect(result.fileName).toBe('syllabus.txt')
    expect(result.fileSize).toContain('B')
    expect(result.text).toContain('Week 1: Introduction to Psychology')
    expect(result.text).toContain('Week 2: Research Methods')
  })

  it('correctly handles Markdown files', async () => {
    const mdContent = '# Biology 101\n\n## Schedule\n- **Week 1**: Cell Structure\n- **Week 2**: Genetics'
    const blob = new Blob([mdContent], { type: 'text/markdown' })
    const file = new File([blob], 'biology_syllabus.md', { type: 'text/markdown' })

    const result = await extractTextFromFile(file)

    expect(result.fileName).toBe('biology_syllabus.md')
    expect(result.text).toContain('Cell Structure')
    expect(result.text).toContain('Genetics')
  })

  it('cleans up RTF control words and formatting tags', async () => {
    const rtfContent = '{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Arial;}}\\par Week 1: Overview\\par Week 2: Deep Dive}'
    const blob = new Blob([rtfContent], { type: 'application/rtf' })
    const file = new File([blob], 'course.rtf', { type: 'application/rtf' })

    const result = await extractTextFromFile(file)

    expect(result.fileName).toBe('course.rtf')
    expect(result.text).toContain('Week 1: Overview')
    expect(result.text).toContain('Week 2: Deep Dive')
    expect(result.text).not.toContain('\\rtf1')
  })

  it('properly formats human-readable file sizes for KB and MB', async () => {
    const smallText = 'A'.repeat(2048)
    const blob = new Blob([smallText], { type: 'text/plain' })
    const file = new File([blob], 'sample.txt', { type: 'text/plain' })

    const result = await extractTextFromFile(file)
    expect(result.fileSize).toBe('2.0 KB')
  })
})
