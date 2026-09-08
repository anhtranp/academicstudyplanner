# Business Requirements Document (BRD)
## Academic Study Planner

| | |
|---|---|
| **Document Owner** | Anh Tran |
| **Status** | Draft v1.0 |
| **Date** | September 2026 |
| **Product Stage** | V1 shipped; V2/V3 planned |

---

## 1. Executive Summary

The Academic Study Planner converts an uploaded course syllabus into a personalized, actionable study schedule. Students upload a syllabus, set their availability and session-length preferences, and receive a structured plan they can track, focus with, and sync to their calendar. This BRD defines the business rationale, scope, and requirements behind the product to guide prioritization for current and future development.

---

## 2. Business Problem

Syllabi tell students *what* is due and *when*, but not *how to spend their time* getting there. Students are left to manually answer:

- What should I study this week?
- How much time should I allocate per topic?
- When should exam prep start?
- How do I balance multiple courses?
- Am I actually keeping pace?

This creates planning friction that discourages consistent studying and increases the risk of last-minute cramming.

---

## 3. Business Objectives

| Objective | Description |
|---|---|
| Reduce planning friction | Eliminate the manual work of turning a syllabus into a study calendar |
| Increase engagement with studying | Make consistent study habits feel rewarding, not just obligatory |
| Improve visibility into progress | Give students real-time feedback on how they're tracking against their plan |
| Fit into students' existing tools | Integrate with calendar apps students already use (Google Calendar, Apple Calendar, Outlook) |

---

## 4. Scope

### 4.1 In Scope (Current, V1)
- Syllabus upload and client-side text extraction (PDF, TXT, DOCX, MD, RTF)
- Preview of extracted schedule before plan generation
- Study preference configuration (start date, available days, session duration)
- Automated study plan generation
- Weekly and List views of the plan
- Progress tracking (completion %, daily/weekly breakdown, visual indicators)
- Focus Mode with countdown timer and companion character ("Buttercup")
- Calendar integration (per-session Google Calendar link, full-plan `.ics` export)

### 4.2 Out of Scope (Deferred to V2/V3)
- Multi-course concurrent planning
- Automatic workload balancing across courses
- Exam preparation mode
- Assignment prioritization logic
- Re-planning when sessions are missed
- User accounts / saved plans (no persistence layer in V1)
- AI-powered syllabus understanding
- Adaptive scheduling based on performance
- LMS integrations
- Native mobile application

---

## 5. Stakeholders

| Stakeholder | Interest |
|---|---|
| Students (primary user) | Wants a low-effort way to turn a syllabus into a doable schedule |
| Product/Design owner | Wants to validate the problem-to-solution fit and demonstrate product thinking |
| (Future) Institutions/Instructors | Potential secondary users if LMS integration is pursued in V3 |

---

## 6. Functional Requirements

### FR1 — Syllabus Upload & Extraction

| FR # | Description |
|---|---|
| FR1.1 | System shall accept syllabus files in PDF, TXT, DOCX, MD, and RTF formats. |
| FR1.2 | System shall support drag-and-drop and manual file browsing. |
| FR1.3 | System shall support direct paste of syllabus text as a fallback. |
| FR1.4 | System shall extract course schedule and topic information client-side (in-browser). |
| FR1.5 | System shall display a preview of extracted content (schedule, line/character count) before plan generation. |
| FR1.6 | System shall provide a sample syllabus option for users without a file on hand. |

### FR2 — Study Preference Configuration

| FR # | Description |
|---|---|
| FR2.1 | User shall be able to set a course start date. |
| FR2.2 | User shall be able to select active study days (Sunday–Saturday). |
| FR2.3 | User shall be able to select session duration (30 min, 45 min, 1 hr, 90 min, 2 hr). |

### FR3 — Study Plan Generation

| FR # | Description |
|---|---|
| FR3.1 | System shall generate study sessions mapped against course timeline, available days, and session duration. |
| FR3.2 | Each session shall include topic, subtopics, date, duration, and completion status. |

