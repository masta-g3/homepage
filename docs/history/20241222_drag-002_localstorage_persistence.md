# drag-002: Persist Card Positions to localStorage

**Feature ID**: drag-002
**Depends On**: drag-001 (card drag functionality)
**Priority**: 2
**Scope**: Client-side persistence of card positions across page reloads

---

## Objective

Enable users' card arrangements to persist across browser sessions. When users drag cards and close/reload the page, their custom layout is restored on next visit. This reinforces the "engineer's desk" metaphor—their workspace arrangement is saved.

## Requirements

1. **Load on Page Init**: Read positions from localStorage on DOMContentLoaded
2. **Override Data Attributes**: Saved positions take precedence over `data-x/y` attributes
3. **Save on Drag End**: After `onPointerUp`, write current positions to localStorage
4. **Handle Missing/Corrupt Data**: Gracefully fall back to data attributes if localStorage unavailable
5. **No User Action Required**: Automatic save on every drag release (no manual "save" button)
6. **Survive Page Reload**: Positions persist across browser close/open cycles

---

## Solution Approach

### Data Structure

Store card positions in localStorage under a single key `"mg3_card_positions"`:

```json
{
  "cardPositions": {
    "project-alpha": { "x": 25.5, "y": 40.2 },
    "project-beta": { "x": 60.3, "y": 15.1 },
    "project-gamma": { "x": 45.0, "y": 70.8 }
  }
}
```

**Why this structure:**
- Single localStorage entry avoids quota overhead
- Card ID lookup is O(1)
- Easy to inspect in DevTools
- Can be cleared/reset atomically

**Card ID**: Use card's position in DOM or add data attribute. For now, use card index or add a `data-id` attribute to identify each card uniquely across reloads.

### Key Functions

#### 1. `loadPositionsFromStorage()`
- Called during DOMContentLoaded setup
- Read localStorage key "mg3_card_positions"
- Return parsed object or empty object if missing/invalid
- No error logging; silently fall back to data attributes

