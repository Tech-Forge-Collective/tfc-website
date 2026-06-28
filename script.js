const orbStage = document.querySelector(".orb-stage");
const orbButton = document.querySelector(".orb-button");
const faceOrb = document.querySelector("#face-orb");
const orbStatus = document.querySelector("#orb-status");
const fullscreenButton = document.querySelector(".orb-fullscreen");
const quadrantCards = Array.from(document.querySelectorAll(".quadrant-card"));

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
  setOrbStatus("loading", "Loading orb");
  faceOrb.addEventListener("load", () => {
    if (detectFaceCanvas()) {
      startHeartbeat();
      return;
    }

    window.setTimeout(detectFaceCanvas, 350);
    window.setTimeout(markFaceFailed, 1400);
  });

  window.setTimeout(markFaceFailed, 2600);
  scheduleFaceOrbLoad();
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
