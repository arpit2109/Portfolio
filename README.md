# Portfolio — work in progress

Interactive hero prototype for my personal portfolio: a paper + code design system, an
interactive 3D avatar (three.js + three-vrm) that follows the cursor and reacts, and a
"corrosion" theme switch where the old page is eaten away to reveal the new one.

## Run locally
Any static server works:

    python -m http.server 8000

then open http://localhost:8000/. Press T to switch theme; add ?debug to the URL for the
status HUD.

## Stack
three.js · three-vrm · vanilla JS/CSS (Vite + React migration planned)

© Arpit Patel

## Story
`media/one-sheet-story.mp4` — a 41 s motion storyboard of the full page concept:
one sheet of paper travels through each of my projects (scan, classify, reconcile,
detect, solve, post, run) and is finally sealed into an envelope. Designed frame by
frame in Figma as the blueprint for the scroll experience.
