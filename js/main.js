/* =============================================================================
   main.js  —  all interaction logic (dependency-free vanilla JS).
   Sections:  1 Constellation background   2 Intro   3 Nav/pages
              4 Snap carousel               5 Modal   6 Timeline   7 About
   ========================================================================== */
"use strict";

const PALETTE = ["#4da3ff", "#37d6a7", "#ff8a5b", "#c07bff", "#ffd24d", "#5fb0d8"];

// Video field can be one path (string) or several, tried in order (array) —
// e.g. an alpha .webm first, with an opaque .mp4 fallback for browsers that
// can't decode it. Renders <source> tags so the <video> picks what it can play.
const VIDEO_MIME = { webm: "video/webm", mp4: "video/mp4", mov: "video/quicktime" };
function videoSourceTags(video) {
  if (!video) return "";
  const list = Array.isArray(video) ? video : [video];
  return list
    .map((src) => {
      const ext = src.split(".").pop().toLowerCase();
      return `<source src="${src}" type="${VIDEO_MIME[ext] || ""}" />`;
    })
    .join("");
}

/* Shared journey state — the whole site is one continuous scroll:
   Home cards -> Timeline -> About (and back). Populated by the modules below. */
const App = {};
let currentSection = "home";
let ready = false;          // scroll journey activates after the intro
let sectionLockUntil = 0;   // ignore wheel briefly during a section slide

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

  const BG_REVEAL_AT = 4;      // site fades in 0.5s AFTER the shrink starts (OUTRO_AT)
  const OUTRO_AT = 3.5;        // the video starts shrinking onto the card here...
  const OUTRO_DUR = 1.6;       // ...over this long, dissolving out as it shrinks

  let done = false, shrunk = false, bgRevealed = false, outroStarted = false;

  // Gradually fade the solid black away to reveal the live site (constellation
  // bg, nav, cards) behind the intro, starting once the video hits BG_REVEAL_AT
  // -- instead of holding it back until the video fully ends.
  function revealBg() {
    if (bgRevealed) return;
    bgRevealed = true;
    intro.classList.add("bg-reveal");
  }

  // Shrink the fullscreen video down onto the FRONT card's exact on-screen
  // position and size (and fly the identity text to the corner alongside it),
  // so the product appears to settle into the card as one coordinated move.
  function shrink() {
    if (shrunk) return;
    shrunk = true;
    const frame = intro.querySelector(".intro-frame");
    const card = document.querySelector(".card.is-front") || document.querySelector(".card");
    if (frame && card) {
      const r = card.getBoundingClientRect();
      if (r.width > 0) {
        frame.style.width = r.width + "px";
        frame.style.height = r.height + "px";
        const dx = r.left + r.width / 2 - window.innerWidth / 2;
        const dy = r.top + r.height / 2 - window.innerHeight / 2;
        frame.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
      }
    }
    intro.classList.add("shrunk", "to-corner");
  }

  function reveal() {
    if (done) return;
    done = true;
    clearTimeout(maxWait);
    shrink(); // safety: the video must have visibly landed on the card first
    revealBg();
    brand && brand.classList.add("show");
    intro.classList.add("gone");
    // tell the carousel the intro is over (it then waits 3s before auto-scroll)
    window.dispatchEvent(new Event("intro:done"));
  }
  // Coordinated outro: the fullscreen video shrinks onto the card AND fades
  // out at the same time, dissolving into the real photo poster that sits in
  // that same card right behind it (shrink() matched its size/position). One
  // smooth motion instead of shrink-then-cut, so it never feels janky.
  function outro() {
    if (outroStarted) return;
    outroStarted = true;
    shrink();                           // frame shrinks to the card + text flies to corner
    intro.classList.add("video-fade");  // video gently dissolves out as it shrinks
    setTimeout(reveal, OUTRO_DUR * 1000);
  }
  function finish() {
    // skip / error: collapse the choreography quickly, then reveal
    outroStarted = true;
    shrink();
    intro.classList.add("video-fade");
    setTimeout(reveal, 450);
  }

  if (video) {
    video.addEventListener("timeupdate", () => {
      if (video.currentTime >= BG_REVEAL_AT) revealBg();
      if (video.currentTime >= OUTRO_AT) outro();
    });
    // fallback if the clip is shorter than OUTRO_AT (or timeupdate is sparse)
    video.addEventListener("ended", outro);
    video.addEventListener("error", finish);
  } else {
    setTimeout(outro, OUTRO_AT * 1000);
  }

  // safety net in case metadata/ended never fire (e.g. autoplay blocked)
  const maxWait = setTimeout(finish, 9000);

  skip &&
    skip.addEventListener("click", () => {
      clearTimeout(maxWait);
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
  document.body.dataset.page = "home";

  function applyTransition(name) {
    const ti = order.indexOf(name);
    order.forEach((key) => {
      const el = pages[key];
      if (!el) return;
      const i = order.indexOf(key);
      el.classList.remove("is-active", "is-exit-up");
      if (key === name) el.classList.add("is-active");
      else if (i < ti) el.classList.add("is-exit-up"); // earlier sections slide up
    });
    document
      .querySelectorAll(".pill")
      .forEach((p) => p.classList.toggle("is-active", p.dataset.nav === name));
    document.body.dataset.page = name;
  }

  // Change section and place the viewer at that section's start (or end).
  function goSection(name, opts) {
    if (!pages[name] || name === currentSection) return;
    opts = opts || {};
    applyTransition(name);
    currentSection = name;
    sectionLockUntil = performance.now() + 750; // block wheel during the slide
    if (name === "home" && App.setCard) {
      App.setCard(opts.card != null ? opts.card : (App.getCard ? App.getCard() : 0));
    } else if (name === "timeline" && App.tlWrap) {
      App.tlWrap.scrollLeft = opts.end ? App.tlWrap.scrollWidth - App.tlWrap.clientWidth : 0;
      App.tlTarget = App.tlWrap.scrollLeft; // keep the smooth-scroll target in sync
    } else if (name === "about" && App.aboutPage) {
      App.aboutPage.scrollTop = opts.end ? App.aboutPage.scrollHeight - App.aboutPage.clientHeight : 0;
      App.abTarget = App.aboutPage.scrollTop;
    }
  }
  App.goSection = goSection;
  App.tlTarget = 0;
  App.abTarget = 0;

  // Smooth-scroll easing loop: the wheel sets a target; the actual scroll glides
  // toward it each frame (instead of jumping per wheel tick -> no jank).
  // On touch we hand control to NATIVE scrolling (App.tlNative/abNative, set on
  // touchstart) — the loop then just follows, so it never fights the finger.
  (function scrollEase() {
    if (currentSection === "timeline" && App.tlWrap) {
      const w = App.tlWrap;
      if (App.tlNative) {
        App.tlTarget = w.scrollLeft; // native/touch scroll owns it -> just follow
      } else {
        App.tlTarget = Math.max(0, Math.min(w.scrollWidth - w.clientWidth, App.tlTarget));
        const d = App.tlTarget - w.scrollLeft;
        if (Math.abs(d) > 0.5) w.scrollLeft += d * 0.16;
        else if (d !== 0) w.scrollLeft = App.tlTarget;
      }
    } else if (currentSection === "about" && App.aboutPage) {
      const p = App.aboutPage;
      if (App.abNative) {
        App.abTarget = p.scrollTop;
      } else {
        App.abTarget = Math.max(0, Math.min(p.scrollHeight - p.clientHeight, App.abTarget));
        const d = App.abTarget - p.scrollTop;
        if (Math.abs(d) > 0.5) p.scrollTop += d * 0.16;
        else if (d !== 0) p.scrollTop = App.abTarget;
      }
    }
    requestAnimationFrame(scrollEase);
  })();

  document.querySelectorAll("[data-nav]").forEach((btn) =>
    btn.addEventListener("click", () =>
      goSection(btn.dataset.nav, btn.dataset.nav === "home" ? { card: 0 } : {})
    )
  );

  // the scroll journey turns on once the intro is gone
  window.addEventListener("intro:done", () => { ready = true; });
  setTimeout(() => { ready = true; }, 8000); // fallback

  /* ---- Global wheel handler: one continuous scroll through the whole site */
  let hAccum = 0, hLock = 0;
  window.addEventListener(
    "wheel",
    (e) => {
      if (!ready || document.body.classList.contains("modal-open")) return;
      const now = performance.now();
      if (now < sectionLockUntil) { e.preventDefault(); return; }
      let dy = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (e.deltaMode === 1) dy *= 16; // line-based wheels -> approx pixels

      if (currentSection === "home") {
        e.preventDefault();
        hAccum += dy;
        if (Math.abs(hAccum) > 50 && now > hLock) {
          const dir = hAccum > 0 ? 1 : -1;
          hAccum = 0; hLock = now + 120;
          const moved = App.stepCard ? App.stepCard(dir) : false;
          // past the last card -> Timeline; before the first -> stay (top of site)
          if (!moved && dir > 0) goSection("timeline", { end: false });
        }
      } else if (currentSection === "timeline") {
        e.preventDefault();
        App.tlNative = false; // wheel -> use the eased glide, not native scroll
        const wrap = App.tlWrap;
        if (!wrap) return;
        const max = wrap.scrollWidth - wrap.clientWidth;
        // hand off to the next/prev section only once the TARGET is at an edge
        if (dy > 0 && App.tlTarget >= max - 1) goSection("about", { end: false });
        else if (dy < 0 && App.tlTarget <= 1) goSection("home", { card: App.cardCount ? App.cardCount - 1 : 0 });
        else App.tlTarget = Math.max(0, Math.min(max, App.tlTarget + dy)); // glide (see scrollEase)
      } else if (currentSection === "about") {
        e.preventDefault();
        App.abNative = false; // wheel -> eased glide
        const page = App.aboutPage;
        if (!page) return;
        const maxA = page.scrollHeight - page.clientHeight;
        if (dy < 0 && App.abTarget <= 1) goSection("timeline", { end: true });
        else App.abTarget = Math.max(0, Math.min(maxA, App.abTarget + dy)); // glide
      }
    },
    { passive: false }
  );
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
  let recoilIndex = -1, recoilStart = 0;    // the ONE card that dips when opened
  const RECOIL_DUR = 420;
  const cards = [];

  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  function tweenTo(to, dur) {
    to = Math.max(0, Math.min(N - 1, to));  // non-looping: clamp to the real card range
    tFrom = angle; tTo = to; tStart = performance.now(); tDur = dur; tweening = true;
  }

  // Auto-scroll is normally armed 3s after the intro. But when the first-run
  // guidance demo runs (section 5b) it takes over the timing: the demo calls
  // App.startAuto() once its pointer -> open-window -> close sequence is done.
  App.startAuto = (delayMs) => { autoAt = performance.now() + (delayMs || 0); };
  App.holdAuto = () => { autoAt = Infinity; };
  window.addEventListener("intro:done", () => { if (!App.demoWillRun) App.startAuto(3000); });
  // fallback in case the intro never fires an event / the demo stalls
  setTimeout(() => { if (autoAt === Infinity && !App.demoRunning) App.startAuto(3000); }, 12000);

  PROJECTS.forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.setProperty("--card-accent", p.accent);
    card.dataset.index = i;
    card.innerHTML = `
      <div class="card-media">
        ${p.video ? `<video muted loop playsinline preload="metadata">${videoSourceTags(p.video)}</video>` : ""}
        <img src="${p.poster}" alt="${p.title}" draggable="false" />
      </div>
      <div class="card-ring-accent"></div>`;
    ring.appendChild(card);
    cards.push({ el: card, video: card.querySelector("video"), poster: card.querySelector("img") });
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
  let spacing = [], cumulative = [];
  function measureTitles() {
    if (titles.length < 2) return;
    const w = titles.map((t) => t.offsetWidth);
    spacing = [];
    for (let i = 0; i < N - 1; i++) spacing[i] = w[i] / 2 + w[i + 1] / 2 + GAP;
    cumulative = [0];
    for (let i = 1; i < N; i++) cumulative[i] = cumulative[i - 1] + spacing[i - 1];
  }
  requestAnimationFrame(measureTitles);
  window.addEventListener("resize", measureTitles);
  window.addEventListener("load", measureTitles);
  setTimeout(measureTitles, 600);

  // linear (non-looping): first card centred, the rest fan out to the right
  const offsetOf = (i) => i - angle;

  function render() {
    const moving = dragging || tweening;
    let bestI = 0, best = Infinity;
    cards.forEach(({ el, video, poster }, i) => {
      const o = offsetOf(i);
      const dist = Math.abs(o);
      const theta = (o * STEP * Math.PI) / 180;
      const x = Math.sin(theta) * RADIUS;
      const z = (Math.cos(theta) - 1) * RADIUS;
      // only the clicked card dips (press-in) as its window opens; a half-sine
      // takes its scale 1 -> ~0.85 -> 1 over RECOIL_DUR (others are untouched)
      let rScale = 1;
      if (i === recoilIndex) {
        const rt = (performance.now() - recoilStart) / RECOIL_DUR;
        if (rt >= 1) recoilIndex = -1;
        else rScale = 1 - 0.15 * Math.sin(rt * Math.PI);
      }
      el.style.transform =
        `translate3d(${x}px,0,${z}px) rotateY(${(-o * STEP * 0.9).toFixed(2)}deg) scale(${((1 - dist * 0.06) * rScale).toFixed(3)})`;
      // fully opaque out to the culling distance (no more see-through cards
      // letting the next one bleed through) -- dim with brightness instead
      el.style.opacity = dist > 2.9 ? "0" : "1";
      el.style.filter = `brightness(${Math.max(0.5, 1 - dist * 0.25).toFixed(3)})`;
      el.style.zIndex = String(1000 - Math.round(dist * 100));
      // every visible card is clickable (not just the centre one) so a tap on a
      // side card opens its window directly; only cull the fully-faded ones
      el.style.pointerEvents = dist > 2.9 ? "none" : "auto";
      el.classList.remove("is-front");
      if (video) {
        if (dist < 2.4) {
          if (dist < 0.25 && !moving) { video.pause(); if (poster) poster.style.opacity = "1"; }
          else { if (video.paused) video.play().catch(() => {}); if (poster) poster.style.opacity = "0"; }
        } else { video.pause(); if (poster) poster.style.opacity = "1"; }
      }
      if (dist < best) { best = dist; bestI = i; }
    });
    cards[bestI].el.classList.add("is-front");
    frontIndex = bestI;

    // titles: edge-to-edge spacing (px, from measured widths) so they never
    // overlap; opacity is index-based so neighbours are HIDDEN at rest and
    // only appear as they move through a transition (linear, non-looping)
    if (titles.length && cumulative.length === N) {
      const a = Math.max(0, Math.min(N - 1, angle));
      const k = Math.max(0, Math.min(N - 2, Math.floor(a)));
      const viewCenter = cumulative[k] + (a - k) * spacing[k];
      titles.forEach((t, i) => {
        const x = cumulative[i] - viewCenter;       // px position along the strip
        t.style.transform = `translate(-50%, -50%) translateX(${x.toFixed(1)}px)`;
        t.style.opacity = Math.max(0, 1 - Math.abs(i - angle)).toFixed(3);
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
      if (now >= autoAt && goal < N - 1) {              // stop drifting at the last card
        if (!dwellStart) dwellStart = now;
        if (now - dwellStart >= 1500) tweenTo(goal + 1, 850); // hold 1.5s, then glide
      } else dwellStart = 0;
    }

    render();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // Which card is under a screen point? getBoundingClientRect reflects the
  // real projected (3D-transformed) bounds, so this reliably finds side cards
  // even when the browser's own hit-testing misses a rotated card. Ties go to
  // the frontmost (highest z-index) card.
  function cardAtPoint(x, y) {
    let hit = null, bestZ = -Infinity;
    for (let i = 0; i < cards.length; i++) {
      const el = cards[i].el;
      if (el.style.pointerEvents === "none") continue;
      const r = el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
        const z = parseInt(el.style.zIndex || "0", 10);
        if (z >= bestZ) { bestZ = z; hit = i; }
      }
    }
    return hit;
  }

  // pointer drag + tap-to-open (any visible card, not just the centre one)
  stage.addEventListener("pointerdown", (e) => {
    dragging = true;
    tweening = false;
    lastX = e.clientX;
    moved = 0;
    vel = 0;
    autoAt = performance.now() + 2000;
    const card = e.target.closest(".card");
    pressedIndex = card ? Number(card.dataset.index) : cardAtPoint(e.clientX, e.clientY);
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    moved += Math.abs(dx);
    const da = -dx / 220;
    angle = Math.max(0, Math.min(N - 1, angle + da)); // non-looping: clamp while dragging
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

  // Wheel is handled globally (see the navigation module) so scrolling can
  // hand off from the last card to the Timeline section, and back again.
  App.stepCard = function (dir) {
    const base = tweening ? tTo : goal;
    const next = base + dir;
    if (next < 0 || next > N - 1) return false; // at an edge -> let the journey move on
    tweenTo(next, 480);
    autoAt = performance.now() + 2000;
    dwellStart = 0;
    return true;
  };
  App.setCard = function (i) {
    goal = angle = Math.max(0, Math.min(N - 1, i));
    tweening = false;
    autoAt = performance.now() + 2000;
    dwellStart = 0;
  };
  App.getCard = function () { return Math.round(goal); };
  App.cardCount = N;
  // make just ONE card dip when its window is opened (called from openModal)
  App.recoilCard = function (index) {
    if (index == null || index < 0 || index >= N) return;
    recoilIndex = index;
    recoilStart = performance.now();
  };
})();

/* ---- 5. Project detail modal -------------------------------------------- */
const modalRoot = document.getElementById("modal-root");
const modalContent = document.getElementById("modal-content");
const modalWindow = document.getElementById("modal-window");

function openModal(p) {
  // KEY POINTS column — the project's headline specs (+ tags below).
  const specs = (p.specs || [])
    .map(
      (s) =>
        `<div class="m-spec"><span class="m-spec-label">${s.label}</span><span class="m-spec-value">${s.value}</span></div>`
    )
    .join("");
  const tags = (p.tags || []).map((t) => `<span class="m-tag">${t}</span>`).join("");

  // VIEWER column — the GLB 3D viewer if there's a model, else the project's
  // video (looping) or its poster image, so the middle is always a visual.
  let viewerInner;
  if (p.model) {
    viewerInner =
      `<model-viewer src="${p.model}" poster="${p.poster}" alt="${p.title} 3D model"
         camera-controls auto-rotate touch-action="pan-y" shadow-intensity="0.65"
         exposure="${p.exposure != null ? p.exposure : 0.72}" tone-mapping="neutral" interaction-prompt="none"${
           p.cameraOrbit ? ` camera-orbit="${p.cameraOrbit}"` : ""
         }></model-viewer>
       <p class="m-viewer-cap">// Drag to orbit · scroll to zoom · GLB model</p>`;
  } else if (p.video) {
    viewerInner =
      `<video class="m-viewer-media" autoplay muted loop playsinline poster="${p.poster}">${videoSourceTags(
        p.video
      )}</video>`;
  } else {
    viewerInner = `<img class="m-viewer-media" src="${p.poster}" alt="${p.title}" />`;
  }

  // ABOUT column — the narrative: lead paragraph, then the write-up sections.
  const sections = (p.sections || [])
    .map(
      (s) =>
        `<div class="m-section"><h4>${s.title}</h4><p>${s.body}</p>${
          s.image ? `<img src="${s.image}" alt="${s.title}" loading="lazy" />` : ""
        }</div>`
    )
    .join("");

  modalContent.innerHTML = `
    <div class="m-head">
      <div class="m-cat">${p.category} · ${p.year}</div>
      <h2 class="m-title">${p.title}</h2>
      <p class="m-desc">${p.tagline}</p>
    </div>
    <div class="m-body">
      <aside class="m-col m-keypoints">
        <h3 class="m-col-label">Key points</h3>
        ${specs || ""}
        ${tags ? `<div class="m-tags">${tags}</div>` : ""}
      </aside>
      <div class="m-col m-viewer">${viewerInner}</div>
      <div class="m-col m-about">
        <h3 class="m-col-label">About the project</h3>
        <p class="m-about-lead">${p.hero}</p>
        ${sections}
      </div>
    </div>`;

  modalWindow.style.setProperty("--m-accent", p.accent);
  modalRoot.style.setProperty("--accent", p.accent);

  // Click feel: ONLY the clicked card dips (press-in), then the window grows
  // out of it — so that one card visually "becomes" the project window.
  if (App.recoilCard) App.recoilCard(typeof PROJECTS !== "undefined" ? PROJECTS.indexOf(p) : -1);
  setTimeout(() => {
    modalRoot.classList.add("open");
    modalRoot.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    modalWindow.scrollTop = 0;
    const about = modalContent.querySelector(".m-about");
    if (about) about.scrollTop = 0;
  }, 165); // let the card start dipping before the window emerges
}
function closeModal() {
  modalRoot.classList.remove("open");
  modalRoot.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  // as the window shrinks away, let ALL the cards settle back in smoothly
  const carousel = document.getElementById("carousel");
  if (carousel) {
    carousel.classList.remove("settle-in");
    void carousel.offsetWidth; // restart the settle animation
    carousel.classList.add("settle-in");
    setTimeout(() => carousel.classList.remove("settle-in"), 620);
  }
}
document.getElementById("modal-close").addEventListener("click", closeModal);
document.getElementById("modal-backdrop").addEventListener("click", closeModal);
window.addEventListener("keydown", (e) => e.key === "Escape" && closeModal());

/* ---- 5b. First-run guidance gesture ------------------------------------- */
/* Once the site settles after the intro, a minimalist pointer glides onto the
   front card and "clicks" it (press + ripple) to pop its window open; the
   window then closes smoothly, the cards rest at centre ~2s, and only then
   does the auto-cascade begin. Skipped for prefers-reduced-motion users. */
(function guidanceDemo() {
  const reduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return; // no demo; the carousel arms auto-scroll on its own

  App.demoWillRun = true; // tell the carousel to wait for us before auto-scrolling

  let timers = [], cursor = null, finished = false, started = false;
  const at = (ms, fn) => timers.push(setTimeout(fn, ms));

  function removeUserWatch() {
    window.removeEventListener("wheel", onUser);
    window.removeEventListener("pointerdown", onUser, true);
  }
  // arms auto-scroll `delay` ms from now; the carousel adds its own 1.5s dwell,
  // so `delay = 500` makes the cards rest ~2s at centre before the first move.
  function finishOnce(delay) {
    if (finished) return;
    finished = true;
    timers.forEach(clearTimeout); timers = [];
    if (cursor) { cursor.remove(); cursor = null; }
    removeUserWatch();
    App.demoRunning = false;
    if (App.startAuto) App.startAuto(delay);
  }
  function onUser() {
    // the viewer took over -> abort the demo cleanly
    if (finished) return;
    if (document.body.classList.contains("modal-open")) closeModal();
    finishOnce(500);
  }

  function run() {
    if (started || finished) return;
    started = true;
    App.demoRunning = true;
    if (App.holdAuto) App.holdAuto(); // freeze auto-scroll for the duration

    const card =
      document.querySelector(".card.is-front") || document.querySelector(".card");
    if (!card) return finishOnce(3000);
    const r = card.getBoundingClientRect();
    const tx = r.left + r.width / 2;      // aim at the card centre
    const ty = r.top + r.height * 0.52;

    cursor = document.createElement("div");
    cursor.className = "demo-cursor";
    cursor.setAttribute("aria-hidden", "true");
    cursor.innerHTML =
      '<svg viewBox="0 0 24 24" class="demo-cursor-arrow">' +
      '<path d="M5 2.5 L5 18.5 L9.4 14.3 L12.4 20.8 L15 19.6 L12 13.2 L18 13.2 Z"/></svg>' +
      '<span class="demo-cursor-ring"></span>';
    document.body.appendChild(cursor);

    // enter from just below-right of the card, then glide onto it
    const sx = tx + Math.min(170, r.width * 0.45);
    const sy = ty + Math.min(150, r.height * 0.7);
    cursor.style.transform = `translate(${sx}px, ${sy}px)`;

    window.addEventListener("wheel", onUser, { passive: true });
    window.addEventListener("pointerdown", onUser, true);

    at(60, () => {
      cursor.classList.add("show");
      cursor.style.transform = `translate(${tx}px, ${ty}px)`;
    });
    at(840, () => cursor && cursor.classList.add("click")); // press + ripple on the card
    at(990, () => {                                          // the click pops the window open
      if (finished) return;
      const i = App.getCard ? App.getCard() : 0;
      openModal(PROJECTS[i] || PROJECTS[0]);
      cursor && cursor.classList.add("fade");               // hide the pointer while the window is up
    });
    at(1240, () => cursor && cursor.classList.remove("click"));

    // travel back up to the close (×) button and click it to dismiss
    at(2150, () => {
      if (finished || !cursor) return;
      const close = document.getElementById("modal-close");
      const c = close && close.getBoundingClientRect();
      const cx = c ? c.left + c.width / 2 : tx;
      const cy = c ? c.top + c.height / 2 : ty;
      cursor.classList.remove("fade");
      cursor.classList.add("show");
      cursor.style.transform = `translate(${cx}px, ${cy}px)`;
    });
    at(2950, () => cursor && cursor.classList.add("click")); // press + ripple on the ×
    at(3090, () => {                                         // window disappears, cards settle back
      if (!finished) closeModal();
      cursor && cursor.classList.add("fade");
    });
    at(3420, () => cursor && cursor.classList.remove("click"));
    at(3700, () => finishOnce(500));                         // rest ~2s, then auto-cascade
  }

  window.addEventListener("intro:done", () => at(500, run));
})();

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
          <div class="tl-face tl-summary">
            <div class="tl-kind">${kind}</div>
            <h3 class="tl-title">${t.title}</h3>
            <p class="tl-org">${t.org}</p>
          </div>
          <div class="tl-face tl-note"><p>${t.note}</p></div>
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
  instagram:
    '<svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6.01 4.9.07 1.17.05 1.96.24 2.65.51.72.28 1.33.65 1.94 1.26.61.61.98 1.22 1.26 1.94.27.69.46 1.48.51 2.65.06 1.3.07 1.66.07 4.87s-.01 3.57-.07 4.87c-.05 1.17-.24 1.96-.51 2.65a5.35 5.35 0 0 1-1.26 1.94 5.35 5.35 0 0 1-1.94 1.26c-.69.27-1.48.46-2.65.51-1.3.06-1.66.07-4.9.07s-3.6-.01-4.9-.07c-1.17-.05-1.96-.24-2.65-.51a5.35 5.35 0 0 1-1.94-1.26 5.35 5.35 0 0 1-1.26-1.94c-.27-.69-.46-1.48-.51-2.65C2.21 15.57 2.2 15.21 2.2 12s.01-3.57.07-4.87c.05-1.17.24-1.96.51-2.65.28-.72.65-1.33 1.26-1.94A5.35 5.35 0 0 1 5.98 1.28c.69-.27 1.48-.46 2.65-.51C9.93 2.21 10.29 2.2 12 2.2Zm0 1.98c-3.15 0-3.52.01-4.76.07-1.15.05-1.77.24-2.19.4-.55.22-.94.47-1.35.88-.41.41-.66.8-.88 1.35-.16.42-.35 1.04-.4 2.19-.06 1.24-.07 1.61-.07 4.76s.01 3.52.07 4.76c.05 1.15.24 1.77.4 2.19.22.55.47.94.88 1.35.41.41.8.66 1.35.88.42.16 1.04.35 2.19.4 1.24.06 1.61.07 4.76.07s3.52-.01 4.76-.07c1.15-.05 1.77-.24 2.19-.4.55-.22.94-.47 1.35-.88.41-.41.66-.8.88-1.35.16-.42.35-1.04.4-2.19.06-1.24.07-1.61.07-4.76s-.01-3.52-.07-4.76c-.05-1.15-.24-1.77-.4-2.19-.22-.55-.47-.94-.88-1.35-.41-.41-.8-.66-1.35-.88-.42-.16-1.04-.35-2.19-.4-1.24-.06-1.61-.07-4.76-.07Zm0 3.37a5.05 5.05 0 1 1 0 10.1 5.05 5.05 0 0 1 0-10.1Zm0 8.33a3.28 3.28 0 1 0 0-6.56 3.28 3.28 0 0 0 0 6.56Zm6.43-8.55a1.18 1.18 0 1 1-2.36 0 1.18 1.18 0 0 1 2.36 0Z"/></svg>',
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
  // opens in the in-site résumé viewer (resumeViewer module); the href stays as
  // a no-JS fallback that just opens the PDF directly
  const resumeBtns = ABOUT.resumes
    .map(
      (r) =>
        `<a class="btn btn-primary" href="${r.href}" data-resume="${r.href}" data-label="${r.label}">▤ ${r.label}</a>`
    )
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

/* ---- 7b. Résumé viewer: opens the CV in an on-site window (matches the
   site's look) with a download button, instead of downloading straight away. */
(function resumeViewer() {
  const root = document.createElement("div");
  root.className = "rez-root";
  root.setAttribute("aria-hidden", "true");
  root.innerHTML = `
    <div class="rez-backdrop"></div>
    <div class="rez-window" role="dialog" aria-modal="true" aria-label="Résumé">
      <div class="rez-head">
        <div>
          <div class="rez-cat">Document</div>
          <h3 class="rez-title">Résumé</h3>
        </div>
        <div class="rez-actions">
          <a class="btn btn-primary rez-download" download>↓ Download</a>
          <button class="rez-close" aria-label="Close">&times;</button>
        </div>
      </div>
      <div class="rez-body"><iframe class="rez-frame" title="Résumé preview"></iframe></div>
    </div>`;
  document.body.appendChild(root);

  const frame = root.querySelector(".rez-frame");
  const dl = root.querySelector(".rez-download");
  const titleEl = root.querySelector(".rez-title");

  function open(href, label) {
    titleEl.textContent = label || "Résumé";
    dl.href = href;
    dl.setAttribute("download", href.split("/").pop());
    frame.src = href + "#view=FitH"; // let the browser's PDF viewer fit the width
    root.classList.add("open");
    root.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }
  function close() {
    root.classList.remove("open");
    root.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    setTimeout(() => { frame.src = "about:blank"; }, 400); // stop rendering once hidden
  }
  root.querySelector(".rez-close").addEventListener("click", close);
  root.querySelector(".rez-backdrop").addEventListener("click", close);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && root.classList.contains("open")) close();
  });

  // any résumé button in the About section opens the viewer
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-resume]");
    if (!btn) return;
    e.preventDefault();
    open(btn.getAttribute("data-resume"), btn.getAttribute("data-label"));
  });
})();

