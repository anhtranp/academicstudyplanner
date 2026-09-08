import { useState, useRef } from 'react'
import { SyllabusConfig } from '../types'
import { SAMPLE_SYLLABUS } from '../utils/parser'
import { extractTextFromFile } from '../utils/fileExtractor'

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const DURATION_OPTIONS = [
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '90 min' },
  { value: 120, label: '2 hours' },
]

interface Props {
  onGenerate: (text: string, config: SyllabusConfig) => void
}

type InputTab = 'upload' | 'paste'

export default function SyllabusInput({ onGenerate }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const [activeTab, setActiveTab] = useState<InputTab>('upload')
  const [syllabusText, setSyllabusText] = useState('')
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [startDate, setStartDate] = useState(today)
  const [studyDays, setStudyDays] = useState<number[]>([1, 3, 5]) // Mon, Wed, Fri
  const [sessionDuration, setSessionDuration] = useState(60)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  function toggleDay(day: number) {
    setStudyDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
    )
  }

  async function handleFileProcess(file: File) {
    setIsExtracting(true)
    setError('')
    try {
      const { text, fileName, fileSize } = await extractTextFromFile(file)
      setSyllabusText(text)
      setUploadedFileName(fileName)
      setUploadedFileSize(fileSize)
    } catch (err) {
      console.error(err)
      setError('Could not extract text from this file. Please paste syllabus text directly.')
    } finally {
      setIsExtracting(false)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      handleFileProcess(file)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileProcess(file)
    }
  }

  function handleSubmit() {
    if (!syllabusText.trim()) {
      setError('Please upload your syllabus file or paste your syllabus text first.')
      return
    }
    if (studyDays.length === 0) {
      setError('Choose at least one study day.')
      return
    }
    setError('')
    onGenerate(syllabusText, { startDate, studyDays, sessionDuration })
  }

  function useSample() {
    setSyllabusText(SAMPLE_SYLLABUS)
    setUploadedFileName('PSYC101_Intro_to_Psychology_Syllabus.txt')
    setUploadedFileSize('4.8 KB')
    setError('')
  }

  return (
    <div className="min-h-screen bg-[#FFF8EF] flex flex-col">
      {/* Hero header */}
      <header className="max-w-3xl mx-auto w-full px-6 pt-12 pb-6 text-center">
        <div className="inline-flex items-center gap-2 bg-[#FFF0E6] text-[#E8631C] text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-[#F5D9C8]">
          ✦ Your academic year, planned
        </div>
        <h1
          className="text-4xl sm:text-5xl font-bold text-[#2C1810] leading-tight"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Turn your syllabus into a{' '}
          <span className="text-[#E8631C] italic">study plan</span>{' '}
          you'll actually follow
        </h1>
        <p className="mt-4 text-[#7A6352] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          Upload your syllabus, choose your study days & session length, and get an interactive
          schedule with Google Calendar sync, focus companion, and celebratory rewards!
        </p>
      </header>

      {/* Main form */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 pb-12 space-y-5">
        {/* Config row */}
        <div className="grid sm:grid-cols-3 gap-4">
          {/* Start date */}
          <div className="bg-white rounded-2xl border border-[#E8DDD3] p-4 shadow-sm">
            <label className="block text-xs font-semibold text-[#7A6352] uppercase tracking-wide mb-2">
              📅 Course starts
            </label>
            <input
              type="date"
              value={startDate}
              min={today}
              onChange={e => setStartDate(e.target.value)}
              className="w-full text-sm text-[#2C1810] bg-[#FFF8EF] border border-[#E8DDD3] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E8631C]/30"
            />
          </div>

          {/* Study days */}
          <div className="bg-white rounded-2xl border border-[#E8DDD3] p-4 shadow-sm">
            <label className="block text-xs font-semibold text-[#7A6352] uppercase tracking-wide mb-2">
              📆 Study days
            </label>
            <div className="flex gap-1 flex-wrap">
              {DAY_LABELS.map((label, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleDay(i)}
                  className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                    studyDays.includes(i)
                      ? 'bg-[#E8631C] text-white shadow-sm'
                      : 'bg-[#F0E8E0] text-[#7A6352] hover:bg-[#E8DDD3]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Session length */}
          <div className="bg-white rounded-2xl border border-[#E8DDD3] p-4 shadow-sm">
            <label className="block text-xs font-semibold text-[#7A6352] uppercase tracking-wide mb-2">
              ⏱ Session length
            </label>
            <div className="flex gap-1 flex-wrap">
              {DURATION_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSessionDuration(opt.value)}
                  className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                    sessionDuration === opt.value
                      ? 'bg-[#E8631C] text-white shadow-sm'
                      : 'bg-[#F0E8E0] text-[#7A6352] hover:bg-[#E8DDD3]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Syllabus Section (Upload File or Paste Text) */}
        <div className="bg-white rounded-3xl border border-[#E8DDD3] p-5 sm:p-6 shadow-sm">
          {/* Header & Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-[#E8DDD3] pb-3">
            <div className="flex items-center gap-1 bg-[#F0E8E0] p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'upload'
                    ? 'bg-white text-[#2C1810] shadow-sm'
                    : 'text-[#7A6352] hover:text-[#2C1810]'
                }`}
              >
                📁 Upload Syllabus File
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('paste')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'paste'
                    ? 'bg-white text-[#2C1810] shadow-sm'
                    : 'text-[#7A6352] hover:text-[#2C1810]'
                }`}
              >
                📝 Paste Text
              </button>
            </div>

            <button
              type="button"
              onClick={useSample}
              className="text-xs text-[#E8631C] hover:text-[#C45215] font-bold transition-colors flex items-center gap-1"
            >
              <span>Try sample syllabus →</span>
            </button>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.md,.rtf,.docx,.doc,.csv"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Tab 1: Upload File */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              {/* Drag and Drop Zone */}
              <div
                onDragOver={e => {
                  e.preventDefault()
                  setIsDragOver(true)
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                  isDragOver
                    ? 'border-[#E8631C] bg-[#FFF0E6]'
                    : uploadedFileName
                    ? 'border-emerald-300 bg-emerald-50/30'
                    : 'border-[#E8DDD3] bg-[#FFF8EF] hover:border-[#E8631C]/60 hover:bg-[#FFF4EC]'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-4xl">
                    {isExtracting ? '⏳' : uploadedFileName ? '📄' : '📤'}
                  </span>
                  <p className="text-sm font-bold text-[#2C1810]">
                    {isExtracting
                      ? 'Extracting syllabus course topics...'
                      : uploadedFileName
                      ? 'Upload a different file or replace syllabus'
                      : 'Drag & drop your syllabus here, or click to browse'}
                  </p>
                  <p className="text-xs text-[#7A6352]">
                    Supports PDF, Word/DOCX, TXT, Markdown, and RTF documents
                  </p>
                  <button
                    type="button"
                    className="mt-2 px-4 py-1.5 rounded-xl bg-white border border-[#E8DDD3] text-xs font-bold text-[#E8631C] hover:bg-[#FFF0E6] transition-colors shadow-sm"
                  >
                    Select file from computer
                  </button>
                </div>
              </div>

              {/* Uploaded File Badge */}
              {uploadedFileName && (
                <div className="flex items-center justify-between p-3.5 bg-[#FFF0E6] rounded-xl border border-[#F5D9C8]">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl">✅</span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#2C1810] truncate">
                        {uploadedFileName}
                      </p>
                      <p className="text-[11px] text-[#7A6352]">
                        {uploadedFileSize} • Successfully parsed
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation()
                      setUploadedFileName(null)
                      setSyllabusText('')
                    }}
                    className="text-xs text-rose-600 hover:text-rose-800 font-bold px-2 py-1"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Extracted Text Preview */}
              {syllabusText && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-[#7A6352] uppercase tracking-wide">
                      Extracted Syllabus Schedule Preview
                    </span>
                    <span className="text-xs text-[#C4B5A5]">
                      {syllabusText.split('\n').filter(l => l.trim()).length} lines · {syllabusText.length} chars
                    </span>
                  </div>
                  <textarea
                    value={syllabusText}
                    onChange={e => setSyllabusText(e.target.value)}
                    rows={7}
                    className="w-full text-xs text-[#2C1810] bg-[#FFF8EF] border border-[#E8DDD3] rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-[#E8631C]/30 leading-relaxed font-mono"
                    placeholder="Extracted syllabus text appears here..."
                  />
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Direct Paste Text */}
          {activeTab === 'paste' && (
            <div className="space-y-2">
              <textarea
                value={syllabusText}
                onChange={e => {
                  setSyllabusText(e.target.value)
                  setError('')
                }}
                placeholder={`Paste your syllabus here — course schedule, weekly topics, exam dates, assignment deadlines…\n\nTip: copy from your course portal, PDF, or email. The more detail, the better your plan.`}
                rows={12}
                className="w-full text-sm text-[#2C1810] bg-[#FFF8EF] border border-[#E8DDD3] rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#E8631C]/30 placeholder-[#C4B5A5] leading-relaxed font-mono"
              />
              {syllabusText && (
                <p className="text-xs text-[#C4B5A5] text-right">
                  {syllabusText.split('\n').filter(l => l.trim()).length} lines · {syllabusText.length} chars
                </p>
              )}
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        {/* Generate button */}
        <button
          onClick={handleSubmit}
          className="w-full py-4 rounded-2xl bg-[#E8631C] hover:bg-[#C45215] text-white font-bold text-base transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 shadow-md"
          style={{ fontFamily: 'Fraunces, serif' }}
        >
          Generate my study plan →
        </button>

        {/* Feature hints */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {[
            { icon: '🗓️', title: 'Google Calendar', text: 'One-click event sync' },
            { icon: '↔️', title: 'Drag & Drop', text: 'Reschedule between days' },
            { icon: '🍦', title: 'Ice Cream Confetti', text: 'Fall when crossing out' },
            { icon: '🐾', title: 'Moki Study Buddy', text: 'Focus countdown timer' },
          ].map((f, i) => (
            <div key={i} className="bg-[#F0E8E0] rounded-2xl p-3 text-center border border-[#E8DDD3]/60">
              <div className="text-xl mb-1">{f.icon}</div>
              <p className="text-xs font-bold text-[#2C1810]">{f.title}</p>
              <p className="text-[11px] text-[#7A6352] mt-0.5 leading-tight">{f.text}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
