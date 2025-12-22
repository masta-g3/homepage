# polish-001: Reset Button for Card Positions

**Feature ID**: polish-001
**Status**: Done
**Completed**: 2024-12-22

---

## Feature Specification

Add a reset button that allows users to restore all project cards to their original positions (as defined in `data-x`/`data-y` attributes), clearing any localStorage-persisted positions from dragging.

### Requirements

1. **Reset button in header**: Small [reset] button next to [about]
2. **Clear localStorage**: Remove stored card positions
3. **Restore positions**: Reapply original data-x/data-y values
4. **Desktop only**: Hidden on mobile (no drag = no reset needed)

---

## Implementation Summary

### HTML Changes (index.html)

Added reset button to site-nav:
```html
<nav class="site-nav">
  <button type="button" class="reset-trigger">[reset]</button>
  <button type="button" class="about-trigger" aria-haspopup="dialog">[about]</button>
</nav>
```

### CSS Changes (app.css)

Consolidated button styles for .reset-trigger and .about-trigger:
- Base styles (font, color, underline)
- Hover states (thicker underline)
- Focus-visible states (outline)
- Mobile: `display: none` for reset button

### JavaScript Changes (app.js)

Added reset handler inside desktop layout block:
```javascript
if (resetTrigger) {
  resetTrigger.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    cards.forEach((card) => {
      const x = parseFloat(card.dataset.x) || 0;
      const y = parseFloat(card.dataset.y) || 0;
      card.style.left = x + '%';
      card.style.top = y + '%';
    });
  });
}
```

---

## Files Modified

- **index.html**: Added reset button to nav (~1 line)
- **app.css**: Consolidated button styles, added mobile hide (~10 lines)
- **app.js**: Added reset click handler (~12 lines)

---

## Design Decisions

1. **Button in header nav**: Consistent with [about] button placement.

2. **[reset] text format**: Matches [about] and [×] bracket convention.

3. **Hidden on mobile**: Mobile layout has no drag functionality.

4. **No confirmation dialog**: Reset is non-destructive; users can re-drag immediately.

5. **No animation**: Cards snap to position instantly for simplicity.
