const orbStage = document.querySelector(".orb-stage");
const orbButton = document.querySelector(".orb-button");
const faceOrb = document.querySelector("#face-orb");
const orbStatus = document.querySelector("#orb-status");
const fullscreenButton = document.querySelector(".orb-fullscreen");
const quadrantCards = Array.from(document.querySelectorAll(".quadrant-card"));
let homeBackground = document.querySelector(".tfc-background, #home-background");

const ORB_MODES = ["thinking", "speaking", "warning", "listening"];
const FACE_STATES = new Set(["speaking", "listening", "thinking", "idle", "processing", "error", "offline"]);
const MODE_CLASS_PREFIX = "orb-mode-";
let activeOrbMode = "idle";
let touchCycleIndex = -1;
let heartbeatTimer = 0;
let heartbeatMissTimer = 0;
let lastFaceReady = 0;
let faceLoadStarted = false;
const cardHideTimers = new WeakMap();

const SUPPORTED_LANGUAGES = new Set(["en", "nl", "pl", "de", "es", "fr"]);
const ROUTE_MAP = {
  home: { slug: "" },
  technology: { slug: "technology" },
  projectile: { slug: "projectile" },
  journal: { slug: "journal" },
  notes: { slug: "notes" },
  updates: { slug: "updates" },
  roadmap: { slug: "roadmap" },
  articleGptNotEnough: { slug: "journal/why-gpt-is-not-enough-for-complex-engineering-organisations" },
  notFound: { slug: "404" },
  offline: { slug: "offline" },
};
const ROUTE_BY_SLUG = Object.fromEntries(Object.entries(ROUTE_MAP).map(([key, route]) => [route.slug, key]));
const LANGUAGE_LABELS = {
  en: { flag: "&#x1F1EC;&#x1F1E7;", name: "English" },
  nl: { flag: "&#x1F1F3;&#x1F1F1;", name: "Nederlands" },
  pl: { flag: "&#x1F1F5;&#x1F1F1;", name: "Polski" },
  de: { flag: "&#x1F1E9;&#x1F1EA;", name: "Deutsch" },
  es: { flag: "&#x1F1EA;&#x1F1F8;", name: "Español" },
  fr: { flag: "&#x1F1EB;&#x1F1F7;", name: "Français" },
};

function currentRouteLanguage() {
  const firstSegment = window.location.pathname.split("/").filter(Boolean)[0];
  return SUPPORTED_LANGUAGES.has(firstSegment) ? firstSegment : "";
}

function currentRouteSlug() {
  const segments = window.location.pathname.split("/").filter(Boolean);
  if (SUPPORTED_LANGUAGES.has(segments[0])) segments.shift();
  return segments.join("/");
}

function currentLogicalRoute() {
  return ROUTE_BY_SLUG[currentRouteSlug()] || "home";
}

function validTargetHash(slug) {
  const hash = window.location.hash;
  if (!hash || slug === "") return "";
  const target = document.getElementById(hash.slice(1));
  return target ? hash : "";
}

function languageHref(code) {
  const route = ROUTE_MAP[currentLogicalRoute()] || ROUTE_MAP.home;
  const slug = route.slug;
  const suffix = slug ? `${slug}/` : "";
  return `/${code}/${suffix}${validTargetHash(slug)}`;
}

function languageSwitcherMarkup(lang = "en", placement = "dynamic") {
  const id = `language-menu-${placement}-${lang}-${(currentRouteSlug() || "home").replaceAll("/", "-")}`;
  const links = Object.entries(LANGUAGE_LABELS)
    .map(([code, meta]) => {
      const selected = code === lang;
      return `<a role="option" aria-selected="${selected}" href="${languageHref(code)}" data-lang="${code}" lang="${code}"${selected ? ' aria-current="true"' : ""}><span class="language-flag" aria-hidden="true">${meta.flag}</span><span class="language-code">${code.toUpperCase()}</span><span class="language-name">${meta.name}</span></a>`;
    })
    .join("");
  return `<nav class="language-switcher" aria-label="Language" data-current-lang="${lang}"><button class="language-switcher-button" type="button" aria-haspopup="listbox" aria-expanded="false" aria-controls="${id}" aria-label="Open language menu"><span class="language-globe" aria-hidden="true">&#9678;</span><span class="language-button-label">Language</span><span class="language-current-code">${lang.toUpperCase()}</span><span class="language-arrow" aria-hidden="true">&#9662;</span></button><div class="language-switcher-menu" id="${id}" role="listbox" hidden>${links}</div></nav>`;
}

