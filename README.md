# Neil Vinci Lipaen · Personal Site (v5: commercial repositioning)

Editorial black / white / signal green. Plain HTML + CSS + vanilla JS. No framework, no build step, no dependencies.

## Files
```
index.html            Home, in narrative order:
                        hero (typography-led, small portrait) → 01 Experience + measurable contributions →
                        02 Case studies (3) → 03 How I work → 04 My story (+ "Three jobs. One degree.") →
                        05 AI & workflow → 06 Direction
experience.html       Full experience: ClickUp (commercial, renewals, qualification), Spotify via Sutherland, HR internship, credentials
contact.html          Let's talk
assets/style.css      All styling (tokens at the top)
assets/main.js        All behaviour (menu, reveals, counters, convergence lines, case-study carousel, scroll-linked timelines, account dots)
assets/img/           Logos, photos, favicon, og.png. source/ holds the original logo squares and the previous site resume
assets/fonts/         Bricolage Grotesque, Instrument Sans, JetBrains Mono (self-hosted)
assets/Neil_Vinci_Lipaen_Resume.pdf   Current external resume (Nov 2026)
```

## Source of truth
Professional facts (titles, dates, metrics, responsibilities) come from the external resume (assets/Neil_Vinci_Lipaen_Resume.pdf). The personal story and photos come from the previous site. Do not add figures that are not in the resume.

Figures that are subsets must stay presented as subsets: 60+ sits inside 100+; 56 sits inside 300+ (the 56 are owned by Neil; the 300+ is a pool); US$6,295 MRR and ≈US$75,540 are the same figure (MRR × 12) for the 56 accounts, not contracted ARR; 96% CSAT and 91% FCR are measured across the 8,000+ Spotify cases.

## Design system
- Colour: #000 / #FFF, signal green #14E28A. Green is never text on white; on white it is a highlight block behind black text.
- Type: Bricolage (uppercase headlines), Instrument Sans (body), JetBrains Mono (labels).
- Motif: lines converging on a green node. Hero lines travel from the three capabilities to the full stop of "forward."; the Direction map reprises it.
- Photos are stored in colour and shown greyscale by CSS; they turn to colour on hover.

## Motion
Reveals, line-by-line headline reveal, convergence lines, scroll-filled timelines, account-dot matrix, Spotify counters. Case studies are a native scroll-snap carousel (swipe, drag, arrows, arrow keys) that never hijacks vertical scroll, with a "Skip to How I work" link. `prefers-reduced-motion` shows everything immediately.

## Local preview
```
python3 -m http.server 8000   # then open http://localhost:8000
```

## Editing
Nav and footer repeat on all three pages: change them in all three. Case-study copy lives in index.html under CASE STUDIES.