/* ---- 8. Timeline: wheel-scroll horizontally + custom minimal scrollbar --- */
(function timelineScroll() {
  const wrap = document.getElementById("timeline-wrap");
  const track = document.getElementById("tl-scroll");
  const thumb = document.getElementById("tl-thumb");
  if (!wrap || !track || !thumb) return;

  App.tlWrap = wrap; // the global journey handler (in the navigation module)
                      // drives horizontal scroll here and detects its edges

  // on touch, let the browser scroll this natively (finger drag / momentum);
  // the easing loop then just follows instead of fighting it
  wrap.addEventListener("touchstart", () => { App.tlNative = true; }, { passive: true });

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
    App.tlTarget = wrap.scrollLeft; // keep smooth-scroll target in sync with the drag
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
    App.tlTarget = wrap.scrollLeft;
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

  App.aboutPage = page; // the global journey handler detects its top edge here

  // on touch, hand vertical scrolling to the browser (finger drag / momentum)
  page.addEventListener("touchstart", () => { App.abNative = true; }, { passive: true });

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
    App.abTarget = page.scrollTop; // keep smooth-scroll target in sync with the drag
    update();
  });
  const stop = () => (dragging = false);
  thumb.addEventListener("pointerup", stop);
  thumb.addEventListener("pointercancel", stop);

  track.addEventListener("pointerdown", (e) => {
    if (e.target === thumb) return;
    const rect = track.getBoundingClientRect();
    page.scrollTop = ((e.clientY - rect.top) / rect.height) * maxScroll();
    App.abTarget = page.scrollTop;
    update();
  });

  // recompute when the About tab is opened (content height is then known)
  document
    .querySelectorAll('[data-nav="about"]')
    .forEach((b) => b.addEventListener("click", () => setTimeout(update, 60)));
  requestAnimationFrame(() => requestAnimationFrame(update));
  setTimeout(update, 400);
})();
