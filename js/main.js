/* =============================================================================
   main.js  —  all interaction logic (dependency-free vanilla JS).
   Sections:  1 Constellation background   2 Intro   3 Nav/pages
              4 Snap carousel               5 Modal   6 Timeline   7 About
   ========================================================================== */
"use strict";

const PALETTE = ["#4da3ff", "#37d6a7", "#ff8a5b", "#c07bff", "#ffd24d", "#5fb0d8"];

// One-shot glow pulse for a scrollbar thumb when it hits an edge (fades out).
function pulseGlow(el) {
  if (!el.animate) return;
  el.animate(
    [
      { boxShadow: "0 0 14px 1px rgba(150,190,255,0.75)" },
      { boxShadow: "0 0 0 0 rgba(150,190,255,0)" },
    ],
    { duration: 850, easing: "ease-out" }
  );
}

/* ---- 1. Constellation / neural-network background (2D canvas) ------------ */
(function constellation() {
  const canvas = document.getElementById("silk");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let W = 0, H = 0, DPR = 1, nodes = [];
  const LINK = 150;       // max distance to draw a link between two nodes
  const MOUSE_R = 200;    // radius the cursor interacts within
  const mouse = { x: -9999, y: -9999 };

  function build() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.width = Math.floor(innerWidth * DPR);
    H = canvas.height = Math.floor(innerHeight * DPR);
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
    // density scales with area (~30% more than before), clamped for performance
    const count = Math.max(60, Math.min(150, Math.round((innerWidth * innerHeight) / 13000)));
    // jittered grid: one node per cell -> even coverage, no bare patches
    const cols = Math.max(1, Math.round(Math.sqrt(count * (W / H))));
    const rows = Math.ceil(count / cols);
    const cw = W / cols, ch = H / rows;
    nodes = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (nodes.length >= count) break;
        nodes.push({
          x: (c + 0.15 + Math.random() * 0.7) * cw,
          y: (r + 0.15 + Math.random() * 0.7) * ch,
          vx: (Math.random() - 0.5) * 0.28 * DPR,
          vy: (Math.random() - 0.5) * 0.28 * DPR,
          r: (Math.random() * 1.3 + 0.6) * DPR,
        });
      }
    }
  }
  build();
  window.addEventListener("resize", build);
  window.addEventListener("pointermove", (e) => {
    mouse.x = e.clientX * DPR;
    mouse.y = e.clientY * DPR;
  });
  window.addEventListener("pointerleave", () => {
    mouse.x = mouse.y = -9999;
  });

  const linkPx = () => LINK * DPR;
  const mouseR = () => MOUSE_R * DPR;

  function frame() {
    ctx.clearRect(0, 0, W, H);
    const L = linkPx(), MR = mouseR();

    for (const n of nodes) {
      // drift + wrap around edges
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0) n.x += W; else if (n.x > W) n.x -= W;
      if (n.y < 0) n.y += H; else if (n.y > H) n.y -= H;

      // cursor gently pushes nearby nodes, so the web flexes as you move
      const dxm = n.x - mouse.x, dym = n.y - mouse.y;
      const dm = Math.hypot(dxm, dym);
      if (dm < MR && dm > 0.01) {
        const f = (1 - dm / MR) * 0.6 * DPR;
        n.x += (dxm / dm) * f;
        n.y += (dym / dm) * f;
      }
    }

    // links between nodes
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.hypot(dx, dy);
        if (d < L) {
          const alpha = (1 - d / L) * 0.28;
          ctx.strokeStyle = `rgba(150,178,214,${alpha})`;
          ctx.lineWidth = DPR;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      // brighter links from the cursor to nearby nodes (the "neural" pulse)
      const dxm = a.x - mouse.x, dym = a.y - mouse.y;
      const dm = Math.hypot(dxm, dym);
      if (dm < MR) {
        const alpha = (1 - dm / MR) * 0.5;
        ctx.strokeStyle = `rgba(190,214,255,${alpha})`;
        ctx.lineWidth = DPR;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }

    // nodes (stars) on top
    for (const n of nodes) {
      const near = Math.hypot(n.x - mouse.x, n.y - mouse.y) < MR;
      ctx.fillStyle = near ? "rgba(214,228,255,0.95)" : "rgba(170,190,225,0.7)";
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(frame);
  }
  frame();
})();

