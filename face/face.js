import { FaceApp } from "./src/face/FaceApp.js";
import { FaceStateController } from "./src/face/FaceStateController.js";
import { StudioPanel } from "./src/studio/StudioPanel.js";
import { PresetManager } from "./src/studio/PresetManager.js";

const ORB_STATES = new Set(["idle", "listening", "thinking", "speaking", "processing", "success", "error", "sleeping", "wake", "mission", "warning", "offline", "estop"]);
const ACTION_MAP = new Map([
  ["time", "time"],
  ["calendar", "calendar"],
  ["weather", "weather"],
  ["objective", "objective"],
  ["random-emotion", "random-emotion"],
  ["knowledge-summary", "knowledge-summary"],
]);

const stage = document.getElementById("orb-stage");
const orbButton = document.getElementById("orb-button");
const canvas = document.getElementById("orb-canvas");
const actions = document.getElementById("orb-actions");
const urlParams = new URLSearchParams(window.location.search);
const embeddedMode = urlParams.get("embed") === "1";
let faceSocket = null;
let reconnectTimer = null;
let actionInFlight = "";
let menuTimer = null;
let actionAnimations = [];
let controller = null;
let studio = null;

const prefersReducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

function animeAnimate(targets, params) {
  const api = window.anime;
  if (!api || document.hidden || prefersReducedMotion()) return null;
  if (typeof api.animate === "function") return api.animate(targets, params);
  if (typeof api === "function") return api({ targets, ...params });
  return null;
}

function stopActionAnimations() {
  actionAnimations.forEach((animation) => {
    try {
      animation.pause?.();
      animation.cancel?.();
    } catch {
      // Best-effort cleanup.
    }
  });
  actionAnimations = [];
}

function showActions(open) {
  window.clearTimeout(menuTimer);
  actions.classList.toggle("open", open);
  actions.setAttribute("aria-hidden", open ? "false" : "true");
  stopActionAnimations();
  const buttons = actions.querySelectorAll("button");
  const wrap = document.querySelector(".orb-canvas-wrap");
  actionAnimations.push(animeAnimate(wrap, {
    scaleX: open ? [1, 0.94] : [0.94, 1],
    duration: 420,
    ease: "outCubic",
  }));
  actionAnimations.push(animeAnimate(buttons, {
    opacity: open ? [0, 1] : [1, 0],
    scale: open ? [0.62, 1] : [1, 0.62],
    translateX: (_, index) => {
      const side = index < 3 ? -1 : 1;
      return open ? [side * -24, 0] : [0, side * -18];
    },
    duration: 360,
    delay: (_, index) => index * 38,
    ease: "outBack(1.8)",
  }));
  if (open) menuTimer = window.setTimeout(() => showActions(false), 6000);
}

function applyState(payload = {}) {
  const requestedState = String(payload.state || "idle").toLowerCase();
  const state = controller?.normalize(requestedState) || "idle";
  const visualState = ORB_STATES.has(requestedState) ? requestedState : state;
  if (actionInFlight && state === "idle") return;
  const speechLevel = Number(payload.speech_level ?? payload.speechLevel ?? payload.level ?? 0);
  const applied = controller?.setLiveState(state, speechLevel) ?? true;
  if (!applied) return;
  ORB_STATES.forEach((name) => stage.classList.toggle(`state-${name}`, visualState === name));
  stage.dataset.state = visualState;
}

function syncStageState(state) {
  ORB_STATES.forEach((name) => stage.classList.toggle(`state-${name}`, state === name));
  stage.dataset.state = state;
}

function faceSocketUrl() {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/ws/face`;
}

function connectRobotFace() {
  if (!window.WebSocket) return;
  try {
    faceSocket = new WebSocket(faceSocketUrl());
  } catch {
    scheduleReconnect();
    return;
  }
  faceSocket.onopen = () => applyState({ state: "idle" });
  faceSocket.onmessage = (event) => {
    try {
      applyState(JSON.parse(event.data));
    } catch {
      applyState({ state: "sleeping" });
    }
  };
  faceSocket.onclose = () => {
    applyState({ state: "sleeping" });
    scheduleReconnect();
  };
  faceSocket.onerror = () => {
    try {
      faceSocket.close();
    } catch {
      // Ignore close failures during reconnect.
    }
  };
}

function scheduleReconnect() {
  if (reconnectTimer) return;
  reconnectTimer = window.setTimeout(() => {
    reconnectTimer = null;
    connectRobotFace();
  }, 2000);
}

function runFaceAction(action) {
  const endpointAction = ACTION_MAP.get(action);
  if (!endpointAction || actionInFlight) return;
  actionInFlight = endpointAction;
  showActions(false);
  applyState({ state: "thinking" });
  fetch(`/api/face/action/${endpointAction}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  })
    .then((response) => response.json().catch(() => ({ ok: false })))
    .then((payload) => {
      actionInFlight = "";
      if (!payload || payload.ok === false) applyState({ state: "error" });
      else if (payload.face) applyState(payload.face);
      else applyState({ state: "idle" });
    })
    .catch(() => {
      actionInFlight = "";
      applyState({ state: "error" });
    });
}

function studioEnabled() {
  return urlParams.get("studio") === "1" || localStorage.getItem("t1.faceStudio.enabled") === "1";
}

async function bootFaceApp() {
  document.documentElement.classList.toggle("face-embedded", embeddedMode);
  const presetManager = new PresetManager();
  const config = await presetManager.loadProductionConfig();
  controller = new FaceStateController(config);
  controller.addEventListener("change", (event) => syncStageState(event.detail.state));
  try {
    new FaceApp(canvas, controller);
    stage.classList.remove("no-webgl");
  } catch {
    stage.classList.add("no-webgl");
  }

  if (!embeddedMode) {
    const studioButton = document.createElement("button");
    studioButton.type = "button";
    studioButton.className = "studio-open-button";
    studioButton.textContent = "Studio";
    studioButton.addEventListener("click", () => {
      if (!studio) studio = new StudioPanel({ controller, presetManager });
      studio.show();
    });
    document.body.appendChild(studioButton);
    if (studioEnabled()) studioButton.click();
  }

  applyState({ state: config.activeState || "idle" });
  if (!embeddedMode) connectRobotFace();
}

window.addEventListener("message", (event) => {
  const payload = event.data || {};
  if (payload.type === "projectile-face-heartbeat") {
    window.parent?.postMessage({ type: "projectile-face-heartbeat-ack", at: Date.now() }, "*");
    return;
  }
  if (payload.type !== "blacksmith-face-state") return;
  if (event.source !== window.parent && event.source !== window.opener) return;
  applyState(payload);
});

if (!embeddedMode) {
  orbButton.addEventListener("click", () => showActions(!actions.classList.contains("open")));
}

actions.querySelectorAll("button[data-action]").forEach((button) => {
  button.addEventListener("click", (event) => {
    if (embeddedMode) return;
    event.stopPropagation();
    runFaceAction(button.dataset.action);
  });
});

document.addEventListener("pointerdown", () => navigator.wakeLock?.request("screen").catch(() => {}), { once: true });
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopActionAnimations();
});

bootFaceApp();
window.parent?.postMessage({ type: "projectile-face-ready", at: Date.now() }, "*");
