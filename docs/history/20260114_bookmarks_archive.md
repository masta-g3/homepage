# Bookmarks Archive Feature

## Summary

Archive bookmarks to hide them without deleting. Uses `archived_at` timestamp (NULL = visible, set = hidden).

## API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/bookmarks` | GET | Default excludes archived |
| `/api/bookmarks?archived=true` | GET | Show only archived |
| `/api/bookmarks/:id/archive` | POST | Archive a bookmark |
| `/api/bookmarks/:id/unarchive` | POST | Restore archived bookmark |

## UI

- [x] "archived" filter button in filter bar
- [x] Right-click context menu on cards
- [x] Archive action removes card from current view
- [x] Unarchive action in archived view

## Interaction

1. Right-click card → "archive" → card disappears
2. Click "[archived]" filter → view archived items
3. Right-click archived card → "unarchive" → returns to active

## Files

- `api/bookmarks.js` - Added archive filter logic
- `api/bookmarks/[id]/archive.js` - New endpoint
- `api/bookmarks/[id]/unarchive.js` - New endpoint
- `bookmarks/index.html` - Added archived filter button
- `bookmarks.js` - Added state, context menu, archive action
- `bookmarks.css` - Added context menu styles
