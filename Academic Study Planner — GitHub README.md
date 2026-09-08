# 📚 Academic Study Planner

> Turn a syllabus into a personalized, actionable study plan.

**Live Demo:** [Add link]  
**Product Design:** [Add Figma link]  
**Built by:** Anh Tran

---

## 🎯 The Problem

Students receive course syllabi containing deadlines, readings, assignments, exams, and weekly topics — but the syllabus itself doesn't tell them **how to organize their time**.

Students still have to manually answer:

- What should I study this week?
- How much time should I spend on each topic?
- When should I start preparing for an exam?
- How do I fit multiple courses into my schedule?
- How do I track whether I'm actually keeping up?

The Academic Study Planner turns an uploaded syllabus into a personalized study schedule based on the student's availability and preferred study session length.

---

## 💡 The Solution

Students upload a syllabus, configure their study preferences, and receive a structured study plan.

### Core workflow

```text
Upload Syllabus
       ↓
Extract Course Schedule
       ↓
Configure Study Preferences
       ↓
Generate Study Plan
       ↓
Track Progress
       ↓
Focus & Complete Sessions
       ↓
Sync With Calendar
```

---

# ✨ Key Features

## 1. Syllabus Upload & Extraction

Students can upload:

- PDF
- TXT
- DOCX
- Markdown
- RTF

The application extracts course topics and schedule information directly from the uploaded document and provides a preview before generating the study plan.

---

## 2. Personalized Study Planning

Students can configure:

- Course start date
- Available study days
- Session duration
- Weekly study schedule

The planner then generates study sessions around the student's preferences.

---

## 3. Study Plan Views

Students can view their schedule in:

- Weekly view
- List view

Each session includes:

- Study topic
- Subtopics
- Date
- Duration
- Completion status
- Calendar integration
- Focus mode

---

## 4. Progress Tracking

Students can mark sessions as complete and immediately see:

- Overall completion percentage
- Completed vs. total sessions
- Daily progress
- Weekly progress
- Visual progress indicators

Completed sessions receive a visual strikethrough treatment to provide immediate feedback.

---

## 5. Focus Mode

Each study session can be launched in Focus Mode.

Features include:

- Countdown timer
- Play / pause
- +5 minute extension
- Reset
- Finish & mark complete
- Picture-in-picture style dock

---

## 6. Buttercup 🐶

Meet **Buttercup**, the yellow puppy study companion.

Buttercup provides encouraging messages during focus sessions and celebrates when students complete a session.

The goal is to make studying feel more engaging and rewarding without overwhelming the core productivity experience.

---

## 7. Calendar Integration

Students can:

**Add individual sessions to Google Calendar**

or

**Sync the entire study plan**

The full schedule can be exported as an `.ics` calendar file compatible with Google Calendar, Apple Calendar, and Outlook.

---

# 🖥️ Product Screens

## Syllabus Upload

![Syllabus Upload](public/screenshots/upload.png)

Students upload their syllabus and preview the extracted course schedule before generating their plan.

---

## Study Plan

![Study Plan](public/screenshots/study-plan.png)

The generated schedule organizes course topics into manageable study sessions.

---

## Account / Progress

![Progress](public/screenshots/progress.png)

Students can monitor completion across individual days and the overall course.

---

## Focus Mode

![Focus Mode](public/screenshots/focus-mode.png)

Buttercup accompanies students during focused study sessions.

---

# 🏗️ Technical Architecture

```text
                Student
                   │
                   ↓
            React Frontend
                   │
        ┌──────────┴──────────┐
        ↓                     ↓
 Syllabus Upload         Study Preferences
        │                     │
        ↓                     ↓
 File Extraction        Plan Generator
        │                     │
        └──────────┬──────────┘
                   ↓
             Study Plan
                   │
        ┌──────────┼──────────┐
        ↓          ↓          ↓
   Progress     Focus      Calendar
   Tracking     Mode       Integration
```

---

# 🧰 Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Language | TypeScript |
| Styling | CSS / Tailwind |
| File Processing | Client-side extraction |
| Calendar | Google Calendar / `.ics` |
| Animation | CSS / SVG |
| Audio | Web Audio API |

---

# 🧠 Product Design Decisions

The product was designed around three principles:

### 1. Reduce planning friction

Students shouldn't need to manually translate a syllabus into dozens of calendar events.

### 2. Make progress visible

The product provides immediate feedback when students complete sessions.

### 3. Make studying feel rewarding

Focus Mode and Buttercup add lightweight positive reinforcement without interrupting the study workflow.

---

# 🔍 Technical Highlights

### Client-side syllabus processing

The application extracts text from uploaded documents directly in the browser and converts the extracted content into structured course information.

### Study plan generation

The planner maps course topics against:

- Course timeline
- Available study days
- Session duration
- Number of study sessions

### Calendar generation

Individual sessions can generate pre-filled calendar events, while the full schedule can be exported as an `.ics` file.

### Interactive focus experience

Focus Mode maintains a countdown timer, supports session extensions, and synchronizes completion state with the main study plan.

---

# 🧪 Testing

The project includes tests for key utilities and product logic, including:

- File extraction
- Study plan generation
- Calendar event generation

---

# 🗺️ Roadmap

## V1 — Current

- [x] Syllabus upload
- [x] Syllabus extraction
- [x] Study preference configuration
- [x] Study plan generation
- [x] Weekly / List views
- [x] Progress tracking
- [x] Focus Mode
- [x] Calendar integration

## V2 — Planned

- [ ] Multi-course planning
- [ ] Automatic workload balancing
- [ ] Exam preparation mode
- [ ] Assignment prioritization
- [ ] Study-plan adjustments when sessions are missed
- [ ] User accounts and saved plans

## V3 — Future

- [ ] AI-powered syllabus understanding
- [ ] Personalized study recommendations
- [ ] Adaptive scheduling based on performance
- [ ] LMS integrations
- [ ] Mobile application

---

# 📊 Product Success Metrics

If this were launched as a real product, I would measure:

### Activation
% of users who upload a syllabus and generate their first study plan.

### Engagement
Average study sessions completed per user.

### Retention
% of students returning to the planner each week.

### Completion
% of generated sessions completed.

### Calendar adoption
% of users who sync their plan with a calendar.

---

# 📌 What This Project Demonstrates

This project was intentionally built at the intersection of:

**Product × Design × Technology × Data**

### Product
- Problem identification
- User journey design
- Feature prioritization
- Product roadmap
- Success metrics

### Design
- UX flows
- Information architecture
- Responsive interface
- Interaction design
- Micro-interactions

### Engineering
- React
- TypeScript
- File processing
- Client-side data transformation
- Calendar integrations
- Interactive state management

### Product Thinking

The goal wasn't simply to build a study calendar.

It was to answer:

> **How can technology reduce the cognitive effort required for students to turn a syllabus into an actionable plan?**