function ensureLanguageSwitcherPresence() {
  if (document.querySelector(".language-switcher")) return;
  const lang = currentRouteLanguage() || "en";
  const header = document.querySelector(".site-header, body > header.brand, .home-brand");
  if (header) header.insertAdjacentHTML("beforeend", languageSwitcherMarkup(lang, "header"));
  if (!document.querySelector(".site-language-footer")) {
    document.body.insertAdjacentHTML("beforeend", `<footer class="site-language-footer">${languageSwitcherMarkup(lang, "footer")}</footer>`);
  }
}

function initLanguageSwitcher() {
  ensureLanguageSwitcherPresence();
  document.querySelectorAll(".language-switcher").forEach((switcher) => {
    const button = switcher.querySelector(".language-switcher-button");
    const menu = switcher.querySelector(".language-switcher-menu");
    if (!button || !menu) return;

    const close = () => {
      button.setAttribute("aria-expanded", "false");
      menu.hidden = true;
    };

    const open = () => {
      button.setAttribute("aria-expanded", "true");
      menu.hidden = false;
      menu.querySelector('[aria-selected="true"]')?.focus();
    };

    button.addEventListener("click", (event) => {
      event.stopPropagation();
      if (button.getAttribute("aria-expanded") === "true") close();
      else open();
    });

    switcher.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        close();
        button.focus();
      }
    });

    document.addEventListener("pointerdown", (event) => {
      if (!switcher.contains(event.target)) close();
    });
  });

  document.querySelectorAll(".language-switcher a[data-lang]").forEach((link) => {
    link.addEventListener("click", () => {
      try {
        window.localStorage.setItem("tfc-language", link.dataset.lang || "en");
      } catch {
        // Language selection still works as a normal link if storage is unavailable.
      }
    });
  });

  if (currentRouteLanguage()) return;
  const agent = navigator.userAgent || "";
  if (/bot|crawler|spider|crawling/i.test(agent)) return;

  let preferred = "";
  try {
    preferred = window.localStorage.getItem("tfc-language") || "";
  } catch {
    preferred = "";
  }

  if (!preferred) {
    preferred = (navigator.language || "").slice(0, 2).toLowerCase();
  }

  if (preferred && preferred !== "en" && SUPPORTED_LANGUAGES.has(preferred)) {
    const matching = document.querySelector(`.language-switcher a[data-lang="${preferred}"]`);
    if (matching?.href) window.location.replace(matching.href);
  }
}

initLanguageSwitcher();

function scrollToHomeProjectile() {
  const target = document.querySelector("#projectile");
  if (!target) return false;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  if (window.history?.replaceState) {
    window.history.replaceState(null, "", "#projectile");
  }
  return true;
}

