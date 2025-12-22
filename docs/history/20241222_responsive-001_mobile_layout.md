# responsive-001: Mobile Layout (Stacked Cards, No Drag)

**Feature ID**: responsive-001
**Status**: Done
**Completed**: 2024-12-22

---

## Feature Specification

Implement responsive mobile layout that converts the scattered desktop workspace into a clean vertical card list on small screens.

### Requirements

1. **Media query breakpoint**: 768px width threshold
2. **Stacked layout**: Cards arranged vertically in document flow
3. **No rotation**: Cards display without rotation transform
4. **No drag**: Drag functionality disabled on mobile
5. **Click navigation**: Cards remain clickable to open project URLs

---

## Implementation Summary

### CSS Changes (app.css:182-212)

Added media query for mobile layout:
- `.workspace`: Flex column with 1rem gap
- `.project-card`: `position: static`, `width: 100%`, `transform: none`
- Cursor states overridden to `default`

### JavaScript Changes (app.js:16-18, 69)

Added `isMobileLayout()` helper using `matchMedia('(max-width: 768px)')`.

Wrapped position application and drag initialization in desktop-only condition:
```javascript
if (workspace && cards.length > 0 && !isMobileLayout()) {
  // position and drag logic
}
```

Click-to-navigate remains active on all devices.

---

## Files Modified

- **app.css**: Lines 182-212 contain the mobile media query
- **app.js**: Lines 16-18 contain `isMobileLayout()`, line 69 contains the conditional

---

## Design Decisions

1. **matchMedia over touch detection**: Using viewport width matches CSS breakpoint exactly; `ontouchstart` detection is unreliable on touchscreen laptops.

2. **Positions not applied on mobile**: CSS flow layout handles card arrangement; stored localStorage positions are retained for desktop return.

3. **No resize handler**: If user resizes from desktop to mobile, CSS overrides take effect immediately; drag listeners remain attached but are harmless since cards are position:static.
