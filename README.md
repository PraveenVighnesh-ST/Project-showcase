# Praveen Vighnesh — Portfolio

A dark, interactive portfolio built with **plain HTML/CSS/JS** — no build step, no
framework. The only external dependency is Google's `<model-viewer>` (loaded from a
CDN) for the one interactive 3D viewer.

## Run it locally

Because browsers block some features on `file://`, serve the folder over HTTP:

```bash
cd website
python -m http.server 8000
# then open http://localhost:8000
```

(Or use the VS Code **Live Server** extension → "Open with Live Server".)

## Project structure

```
website/
├── index.html          ← page markup
├── css/style.css       ← all styling
├── js/
│   ├── projects.js      ← YOUR CONTENT lives here (edit this)
│   └── main.js          ← interactions (intro, carousel, modal, nav)
└── assets/
    ├── img/             ← posters & section images (+ SVG placeholders)
    ├── video/           ← hover / intro videos
    ├── models/          ← .glb files for the 3D viewer
    └── resume/          ← downloadable CVs
```

## How to swap placeholders for your real work

Everything you'll edit is in **`js/projects.js`** — it's plain, commented data.

### 1. Replace a card image or video
Drop your file into `assets/img/` (or `assets/video/`) and update the `poster`
(and `video`) path for that project. `video` plays on hover and freezes back to
`poster` on mouse-out; set it to `null` if there's no video yet.

### 2. The intro / hero video (background-free product)
The intro plays a video fullscreen, then shrinks it into a square frame.

To make the product float with **no background box**, export a video **with an
alpha (transparency) channel**:

1. In Fusion 360 / Blender, render the animation with a **transparent background**
   (no environment, no floor shadow catcher) as a **PNG image sequence**.
2. Encode it to the two web formats that support transparency:
   - **`robotic-arm.webm`** — VP9 with alpha (Chrome, Edge, Firefox)
     `ffmpeg -i frame_%04d.png -c:v libvpx-vp9 -pix_fmt yuva420p robotic-arm.webm`
   - **`robotic-arm.mov`** — HEVC with alpha (Safari)
     `ffmpeg -i frame_%04d.png -c:v hevc_videotoolbox -alpha_quality 0.9 -tag:v hvc1 robotic-arm.mov`
3. Put them in `assets/video/`. A plain `.mp4` **cannot** hold transparency — that's
   the usual gotcha. The intro already lists `robotic-arm.webm` first and falls back
   to the excavator clip, so it works today and upgrades the moment you add the file.

### 3. The 3D viewer (GLB)
Convert your STEP/Fusion model to **`.glb`** and place it in `assets/models/`
(e.g. `robotic-arm.glb`). In `projects.js`, set the project's `model:` path.
No GLB yet? Leave `model` out — the viewer just won't render for that project.
Quick STEP → GLB paths: Fusion 360 "Export → GLB", or Blender (import STEP add-on →
export glTF Binary).

### 4. Text, specs, timeline, about
All in `projects.js`: `PROJECTS`, `TIMELINE`, and `ABOUT`. Edit the strings.
**Set your real profile URLs** in `ABOUT.socials` — GitHub, GrabCAD, YouTube,
Instagram and LinkedIn are currently `"#"` placeholders.

### 5. Background & timeline
- The background is an interactive WebGL "silk" shader (`silkBackground()` in
  `main.js`). It ripples toward the pointer. Tweak the `c1/c2/c3` colours in the
  fragment shader to re-tint it.
- The timeline is horizontal and reads left→right oldest→newest, alternating
  above/below the axis. Cards reveal their detail and their title shines on hover.

## Deploy

**GitHub Pages**
1. `git init` in the repo, commit, push to GitHub.
2. Repo → Settings → Pages → Deploy from branch → `/ (root)` (if you push the
   `website/` contents to the repo root) or point it at the folder you use.

**Netlify** (easiest)
1. Drag the `website/` folder onto https://app.netlify.com/drop, **or**
2. Connect the repo and set **Publish directory = `website`**.

## Notes
- Respects `prefers-reduced-motion` (animations collapse for users who ask for it).
- Fully responsive; the carousel, nav and modal adapt down to phones.
- Placeholder posters are the `*.svg` files in `assets/img/` — replace freely.