function initHomeBackground() {
  if (!homeBackground) {
    homeBackground = document.createElement("canvas");
    homeBackground.className = "tfc-background";
    homeBackground.setAttribute("aria-hidden", "true");
    document.body.prepend(homeBackground);
  }
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const coarsePointer = window.matchMedia?.("(pointer: coarse)")?.matches;
  const compactViewport = window.matchMedia?.("(max-width: 899px)")?.matches;
  const lowPower = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;

  const canvas = homeBackground;
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return;

  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let animationFrame = 0;
  let tick = 0;
  let simplified = false;
  const rings = [
    { x: 0.68, y: 0.22, r: 150, speed: 0.35, phase: 0.2 },
    { x: 0.17, y: 0.78, r: 190, speed: -0.22, phase: 1.6 },
    { x: 0.58, y: 0.62, r: 260, speed: 0.16, phase: 2.8 },
  ];

  function resize() {
    pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;
    simplified = coarsePointer || compactViewport || lowPower;
    canvas.width = Math.floor(width * pixelRatio);
    canvas.height = Math.floor(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    }

  function drawGrid(time) {
    const spacing = simplified ? 68 : 56;
    const drift = reducedMotion ? 0 : Math.sin(time * 0.32) * 6;
    context.lineWidth = 1;
    context.strokeStyle = "rgba(126, 255, 0, 0.055)";

    for (let x = -spacing; x < width + spacing; x += spacing) {
      const offset = Math.sin(time * 0.55 + x * 0.01) * (simplified ? 1.5 : 4);
      context.beginPath();
      context.moveTo(x + drift, 0);
      context.lineTo(x + offset, height);
      context.stroke();
    }

    context.strokeStyle = "rgba(126, 255, 0, 0.04)";
    for (let y = -spacing; y < height + spacing; y += spacing) {
      const offset = Math.cos(time * 0.44 + y * 0.012) * (simplified ? 1.5 : 4);
      context.beginPath();
      context.moveTo(0, y + offset);
      context.lineTo(width, y + drift);
      context.stroke();
    }
  }

  function drawShaderPlane(centerX, centerY, radiusX, radiusY, time, phase) {
    const gradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(radiusX, radiusY));
    gradient.addColorStop(0, "rgba(126, 255, 0, 0.13)");
    gradient.addColorStop(0.42, "rgba(25, 255, 119, 0.052)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    context.fillStyle = gradient;
    context.beginPath();
    context.ellipse(centerX, centerY, radiusX, radiusY, Math.sin(time * 0.22 + phase) * 0.18, 0, Math.PI * 2);
    context.fill();

    const lines = simplified ? 5 : 9;
    for (let index = 0; index < lines; index += 1) {
      const progress = (index + 1) / (lines + 1);
      const wave = Math.sin(time * 1.1 + phase + progress * 6.28);
      const y = centerY - radiusY * 0.55 + progress * radiusY * 1.1 + wave * 16;
      const alpha = (1 - Math.abs(progress - 0.5) * 1.6) * 0.12;
      if (alpha <= 0) continue;
      context.strokeStyle = `rgba(126, 255, 0, ${alpha})`;
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(centerX - radiusX * 0.62, y);
      context.bezierCurveTo(
        centerX - radiusX * 0.15,
        y + wave * 26,
        centerX + radiusX * 0.22,
        y - wave * 18,
        centerX + radiusX * 0.62,
        y + Math.cos(time + phase + index) * 12,
      );
      context.stroke();
    }
  }

  function drawEnergyRing(ring, time, index) {
    const centerX = ring.x * width;
    const centerY = ring.y * height;
    const baseRadius = Math.min(width, height) * (ring.r / 900);
    const pulse = Math.sin(time * 2.1 + ring.phase) * 0.18 + 0.82;
    const radius = baseRadius * pulse;
    const start = time * ring.speed + ring.phase;
    const arcs = simplified ? 2 : 4;

    for (let segment = 0; segment < arcs; segment += 1) {
      const segmentStart = start + segment * (Math.PI * 2 / arcs);
      const segmentEnd = segmentStart + Math.PI * (simplified ? 0.38 : 0.54);
      const alpha = simplified ? 0.12 : 0.17;
      context.strokeStyle = `rgba(126, 255, 0, ${alpha})`;
      context.lineWidth = segment % 2 === 0 ? 1.4 : 0.85;
      context.beginPath();
      context.arc(centerX, centerY, radius + segment * 11, segmentStart, segmentEnd);
      context.stroke();
    }

    const core = context.createRadialGradient(centerX, centerY, radius * 0.25, centerX, centerY, radius * 1.5);
    core.addColorStop(0, "rgba(247, 255, 249, 0.026)");
    core.addColorStop(0.45, `rgba(126, 255, 0, ${simplified ? 0.025 : 0.04})`);
    core.addColorStop(1, "rgba(0, 0, 0, 0)");
    context.fillStyle = core;
    context.beginPath();
    context.arc(centerX, centerY, radius * 1.5 + index * 12, 0, Math.PI * 2);
    context.fill();
  }

  function drawPoints(time) {
    const count = simplified ? 26 : 54;
    for (let index = 0; index < count; index += 1) {
      const seedX = ((index * 97) % 1000) / 1000;
      const seedY = ((index * 163) % 1000) / 1000;
      const x = seedX * width + Math.sin(time * 0.25 + index) * 10;
      const y = seedY * height + Math.cos(time * 0.2 + index * 0.7) * 8;
      const radius = index % 8 === 0 ? 1.45 : 0.85;
      const alpha = 0.32 + Math.sin(time * 1.8 + index) * 0.12;
      context.fillStyle = `rgba(126, 255, 0, ${alpha})`;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    }
  }

  function draw() {
    context.clearRect(0, 0, width, height);
    const time = reducedMotion ? 0 : tick;
    tick += simplified ? 0.006 : 0.01;

    drawGrid(time);
    drawShaderPlane(width * 0.78, height * 0.24, width * 0.34, height * 0.32, time, 0.2);
    drawShaderPlane(width * 0.2, height * 0.84, width * 0.28, height * 0.26, time, 1.8);
    if (!simplified) {
      drawShaderPlane(width * 0.5, height * 0.54, width * 0.4, height * 0.28, time, 3.1);
    }
    rings.slice(0, simplified ? 2 : rings.length).forEach((ring, index) => drawEnergyRing(ring, time, index));
    drawPoints(time);

    if (!reducedMotion) {
      animationFrame = window.requestAnimationFrame(draw);
    }
  }

  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.cancelAnimationFrame(animationFrame);
      return;
    }
    animationFrame = window.requestAnimationFrame(draw);
  });

  resize();
  draw();

  window.addEventListener("pagehide", () => {
    window.cancelAnimationFrame(animationFrame);
  }, { once: true });
}

