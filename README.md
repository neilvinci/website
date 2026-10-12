# Neil Vinci Lipaen · Personal Site (v4: "The Intersection")

Editorial black / white / signal green. Plain HTML + CSS + vanilla JS. No framework, no build step, no dependencies.

## Files
```
index.html            Home: hero (portrait), My story, Three jobs. One degree., the work + KPIs, 4 case studies (swipe/arrow carousel), how I work, AI, what's next
experience.html       Chapters: Spotify (via Sutherland), ClickUp (account mgmt, proactive engagement, commercial judgment), Sutherland HR, credentials
contact.html          Let's talk
assets/style.css      All styling (tokens at the top)
assets/main.js        All behaviour: menu, reveals, counters, convergence lines, horizontal case-study scroll, scroll-linked timelines, parallax
assets/img/           spotify_mark.png + clickup_mark.png (cut-outs of the original squares, which are kept), favicon, og.png,
                      neil-portrait.jpg, clickup-offer-day.jpg, spotify-team-wave-101.jpg, sutherland-hr-pride-fgd.jpg
assets/fonts/         Bricolage Grotesque, Instrument Sans, JetBrains Mono (self-hosted)
assets/Neil_Vinci_Lipaen_Resume.pdf
```

## Design system
- **Colour:** #000 / #FFF, signal green #14E28A, supporting #0B9E62. Green is never used as text on white (fails contrast); on white it becomes a highlight block behind black text.
- **Type:** Bricolage (uppercase headlines, tight tracking), Instrument Sans (body), JetBrains Mono (dates, labels, metadata).
- **Motif:** lines converging on a green node, "the intersection". Hero lines land on the period of MEET., and the closing What's next scene reprises it.
- **Sutherland:** official mark (assets/img/sutherland_mark.svg, traced from sutherland_logo.png), shown on a white tile so the navy stays legible.
- **Photos:** stored in colour, shown in greyscale by CSS; they turn to colour on hover.

## Motion
IntersectionObserver reveals, line-by-line text reveal, scroll-filled HR timeline, stakeholder thread and qualification flow, case-study diagrams that draw in, subtle logo parallax, number counting on the Spotify stats only.
Case studies are a native scroll-snap carousel: swipe (touch/trackpad), mouse drag, arrow buttons (top and bottom), or left/right keys. It never hijacks vertical scroll, and a 'Skip to How I work' link sits beside the controls.
`prefers-reduced-motion` disables the motion: content is shown immediately.

## Local preview
Fonts won't load from `file://` in some browsers. Serve the folder instead:
```
python3 -m http.server 8000   # then open http://localhost:8000
```

## Editing
Each page is plain HTML. Nav and footer are repeated on all three pages, so change them in all three. Case-study copy lives in `index.html` under `CASE STUDIES`.
