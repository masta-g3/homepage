# Visual Identity

Linear Content follows a **terminal-minimalist aesthetic with industrial plotting paper undertones**.

## Philosophy

- **Less is more** - every visual element must earn its place
- **Technical honesty** - the design should feel like it was made by engineers, for engineers
- **Subtle warmth** - avoid sterile coldness without becoming decorative
- **Zero ornamentation** - no gradients, shadows, rounded corners, or color accents

## Companion Files

This document defines the design system. For implementation details, reference:

| File | Purpose |
|------|---------|
| `styles.css` | Complete CSS with all variables, components, dark mode |
| `fonts/` | Berkeley Mono woff2 files (Regular + Bold weights) |

Load fonts via `@font-face` with `font-display: swap`.

## Color Palette

```
Paper (background)    #FAFAF9   warm off-white, suggests aged paper
Black (primary)       #000000   text, borders, emphasis
Dark Gray             #1A1A1A   secondary emphasis
Mid Gray              #666666   descriptions, secondary text
Light Gray            #E5E5E5   subtle backgrounds
Border Gray           #CCCCCC   dividers, rules
Grid Color            #E8E8E6   dot pattern (barely visible)
```

The palette is strictly monochrome. Color accents are forbidden.

### Dark Mode Palette

Dark mode translates the "industrial plotting paper" metaphor to a darker surface—think aged dark paper or chalkboard with grid lines. Activated automatically via system preference (`prefers-color-scheme: dark`).

```
Dark Paper (bg)       #1E1D1B   lighter warm dark, like aged dark paper
Cream Text            #E6E4DF   warm cream, like chalk
Light Gray            #D0CEC8   secondary emphasis
Mid Gray              #9C9A94   secondary text (olive undertone)
Subtle Dark           #2A2926   backgrounds
Dark Border           #3D3B37   warmer brown-gray dividers
Dark Grid             #2F2D2A   visible grid (essential to aesthetic)
Code BG               #252422   warm code blocks
Inline Code BG        #2D2B28   inline code snippets
```

The grid visibility is critical—it defines the plotting paper aesthetic.

### Semantic Color Usage

Map colors to purpose, not specific values. This enables theming:

```
--paper          background surface
--black          primary text, borders, emphasis
--mid-gray       secondary text, descriptions, muted content
--border-color   dividers, rules, separators
--grid-color     dot grid pattern
--code-bg        code block backgrounds
--inline-code-bg inline code backgrounds
--selection-bg   text selection background (inverts in dark mode)
--selection-text text selection foreground
```

## Typography

**Berkeley Mono** throughout—headings, body, code. No font mixing.

```
Font Stack:    'Berkeley Mono', ui-monospace, 'SF Mono', 'Cascadia Mono', 'Consolas', monospace

Body:          1rem (16px) / 1.7 line-height
Headings:      700 weight, lowercase preferred
Code blocks:   0.8rem / 1.6 line-height
Inline code:   0.85em (relative to parent)
Small text:    0.85rem (metadata, captions, labels)
```

### Heading Scale

Flat, compact hierarchy. Avoid dramatic size jumps.

```
h1    1.5rem    page titles
h2    1.25rem   major sections (has bottom border)
h3    1.1rem    subsections
h4    1rem      minor sections
h5    0.95rem   rarely used
h6    0.9rem    rarely used
```

## Spacing System

Base unit: `0.25rem` (4px). Use multiples for consistency.

```
0.25rem    4px     micro (padding inside tags)
0.5rem     8px     tight (between related elements)
1rem       16px    standard (paragraph margins, padding)
1.5rem     24px    comfortable (section gaps, block margins)
2rem       32px    loose (major section separations)
3rem       48px    spacious (page-level padding)
```

Content max-width: `48rem` (768px). Keeps lines readable.

## Visual Elements

### Dot Grid Background

Faint radial dots at 20px intervals. Should be felt, not seen.

```css
background-image: radial-gradient(circle, var(--grid-color) 1px, transparent 1px);
background-size: 20px 20px;
```

