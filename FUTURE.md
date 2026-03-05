# Neural Hub - Future Ideas & TODO

## Planned Features

---

## 1. Health Layer Toggle
**Status:** Not Started

A button that recolors the entire sphere by health rather than type:
- **Green nodes** = healthy, active, no issues
- **Amber nodes** = stale, hasn't been touched in 30+ days
- **Red nodes** = has open blocked tasks or unresolved RCAs
- **Grey nodes** = archived/completed

This provides a quick visual overview of project health at a glance.

---

## 2. Timeline Scrubber
**Status:** Not Started

A horizontal slider at the bottom of the screen that represents time from OpenClaw's first day to today.
- As you drag backward, memory nodes that came after that date fade out
- Tasks that were completed after that point return to active/pending state
- Projects that didn't exist yet disappear

This lets you watch the workspace grow over time and see when big bursts of activity happened.

---

## 3. Contextual Right Panel (Editable)
**Status:** Not Started

Currently the side panel is read-only. Make it interactive:
- Add a note to a project directly from the panel (writes to workspace)
- Mark a task as done, blocked, or in-progress
- Promote a memory log entry to long-term memory with one button
- Create a quick task linked to the current project

---

## 4. Real Dashboard Data on Left Panel
**Status:** Not Started

Replace mock data on left side with real OpenClaw data:
- Session count and duration
- API calls and costs
- Tasks completed
- Memory usage
- Keep the UI format and graph types shown

Requires reading from OpenClaw's workspace state files.

---

## 5. Animation Speed Control
**Status:** Not Started

The current animations (pulsing, rotation) are too aggressive:
- Animation moves too fast by default
- When user clicks, it slows down to usable speed
- After mouse input, slowly ramps back up over 5 seconds (with 1 second delay)
- This gives the cool effect while remaining usable for clicking

---

## 6. Live Pulse When OpenClaw Is Working
**Status:** Not Started

When OpenClaw is actively running a task:
- That task's node should pulse visibly
- Its connections to parent project should animate
- Traveling dot along connection line like a signal moving through a wire
- You'd see "OpenClaw is working on X project right now"

Requires:
- OpenClaw writes ACTIVE_SESSION.json with current task info
- Visualization polls this file every few seconds

---

## 7. Surface Tension Effect (Node Animations)
**Status:** Not Started

When adding a new node:
- Should emerge from nearest related node like a bubble forming
- Starts as small protrusion from parent node
- Grows, then detaches and finds orbital position
- When archived, shrinks back toward parent and is absorbed

This makes the sphere feel like a living organism:
- New information is born from existing information
- Completed work is reabsorbed rather than deleted
- Sphere's history encoded in how it moves, not just data

---

## Priority Order
1. Timeline Scrubber (most compelling)
2. Health Layer Toggle (quick win)
3. Animation Speed Control (usability fix)
4. Contextual Right Panel (high value)
5. Live Pulse (requires OpenClaw integration)
6. Real Dashboard Data (requires OpenClaw integration)
7. Surface Tension Effect (nice to have)
