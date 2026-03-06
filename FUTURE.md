# Neural Hub - Future Ideas & Implementation Roadmap

## Priority Order (2026-03-05 Updated)

### P0 - Immediate Fixes

###bugs
-search button crashes the site
-tooltips need to be prioritized on top when hovering vs the background tooltips,
-tooltips need to go away when we engage in a double click and bring up the menu, theyre still visible
-sphere still not the best shap, its just a sphere with projects poking out, it needs to be more random and more like a web, yet still retain the sphere shape
we can emphasize this by adjust the 2d spheres behind the nueral hub sphere to be exactly the size of the hub so it give the illusion of a perfect cicle (like in the original scripts)

#### 1. Animation Speed Control ⭐ HIGH PRIORITY
**Status:** Not Started | **Complexity:** Low

Current problem: Animations (pulsing, rotation) are too aggressive, making it hard to click nodes.

**Solution:**
- Animation runs at cool speed by default
- On mouse interaction (click/hover on sphere), immediately slow to minimal movement
- After 1 second delay, slowly ramp back up to full animation over 5 seconds
- This gives the "cool" effect while remaining usable for clicking

**Implementation:** Track last interaction time in useFrame, adjust animation speed based on time since interaction.

---

### P1 - High Value Features

#### 2. Health Layer Toggle ⭐ HIGH PRIORITY
**Status:** Not Started | **Complexity:** Medium

A button that recolors the entire sphere by health rather than type:
- **Green nodes** = healthy, active, no issues
- **Amber nodes** = stale, hasn't been touched in 30+ days
- **Red nodes** = has open blocked tasks or unresolved RCAs
- **Grey nodes** = archived/completed

Toggle in top bar. Provides quick visual overview of project health at a glance.

---

#### 3. Contextual Right Panel (Editable) ⭐ HIGH PRIORITY
**Status:** Not Started | **Complexity:** High

Currently the side panel is read-only. Make it interactive:
- Add a note to a project directly from the panel (writes to workspace file)
- Mark a task as done, blocked, or in-progress
- Promote a memory log entry to long-term memory with one button
- Create a quick task linked to the current project
- Edit project metadata (priority, status)

Requires: OpenClaw workspace integration for writing files.

---

#### 4. Real Dashboard Data (Left Panel)
**Status:** Not Started | **Complexity:** Medium

Replace mock data on left side with real OpenClaw metrics:
- Session count and duration
- API calls and costs (from OpenClaw dashboard data)
- Tasks completed
- Memory/log entries count
- Keep the UI format and graph types shown

Requires: Reading from OpenClaw's state files or API.

---

#### 5. Timeline Scrubber ⭐ MOST COMPELLING
**Status:** Not Started | **Complexity:** High

A horizontal slider at the bottom of the screen representing time from OpenClaw's first day to today.
- As you drag backward, memory nodes that came after that date fade out
- Tasks that were completed after that point return to active/pending state
- Projects that didn't exist yet disappear
- Watch the sphere grow denser as OpenClaw ages

This is one of the most compelling features - literally watching the workspace grow over time.

---

### P2 - Integration Features

#### 6. Live Pulse When OpenClaw Is Working
**Status:** Not Started | **Complexity:** Medium | **Requires:** OpenClaw integration

When OpenClaw is actively running a task:
- That task's node pulses visibly with different color/glow
- Its connections to parent project animate
- Traveling dot along connection line (like signal moving through wire)
- You'd see "OpenClaw is working on X project right now" at a glance

**Requires:**
- OpenClaw writes `ACTIVE_SESSION.json` with current task info
- Visualization polls this file every few seconds

---

#### 7. Surface Tension Effect (Node Birth/Death)
**Status:** Not Started | **Complexity:** High | **Nice to Have**

When adding a new node (new project created, new task written):
- Should emerge from nearest related node like a bubble forming on surface
- Starts as small protrusion from parent node
- Grows, then detaches and finds its orbital position
- When archived, doesn't disappear - shrinks back toward parent and is absorbed

**Makes the sphere feel like a living organism:**
- New information is born from existing information
- Completed work is reabsorbed rather than deleted
- Sphere's history encoded in how it moves, not just data

---

## Completed in This Session

- **Spherical distribution** - Pure Fibonacci sphere, no randomness
- **Proximity tooltips** - Small labels appear when zoomed close to large projects
- **Hover tooltip fix** - Hides when not hovering, regardless of selection
- **Smoother spheres** - 48x48 geometry segments

---

## Pain Points (Discussed)

1. **Animation too aggressive** - Need the speed control (P0)
2. **Can't edit in panel** - Need contextual editable panel (P1)
3. **Mock data on left** - Need real OpenClaw metrics (P1)
4. **No time perspective** - Need timeline scrubber (P1)
5. **Can't see active work** - Need live pulse (P2)

---

## Technical Notes for Implementation

### Animation Speed Control
```typescript
// In useFrame:
const timeSinceInteraction = Date.now() - lastInteractionTime;
let speedMultiplier = 1;
if (timeSinceInteraction < 1000) {
  speedMultiplier = 0.1; // Slow right after interaction
} else if (timeSinceInteraction < 6000) {
  // Ramp up over 5 seconds
  speedMultiplier = 0.1 + (timeSinceInteraction - 1000) / 5000 * 0.9;
}
```

### Timeline Scrubber
- Each node needs `createdAt` and potentially `archivedAt` timestamp
- Filter nodes in useMemo based on scrubber position
- Animate opacity for smooth transitions

### Live Pulse
- Poll `ACTIVE_SESSION.json` in useEffect every 2-3 seconds
- Store active node ID in state
- Add special glow/animation for active node in render
