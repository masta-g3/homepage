# Bookmarks Archive Feature

## Overview

Add ability to archive bookmarks (hide without deleting). Uses `archived_at` timestamp column.

| State | `archived_at` | Visibility |
|-------|---------------|------------|
| Active | NULL | Shown by default |
| Archived | timestamp | Hidden unless `?archived=true` |

---

## API Changes

### Modified: `GET /api/bookmarks`

Add `archived` query param:

```javascript
// api/bookmarks.js
const { filter, archived, limit = '20', offset = '0' } = req.query;

let whereConditions = [];

// Archive filter (default: exclude archived)
if (archived === 'true') {
  whereConditions.push('archived_at IS NOT NULL');
} else {
  whereConditions.push('archived_at IS NULL');
}

// Existing filters
if (filter === 'unread') {
  whereConditions.push('read_at IS NULL');
} else if (filter === 'x_article') {
  whereConditions.push("source_type = 'x_article'");
} else if (filter === 'external') {
  whereConditions.push("source_type = 'external'");
}

const whereClause = whereConditions.length
  ? 'WHERE ' + whereConditions.join(' AND ')
  : '';
```

### New: `POST /api/bookmarks/[id]/archive`

```javascript
// api/bookmarks/[id]/archive.js
import { pool } from '../../db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  const result = await pool.query(`
    UPDATE personal.x_bookmarks
    SET archived_at = NOW(), updated_at = NOW()
    WHERE x_id = $1
    RETURNING archived_at
  `, [id]);

  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Bookmark not found' });
  }

  return res.json({ success: true, archived_at: result.rows[0].archived_at });
}
```

### New: `POST /api/bookmarks/[id]/unarchive`

```javascript
// api/bookmarks/[id]/unarchive.js
import { pool } from '../../db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  const result = await pool.query(`
    UPDATE personal.x_bookmarks
    SET archived_at = NULL, updated_at = NOW()
    WHERE x_id = $1
    RETURNING x_id
  `, [id]);

  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Bookmark not found' });
  }

  return res.json({ success: true });
}
```

---

## Database

Assumes `archived_at` column exists. If not:

```sql
ALTER TABLE personal.x_bookmarks
ADD COLUMN archived_at TIMESTAMP DEFAULT NULL;
```

---

## UI Changes

### Filter Bar

Add "archived" filter button:

```html
<button class="filter-btn" data-filter="archived">archived</button>
```

### Card Interaction

Add archive action. Two options:

**Option A: Right-click context menu**
- Right-click card → "archive" option
- Minimal UI change

**Option B: Swipe/button on card**
- Small [×] button on hover
- More discoverable but adds visual noise

Recommend **Option A** for minimalism.

### Archive View

When viewing archived:
- Cards show "unarchive" action instead
- Maybe dim styling to indicate archived state

---

## Client-Side Changes

### State

```javascript
const state = {
  // ... existing
  archived: false  // viewing archived items?
};
```

### Filter Handling

```javascript
// When "archived" filter clicked
if (btn.dataset.filter === 'archived') {
  state.archived = true;
  state.filter = 'all';  // reset other filters
} else {
  state.archived = false;
  state.filter = btn.dataset.filter;
}
```

### Fetch Update

```javascript
const params = new URLSearchParams({
  limit: state.limit,
  offset: state.offset
});

if (state.archived) {
  params.set('archived', 'true');
} else if (state.filter !== 'all') {
  params.set('filter', state.filter);
}
```

### Archive Action

```javascript
async function archiveBookmark(bookmark, card) {
  const endpoint = bookmark.archived_at
    ? `/api/bookmarks/${bookmark.x_id}/unarchive`
    : `/api/bookmarks/${bookmark.x_id}/archive`;

  await fetch(endpoint, { method: 'POST' });

  // Remove card from current view
  card.remove();
  state.bookmarks = state.bookmarks.filter(b => b.x_id !== bookmark.x_id);
}
```

### Context Menu (Option A)

```javascript
card.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  showContextMenu(e.clientX, e.clientY, bookmark, card);
});

function showContextMenu(x, y, bookmark, card) {
  // Remove existing menu
  document.querySelector('.context-menu')?.remove();

  const menu = document.createElement('div');
  menu.className = 'context-menu';
  menu.style.left = x + 'px';
  menu.style.top = y + 'px';

  const action = bookmark.archived_at ? 'unarchive' : 'archive';
  menu.innerHTML = `<button class="context-action">[${action}]</button>`;

  menu.querySelector('button').addEventListener('click', () => {
    archiveBookmark(bookmark, card);
    menu.remove();
  });

  document.body.appendChild(menu);

  // Close on click outside
  setTimeout(() => {
    document.addEventListener('click', () => menu.remove(), { once: true });
  }, 0);
}
```

### Context Menu CSS

```css
.context-menu {
  position: fixed;
  background: var(--paper);
  border: 1px solid var(--black);
  padding: 0.5rem;
  z-index: 1000;
}

.context-action {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  background: none;
  border: none;
  color: var(--black);
  cursor: pointer;
  padding: 0.25rem 0.5rem;
}

.context-action:hover {
  text-decoration: underline;
}
```

---

## Implementation Phases

### Phase 1: API
- [x] Add `archived_at IS NULL` filter to existing `/api/bookmarks`
- [x] Add `?archived=true` param handling
- [x] Create `/api/bookmarks/[id]/archive.js`
- [x] Create `/api/bookmarks/[id]/unarchive.js`
- [ ] Verify: endpoints work via curl

### Phase 2: UI Filter
- [x] Add "archived" button to filter bar
- [x] Update JS to handle archived state
- [x] Update fetch to pass `archived` param
- [ ] Verify: can toggle between active and archived views

### Phase 3: Archive Action
- [x] Add context menu on right-click
- [x] Wire up archive/unarchive actions
- [x] Card removes from view on archive
- [ ] Verify: full archive → view archived → unarchive flow works

---

## Files to Modify/Create

| File | Change |
|------|--------|
| `api/bookmarks.js` | Add archived filter logic |
| `api/bookmarks/[id]/archive.js` | New endpoint |
| `api/bookmarks/[id]/unarchive.js` | New endpoint |
| `bookmarks/index.html` | Add archived filter button |
| `bookmarks.js` | Add state, context menu, archive action |
| `bookmarks.css` | Add context menu styles |
