# drag-001: Card Drag Functionality with Pointer Events

**Feature ID**: drag-001
**Status**: Done
**Completed**: 2025-12-22

---

## Feature Specification

Enable users to drag project cards across the workspace using pointer events. Cards move smoothly following the pointer with visual feedback (cursor change). Click and drag are distinguished to avoid interfering with card URL navigation.

### Requirements

1. **Pointer Event Handlers**:
   - `pointerdown`: Capture card and store offset
   - `pointermove`: Update card position while dragging
   - `pointerup`: Release card and persist new position

2. **Drag Mechanics**:
   - Drag uses absolute pixel coordinates during motion
   - Positions stored as percentages for responsive scaling
   - Card stays under pointer throughout drag (smooth follow)
   - Z-index boost during drag for visibility

3. **Click vs. Drag Distinction**:
   - 5px movement threshold distinguishes click from drag
   - Clicks with < 5px movement trigger URL navigation
   - Drags > 5px prevent URL navigation

4. **Viewport Constraints**:
   - Cards clamped to workspace bounds (0-100%)
   - Cards cannot be dragged off-screen

---

## Implementation Summary

✓ **Phase 1: Drag Handler Setup**
- [x] Added drag state object to `app.js`
- [x] Implemented `pointerdown` listener (capture offset, z-index, cursor feedback)
- [x] Implemented `pointermove` listener (smooth position update, threshold detection)
- [x] Implemented `pointerup` listener (persist percentage position, reset state)

✓ **Phase 2: Click vs. Drag Logic**
- [x] 5px movement threshold implemented
- [x] Click handler checks `!dragState.moved` flag to allow clicks only on short press

✓ **Phase 3: Viewport Constraints**
- [x] Position clamped in `onPointerMove` using `Math.max/min`

✓ **Phase 4: Testing & Verification**
- [x] Pointer events work on desktop browsers
- [x] Cursor feedback functional (grab → grabbing → grab)
- [x] Cards stay within workspace bounds
- [x] Clicks work after short press (< 5px movement)
- [x] No console errors

---

## Files Modified

- **app.js**: Added drag state management and three event handlers (pointerdown, pointermove, pointerup)
- **features.json**: Updated drag-001 status to "done"

---

## Design Decisions

1. **Pointer Events**: Unified API for mouse, touch, and pen input (future mobile support via drag-003)
2. **Pixel Coordinates During Drag**: Allows smooth pointer following; converted back to percentages on release
3. **5px Threshold**: Balances responsive clicks with intentional drag initiation
4. **No Grid Snapping**: Free-form drag matches "scattered desk" aesthetic (optional future enhancement)
5. **Z-index Boost**: Visual lift during drag prevents overlap confusion

---

## Success Criteria

✓ All requirements met:
1. Cards draggable via pointer events
2. Smooth position updates during drag
3. Positions persist to data attributes (ready for drag-002 localStorage)
4. Click and drag properly distinguished
5. Cards constrained to viewport
6. No console errors