/* ---- 2. Intro: video shrinks to card size; identity text flies to corner - */
(function intro() {
  const intro = document.getElementById("intro");
  const video = document.getElementById("intro-video");
  const brand = document.getElementById("brand");
  const skip = document.getElementById("intro-skip");
  if (!intro) return;

  let done = false;
  function reveal() {
    if (done) return;
    done = true;
    brand && brand.classList.add("show");
    intro.classList.add("gone");
    // tell the carousel the intro is over (it then waits 3s before auto-scroll)
    window.dispatchEvent(new Event("intro:done"));
  }
  function finish() {
    // skip / error: collapse the choreography quickly, then reveal
    intro.classList.add("shrunk", "to-corner");
    setTimeout(reveal, 450);
  }

  // choreography
  const t1 = setTimeout(() => intro.classList.add("shrunk"), 2600);    // video -> card
  const t2 = setTimeout(() => intro.classList.add("to-corner"), 4100); // text -> top-left
  const t3 = setTimeout(reveal, 5300);

  video && video.addEventListener("error", () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); finish(); });
  skip &&
    skip.addEventListener("click", () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      finish();
    });
})();

/* ---- 3. Navigation & curved page transitions ---------------------------- */
(function navigation() {
  const order = ["home", "timeline", "about"];
  const pages = {
    home: document.getElementById("page-home"),
    timeline: document.getElementById("page-timeline"),
    about: document.getElementById("page-about"),
  };
  let current = "home";
  document.body.dataset.page = "home";
  function go(name) {
    if (!pages[name] || name === current) return;
    const ti = order.indexOf(name);
    order.forEach((key) => {
      const el = pages[key];
      const i = order.indexOf(key);
      el.classList.remove("is-active", "is-exit-up");
      if (key === name) el.classList.add("is-active");
      else if (i < ti) el.classList.add("is-exit-up");
    });
    document
      .querySelectorAll(".pill")
      .forEach((p) => p.classList.toggle("is-active", p.dataset.nav === name));
    document.body.dataset.page = name;
    current = name;
  }
  document
    .querySelectorAll("[data-nav]")
    .forEach((btn) => btn.addEventListener("click", () => go(btn.dataset.nav)));
})();

