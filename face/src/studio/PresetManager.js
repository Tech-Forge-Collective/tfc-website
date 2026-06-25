import { createDefaultFacePresets, FACE_STATES } from "../config/defaultFacePresets.js";

const LOCAL_KEY = "t1.faceStudio.productionConfig";
const PRESET_KEY = "t1.faceStudio.presets";
const PRODUCTION_URL = "./config/face-presets.json";

export class PresetManager {
  async loadProductionConfig() {
    const local = this.loadLocalProduction();
    if (local) return normalizeFaceConfig(local);
    try {
      const response = await fetch(`${PRODUCTION_URL}?t=${Date.now()}`, { cache: "no-store" });
      if (response.ok) return normalizeFaceConfig(await response.json());
    } catch {
      // Defaults keep the face app usable without a saved production file.
    }
    return normalizeFaceConfig(createDefaultFacePresets());
  }

  loadLocalProduction() {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  saveLocalProduction(config) {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(config));
  }

  savedPresets() {
    try {
      return JSON.parse(localStorage.getItem(PRESET_KEY) || "{}");
    } catch {
      return {};
    }
  }

  saveNamedPreset(name, config) {
    const presets = this.savedPresets();
    presets[name] = { savedAt: new Date().toISOString(), config };
    localStorage.setItem(PRESET_KEY, JSON.stringify(presets));
    return presets;
  }

  loadNamedPreset(name) {
    return this.savedPresets()[name]?.config || null;
  }

  exportDownload(config, filename = "face-presets.json") {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  async copyToClipboard(config) {
    await navigator.clipboard?.writeText(JSON.stringify(config, null, 2));
  }

  async deployProduction(config) {
    this.saveLocalProduction(config);
    const response = await fetch("/api/face/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ config }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || payload.ok === false) throw new Error(payload.detail || payload.message || "deploy_failed");
    return payload;
  }
}

export function normalizeFaceConfig(config) {
  const defaults = createDefaultFacePresets();
  const merged = {
    ...defaults,
    ...(config || {}),
    global: { ...defaults.global, ...((config || {}).global || {}) },
    skins: { ...defaults.skins },
  };
  Object.entries(defaults.skins).forEach(([skinName, states]) => {
    merged.skins[skinName] = {};
    FACE_STATES.forEach((state) => {
      merged.skins[skinName][state] = {
        ...(states[state] || {}),
        ...(((config || {}).skins || {})[skinName]?.[state] || {}),
      };
    });
  });
  if (!merged.skins[merged.activeSkin]) merged.activeSkin = defaults.activeSkin;
  if (!FACE_STATES.includes(merged.activeState)) merged.activeState = defaults.activeState;
  return merged;
}