function scheduleHomeBackground() {
  const run = () => initHomeBackground();
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(run, { timeout: 1600 });
    return;
  }
  window.addEventListener("load", run, { once: true });
}

scheduleHomeBackground();

function setOrbStatus(status, message) {
  if (!orbStage || !orbButton) return;
  orbStage.dataset.faceStatus = status;
  orbButton.classList.toggle("face-loading", status === "loading");
  orbButton.classList.toggle("face-offline", status === "offline");
  orbButton.classList.toggle("face-error", status === "error");
  if (orbStatus) orbStatus.textContent = message || status;
}

function markFaceReady() {
  if (!orbButton) return;
  orbButton.classList.add("face-ready");
  orbButton.classList.remove("face-failed");
  lastFaceReady = Date.now();
  setOrbStatus("ready", "Orb ready");
  sendFaceMode(activeOrbMode);
}

function markFaceFailed() {
  if (!orbButton) return;
  if (!orbButton.classList.contains("face-ready")) {
    orbButton.classList.add("face-failed");
    setOrbStatus("error", "Orb unavailable");
  }
}

function detectFaceCanvas() {
  if (!faceOrb) return false;
  try {
    const faceDocument = faceOrb.contentDocument || faceOrb.contentWindow.document;
    if (faceDocument && faceDocument.querySelector("#orb-canvas")) {
      markFaceReady();
      return true;
    }
  } catch (error) {
    markFaceFailed();
  }

  return false;
}

