---
name: Fleet OPS
description: Fleet compliance and maintenance for truck and bus operators.
colors:
  ink: "#0b0f0d"
  ink-soft: "#151b18"
  paper: "#f3f1ea"
  paper-deep: "#e8e5db"
  white: "#ffffff"
  brand: "#087a4d"
  brand-bright: "#0fa468"
  lime: "#c9f26b"
  valid: "#0f9d6a"
  warn: "#f0a020"
  danger: "#d92d2d"
typography:
  display:
    fontFamily: "Bricolage Grotesque Variable, Inter Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 7vw, 9rem)"
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Inter Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "JetBrains Mono Variable, ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 500
    letterSpacing: "0.14em"
    lineHeight: 1.4
rounded:
  sm: "8px"
  card: "20px"
  large: "28px"
  pill: "9999px"
spacing:
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  6: "24px"
  8: "32px"
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "14px 24px"
  button-ghost:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "14px 24px"
---

# Design System: Fleet OPS

## 1. Overview

**Creative North Star: "The Yard Ledger"**

Fleet OPS should feel like operational paperwork made clear: documents, dates, dispatch decisions, and workshop records brought onto one legible working surface. The visual language combines paper-toned fields, forest-green signals, a restrained lime highlight, and direct examples drawn from truck and bus operations.

Keep the page expressive but practical. Use asymmetry and large display type to guide the story; keep controls, labels, and product examples precise. Avoid the anti-references in `PRODUCT.md`: GPS tracking or driver-surveillance presentation, generic SaaS claims, detached feature lists, opaque pricing or contact steps, and template-like marketing layouts.

**Key Characteristics:**
- Brand register, long-form landing page with a clear demo-request path.
- Tinted paper surfaces with dark ink and forest-green actions.
- Bricolage display type, Inter body copy, and JetBrains Mono operational labels.
- Motion is progressive enhancement and must respect the user's reduced-motion setting.

## 2. Colors

The palette pairs warm paper neutrals with a forest-green action color, lime emphasis, and distinct operational status colors. Use white for compact card surfaces, not as the dominant page background.

### Primary
- **Forest Green** (`#087a4d`): Primary actions, key emphasis, and the brand surface.
- **Bright Green** (`#0fa468`): Positive status and secondary green emphasis.
- **Yard Lime** (`#c9f26b`): High-contrast accent on dark surfaces and selected states.

### Secondary
- **Valid Green** (`#0f9d6a`): Valid or complete status.
- **Warning Amber** (`#f0a020`): Due-soon status.
- **Danger Red** (`#d92d2d`): Expired or blocked status; pair with explicit text or shape, never color alone.

### Neutral
- **Deep Ink** (`#0b0f0d`): Main text and dark sections.
- **Soft Ink** (`#151b18`): Secondary dark surface.
- **Paper** (`#f3f1ea`): Main page background.
- **Deep Paper** (`#e8e5db`): Section contrast and quiet surfaces.
- **White** (`#ffffff`): Small cards and product mockups.

### Named Rules
**The Dispatch Signal Rule.** Green communicates action or valid status; amber and red retain their distinct warning meanings. Never make status depend on hue alone.

## 3. Typography

**Display Font:** Bricolage Grotesque Variable (fallback to Inter Variable, then system sans-serif)
**Body Font:** Inter Variable (fallback to system sans-serif)
**Label/Mono Font:** JetBrains Mono Variable (fallback to system monospace)

**Character:** Display type is sturdy and human, while body copy stays neutral and readable. Mono is reserved for dates, plates, codes, and compact operational labels, not used as generic decoration.

### Hierarchy
- **Display** (700, fluid `clamp()` scale, line-height 0.92): Hero statements and major section headings.
- **Headline** (600-700, roughly 2.4rem-5rem): Section titles and prominent claims.
- **Title** (600-700, roughly 1.375rem-2.4rem): Feature, role, and pricing item titles.
- **Body** (400-600, 15-18px, relaxed line-height): Explanations; keep paragraphs compact and easy to scan.
- **Label** (500, 11px, 0.14em tracking, uppercase where used): Short metadata and section eyebrows.

### Named Rules
**The Paperwork Readability Rule.** Use mono for information that behaves like a record; use body type for sentences. Do not set paragraph copy in tracked uppercase.

## 4. Elevation

Depth comes primarily from tonal layering and borders, with shadows reserved for floating paper, focused product mockups, and hover response. Translucent blur is limited to the fixed navigation and hero compliance board; it is not a default surface treatment.

### Shadow Vocabulary
- **Card hover:** `0 30px 60px -34px rgba(11, 15, 13, 0.45)` for a small lift on interactive spotlight cards.
- **Paper float:** Use the existing restrained paper shadows in the matrix scene to distinguish documents from the desk.
- **Raised hero board:** Use the existing soft broad shadow only for the compliance board over the hero surface.

### Named Rules
**The Flat-by-Default Rule.** Section surfaces stay flat or use subtle tonal contrast; reserve elevation for an object or a change of state.

## 5. Components

### Buttons
- **Shape:** Full pill (`9999px`).
- **Primary:** Forest green with white text, 14px vertical and 24px horizontal padding; keep the touch target at least 44px high.
- **Hover / Focus:** Use the existing fill-sweep interaction and a visible 2px focus outline with 3px offset; on dark sections, use lime for the outline.
- **Ghost:** Paper or transparent surface, ink text, and a visible border where needed.

### Chips
- **Style:** Compact pill with a tinted background and readable text.
- **State:** Valid, warning, expired, and held states must include text or a clear icon in addition to color.

### Cards / Containers
- **Corner Style:** Common card radii are 20px and 28px; use smaller radii for paper mockups.
- **Background:** Paper, deep paper, white, or ink according to section context.
- **Shadow Strategy:** Follow the flat-by-default rule in Elevation.
- **Border:** Use a quiet ink or white border to define the edge when the background alone is insufficient.
- **Internal Padding:** Common spacing is 16px, 24px, and 32px; allow dense operational data to use less.

### Navigation
- **Style:** Fixed pill-shaped primary navigation with concise labels and a clear demo action.
- **Mobile:** Use the 44px menu control and vertically spaced menu links; close the menu on Escape and after selecting a destination.
- **Focus:** Keep the global visible focus ring and a working skip link.

### Billing Switch
- Use a semantic switch with `aria-checked`, an accessible label, and a hit area at least 44px high.

### Product Scenes
- Use actual fleet papers, vehicle records, and workshop examples. Preserve a legible static fallback when WebGL is unavailable; load the 3D scene only when eligible and needed.

## 6. Do's and Don'ts

### Do:
- **Do** show paper, dispatch, and workshop realities that fleet operators recognize.
- **Do** use `#f3f1ea` as the main page surface, `#0b0f0d` for ink, and `#087a4d` for primary actions.
- **Do** use `#c9f26b` primarily for emphasis on dark surfaces.
- **Do** maintain at least 4.5:1 contrast for normal text and at least 44px touch targets for primary controls.
- **Do** preserve keyboard access, reduced-motion behavior, and static fallbacks.
- **Do** keep the product boundary clear: compliance and maintenance, not tracking.

### Don't:
- **Don't** present Fleet OPS as a GPS tracker, live-map product, or driver-surveillance system.
- **Don't** use generic SaaS claims, fabricated outcomes, or feature lists detached from fleet work.
- **Don't** obscure product limits, pricing conditions, or the next step to contact the team.
- **Don't** use template-like marketing layouts that could belong to any software company.
- **Don't** use red, amber, or green as the only indicator of a status.
- **Don't** apply translucent blur as a default surface or use low-contrast small labels.