/* ---- 4. Snap carousel (smooth, one-card-per-scroll) --------------------- */
(function carousel() {
  const ring = document.getElementById("carousel-ring");
  const stage = document.getElementById("carousel");
  const titlesWrap = document.getElementById("carousel-titles");
  if (!ring || typeof PROJECTS === "undefined") return;

  const N = PROJECTS.length;
  const STEP = 26;       // degrees between neighbouring cards
  const RADIUS = 880;    // larger radius to space the bigger cards

  let angle = 0, goal = 0;        // current position; integer card we head to
  // time-based ease-in-out tween -> smooth, consistent glide (not a snap)
  let tweening = false, tFrom = 0, tTo = 0, tStart = 0, tDur = 850;
  let vel = 0, dragging = false;
  let autoAt = Infinity;          // auto-scroll disabled until 3s after intro
  let dwellStart = 0;
  let lastX = 0, moved = 0, pressedIndex = null, frontIndex = -1;
  let wheelAccum = 0, wheelLock = 0;
  const cards = [];

  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  function tweenTo(to, dur) { tFrom = angle; tTo = to; tStart = performance.now(); tDur = dur; tweening = true; }

  // start auto-scroll only 3s after the intro finishes
  window.addEventListener("intro:done", () => { autoAt = performance.now() + 3000; });
  // fallback in case the intro never fires an event
  setTimeout(() => { if (autoAt === Infinity) autoAt = performance.now() + 3000; }, 8000);

  PROJECTS.forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.setProperty("--card-accent", p.accent);
    card.dataset.index = i;
    card.innerHTML = `
      <div class="card-media">
        <img src="${p.poster}" alt="${p.title}" draggable="false" />
        ${p.video ? `<video src="${p.video}" muted loop playsinline preload="metadata"></video>` : ""}
      </div>
      <div class="card-ring-accent"></div>`;
    ring.appendChild(card);
    cards.push({ el: card, video: card.querySelector("video") });
  });

  // title strip — one label per project
  const titles = [];
  if (titlesWrap) {
    PROJECTS.forEach((p) => {
      const t = document.createElement("div");
      t.className = "ct-item";
      t.textContent = p.title;
      titlesWrap.appendChild(t);
      titles.push(t);
    });
  }

  // Measure widths so adjacent titles sit edge-to-edge (a fixed px gap would
  // overlap the wide names). spacing[i] = centre-to-centre distance i -> i+1.
  const GAP = 64;
  let spacing = [], cumulative = [], totalLen = 0;
  function measureTitles() {
    if (!titles.length) return;
    const w = titles.map((t) => t.offsetWidth);
    spacing = titles.map((_, i) => w[i] / 2 + w[(i + 1) % N] / 2 + GAP);
    cumulative = [];
    let acc = 0;
    for (let i = 0; i < N; i++) { cumulative[i] = acc; acc += spacing[i]; }
    totalLen = acc;
  }
  requestAnimationFrame(measureTitles);
  window.addEventListener("resize", measureTitles);
  window.addEventListener("load", measureTitles);
  setTimeout(measureTitles, 600);

  const offsetOf = (i) => {
    let o = i - angle;
    while (o > N / 2) o -= N;
    while (o <= -N / 2) o += N;
    return o;
  };

  function render() {
    const moving = dragging || tweening;
    let bestI = 0, best = Infinity;
    cards.forEach(({ el, video }, i) => {
      const o = offsetOf(i);
      const dist = Math.abs(o);
      const theta = (o * STEP * Math.PI) / 180;
      const x = Math.sin(theta) * RADIUS;
      const z = (Math.cos(theta) - 1) * RADIUS;
      el.style.transform =
        `translate3d(${x}px,0,${z}px) rotateY(${(-o * STEP * 0.9).toFixed(2)}deg) scale(${(1 - dist * 0.06).toFixed(3)})`;
      el.style.opacity = (dist > 2.9 ? 0 : 1 - Math.min(dist / 3.4, 0.72)).toFixed(3);
      el.style.zIndex = String(1000 - Math.round(dist * 100));
      el.style.pointerEvents = dist > 1.6 ? "none" : "auto";
      el.classList.remove("is-front");
      if (video) {
        if (dist < 2.4) {
          if (dist < 0.25 && !moving) { video.pause(); video.style.opacity = "0"; }
          else { if (video.paused) video.play().catch(() => {}); video.style.opacity = "1"; }
        } else { video.pause(); video.style.opacity = "0"; }
      }
      if (dist < best) { best = dist; bestI = i; }
    });
    cards[bestI].el.classList.add("is-front");
    frontIndex = bestI;

    // titles: edge-to-edge spacing (px, from measured widths) so they never
    // overlap; opacity is index-based so neighbours are HIDDEN at rest and
    // only appear as they move through a transition
    if (titles.length && totalLen > 0) {
      const a = ((angle % N) + N) % N;
      const k = Math.floor(a);
      const frac = a - k;
      const viewCenter = cumulative[k] + frac * spacing[k];
      titles.forEach((t, i) => {
        let x = cumulative[i] - viewCenter;   // px position along the strip
        while (x > totalLen / 2) x -= totalLen;
        while (x <= -totalLen / 2) x += totalLen;
        let o = i - angle;                    // index offset -> visibility
        while (o > N / 2) o -= N;
        while (o <= -N / 2) o += N;
        t.style.transform = `translate(-50%, -50%) translateX(${x.toFixed(1)}px)`;
        t.style.opacity = Math.max(0, 1 - Math.abs(o)).toFixed(3); // 0 at rest for neighbours
      });
    }
  }

  function loop(now) {
    if (document.body.classList.contains("modal-open")) {
      cards.forEach(({ video }) => video && video.pause());
      requestAnimationFrame(loop);
      return;
    }
    if (dragging) {
      /* angle driven by pointermove */
      tweening = false;
    } else if (tweening) {
      const t = Math.min(1, (now - tStart) / tDur);
      angle = tFrom + (tTo - tFrom) * easeInOut(t);   // smooth ease-in-out glide
      if (t >= 1) { angle = tTo; goal = tTo; tweening = false; dwellStart = now; }
    } else {
      angle = goal;                                    // resting on a card
      if (now >= autoAt) {
        if (!dwellStart) dwellStart = now;
        if (now - dwellStart >= 1500) tweenTo(goal + 1, 850); // hold 1.5s, then glide
      } else dwellStart = 0;
    }

    render();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // pointer drag + tap-to-open
  stage.addEventListener("pointerdown", (e) => {
    dragging = true;
    tweening = false;
    lastX = e.clientX;
    moved = 0;
    vel = 0;
    autoAt = performance.now() + 2000;
    const card = e.target.closest(".card");
    pressedIndex = card ? Number(card.dataset.index) : null;
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    moved += Math.abs(dx);
    const da = -dx / 220;
    angle += da;
    vel = Math.max(-0.05, Math.min(0.05, da));
  });
  function release() {
    if (!dragging) return;
    dragging = false;
    if (moved < 8 && pressedIndex !== null) openModal(PROJECTS[pressedIndex]);
    // glide to the nearest card, carrying a little of the drag's momentum
    tweenTo(Math.round(angle + vel * 6), 450);
    autoAt = performance.now() + 2000; // resume auto-drift 2s after interaction
    pressedIndex = null;
  }
  stage.addEventListener("pointerup", release);
  stage.addEventListener("pointercancel", release);

  // wheel / trackpad -> glide exactly one card toward the scroll direction
  stage.addEventListener(
    "wheel",
    (e) => {
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const now = performance.now();
      wheelAccum += d;
      if (Math.abs(wheelAccum) > 24 && now > wheelLock) {
        const base = tweening ? tTo : goal;          // chain notches smoothly
        tweenTo(base + (wheelAccum > 0 ? 1 : -1), 480);
        wheelAccum = 0;
        wheelLock = now + 160;
      }
      autoAt = now + 2000;
      dwellStart = 0;
      e.preventDefault();
    },
    { passive: false }
  );
})();

