# cards-002: Card Click to Navigate to External URL

**Feature ID**: cards-002
**Status**: Done
**Completed**: 2025-12-22

---

## Feature Specification

Enable clicking on project cards to navigate to their associated external URLs. Clicks must be distinguished from drags to avoid accidental navigation during card repositioning.

### Requirements

1. **Click Handler**: Add click event listener to cards with `data-url` attribute
2. **Click vs. Drag Distinction**: Only trigger navigation if movement < 5px threshold
3. **External Navigation**: Open URLs in new tab (`window.open(url, '_blank')`)
4. **Non-interference**: Click should not trigger during or after drag operations

---

## Implementation Summary

✓ **Already Implemented** (during drag-001)

The click-to-navigate functionality was implemented as part of drag-001's click vs. drag distinction:

- Click handler added to all cards with `data-url` attribute
- Checks `!dragState.moved` flag before navigating
- Uses `window.open(url, '_blank')` for external links
- Excludes clicks on anchor tags (`e.target.tagName !== 'A'`)
- `setTimeout` delay on `dragState.moved` reset ensures flag is checked before reset

---

## Files

- **app.js**: Lines 92-102 contain the click handler implementation

---

## Implementation Details

```javascript
// Card click to open URL
cards.forEach((card) => {
  const url = card.dataset.url;
  if (url) {
    card.addEventListener('click', (e) => {
      if (e.target.tagName !== 'A' && !dragState.moved) {
        window.open(url, '_blank');
      }
    });
  }
});
```

The `dragState.moved` flag is set to `true` in `onPointerMove` when movement exceeds 5px, and reset to `false` in `onPointerUp` via `setTimeout(() => { dragState.moved = false; }, 0)`. This delay ensures the click handler can check the flag before it's reset.

---

## Success Criteria

✓ All requirements met:
1. Cards with data-url navigate on click
2. Clicks after drag (> 5px movement) do not trigger navigation
3. URLs open in new browser tab
4. Drag functionality remains unaffected
