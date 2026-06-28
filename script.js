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
  about: { slug: "about" },
  contact: { slug: "contact" },
  products: { slug: "products" },
  technology: { slug: "technology" },
  projectile: { slug: "projectile" },
  journal: { slug: "journal" },
  notes: { slug: "notes" },
  updates: { slug: "updates" },
  roadmap: { slug: "roadmap" },
  privacy: { slug: "privacy" },
  terms: { slug: "terms" },
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
  return ROUTE_BY_SLUG[currentRouteSlug()] || "notFound";
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
  return `<nav class="language-switcher" aria-label="Language" data-current-lang="${lang}"><button class="language-switcher-button" type="button" aria-haspopup="listbox" aria-expanded="false" aria-controls="${id}" aria-label="Open language menu"><span class="language-current-code">${lang.toUpperCase()}</span></button><div class="language-switcher-menu" id="${id}" role="listbox" hidden>${links}</div></nav>`;
}

function ensureLanguageSwitcherPresence() {
  if (document.querySelector(".language-switcher")) return;
  const lang = currentRouteLanguage() || "en";
  const header = document.querySelector(".site-header, body > header.brand, .home-brand");
  if (header) header.insertAdjacentHTML("beforeend", languageSwitcherMarkup(lang, "header"));
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

function initResponsiveNavigation() {
  const navs = Array.from(document.querySelectorAll(".home-nav, .site-nav"));
  navs.forEach((nav, index) => {
    if (nav.dataset.responsiveNavReady === "true") return;
    nav.dataset.responsiveNavReady = "true";
    const id = nav.id || `site-navigation-${index + 1}`;
    nav.id = id;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "site-menu-toggle";
    button.setAttribute("aria-controls", id);
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "Open menu");
    button.innerHTML = '<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>';
    nav.parentElement?.insertBefore(button, nav);

    function close() {
      nav.dataset.menuOpen = "false";
      button.setAttribute("aria-expanded", "false");
    }

    button.addEventListener("click", () => {
      const open = nav.dataset.menuOpen === "true";
      document.querySelectorAll(".home-nav[data-menu-open='true'], .site-nav[data-menu-open='true']").forEach((openNav) => {
        if (openNav !== nav) openNav.dataset.menuOpen = "false";
      });
      document.querySelectorAll(".site-menu-toggle[aria-expanded='true']").forEach((toggle) => {
        if (toggle !== button) toggle.setAttribute("aria-expanded", "false");
      });
      nav.dataset.menuOpen = open ? "false" : "true";
      button.setAttribute("aria-expanded", open ? "false" : "true");
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) close();
    });
    document.addEventListener("click", (event) => {
      if (!nav.contains(event.target) && event.target !== button) close();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
  });
}

initResponsiveNavigation();

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
  if (currentLogicalRoute() !== "home") {
    homeBackground?.remove();
    homeBackground = null;
    return;
  }

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
  let simplified = false;
  const startedAt = performance.now();
  const pointer = {
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
    active: false,
  };
  const connectionTrails = new Map();
  const nodeCount = simplified ? 34 : 58;
  const particleCount = simplified ? 86 : 144;
  const nodes = Array.from({ length: nodeCount }, (_, index) => ({
    seed: index * 127.13,
    x: Math.sin(index * 14.91) * 0.5 + 0.5,
    y: Math.cos(index * 9.37) * 0.5 + 0.5,
    vx: 0,
    vy: 0,
  }));
  const particles = Array.from({ length: particleCount }, (_, index) => ({
    seed: index * 91.77,
    x: Math.sin(index * 17.61) * 0.5 + 0.5,
    y: Math.cos(index * 11.83) * 0.5 + 0.5,
    size: 0.7 + (index % 5) * 0.22,
  }));

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

  function drawStaticGlow() {
    context.fillStyle = "#000";
    context.fillRect(0, 0, width, height);
    const rightGlow = context.createRadialGradient(width * 0.5, height * 0.45, 0, width * 0.5, height * 0.45, Math.max(width, height) * 0.62);
    rightGlow.addColorStop(0, "rgba(126, 255, 0, 0.145)");
    rightGlow.addColorStop(0.32, "rgba(20, 88, 0, 0.105)");
    rightGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
    context.fillStyle = rightGlow;
    context.fillRect(0, 0, width, height);
  }

  function drawNodeField(time) {
    context.save();
    context.globalCompositeOperation = "screen";
    pointer.x += (pointer.tx - pointer.x) * 0.08;
    pointer.y += (pointer.ty - pointer.y) * 0.08;

    const activeNodes = simplified ? nodes.slice(0, 34) : nodes;
    const positions = activeNodes.map((node, index) => {
      const baseX = node.x * width;
      const baseY = node.y * height;
      const driftX = Math.sin(time * 0.16 + index * 1.7) * 10;
      const driftY = Math.cos(time * 0.13 + index * 1.31) * 10;
      let x = baseX + driftX;
      let y = baseY + driftY;

      if (pointer.active && !simplified) {
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const distance = Math.max(1, Math.hypot(dx, dy));
        const radius = Math.min(width, height) * 0.34;
        if (distance < radius) {
          const force = (1 - distance / radius) ** 2;
          x += (dx / distance) * force * 38;
          y += (dy / distance) * force * 38;
        }
      }

      return { x, y };
    });

    if (pointer.active && !simplified) {
      const nearby = positions
        .map((point, index) => ({ ...point, index, distance: Math.hypot(point.x - pointer.x, point.y - pointer.y) }))
        .filter((point) => point.distance < 210)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 7);
      for (let index = 0; index < nearby.length; index += 1) {
        for (let next = index + 1; next < nearby.length; next += 1) {
          const a = nearby[index];
          const b = nearby[next];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance > 260) continue;
          const key = `${Math.min(a.index, b.index)}:${Math.max(a.index, b.index)}`;
          connectionTrails.set(key, {
            from: a.index,
            to: b.index,
            life: 1,
            strength: Math.max(0.16, 1 - (a.distance + b.distance) / 420),
          });
        }
      }
    }

    for (let index = 0; index < positions.length; index += 1) {
      const a = positions[index];
      for (let next = index + 1; next < positions.length; next += 1) {
        const b = positions[next];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance > width * 0.14) continue;
        const pointerBoost = pointer.active
          ? Math.max(0, 1 - Math.min(Math.hypot((a.x + b.x) * 0.5 - pointer.x, (a.y + b.y) * 0.5 - pointer.y) / 260, 1)) * 0.08
          : 0;
        const alpha = Math.max(0, 0.13 - distance / width * 0.55) + pointerBoost;
        context.strokeStyle = `rgba(126, 255, 0, ${alpha})`;
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(a.x, a.y);
        context.lineTo(b.x, b.y);
        context.stroke();
      }
    }

    for (const [key, trail] of connectionTrails) {
      const a = positions[trail.from];
      const b = positions[trail.to];
      if (!a || !b) {
        connectionTrails.delete(key);
        continue;
      }
      const alpha = trail.life * trail.strength * 0.34;
      context.strokeStyle = `rgba(126, 255, 0, ${alpha})`;
      context.lineWidth = 1.15 + trail.life * 0.65;
      context.beginPath();
      context.moveTo(a.x, a.y);
      context.lineTo(b.x, b.y);
      context.stroke();
      trail.life -= reducedMotion ? 1 : 0.012;
      if (trail.life <= 0) connectionTrails.delete(key);
    }

    for (let index = 0; index < positions.length; index += 1) {
      const point = positions[index];
      const pointerDistance = pointer.active ? Math.hypot(point.x - pointer.x, point.y - pointer.y) : 9999;
      const boost = Math.max(0, 1 - pointerDistance / 230);
      context.fillStyle = `rgba(126, 255, 0, ${0.4 + boost * 0.38})`;
      context.beginPath();
      context.arc(point.x, point.y, 1.2 + boost * 1.8, 0, Math.PI * 2);
      context.fill();
    }
    context.restore();
  }

  function drawParticles(time) {
    context.save();
    context.globalCompositeOperation = "screen";
    const activeParticles = simplified ? particles.slice(0, 76) : particles;
    for (let index = 0; index < activeParticles.length; index += 1) {
      const particle = activeParticles[index];
      let x = ((particle.x * width) + Math.sin(time * 0.22 + particle.seed) * 18 + width) % width;
      let y = ((particle.y * height) + Math.cos(time * 0.18 + particle.seed) * 16 + height) % height;
      const pulse = 0.36 + Math.abs(Math.sin(time * 0.72 + particle.seed)) * 0.64;
      let alpha = (simplified ? 0.19 : 0.32) + pulse * (simplified ? 0.16 : 0.25);

      if (pointer.active && !simplified) {
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const distance = Math.max(1, Math.hypot(dx, dy));
        const radius = 230;
        if (distance < radius) {
          const force = (1 - distance / radius);
          x += (dx / distance) * force * 42;
          y += (dy / distance) * force * 42;
          alpha += force * 0.35;
        }
      }

      context.fillStyle = `rgba(126, 255, 0, ${alpha})`;
      context.beginPath();
      context.arc(x, y, particle.size + pulse * 0.9, 0, Math.PI * 2);
      context.fill();
    }
    context.restore();
  }

  function draw() {
    const time = reducedMotion ? 0 : (performance.now() - startedAt) / 1000;
    drawStaticGlow();
    drawNodeField(time);
    drawParticles(time);

    if (!reducedMotion) {
      animationFrame = window.requestAnimationFrame(draw);
    }
  }

  window.addEventListener("pointermove", (event) => {
    pointer.tx = event.clientX;
    pointer.ty = event.clientY;
    pointer.active = true;
  }, { passive: true });
  window.addEventListener("pointerleave", () => {
    pointer.active = false;
  }, { passive: true });
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