/* ---- 5. Project detail modal -------------------------------------------- */
const modalRoot = document.getElementById("modal-root");
const modalContent = document.getElementById("modal-content");
const modalWindow = document.getElementById("modal-window");

function openModal(p) {
  const specs = (p.specs || [])
    .map(
      (s) =>
        `<div class="m-spec"><div class="m-spec-label">${s.label}</div><div class="m-spec-value">${s.value}</div></div>`
    )
    .join("");
  const viewer = p.model
    ? `<div class="m-viewer">
         <model-viewer src="${p.model}" poster="${p.poster}" alt="${p.title} 3D model"
           camera-controls auto-rotate touch-action="pan-y" shadow-intensity="1"
           exposure="1" interaction-prompt="none"></model-viewer>
         <p class="m-viewer-cap">// Drag to orbit · scroll to zoom · GLB model</p>
       </div>`
    : "";
  const sections = (p.sections || [])
    .map(
      (s) =>
        `<div class="m-section"><h3>${s.title}</h3><p>${s.body}</p>${
          s.image ? `<img src="${s.image}" alt="${s.title}" loading="lazy" />` : ""
        }</div>`
    )
    .join("");
  const tags = (p.tags || []).map((t) => `<span class="m-tag">${t}</span>`).join("");

  modalContent.innerHTML = `
    <div class="m-hero">
      <div class="m-cat">${p.category} · ${p.year}</div>
      <h2 class="m-title">${p.title}</h2>
      <p class="m-tagline">${p.tagline}</p>
      <p class="m-hero-blurb">${p.hero}</p>
    </div>
    ${p.specs && p.specs.length ? `<div class="m-specs">${specs}</div>` : ""}
    ${viewer}
    ${sections}
    ${tags ? `<div class="m-tags">${tags}</div>` : ""}`;

  modalWindow.style.setProperty("--m-accent", p.accent);
  modalRoot.style.setProperty("--accent", p.accent);
  modalRoot.classList.add("open");
  modalRoot.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modalWindow.scrollTop = 0;
}
function closeModal() {
  modalRoot.classList.remove("open");
  modalRoot.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}
