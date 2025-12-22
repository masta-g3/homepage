# mg3.dev Homepage

## Vision

A single-page interactive portfolio/homepage that transforms the industrial plotting paper aesthetic into a tactile desktop workspace. Project cards float like paper notes on an engineer's desk—draggable, rotatable, scattered but intentional. The experience should feel like discovering someone's curated workspace.

**Core experience**: visitors land on a dot-grid surface with paper cards scattered across it. Each card represents a project. Cards can be dragged and repositioned. An "about" section opens as a terminal-style modal. The entire experience reinforces the "engineer's desk" metaphor.

## Tech Stack

| Technology | Why |
|------------|-----|
| Vanilla HTML | Single page, no routing needed |
| Vanilla CSS | Design system already defined in styles.css |
| Vanilla JS | Drag interactions are simple; no framework overhead |

**Rejected alternatives**:
- React/Vue/Svelte: Overkill for a single interactive page
- Tailwind: We have a complete design system; adding utility classes adds cognitive load
- GSAP: Simple CSS transitions suffice; no complex animations needed

## Architecture

```
homepage/
├── index.html          # Single page entry point (shell only)
├── data.json           # Project cards and about content
├── styles.css          # Inherited design system (from blog)
├── app.css             # Homepage-specific styles (cards, workspace, modal)
├── app.js              # Fetches data.json, renders cards, handles interactions
├── fonts/              # Berkeley Mono woff2 files
├── images/             # Project screenshots (optional)
│   └── projects/       # Organized by project slug
├── docs/
│   ├── STRUCTURE.md    # This file
│   └── VISUAL_IDENTITY.md  # Design system reference
└── features.json       # Feature backlog
```

## Data Model

Projects and about content are defined in `data.json`:

```json
{
  "projects": [
    {
      "id": "project-slug",
      "title": "Project Name",
      "description": "Brief description of the project.",
      "url": "https://example.com",
      "date": "2024-01",
      "position": { "x": 15, "y": 20, "rotation": -2 }
    }
  ],
  "about": {
    "content": "About text here."
  }
}
```

**Project properties**:
- `id`: Unique identifier (used for localStorage position persistence)
- `title`, `description`, `url`, `date`: Display content
- `position.x`, `position.y`: Initial position (percentage-based)
- `position.rotation`: Slight rotation in degrees (-5 to 5)

Positions persist to `localStorage` after drag, so users' arrangements are remembered.

## User Flows

```
┌─────────────────────────────────────────────────────┐
│                    LANDING                          │
│  ┌──────────────────────────────────────────────┐   │
│  │          dot grid background                 │   │
│  │   ┌─────────┐  ┌─────────┐                   │   │
│  │   │ card 1  │  │ card 2  │    scattered      │   │
│  │   │ (rot)   │  └─────────┘    project        │   │
│  │   └─────────┘       ┌─────────┐  cards       │   │
│  │          ┌─────────┐│ card 4  │              │   │
│  │          │ card 3  │└─────────┘              │   │
│  │          └─────────┘                         │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  [about]  ← fixed position, opens modal             │
└─────────────────────────────────────────────────────┘

User interactions:
1. DRAG card → repositions on grid, saves to localStorage
2. CLICK card → navigates to project URL (external link)
3. HOVER card → border thickens (2px → 3px), subtle lift via z-index
4. CLICK [about] → modal overlay appears with about content
5. ESC or click outside → closes modal
```

