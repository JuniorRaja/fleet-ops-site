# Fleet Ops — merge plan

**Base:** copy of `premium-fleetops-1-green-white/` → `fleet-ops-merged/`
**Design system:** B's (white/paper + forest green + lime, Bricolage / Inter / JetBrains Mono)
**Your picks:** 19 sections — 8 from A, 9 from B, 2 from C

---

## 1. Page order

| # | Section | From | Work |
|---|---------|------|------|
| — | Navbar, cursor, skip-link, mobile CTA | B (chrome) | keep as-is |
| 01 | **Hero** — stacked docs, names visible, hover + parallax | B-01 *rebuilt* | **L** |
| 02 | **Logo marquee** | C-02 | S |
| 03 | **Stat bar** (6 / 45 / 1 / 0) | B-02 | S |
| 04 | **Manifesto** — word-by-word green highlight | B-03 | none |
| 05 | **Features bento** | B-07 | none |
| 06 | **Papers → matrix** (scatter → forming → *done*) | B-09, B-10, **+B-11** | none |
| 07 | **Trips scene** — 5 beats + slip pile-up | A-08…11 + **A-01** | **L** |
| 08 | **Roles** | A-12 | M |
| 09 | **More bento** — rest of the office | A-13 | M |
| 10 | **Testimonials** | B-18 | none |
| 11 | **Pricing** | B-19 | none |
| 12 | **FAQ — what it does not do** | A-14 | M |
| 13 | **Final CTA** | C-12 | S |
| 14 | **Footer** | B-22 | none |

---

## 2. Three calls I made on your list

**B-09 and B-10 without B-11.** You picked the scatter and the forming frames of the papers→matrix scene but not the finished grid. A scroll scene without its end state just stops mid-air. **B-11 is included** as part of the same component — it's one file (`PapersToMatrix.tsx`), not three.

**Two logo bands.** B-02 is marquee *plus* the four-up stat bar; C-02 is just the marquee. Read as: you want C's tinted-strip marquee treatment and B's stat bar. Plan splits them into two bands (02 and 03). Say the word if you meant B-02 whole and C-02 was a duplicate.

**Two footers.** B-22 is a footer; C-12 is a CTA card *plus* a footer. Plan takes **C-12's dark rounded CTA** as section 13 and **B-22's footer** as section 14, dropping C's footer.

---

## 3. The hero rebuild (your note)

> *"The current hero 6 docs can be let stacked with visible names reacting to cursor hovers and parallax"*

Today in `src/three/heroScene.ts`: six certificate meshes, canvas-drawn textures that **already carry the names** ("Fitness Certificate", "Insurance Policy", …), positioned by a `SLOTS` array as a **scattered** desk layout. Pointer input exists but only rotates the whole world; scroll already lifts each paper (`sp` term). There is **no per-document hover**.

Changes:

1. **`SLOTS` → a stack.** Replace the six scattered x/z positions with a stepped pile — each sheet offset ~8–12% down and slightly rotated so the coloured header band (which holds the name) of every sheet below stays visible. One readable column instead of six floating papers.
2. **Per-doc hover.** Add a `Raycaster` against the six meshes on `pointermove`. Hovered sheet slides out of the stack and lifts; neighbours part slightly. Needs a hovered-index in the update loop and a lerped target per item — the existing `items[]` loop is the right place.
3. **Keep the parallax.** The current `world.rotation` pointer-follow and the scroll-lift stay; they read well against a stack.
4. **Fallback.** `PaperPoster.tsx` (the no-WebGL / mobile poster) must be redrawn to match the stacked arrangement, or the two states look unrelated.

Hero copy, CTAs, checklist and the `HeroBoard` compliance card are unchanged.

---

## 4. The trips scene (biggest port)

`A/OneTrip.tsx` (332 lines) + the paper-storm canvas lifted out of `A/Yard.tsx` (lines 69–125).

**How A's motion works** — worth knowing before porting: A has **no GSAP**. It runs one shared rAF loop (`lib/scroll.ts` → `onFrame`), and each scene reads its own `pinProgress(el)` (`lib/math.ts`) and writes styles directly. Nothing goes through React state. B uses GSAP ScrollTrigger + Lenis.

**Recommendation: port A's loop, don't rewrite the scene in GSAP.** `lib/scroll.ts` (55 lines) + `lib/math.ts` (29 lines) are small, framework-agnostic and already Lenis-driven. Rewriting five beats of hand-tuned timing into ScrollTrigger is where this merge would burn a day and lose fidelity. The two systems coexist: GSAP owns B's scenes, `onFrame` owns the ported ones, Lenis drives both.