document.getElementById("modal-close").addEventListener("click", closeModal);
document.getElementById("modal-backdrop").addEventListener("click", closeModal);
window.addEventListener("keydown", (e) => e.key === "Escape" && closeModal());

/* ---- 6. Horizontal timeline (chronological, alternating up/down) -------- */
(function fillTimeline() {
  const el = document.getElementById("timeline");
  if (!el || typeof TIMELINE === "undefined") return;
  const items = [...TIMELINE].reverse(); // data is newest-first -> oldest-first
  el.innerHTML = items
    .map((t, i) => {
      const accent = PALETTE[i % PALETTE.length];
      const side = i % 2 === 0 ? "up" : "down";
      const kind = t.kind === "edu" ? "Education" : "Experience";
      return `
      <li class="tl-item ${side}" style="--tl-accent:${accent}">
        <span class="tl-node"></span>
        <span class="tl-date">${t.period}</span>
        <div class="tl-card">
          <div class="tl-kind">${kind}</div>
          <h3 class="tl-title">${t.title}</h3>
          <p class="tl-org">${t.org}</p>
          <p class="tl-note">${t.note}</p>
        </div>
      </li>`;
    })
    .join("");
})();

/* ---- 7. About (Apple-style tiles + socials) ----------------------------- */
const ICONS = {
  github:
    '<svg viewBox="0 0 24 24"><path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.36-3.88-1.36-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.75.4-1.27.73-1.56-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z"/></svg>',
  grabcad:
    '<svg viewBox="0 0 24 24"><path d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.3 6.5 3.6L12 11.5 5.5 7.9 12 4.3ZM5 9.6l6 3.4v6.8l-6-3.3V9.6Zm14 0v6.9l-6 3.3v-6.8l6-3.4Z"/></svg>',
  youtube:
    '<svg viewBox="0 0 24 24"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z"/></svg>',
  linkedin:
    '<svg viewBox="0 0 24 24"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3 0-2.95-1.8-2.95s-2.08 1.4-2.08 2.85V21H9V9Z"/></svg>',
};

(function fillAbout() {
  const el = document.getElementById("about");
  if (!el || typeof ABOUT === "undefined") return;
  const tiles = ABOUT.skills
    .map(
      (s, i) => `
      <div class="skill-tile" style="--tile-accent:${PALETTE[i % PALETTE.length]}">
        <h3 class="skill-group">${s.group}</h3>
        <div class="skill-items">${s.items}</div>
      </div>`
    )
    .join("");
  const resumeBtns = ABOUT.resumes
    .map((r) => `<a class="btn btn-primary" href="${r.href}" download>↓ ${r.label}</a>`)
    .join("");
  const socialBtns = (ABOUT.socials || [])
    .map(
      (s) =>
        `<a class="btn" href="${s.href}" target="_blank" rel="noopener">${ICONS[s.icon] || ""} ${s.label}</a>`
    )
    .join("");
  el.innerHTML = `
    <p class="about-lead">${ABOUT.blurb}</p>
    <p class="about-sub">${ABOUT.role} · ${ABOUT.location} ·
      <a class="af-link" href="mailto:${ABOUT.email}">${ABOUT.email}</a></p>
    <div class="about-actions">${resumeBtns}${socialBtns}</div>
    <div class="about-label">Toolbox</div>
    <div class="skill-grid">${tiles}</div>`;
})();

