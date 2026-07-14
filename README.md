# Neil Vinci Lipaen — Personal Site (v2: monochrome + green)

A 3-page site (Home, Experience, Contact) — black / white / green, plain HTML/CSS/JS, no build step, no dependencies.

## Design notes
- **Palette:** black (`#0B0B0C`), white, and a single signal green (`#14E28A`) used only for accents, links, and interactive states — a nod to "healthy account" status.
- **Type:** Bricolage Grotesque (headlines), Instrument Sans (body), JetBrains Mono (labels, data, nav — reinforces the "status/systems" feel).
- **Icons:** hand-drawn custom line icons (not a generic icon library) in a consistent monoline style, with a badge that inverts to black-with-green on hover.
- **Interactive:** pulsing "status" indicator, hover states throughout, and a live tab switcher on the Experience page to flip between ClickUp and the Spotify/Sutherland role without leaving the page.

## Files
```
index.html          Home
experience.html      Work history (interactive tabs) + skills/education/certifications
contact.html         Contact details
assets/style.css     All styling
assets/Neil_Vinci_Lipaen_Resume.pdf   Downloadable resume
assets/img/           Company logos + favicon
assets/fonts/         Self-hosted font files
```

## Deploy for free

### GitHub Pages
1. Create a repo (name it `<your-username>.github.io` for a root-level URL).
2. Upload all files in this folder to the repo.
3. Settings → Pages → Source: "Deploy from a branch", branch `main`, folder `/root`. Save.
4. Live in 1–2 minutes at the URL shown on that settings page.

### Netlify
1. Sign up free at netlify.com.
2. "Add new site" → "Deploy manually" → drag this whole folder in.
3. Live instantly; rename the subdomain under Site settings if you like.

## Editing later
Everything is plain text. Open any `.html` file to change wording, or `assets/style.css` to adjust colors/spacing/sizing. Re-upload (or `git push`) and the live site updates within a minute.
