# a11y-001: Keyboard Navigation and Accessibility

**Feature ID**: a11y-001
**Status**: Done
**Completed**: 2024-12-22

---

## Feature Specification

Add keyboard navigation and accessibility attributes to make the homepage usable for keyboard-only users and screen reader users.

### Requirements

1. **Focusable cards**: Project cards navigable via Tab key
2. **Keyboard activation**: Enter/Space opens card URL
3. **Focus indicators**: Visible focus styles for all interactive elements
4. **Modal accessibility**: Focus trapping in modal (native `<dialog>`)

---

## Implementation Summary

### HTML Changes (index.html)

Added to all 5 project cards:
- `tabindex="0"` - makes cards focusable in tab order
- `role="link"` - indicates navigation behavior to screen readers

### CSS Changes (app.css)

Added `:focus-visible` styles for keyboard-only focus indicators:
- `.project-card:focus-visible`: 2px black outline with offset, z-index boost
- `.about-trigger:focus-visible`: 2px black outline with offset
- `.modal-close:focus-visible`: 2px black outline with offset

### JavaScript Changes (app.js)

Added keydown handler for cards:
```javascript
card.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    window.open(url, '_blank');
  }
});
```

---

## Files Modified

- **index.html**: Added `tabindex="0"` and `role="link"` to 5 project cards
- **app.css**: Added 3 `:focus-visible` rule blocks (~15 lines)
- **app.js**: Added keydown handler (~7 lines)

---

## Design Decisions

1. **`role="link"` over `role="button"`**: Cards navigate to external URLs, which is link behavior.

2. **`:focus-visible` over `:focus`**: Only shows focus ring for keyboard navigation, not mouse clicks.

3. **Native `<dialog>` focus trapping**: No custom implementation needed—`showModal()` handles this automatically.

4. **Space key handling**: `e.preventDefault()` prevents page scroll when activating cards with spacebar.