Steps:
- Copy `lib/scroll.ts`, `lib/math.ts`, `hooks/useReveals.ts` into the merged project.
- Point A's `startScroll` at B's existing Lenis instance (`smooth.lenis` in `lib/gsap.ts`) instead of making a second one — **two Lenis instances will fight.**
- Swap `useReducedMotion()` → B's `useMotion().pin`.
- **Paper storm → pile-up.** A-01's canvas draws 40 sheets and blows them *off* screen (`clear` ramp, `y - clear*h`). Reverse it for beat 2: sheets fall *in* and settle onto the pile, so the "slips this month" counter has something to count. Same ~60 lines of canvas, inverted ramp, slips restyled as trip slips rather than generic paper.
- Re-skin: `bg-ink`→`bg-ink`, `bg-ink-2`→`bg-ink-soft`, `text-cream`→`text-paper`, **`yolk`→`lime`** (it's a dark section, so lime works).

---

## 5. Token map for A's sections

| A token | → merged | note |
|---------|----------|------|
| `cream` `#f3efe6` | `paper` `#f3f1ea` | near-identical |
| `paper` `#fbf9f4` | `white` | card surfaces |
| `ink` `#151515` | `ink` `#0b0f0d` | |
| `ink-2` | `ink-soft` | |
| `muted` / `faint` | `ink/65` / `ink/45` | |
| `ok` / `due` / `bad` | `valid` / `warn` / `danger` | |
| `yolk` `#ffc72c` | **`lime` on dark, `brand` on light** | ⚠ see below |
| `font-display` + `.wide` | `.display` (Bricolage 700) | `.wide` is `font-stretch:125%` — **does nothing to Bricolage**, drop it |
| `text-hero` / `text-display` | B's clamp scale | |

⚠ **`yolk` → `lime` is not a straight swap.** Yolk `#ffc72c` on cream is legible; lime `#c9f26b` on white/paper is not (fails contrast). On A's **light** sections — Roles (12), More bento (13), FAQ (14) — map yolk to **`brand` `#087a4d`**, keeping lime for dark surfaces only (trips scene, CTA, footer).

---

## 6. Fonts

A's CSS names **Archivo** and **Caveat**, but A's `package.json` has no font packages and `index.css` has **no `@font-face` rules** — neither font is actually loaded. Archivo silently falls back to Arial Black; Caveat falls back to Segoe Print, which only exists on Windows. The handwritten trip slip you liked in A-09/A-10 is rendering as a Windows system font and will not look like that on a Mac or phone.

So: **add `@fontsource-variable/caveat`** (one dependency) and wire a real `@font-face`, matching how B loads its three faces. Archivo isn't needed — Bricolage replaces it.

---

## 7. Content overlap to resolve

**B-07 (features bento) and A-13 (more bento) are both feature grids** and say overlapping things — compliance matrix, reminders, workshop, reports. Two bentos back to back will read as padding. Recommendation: B-07 stays the primary "what's inside"; A-13 is re-scoped to genuinely secondary items (fuel log, tyres, Excel import, works-on-phone) with anything duplicated in B-07 cut. Content decision, not a code one — flagging it rather than deciding for you.

Also: A's copy lives in one `content.ts`; B's is inline in components plus `lib/fleet.ts`. Ported sections should read from B's existing data files so the fleet example data stays consistent across the matrix, the demos and the trips scene.

---

## 8. Two things about B you should know

**Photos are hotlinked from Pexels.** `lib/config.ts` points `PHOTOS` at `images.pexels.com` URLs. Fine for a prototype, not for launch — download and self-host, or swap for licensed shots.

**The `{{PLACEHOLDER}}` tokens are deliberate.** `{{WHATSAPP_NUMBER}}`, `{{DEMO_EMAIL}}`, `{{REPLY_TIME}}`, `{{APP_URL}}`, `{{COMPANY_NAME}}` are documented in `lib/config.ts` as find-and-replace-at-launch. I flagged them as a bug last pass — they aren't, they're by design. They still need filling before the site goes live.

---

## 9. Not carried over

Dropped with the picks, listed so nothing is lost by accident: B's HowItWorks (3-step pin), all three interactive demos (B-12/13/14 matrix, dispatch, one-save), B's OneSaveScene, B's Benefits and FAQ, A's Compliance scene, A's demo form and footer, C's hero, features, compliance matrix, dispatch guard, one-save, benefits, testimonials, pricing and FAQ.

**Worth a second look:** dropping all three interactive demos means the merged site has no section a visitor can actually *touch* — every remaining section is read-only. B's demos were the strongest proof-of-product on any of the three sites. Adding B-12 (matrix demo) back after section 06 would cost nothing to port, since it's already in the base project.

---

## 10. Build order

1. Scaffold `fleet-ops-merged/` from B; strip unpicked components from `App.tsx`.
2. Port `lib/scroll.ts`, `lib/math.ts`, `useReveals.ts`; bind to B's Lenis.
3. Add Caveat; extend the token layer with the A→B map.
4. Port and re-skin the three light A sections (Roles, More, FAQ) — quickest wins, validates the token map.
5. Port the trips scene + paper-storm pile-up.
6. Rebuild the hero stack + raycast hover; redraw `PaperPoster`.
7. Split the marquee / stat bar; drop in C's CTA.
8. Pass: contrast check on every yolk→lime/brand swap, reduced-motion, keyboard, mobile.