function sendFaceMode(mode) {
  if (!faceOrb?.contentWindow) {
    return;
  }

  const normalized = FACE_STATES.has(mode) ? mode : mode === "warning" ? "error" : "idle";
  try {
    faceOrb.contentWindow.postMessage(
      {
        type: "blacksmith-face-state",
        state: normalized || "idle",
        theme: "dark",
        source: "projectile-teaser",
      },
      window.location.origin
    );
  } catch (error) {
    // The fallback orb handles standalone/static previews where /face is unavailable.
  }
}

function loadFaceOrb() {
  if (!faceOrb || faceLoadStarted) return;
  const source = faceOrb.dataset.src;
  if (!source) return;
  faceLoadStarted = true;
  setOrbStatus("loading", "Loading orb");
  faceOrb.src = source;
}

function scheduleFaceOrbLoad() {
  if (!faceOrb) return;
  const run = () => window.setTimeout(loadFaceOrb, 900);
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(run, { timeout: 1800 });
    return;
  }
  window.addEventListener("load", run, { once: true });
}

function setActiveOrbMode(mode) {
  const nextMode = ORB_MODES.includes(mode) ? mode : "idle";
  if (nextMode === activeOrbMode) {
    return;
  }

  activeOrbMode = nextMode;
  orbStage.dataset.orbMode = nextMode;
  orbButton.setAttribute("aria-expanded", nextMode === "idle" ? "false" : "true");

  ["idle", ...ORB_MODES].forEach((name) => {
    orbStage.classList.toggle(`${MODE_CLASS_PREFIX}${name}`, nextMode === name);
  });

  quadrantCards.forEach((card) => {
    const isActive = card.dataset.sector === nextMode;
    window.clearTimeout(cardHideTimers.get(card));

    if (isActive) {
      card.hidden = false;
      requestAnimationFrame(() => card.classList.add("is-active"));
      return;
    }

    card.classList.remove("is-active");
    cardHideTimers.set(
      card,
      window.setTimeout(() => {
        if (!card.classList.contains("is-active")) {
          card.hidden = true;
        }
      }, 220)
    );
  });

  sendFaceMode(nextMode);
}

function sendFaceHeartbeat() {
  if (!faceOrb?.contentWindow) return;
  try {
    faceOrb.contentWindow.postMessage({ type: "projectile-face-heartbeat", source: "projectile-teaser", at: Date.now() }, window.location.origin);
  } catch {
    setOrbStatus("offline", "Orb offline");
  }
}

function startHeartbeat() {
  window.clearInterval(heartbeatTimer);
  window.clearTimeout(heartbeatMissTimer);
  heartbeatTimer = window.setInterval(sendFaceHeartbeat, 3000);
  heartbeatMissTimer = window.setInterval(() => {
    if (lastFaceReady && Date.now() - lastFaceReady > 12000) {
      setOrbStatus("offline", "Orb reconnecting");
      sendFaceMode("offline");
    }
  }, 4000);
}

function quadrantFromPoint(clientX, clientY) {
  const rect = orbButton.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const x = clientX - centerX;
  const y = clientY - centerY;
  const distance = Math.hypot(x, y);
  const radius = Math.min(rect.width, rect.height) * 0.48;

  if (distance > radius) {
    return "idle";
  }

  if (x < 0 && y < 0) return "thinking";
  if (x >= 0 && y < 0) return "speaking";
  if (x >= 0 && y >= 0) return "warning";
  return "listening";
}

function cycleOrbMode(direction = 1) {
  touchCycleIndex = (touchCycleIndex + direction + ORB_MODES.length) % ORB_MODES.length;
  setActiveOrbMode(ORB_MODES[touchCycleIndex]);
}

function resetOrbMode() {
  touchCycleIndex = -1;
  setActiveOrbMode("idle");
}

function isTouchLike(event) {
  return event.pointerType === "touch" || window.matchMedia?.("(hover: none)")?.matches;
}