In dark mode, dots become more visible (#2F2D2A)—this is intentional.

### Left Margin Tick Marks

Subtle dashed vertical line on content area, evoking plotting axes.

```css
background-image: repeating-linear-gradient(
  to bottom,
  var(--border-color) 0px,
  var(--border-color) 4px,
  transparent 4px,
  transparent 20px
);
opacity: 0.5;
```

### Borders

Border weight hierarchy communicates importance:

```
2px solid    primary boundaries (navbar, table headers)
3px solid    code block left accent
1px solid    secondary boundaries (h2 underline, dividers, table cells)
1px solid    subtle (cards, inputs)
```

Always use `--border-color` for 1px borders, `--black` for heavier borders.

### Links

Underlined, same color as text. Interaction via underline weight only.

```css
a {
  color: var(--black);
  text-decoration: underline;
  text-underline-offset: 2px;
}

a:hover {
  text-decoration-thickness: 2px;
}
```

No color change on hover. No visited state styling.

### Selection

Inverted colors for text selection:

```css
::selection {
  background-color: var(--black);
  color: var(--paper);
}
```

In dark mode, this naturally inverts (cream on dark → dark on cream).

### Scrollbars

Minimal, matches theme:

```css
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: var(--paper); }
::-webkit-scrollbar-thumb { background: var(--border-color); }
::-webkit-scrollbar-thumb:hover { background: var(--mid-gray); }
```

## Component Patterns

The blog is content-focused. For companion apps requiring interactive components, follow these patterns:

### Buttons

Primary action—black fill, paper text:

```css
.button {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  background-color: var(--black);
  color: var(--paper);
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.button:hover {
  text-decoration: underline;
}

.button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
```

Secondary action—outlined:

```css
.button-secondary {
  background-color: transparent;
  color: var(--black);
  border: 1px solid var(--black);
}

.button-secondary:hover {
  background-color: var(--black);
  color: var(--paper);
}
```

No rounded corners. No shadows. No gradients.

### Form Inputs

```css
input, textarea, select {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  background-color: var(--paper);
  color: var(--black);
  border: 1px solid var(--border-color);
  padding: 0.5rem;
  width: 100%;
}

input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: var(--black);
}

input::placeholder {
  color: var(--mid-gray);
}
```

### Cards / Panels

Content containers—minimal styling:

```css
.card {
  background-color: var(--paper);
  border: 1px solid var(--border-color);
  padding: 1rem;
}

.card-elevated {
  border-left: 3px solid var(--black);  /* emphasis via left border */
}
```

No shadows. Use border-left for hierarchy, not elevation.

### Tags / Badges

Inline metadata markers:

```css
.tag {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--mid-gray);
  padding: 0;
}

.tag::before { content: "["; }
.tag::after { content: "]"; }
```

### Modals / Dialogs

```css
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}

.modal {
  background-color: var(--paper);
  border: 2px solid var(--black);
  padding: 1.5rem;
  max-width: 32rem;
}
```

### Loading States

Use text-based indicators, not spinners:

```
Loading...
Processing...
[=====>    ] 60%
```

If animation is needed, use blinking cursor or simple opacity pulse.

### Error / Success States

Communicate via text and border, not color:

```css
.message-error {
  border-left: 3px solid var(--black);
  padding-left: 1rem;
  font-weight: 700;
}

.message-success {
  border-left: 3px solid var(--mid-gray);
  padding-left: 1rem;
}
```

Prefix messages with `error:` or `ok:` for clarity.

### Empty States

```css
.empty-state {
  color: var(--mid-gray);
  text-align: center;
  padding: 3rem 1rem;
  font-style: italic;
}
```

## Code Syntax Highlighting

Monochrome syntax highlighting. No rainbow colors.

### Light Mode

Use Quarto's `kate` theme or equivalent muted scheme.

### Dark Mode

Custom monochrome warm palette:

```
Keywords, operators    #FFFFFF   brightest, bold
Functions, builtins    #E6E4DF   cream
Variables              #E6E4DF   cream
Strings, chars         #C8C4B8   muted warm
Numbers, constants     #D0CEC8   light gray
Data types             #BAB8B0   medium gray
Comments               #7A7870   dimmest, italic
```

See `styles.css` for full `.sourceCode` class mappings.

## Responsive Behavior

Single breakpoint at `768px` (mobile/desktop).

```css
@media (max-width: 768px) {
  /* Reduce heading sizes */
  h1, .title { font-size: 1.25rem; }
  h2 { font-size: 1.1rem; }

  /* Stack horizontal layouts */
  /* Increase touch targets to 44px minimum */
}
```

Principles:
- Content remains readable at any width (monospace helps)
- Touch targets: minimum 44px height on mobile
- No horizontal scrolling except code blocks
- Grid pattern scales naturally

## Motion & Animation

Interactions should be **instantaneous or near-instantaneous**. Avoid decorative animation.

```
Allowed:
- Underline thickness change (instant, no transition)
- Opacity transitions (100-150ms max, ease-out)
- Focus ring appearance (instant)

Forbidden:
- Slide/bounce/spring animations
- Staggered list animations
- Loading spinners (use text instead)
- Parallax effects
- Hover scale transforms
```

If you must animate, use `150ms ease-out` maximum. Prefer `opacity` and `transform` for performance.

## Accessibility

- Contrast ratio: minimum 4.5:1 (AA). Current palette exceeds this.
- Focus states: use `outline: 2px solid var(--black); outline-offset: 2px;`
- Touch targets: minimum 44x44px on mobile
- Motion: respect `prefers-reduced-motion` by disabling all transitions
- Screen readers: semantic HTML, proper heading hierarchy

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    transition: none !important;
    animation: none !important;
  }
}
```

## Do's

- Use flat, sharp edges
- Maintain high contrast (black on paper)
- Let whitespace breathe
- Keep interactions subtle (underline thickness, not color)
- Use lowercase for titles/brand
- Communicate state via text, not color
- Use border-left for emphasis/hierarchy

## Don'ts

- Add color accents
- Use rounded corners (border-radius: 0 always)
- Add shadows or gradients
- Use multiple typefaces
- Add decorative elements
- Over-engineer hover states
- Use loading spinners
- Add bounce/spring animations
- Create "cards" with shadows/elevation

## Influences

- Engineering graph paper / lab notebooks
- Terminal interfaces
- Brutalist web design
- Rhodia dot pads
- Monospace typography systems
- Unix/Plan 9 aesthetics
