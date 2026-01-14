# X Bookmarks Board

## Summary

Card-based UI to browse and manage X.com bookmarks at `/bookmarks`. Separate from homepage to maintain distinct purposes (portfolio vs. reading list).

## Architecture

```
homepage/
├── bookmarks/
│   └── index.html          # Clean URL: /bookmarks
├── bookmarks.css           # Page styles
├── bookmarks.js            # Client interactions
└── api/
    ├── db.js               # Shared PostgreSQL pool
    ├── bookmarks.js        # GET /api/bookmarks
    └── bookmarks/[id]/read.js  # POST mark as read
```

## Data Source

PostgreSQL table `personal.x_bookmarks` on Hetzner. Vercel serverless functions connect via environment variables.

## Features

- [x] Grid layout with bookmark cards
- [x] Filter by: all, unread, x_article, external
- [x] Load more pagination
- [x] Click to open URL + mark as read
- [x] Keyboard navigation
- [x] Loading and empty states
- [x] Image error handling
- [x] Dark mode support
- [x] Mobile responsive layout

## Visual Identity

Follows terminal-minimalist aesthetic:
- Berkeley Mono typography
- Monochrome palette
- 3px left border accent on cards
- No shadows, rounded corners, or gradients
- Bullet indicator for unread state