## Screen Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ mg3.dev                                          [about]        │
├─────────────────────────────────────────────────────────────────┤
│ · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · │
│ · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · │
│ · · ┌──────────────────┐ · · · · · · · · · · · · · · · · · · · │
│ · · │ 2024-01          │ · · · ┌──────────────────┐ · · · · · · │
│ · · │ project alpha    │ · · · │ 2023-11          │ · · · · · · │
│ · · │ desc...          │ · · · │ project beta     │ · · · · · · │
│ · · │ ┌──────────────┐ │ · · · │ desc...          │ · · · · · · │
│ · · │ │  screenshot  │ │ · · · └──────────────────┘ · · · · · · │
│ · · │ └──────────────┘ │ · · · · · · · · · · · · · · · · · · · │
│ · · └──────────────────┘ · · · · · · · · · · · · · · · · · · · │
│ · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · │
│ · · · · · · · · · ┌──────────────────┐ · · · · · · · · · · · · │
│ · · · · · · · · · │ 2023-08          │ · · · · · · · · · · · · │
│ · · · · · · · · · │ project gamma    │ · · · · · · · · · · · · │
│ · · · · · · · · · │ short desc       │ · · · · · · · · · · · · │
│ · · · · · · · · · └──────────────────┘ · · · · · · · · · · · · │
│ · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · │
└─────────────────────────────────────────────────────────────────┘
```

### About Modal

```
┌─────────────────────────────────────────────────────────────────┐
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓ ┌───────────────────────────────────────────────┐ ▓▓▓▓▓▓▓▓│
│▓▓▓▓ │ about                                     [×] │ ▓▓▓▓▓▓▓▓│
│▓▓▓▓ ├───────────────────────────────────────────────┤ ▓▓▓▓▓▓▓▓│
│▓▓▓▓ │                                               │ ▓▓▓▓▓▓▓▓│
│▓▓▓▓ │ > about content here...                       │ ▓▓▓▓▓▓▓▓│
│▓▓▓▓ │                                               │ ▓▓▓▓▓▓▓▓│
│▓▓▓▓ │ links: [github] [linkedin] [email]            │ ▓▓▓▓▓▓▓▓│
│▓▓▓▓ │                                               │ ▓▓▓▓▓▓▓▓│
│▓▓▓▓ └───────────────────────────────────────────────┘ ▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
└─────────────────────────────────────────────────────────────────┘
```

## Design Patterns

### Card Component

Cards follow the visual identity strictly:
- 1px border (--border-color), thickens to 2px on hover
- Paper background (--paper)
- No shadows, no rounded corners
- Left border accent (3px --black) for emphasis
- Slight rotation transform for scattered look

```css
.project-card {
  position: absolute;
  background: var(--paper);
  border: 1px solid var(--border-color);
  border-left: 3px solid var(--black);
  padding: 1rem;
  cursor: grab;
  transform: rotate(var(--rotation, 0deg));
  max-width: 280px;
}

.project-card:hover {
  border-color: var(--black);
  z-index: 10;
}

.project-card:active {
  cursor: grabbing;
}
```

### Drag Behavior

Simple pointer events (no libraries):
1. `pointerdown`: capture card, store offset, set `cursor: grabbing`
2. `pointermove`: update card position
3. `pointerup`: release, persist position to localStorage

Grid snapping is optional (can be toggled).

### Modal Pattern

Modal follows visual identity:
- Semi-transparent backdrop (rgba(0,0,0,0.5))
- Modal box: 2px solid --black border
- Title bar with close button [×]
- Terminal-style content with prompt (>)

### State Management

Minimal state, all in localStorage:
```json
{
  "cardPositions": {
    "project-alpha": { "x": 120, "y": 80 },
    "project-beta": { "x": 400, "y": 200 }
  }
}
```

Reset positions: clear localStorage key or add a reset button.

## Responsive Behavior

- Desktop (>768px): Full workspace, cards draggable
- Mobile (<768px): Cards stack vertically (no drag), simplified list layout

On mobile, the "scattered desk" metaphor doesn't work well with touch—convert to a clean list.

## Performance

- No build step
- No external dependencies
- Fonts loaded with `font-display: swap`
- Images lazy-loaded
- Total JS likely <2KB minified

## Future Considerations (out of scope for MVP)

- Keyboard navigation for cards (Tab + Enter)
- Print stylesheet
- RSS feed of projects
- Animation: cards "settle" when page loads (subtle, if at all)