### FR4 — Study Plan Views

| FR # | Description |
|---|---|
| FR4.1 | User shall be able to view the plan in Weekly view. |
| FR4.2 | User shall be able to view the plan in List view. |

### FR5 — Progress Tracking

| FR # | Description |
|---|---|
| FR5.1 | User shall be able to mark a session complete. |
| FR5.2 | Completed sessions shall display a strikethrough treatment. |
| FR5.3 | System shall display real-time overall completion percentage. |
| FR5.4 | System shall display completed-vs-total session counts. |
| FR5.5 | System shall display daily and weekly progress breakdowns. |
| FR5.6 | System shall trigger a celebratory animation (ice cream emoji confetti) and audio chime on session completion. |

### FR6 — Focus Mode

| FR # | Description |
|---|---|
| FR6.1 | User shall be able to launch Focus Mode from any session card. |
| FR6.2 | Focus Mode shall display a countdown timer matching session duration. |
| FR6.3 | User shall be able to Play/Pause, add +5 minutes, Reset, or Finish & mark complete. |
| FR6.4 | Focus Mode shall support a minimized picture-in-picture dock. |
| FR6.5 | Focus Mode shall feature an animated companion character ("Buttercup") providing encouragement and celebration. |
| FR6.6 | Finishing a session in Focus Mode shall automatically mark it complete and sync state with the main plan. |

### FR7 — Calendar Integration

| FR # | Description |
|---|---|
| FR7.1 | User shall be able to add an individual session to Google Calendar with pre-filled title, date, duration, and subject. |
| FR7.2 | User shall be able to export the entire plan as a standard `.ics` file. |
| FR7.3 | Exported `.ics` files shall be compatible with Google Calendar, Apple Calendar, and Outlook. |

---

## 7. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | Syllabus extraction and plan generation should complete client-side without noticeable lag for typical syllabus lengths |
| Privacy | Syllabus files are processed client-side; no file content is required to be sent to a server |
| Compatibility | `.ics` exports must be valid across major calendar providers |
| Responsiveness | UI (progress bar, session cards) must work across mobile and desktop breakpoints |
| Usability | Core flow (upload → preferences → generated plan) should require minimal configuration steps |

---

## 8. Assumptions & Constraints

- V1 has no backend/user-account persistence layer; plans are session-based (do not survive across visits/devices).
- Syllabus extraction relies on reasonably well-structured source documents; unusual formats may reduce extraction accuracy.
- Only single-course planning is supported in V1.
- Calendar integration depends on the continued availability/format stability of Google Calendar link parameters and the `.ics` standard.

---

## 9. Success Metrics (KPIs)

| Metric | Definition |
|---|---|
| Activation | % of users who upload a syllabus and generate a first study plan |
| Engagement | Average study sessions completed per user |
| Retention | % of students returning to the planner weekly |
| Completion rate | % of generated sessions marked complete |
| Calendar adoption | % of users who sync their plan with a calendar |

---

## 10. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Inconsistent syllabus formats reduce extraction accuracy | Poor first-plan quality, user drop-off | Preview step lets users verify/correct before generating plan; sample syllabus sets expectations |
| No persistence layer | Users lose plans between sessions | Flagged for V2 (user accounts and saved plans) |
| Multi-course workload not supported | Limits usefulness for students juggling several classes | Planned for V2 (multi-course planning, workload balancing) |
| Reliance on third-party calendar link formats | Breakage if Google changes URL parameters | `.ics` export as a stable fallback across providers |

---

## 11. Roadmap Alignment

| Phase | Focus |
|---|---|
| **V1 (Current)** | Single-course upload, extraction, plan generation, tracking, Focus Mode, calendar integration |
| **V2 (Planned)** | Multi-course planning, workload balancing, exam prep mode, assignment prioritization, missed-session re-planning, user accounts |
| **V3 (Future)** | AI-powered syllabus understanding, personalized recommendations, adaptive scheduling, LMS integrations, mobile app |
