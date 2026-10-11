# VITALIS — The Science of Better Living

A longevity education studio presented as a **scientific dashboard you can read like a magazine**. The signature is the **body atlas**: a stylised human figure built from six layered systems (heart and circulation, lungs, brain and nerves, muscles, the sleep clock and metabolism). Choose a system and it lights up on the figure with annotated callouts, while a linked panel shows plain-English science, everyday levers and a sample-data chart.

Production URL: `https://vitalis-hazel-tau.vercel.app`

> Fictional concept brand, built as a portfolio project. VITALIS gives general education, not medical advice. Every number marked "Sample" is illustrative and does not belong to a real person.

---

## Concept

Longevity content online swings between hype and fear. VITALIS takes the tone of a calm lab: show the system, say what research *generally* finds, name the few habits that keep recurring, and teach people to read their own data without overreacting. The site has four interactive "instruments":

1. **Body atlas** (hero): six system layers, linked education panels and sample charts.
2. **Habits × systems matrix:** six everyday habits against six systems. Selecting a habit lights up the systems it is most often linked with.
3. **A day in data:** a sticky 24-hour chart (heart rate, glucose, hourly steps, sleep) whose cursor follows a short scrolling story.
4. **Signal vs noise:** 90 days of a noisy metric, with switchable 7-day average and typical-range band, to show why one reading is a rumour and a trend is a story.

## Brand & positioning

- **Name:** from *vita*, life. The mark is a pulse line crossing a dotted dial, with an amber point at twelve o'clock: a heartbeat measured against the day's clock.
- **Promise:** *The science of better living*, meaning evidence with its limits shown. No supplements, protocols or biohacks.
- **Tone:** precise, warm and unexcitable. The copy uses "associated with", "research generally shows" and "for many people", and points to public guidance (such as WHO activity guidelines) rather than making its own claims.
- **Conversion:** "Request a place" on a fictional six-evening online cohort. It is a demo form and nothing is sent.

## Audience

Curious adults aged 30–65, often with a wearable, who want to understand what the numbers mean and which habits matter most, without being sold anything.

## Art direction

- **Palette:** carbon `#0A1014`, cyan `#4FD1C5` (structure and selection), white `#F2F5F7` and amber `#F2B84B` (data accents, flows and every "Sample" tag). Panels sit on `#0E171C`/`#132028`.
- **Dashboard/editorial hybrid:** a faint 32px measurement grid, scan-frame corner brackets with mono readouts (*View · anterior*, *Layer · lungs & fitness*, the visitor's local time), hairline-ruled panels and large grotesk headlines with cyan second lines.
- **Anatomy:** an original stylised SVG figure with a soft cyan-tinted silhouette and hatched organs. Arteries carry amber "flow" dashes, nerves pulse in white, the lungs breathe and the heart beats when selected, and the circadian ring shows a day arc, a night arc and a live amber marker at your local time.
- **Charts:** hand-built SVG line, scatter, bar, hypnogram, glucose and radar charts in a consistent style, each captioned and tagged "Sample data".
- **Logo:** an original mark (see `logo.svg`) with a spaced VITALIS wordmark. `favicon.svg` is the mark on a carbon tile.

## Typography

- **Schibsted Grotesk** (400–700) for headlines, body copy and UI. Headlines are tightly tracked (−0.028em) with balanced wrapping.
- **Spline Sans Mono** (300–500) for data: KPI labels, axis labels, system codes, timestamps and tags.
- Both load from Google Fonts with `display=swap`. Headings use `overflow-wrap: normal`.

## Motion language

Precise rather than playful. One easing, `cubic-bezier(.2,.7,0,1)`, is used for state changes and an in-out curve for morphs.

- **System focus:** the other layers fall to 10% opacity, the selected layer turns cyan with an SVG glow, and its callout leaders draw out to the labels.
- **Panel transitions:** text cross-fades with a 5px lift, KPI values count to their new numbers, and charts redraw: lines draw on, bars grow from the baseline and dots pop in sequence.
- **Scan reveal:** section headings are uncovered by a glowing cyan scan line moving top to bottom.
- **Morphing data:** in *Signal vs noise*, switching metrics tweens all 90 points, the average line and the range band to their new positions. In *A day in data*, the cursor glides between moments while its readouts update live.
- **Ambient:** a slow scan line over the atlas, a pulsing status dot and an ECG trace in the footer. All of it stops under reduced motion.

## Signature interaction: how to use it

1. **Choose a system** from the list on the left (00 All systems, 01 Heart … 06 Metabolism), or click or tap it directly on the figure. Arrow keys move between systems.
2. **Read the panel:** system code and title, three sample KPIs, a sample chart, "what research generally shows" and three everyday levers.
3. **Explore the figure:** callouts name key structures (for example "Heart · ~100,000 beats a day"), and the circadian ring shows your current local time. Clicking the selected system again returns to the overview.

On first load the atlas gives a short one-time tour through the six systems. It stops at the first interaction, never runs under reduced motion, and returns to the overview when finished.

## Tech

- Static HTML, CSS and ES modules with no build step and no libraries.
- `data.js` holds content, KPI definitions, lever/system values, metric definitions and a seeded PRNG, so sample data is stable between visits.
- `charts.js` contains the SVG chart renderers and the redraw choreography (`pre` / `out` classes).
- `sections.js` covers the matrix, the day chart (generated curves and a tweened cursor), the signal chart (90-point tweening) and the form.
- `main.js` covers the header, the atlas and panel, the count-ups, the circadian marker, the tour and the reveals.
- The atlas SVG and matrix markup are static (generated at authoring time), so the content works without JavaScript. The total hand-written JS is about 40 KB.

## Local development

```bash
npx serve .
```

Then open the printed localhost URL. ES modules need a server.

## Accessibility

- One `h1`, a skip link, landmarks and `aria-current` in the navigation.
- System buttons use `aria-pressed` with arrow-key navigation. The atlas has a title and description, and clicking the figure is only a shortcut for the buttons.
- Charts are `role="img"` with captions and descriptions. The matrix is a real `<table>` with header scopes, a caption and visually hidden text for every mark.
- Signal controls are buttons (`aria-pressed`) and `role="switch"` toggles, and the explanatory note is a live region.
- The form has visible labels, inline errors (`aria-describedby`, `aria-invalid`), focus moved to the first problem and a focused confirmation that says nothing was sent or reserved.
- `prefers-reduced-motion`: no tour, no ambient or organ animation, instant chart and panel updates, and static flows.

## Health-content safeguards

- Persistent labels: "Sample data" on every chart and KPI, "Education · not medical advice" in the header, and disclaimers in the hero, the matrix note, the form and the footer.
- Statements are general and hedged ("associated with", "research generally shows") or attributed to public guidance (WHO activity guidance and expert sleep-duration consensus).
- No diagnoses, thresholds for disease, treatments, supplements or outcome promises.

## Known limitations

- The anatomy is deliberately stylised and not to scale.
- Sample data is generated from simple formulas for teaching purposes; it is not physiological modelling.
- `og.png` is rendered separately by the lead.

---

Designed & built by Saad Bashir — https://www.linkedin.com/in/saadbashirmarketing/