if (faceOrb && orbButton) {
  setOrbStatus("idle", "Orb ready");
  faceOrb.addEventListener("load", () => {
    if (detectFaceCanvas()) {
      startHeartbeat();
      return;
    }

    window.setTimeout(detectFaceCanvas, 350);
    window.setTimeout(markFaceFailed, 1400);
  });

  window.addEventListener("load", () => {
    if (!faceLoadStarted) setOrbStatus("idle", "Orb ready");
  }, { once: true });
}

window.addEventListener("message", (event) => {
  const payload = event.data || {};
  if (!payload || typeof payload !== "object") return;
  if (payload.type === "projectile-face-ready" || payload.type === "projectile-face-heartbeat-ack") {
    markFaceReady();
  }
  if (payload.type === "projectile-face-error") {
    setOrbStatus("error", "Orb error");
  }
});

window.addEventListener("online", () => {
  if (!faceOrb) return;
  setOrbStatus("loading", "Reconnecting orb");
  if (faceLoadStarted) faceOrb.contentWindow?.location.reload();
  else loadFaceOrb();
});

window.addEventListener("offline", () => {
  setOrbStatus("offline", "Offline");
  sendFaceMode("offline");
});

window.addEventListener("resize", () => sendFaceMode(activeOrbMode));

orbButton?.addEventListener("pointermove", (event) => {
  if (isTouchLike(event)) {
    return;
  }

  loadFaceOrb();
  setActiveOrbMode(quadrantFromPoint(event.clientX, event.clientY));
});

orbButton?.addEventListener("pointerleave", (event) => {
  if (!isTouchLike(event)) {
    resetOrbMode();
  }
});

orbButton?.addEventListener("pointerdown", (event) => {
  if (orbButton.dataset.homeProjectileOrb !== undefined && !isTouchLike(event)) {
    scrollToHomeProjectile();
    return;
  }

  if (!isTouchLike(event)) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  loadFaceOrb();
  cycleOrbMode(1);
});

document.addEventListener("pointerdown", (event) => {
  if (!window.matchMedia?.("(hover: none)")?.matches) {
    return;
  }

  if (orbStage && !orbStage.contains(event.target)) {
    resetOrbMode();
  }
});

orbButton?.addEventListener("keydown", (event) => {
  loadFaceOrb();
  if (event.key === "Escape") {
    resetOrbMode();
    return;
  }

  if (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === " ") {
    event.preventDefault();
    cycleOrbMode(1);
    return;
  }

  if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    event.preventDefault();
    cycleOrbMode(-1);
  }
});

orbButton?.addEventListener("blur", resetOrbMode);

document.querySelectorAll("[data-projectile-home-link]").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (scrollToHomeProjectile()) {
      event.preventDefault();
    }
  });
});

fullscreenButton?.addEventListener("click", async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await orbStage.requestFullscreen();
  } catch {
    setOrbStatus("error", "Fullscreen unavailable");
  }
});

document.querySelector("#newsletterForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = event.target.email?.value || "";
  const message = document.querySelector("#newsletterMessage");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    if (message) message.textContent = "Enter a valid email address.";
    return;
  }
  if (message) message.textContent = "Newsletter functionality coming soon.";
});

const searchInput = document.querySelector("#journalSearch");
const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
function filterArticles() {
  const query = (searchInput?.value || "").toLowerCase();
  const active = filterButtons.find((button) => button.classList.contains("active"))?.dataset.filter || "all";
  document.querySelectorAll(".article-card").forEach((card) => {
    const haystack = `${card.textContent || ""} ${card.dataset.tags || ""}`.toLowerCase();
    const categoryMatch = active === "all" || card.dataset.category === active;
    card.hidden = !(categoryMatch && haystack.includes(query));
  });
}
searchInput?.addEventListener("input", filterArticles);
filterButtons.forEach((button) => button.addEventListener("click", () => {
  filterButtons.forEach((item) => item.classList.toggle("active", item === button));
  filterArticles();
}));

if ("serviceWorker" in navigator && window.location.protocol !== "file:") {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}
