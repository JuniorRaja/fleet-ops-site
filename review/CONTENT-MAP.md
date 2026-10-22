# Fleet Ops — content map (merged site, 14 sections)

What each section **covers** (the material) vs what it **conveys** (the argument it makes to a fleet owner).

| # | Section | Covers | Conveys | Stage |
|---|---------|--------|---------|-------|
| 01 | Hero | Six papers named; warns before lapse; blocks unfit dispatch. Board shows 3 of 6 vehicles clear | "This is what you're not seeing right now" | Hook + problem |
| 02 | Logo marquee | OEM names (Tata, Ashok Leyland, Eicher…) | "Built for your vehicles" | Credibility |
| 03 | Stat bar | 6 papers / 45 days warning / 1 save / 0 silent dispatches | The whole product in four numbers | Proof |
| 04 | Manifesto | A lapsed fitness cert costs a day's trip, a fine, a customer. 3 problem cards | "The paperwork is the risk" | Problem |
| 05 | Features bento | Matrix, lead times, document hold, workshop, driver licences, roles, audit trail | "Everything the paperwork needs" | Capability |
| 06 | Papers → matrix | Six certificates become one six-column grid | "Your desk becomes one screen" | Capability (shown) |
| 07 | Trips scene | One trip slip fills one sheet; one save writes 6 records | "Enter it once, everything follows" | Capability (shown) |
| 08 | Roles | Owner / in-charge / accountant see different things; every change logged | "You delegate without losing control" | Trust |
| 09 | More bento | Fuel log, maintenance, tyres, reports, phone, Excel import | "The rest of the office too" | Capability (breadth) |
| 10 | Testimonials | 3 operator quotes with fleet size and city | "People like you already switched" | Credibility |
| 11 | Pricing | Three tiers, monthly/yearly | "Here's the cost" | Decision |
| 12 | FAQ / does not do | 6 "no" pills + 5 answers | "We're not overselling" | Objection handling |
| 13 | Final CTA | Book a 20-min demo, WhatsApp or email | "Do it now" | Action |
| 14 | Footer | Nav, contact, motion toggle | Housekeeping | — |

---

## Repeats

Counted by how many times a fleet owner is told the same thing.

| Claim | Said in | Times |
|-------|---------|-------|
| **Unfit vehicle gets stopped / written reason** | 01, 03 ("0"), 05, 08, 12 | **5×** |
| **Six papers per vehicle** | 01, 03 ("6"), 05, 06 | **4×** |
| **The compliance matrix itself** (as artwork or UI) | 01 board, 05 card, 06 scene, 09 phone tile | **4×** |
| **Lead-time warnings / 45 days** | 01, 03 ("45"), 05 | **3×** |
| Audit trail — a name on every exception | 05, 08 | 2× |
| Maintenance / workshop | 05, 09 | 2× |
| Fuel & diesel log | 07, 09 | 2× |
| One save → many records | 03 ("1"), 07 | 2× |
| "Not a tracker" | 01, 12 | 2× (deliberate) |

**Structural repeat:** 05 and 09 are both bento grids of features, back to back-ish. Two bentos read as padding.

**Worth knowing:** B-07 and B-08 are the *same file* (`Features.tsx`). Picking B-07 brings driver licences, roles & overrides and audit trail along for free — which is why section 05 now overlaps 08 and 09 more than the shortlist suggested.

---

## Gaps

Things no section covers, that the source sites did cover.

| Missing | Was in | Why it matters |
|---------|--------|----------------|
| **Outcome / "what changes on Monday"** | B-17, C-08 (both dropped) | The site lists features but never states the business result — fewer fines, fewer shed days, cleaner audits. No section answers *"what do I get?"* |
| **How you actually use it** | B-04/05/06 HowItWorks (dropped) | No capture → warn → hold walkthrough. A visitor never learns the three-step flow. |
| **Anything interactive** | B-12/13/14 (all dropped) | Every one of the 14 sections is read-only. Nothing to touch. |
| **"Can this vehicle go today?"** | B-13, C-06 (dropped) | The product's sharpest single question now only exists as one card inside 05. |
| **Setup time / migration** | partly A-13 (Excel import), B FAQ | "How long until we're running?" is unanswered. |

---

## Shape of the page

```
Hook ──► Problem ──► Capability ×4 ──► Trust ──► Proof ──► Price ──► Objections ──► Act
 01       04          05 06 07 09       08        10        11        12            13
```

Four capability sections in a row (05–07, 09) with nothing between them but the trips scene's change of pace. The run is long and the payoff — what the operator actually gains — never arrives, because the benefits section was dropped.

**Two cheap fixes:** add back **B-17 Benefits** between 09 and 10 to close the outcome gap, and **B-12 matrix demo** after 06 to give the page one interactive moment. Both are already in the base project.

**One inconsistency:** section 13's CTA promises a "free 14-day trial, no card" — section 11's pricing never mentions a trial.