/* ---- 8. Timeline: wheel-scroll horizontally + custom minimal scrollbar --- */
(function timelineScroll() {
  const wrap = document.getElementById("timeline-wrap");
  const track = document.getElementById("tl-scroll");
  const thumb = document.getElementById("tl-thumb");
  if (!wrap || !track || !thumb) return;

  const maxScroll = () => wrap.scrollWidth - wrap.clientWidth;
  let wasAtEnd = true; // start "at edge" so no glow fires on load

  function update() {
    const ms = maxScroll();
    if (ms <= 1) { track.style.opacity = "0"; return; }
    track.style.opacity = "1";
    const trackW = track.clientWidth;
    const thumbW = Math.max(33, trackW * (wrap.clientWidth / wrap.scrollWidth));
    thumb.style.width = thumbW + "px";
    const p = wrap.scrollLeft / ms;
    thumb.style.transform = `translateX(${(p * (trackW - thumbW)).toFixed(1)}px)`;
    const atEnd = p > 0.992 || p < 0.008;
    if (atEnd && !wasAtEnd) pulseGlow(thumb); // glow only on reaching an edge
    wasAtEnd = atEnd;
  }

  // vertical wheel over the timeline scrolls it left↔right
  wrap.addEventListener(
    "wheel",
    (e) => {
      if (maxScroll() <= 1) return;
      wrap.scrollLeft += Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      update();
      e.preventDefault();
    },
    { passive: false }
  );
  wrap.addEventListener("scroll", update);
  window.addEventListener("resize", update);

  // drag the thumb
  let dragging = false, startX = 0, startScroll = 0;
  thumb.addEventListener("pointerdown", (e) => {
    dragging = true; startX = e.clientX; startScroll = wrap.scrollLeft;
    thumb.setPointerCapture(e.pointerId); e.preventDefault();
  });
  thumb.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const denom = track.clientWidth - thumb.clientWidth;
    if (denom > 0) wrap.scrollLeft = startScroll + ((e.clientX - startX) / denom) * maxScroll();
    update();
  });
  const stop = () => (dragging = false);
  thumb.addEventListener("pointerup", stop);
  thumb.addEventListener("pointercancel", stop);

  // click the track to jump
  track.addEventListener("pointerdown", (e) => {
    if (e.target === thumb) return;
    const rect = track.getBoundingClientRect();
    wrap.scrollLeft = ((e.clientX - rect.left) / rect.width) * maxScroll();
    update();
  });

  requestAnimationFrame(() => requestAnimationFrame(update));
  setTimeout(update, 300);
})();

/* ---- 9. About: custom vertical scrollbar (matches the timeline slider) --- */
(function aboutScroll() {
  const page = document.getElementById("page-about");
  const track = document.getElementById("ab-scroll");
  const thumb = document.getElementById("ab-thumb");
  if (!page || !track || !thumb) return;

  const maxScroll = () => page.scrollHeight - page.clientHeight;
  let wasAtEnd = true; // start "at edge" so no glow fires on load

  function update() {
    const ms = maxScroll();
    if (ms <= 1) { track.style.opacity = "0"; return; }  // nothing to scroll
    track.style.opacity = "";                            // let CSS decide (About only)
    const trackH = track.clientHeight;
    const thumbH = Math.max(33, trackH * (page.clientHeight / page.scrollHeight));
    thumb.style.height = thumbH + "px";
    const p = page.scrollTop / ms;
    thumb.style.transform = `translateY(${(p * (trackH - thumbH)).toFixed(1)}px)`;
    const atEnd = p > 0.992 || p < 0.008;
    if (atEnd && !wasAtEnd) pulseGlow(thumb); // glow only on reaching an edge
    wasAtEnd = atEnd;
  }

  page.addEventListener("scroll", update);
  window.addEventListener("resize", update);

  let dragging = false, startY = 0, startTop = 0;
  thumb.addEventListener("pointerdown", (e) => {
    dragging = true; startY = e.clientY; startTop = page.scrollTop;
    thumb.setPointerCapture(e.pointerId); e.preventDefault();
  });
  thumb.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const denom = track.clientHeight - thumb.clientHeight;
    if (denom > 0) page.scrollTop = startTop + ((e.clientY - startY) / denom) * maxScroll();
    update();
  });
  const stop = () => (dragging = false);
  thumb.addEventListener("pointerup", stop);
  thumb.addEventListener("pointercancel", stop);

  track.addEventListener("pointerdown", (e) => {
    if (e.target === thumb) return;
    const rect = track.getBoundingClientRect();
    page.scrollTop = ((e.clientY - rect.top) / rect.height) * maxScroll();
    update();
  });

  // recompute when the About tab is opened (content height is then known)
  document
    .querySelectorAll('[data-nav="about"]')
    .forEach((b) => b.addEventListener("click", () => setTimeout(update, 60)));
  requestAnimationFrame(() => requestAnimationFrame(update));
  setTimeout(update, 400);
})();
