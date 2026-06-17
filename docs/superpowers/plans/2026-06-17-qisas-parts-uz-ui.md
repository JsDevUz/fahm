# Qisas Parts Uz UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ensure every qisas sentence has grammar parts with detailed explanations and Uzbek word meanings, and show those meanings in the grammar dialog instead of inline under Arabic words on mobile.

**Architecture:** Add a data maintenance script that derives missing `parts` from sentence text and chapter word dictionaries, then enriches every part with `uz` and a fuller `e`. Update `GrammarModal` to render a fourth `O‘zbekcha` column. Update `ChapterView` so mobile no longer renders inline word translations under Arabic tokens.

**Tech Stack:** Node.js data scripts, React components, existing JSON chapter data, Vite build.

---

### Task 1: Data Enrichment Script

**Files:**
- Create: `scripts/fill-qisas-parts-uz.mjs`
- Modify by script: `src/data/qisas/*.json`

- [ ] Create a Node script that reads `src/data/qisas/index.json`, each chapter JSON, and each `*_words.json`.
- [ ] For every existing `part`, set `part.uz` from the exact or normalized word dictionary match.
- [ ] For every existing `part`, expand `part.e` to include the original explanation plus Uzbek meaning when missing.
- [ ] For every sentence with empty `parts`, tokenize the Arabic sentence and create simple part objects from dictionary matches.
- [ ] Fail if any sentence remains without parts or any part lacks `uz`.

### Task 2: Grammar Dialog

**Files:**
- Modify: `src/components/GrammarModal.jsx`

- [ ] Add an `O‘zbekcha` table header after `Izoh`.
- [ ] Render `p.uz || ''` in the new column.
- [ ] Keep the table usable on narrow screens by preserving the modal’s existing horizontal/vertical scroll behavior.

### Task 3: Mobile Inline Translation Removal

**Files:**
- Modify: `src/components/ChapterView.jsx`

- [ ] Stop rendering `.word-translation-mobile` under Arabic words.
- [ ] Keep hover tooltip behavior for desktop unchanged.
- [ ] Keep token click behavior unchanged: sentence click opens grammar dialog.

### Task 4: Verification

**Files:**
- Read: `src/data/qisas/*.json`

- [ ] Run a Node audit confirming `emptyPartsSentences = 0` and `partsWithoutUz = 0`.
- [ ] Run UI word audit confirming `ui miss rows = 0`.
- [ ] Run `npm run build` and confirm it exits 0.