#### 2. `savePositionToStorage(cardId, x, y)`
- Called from `onPointerUp` after calculating percentages
- Read current localStorage data
- Update card's entry
- Write back to localStorage
- Fail silently (user doesn't care about storage failures)

#### 3. Integration Points
- **In DOMContentLoaded**: After parsing data attributes, check localStorage and override if exists
- **In onPointerUp**: After calculating percentages and storing to data-x/y, also save to localStorage

### Edge Cases & Resilience

1. **localStorage unavailable** (private mode, quota exceeded, disabled)
   - Try/catch wraps all localStorage operations
   - Silently continue; cards still work with data attributes
   - No console errors or user-facing dialogs

2. **Corrupt JSON in storage**
   - Try/catch on JSON.parse
   - Fall back to empty object, use data attributes
   - Old data silently discarded

3. **Card count changes** (HTML updated with new/removed cards)
   - Cards with stored positions load them
   - New cards use data attributes
   - Removed cards' entries remain in localStorage (cleanup optional, not critical)

4. **Workspace size changes** (browser resized)
   - Stored percentages scale correctly with viewport
   - No data loss, just reflowed layout

---

## Implementation Plan

### Phase 1: Utility Functions (Core Logic)

**File**: `app.js`

Add three utility functions at top level (after dragState, before DOMContentLoaded):

```javascript
const STORAGE_KEY = 'mg3_card_positions';

function loadPositionsFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    return {};
  }
}

function savePositionToStorage(cardId, x, y) {
  try {
    const positions = loadPositionsFromStorage();
    positions[cardId] = { x, y };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
  } catch (e) {
    // Fail silently
  }
}

function getCardId(card) {
  return card.dataset.id || card.id || Array.from(card.parentNode.children).indexOf(card);
}
```

**Why this approach:**
- Minimal helper functions, no bloat
- Try/catch is localized and appropriate here (external API with real failure modes)
- `getCardId` handles multiple identifier strategies
- Storage key is namespaced to avoid collisions

**Checklist:**
- [x] Add `loadPositionsFromStorage()` function
- [x] Add `savePositionToStorage()` function
- [x] Add `getCardId()` helper
- [x] Add `STORAGE_KEY` constant

### Phase 2: Load on Initialization

**File**: `app.js` (in DOMContentLoaded, card positioning section)

Modify the card positioning loop to load from localStorage:

```javascript
// Card positioning from data attributes and storage
const cards = document.querySelectorAll('.project-card');
const workspace = document.querySelector('.workspace');

if (workspace && cards.length > 0) {
  const storedPositions = loadPositionsFromStorage();

  cards.forEach((card, index) => {
    const cardId = getCardId(card);

    // Prefer stored position, fall back to data attributes
    const stored = storedPositions[cardId];
    const x = stored ? stored.x : (parseFloat(card.dataset.x) || 0);
    const y = stored ? stored.y : (parseFloat(card.dataset.y) || 0);
    const rotation = parseFloat(card.dataset.rotation) || 0;

    card.style.left = x + '%';
    card.style.top = y + '%';
    card.style.setProperty('--rotation', rotation + 'deg');
  });

  // ... rest of drag setup ...
}
```

**Checklist:**
- [x] Load storedPositions before card loop
- [x] Check stored position for each card
- [x] Override data-x/y with stored values if available
- [x] Verify cards render at correct positions on first load
- [x] Test with fresh page (no storage) — uses data attributes
- [x] Test with page reload — uses stored positions

### Phase 3: Save on Drag Release

**File**: `app.js` (in onPointerUp function)

Add localStorage save after updating data attributes:

```javascript
function onPointerUp(e) {
  if (!dragState.card) return;

  const card = dragState.card;
  const workspace = document.querySelector('.workspace');

  if (dragState.moved) {
    const percentX = (card.offsetLeft / workspace.clientWidth) * 100;
    const percentY = (card.offsetTop / workspace.clientHeight) * 100;

    card.dataset.x = percentX.toFixed(1);
    card.dataset.y = percentY.toFixed(1);

    // NEW: Save to localStorage
    const cardId = getCardId(card);
    savePositionToStorage(cardId, percentX.toFixed(1), percentY.toFixed(1));
  }

  card.style.zIndex = '';
  card.style.cursor = '';

  dragState.card = null;
  dragState.offsetX = 0;
  dragState.offsetY = 0;
  setTimeout(() => { dragState.moved = false; }, 0);
}
```

**Checklist:**
- [x] Add savePositionToStorage call in onPointerUp
- [x] Pass cardId, x, y to save function
- [x] Use same precision (toFixed(1)) for consistency
- [x] Test drag and reload — position persists
- [x] Test multiple cards — all positions saved

### Phase 4: Testing & Verification

**Manual Testing** (no automated tests needed; data persistence is simple and visual):

1. **Fresh load (no storage)**
   - [x] Open homepage in private/incognito window
   - [x] Cards appear at data-x/y positions
   - [x] localStorage is empty in DevTools

2. **Drag and persist**
   - [x] Drag card #1 to position (30%, 50%)
   - [x] Open DevTools > Application > localStorage
   - [x] Verify `mg3_card_positions` contains updated position
   - [x] Reload page (Cmd+R)
   - [x] Card #1 is at (30%, 50%), not original position

3. **Multiple cards**
   - [x] Drag cards #2, #3 to different positions
   - [x] Reload page
   - [x] All three cards persist correct positions
   - [x] localStorage shows all three entries

4. **Data integrity**
   - [x] Drag card slightly (< 5px) — shouldn't save (dragState.moved = false)
   - [x] Check localStorage — position unchanged
   - [x] Drag card > 5px — saves position
   - [x] Verify toFixed(1) precision in storage

5. **Reset/Clear**
   - [x] Manual DevTools: delete localStorage entry
   - [x] Reload page
   - [x] Cards return to data-x/y positions

6. **Edge case: Corrupt storage** (simulated)
   - [x] In DevTools console: `localStorage.setItem('mg3_card_positions', 'invalid json')`
   - [x] Reload page
   - [x] Should not error; cards use data attributes
   - [x] Check console for errors — none expected

---

## Code Summary

**Changes to app.js**:
- Add 3 utility functions (~20 lines): `loadPositionsFromStorage`, `savePositionToStorage`, `getCardId`
- Add STORAGE_KEY constant (~1 line)
- Modify DOMContentLoaded card loop (~6 lines): load storedPositions and override x/y
- Modify onPointerUp (~3 lines): call savePositionToStorage

**Total additions**: ~30 lines of code
**No new files**: Only modify app.js
**No new dependencies**: Uses native localStorage API

---

## Success Criteria

✓ All five requirements met:
1. Positions load from localStorage on page init
2. Saved positions override data-x/y attributes
3. Positions save automatically after drag
4. Missing/corrupt storage handled gracefully
5. Positions persist across page reload
6. No console errors or user dialogs
7. Code remains minimal and maintainable

