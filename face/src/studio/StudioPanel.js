import { createDefaultFacePresets, FACE_STATES, SKIN_LABELS } from "../config/defaultFacePresets.js";

const FIELD_LABELS = {
  cameraDistance: "Camera distance",
  cameraHeight: "Camera height",
  spotlight1Color: "Spotlight 1 color",
  spotlight1Intensity: "Spotlight 1 intensity",
  spotlight1PositionX: "Spotlight 1 position X",
  spotlight1PositionY: "Spotlight 1 position Y",
  spotlight1PositionZ: "Spotlight 1 position Z",
  spotlight2Color: "Spotlight 2 color",
  spotlight2Intensity: "Spotlight 2 intensity",
  spotlight2PositionX: "Spotlight 2 position X",
  spotlight2PositionY: "Spotlight 2 position Y",
  spotlight2PositionZ: "Spotlight 2 position Z",
};

const RANGES = {
  glassOpacity: [0.05, 1, 0.01],
  glassRoughness: [0, 1, 0.01],
  transmission: [0, 1, 0.01],
  ior: [1, 2.4, 0.01],
  waterWrinkleStrength: [0, 0.55, 0.01],
  waterWrinkleScale: [0.5, 8, 0.1],
  waterAnimationSpeed: [0, 3, 0.01],
  particleCount: [8, 260, 1],
  particleSpeed: [0, 4, 0.01],
  particleSize: [0.01, 0.12, 0.001],
  particleGlowIntensity: [0.1, 5, 0.01],
  overallBloomIntensity: [0, 4, 0.01],
  wireframeIntensity: [0.1, 4, 0.01],
  eyeEmissiveIntensity: [0.1, 6, 0.01],
  headRotationSpeed: [0, 3, 0.01],
  eyePulseSpeed: [0, 5, 0.01],
  panelMovementAmount: [0, 0.3, 0.01],
  panelMovementSpeed: [0, 5, 0.01],
  glitchAmount: [0, 1, 0.01],
  speakingPulseAmount: [0, 0.7, 0.01],
  translucency: [0.05, 1, 0.01],
  roughness: [0, 1, 0.01],
  displacementStrength: [0, 0.75, 0.01],
  displacementScale: [0.5, 8, 0.1],
  movementSpeed: [0, 3, 0.01],
  pulseMinDisplacementPercent: [0, 100, 1],
  pulsePeakDisplacementPercent: [0, 200, 1],
  pulsePeakDisplacementStrength: [0, 1, 0.01],
  pulseSpeed: [0, 5, 0.01],
  pulseSharpness: [0.1, 6, 0.1],
  spotlight1Intensity: [0, 8, 0.1],
  spotlight1PositionX: [-5, 5, 0.1],
  spotlight1PositionY: [-5, 5, 0.1],
  spotlight1PositionZ: [-1, 8, 0.1],
  spotlight2Intensity: [0, 8, 0.1],
  spotlight2PositionX: [-5, 5, 0.1],
  spotlight2PositionY: [-5, 5, 0.1],
  spotlight2PositionZ: [-1, 8, 0.1],
  opacity: [0.05, 1, 0.01],
  noiseScale: [0.5, 8, 0.1],
  animationSpeed: [0, 3, 0.01],
  pulseAmount: [0, 2, 0.01],
  ringIntensity: [0, 3, 0.01],
  gridIntensity: [0, 3, 0.01],
  cameraDistance: [3.2, 9, 0.1],
  cameraHeight: [-2, 2, 0.05],
};

export class StudioPanel {
  constructor({ controller, presetManager }) {
    this.controller = controller;
    this.presets = presetManager;
    this.root = document.createElement("aside");
    this.root.className = "studio-panel";
    this.root.innerHTML = `
      <div class="studio-panel__header">
        <strong>Face App Studio</strong>
        <button type="button" data-close title="Close">x</button>
      </div>
      <div class="studio-panel__body"></div>
      <div class="studio-panel__status" aria-live="polite"></div>
    `;
    document.body.appendChild(this.root);
    this.body = this.root.querySelector(".studio-panel__body");
    this.status = this.root.querySelector(".studio-panel__status");
    this.root.querySelector("[data-close]").addEventListener("click", () => this.hide());
    this.controller.addEventListener("change", () => {
      if (document.activeElement?.dataset?.param) return;
      this.render();
    });
    this.render();
  }

  show() {
    this.root.classList.add("open");
    localStorage.setItem("t1.faceStudio.enabled", "1");
  }

  hide() {
    this.root.classList.remove("open");
  }

  render() {
    const snap = this.controller.snapshot();
    const presets = Object.keys(this.presets.savedPresets());
    this.body.innerHTML = `
      ${this.choiceGrid("Skin", "skin", snap.skin, Object.keys(SKIN_LABELS).map((key) => [key, SKIN_LABELS[key]]))}
      ${this.choiceGrid("Assistant state", "state", snap.state, FACE_STATES.map((state) => [state, state]))}
      <button class="studio-live-button" type="button" data-live>${snap.previewLocked ? "Return to live assistant state" : "Live assistant state"}</button>
      <h3>Global View</h3>
      ${Object.entries(snap.global).map(([key, value]) => this.field(key, value, true)).join("")}
      <h3>State Parameters</h3>
      ${Object.entries(snap.params).map(([key, value]) => this.field(key, value, false)).join("")}
      <h3>Presets</h3>
      <div class="studio-row inline"><input data-preset-name placeholder="Preset name" value="${snap.skin}-${snap.state}"><button type="button" data-save>Save</button></div>
      <div class="studio-row inline"><select data-load>${presets.map((name) => `<option>${name}</option>`).join("")}</select><button type="button" data-load-btn>Load</button></div>
      <div class="studio-actions">
        <button type="button" data-reset>Reset Defaults</button>
        <button type="button" data-export>Export Production Config</button>
        <button type="button" data-import>Import JSON</button>
        <button type="button" data-deploy>Deploy</button>
      </div>
      <input data-file type="file" accept="application/json" hidden>
      <p class="studio-help">Production file: face/config/face-presets.json</p>
    `;
    this.bind();
  }

  select(label, key, value, options) {
    return `<label class="studio-row"><span>${label}</span><select data-select="${key}">${options.map(([id, text]) => `<option value="${id}" ${id === value ? "selected" : ""}>${text}</option>`).join("")}</select></label>`;
  }

  choiceGrid(label, key, value, options) {
    return `
      <div class="studio-row">
        <span>${label}</span>
        <div class="studio-choice-grid" data-choice="${key}">
          ${options.map(([id, text]) => `<button type="button" data-value="${id}" class="${id === value ? "active" : ""}">${text}</button>`).join("")}
        </div>
      </div>
    `;
  }

  field(key, value, global) {
    const label = FIELD_LABELS[key] || key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
    if (typeof value === "string" && value.startsWith("#")) {
      return `<label class="studio-row"><span>${label}</span><input type="color" data-param="${key}" data-global="${global}" value="${value}"></label>`;
    }
    if (typeof value === "number") {
      const [min, max, step] = RANGES[key] || [0, Math.max(2, value * 2 || 1), 0.01];
      return `<label class="studio-row"><span>${label}<b>${Number(value).toFixed(step >= 1 ? 0 : 2)}</b></span><input type="range" min="${min}" max="${max}" step="${step}" data-param="${key}" data-global="${global}" value="${value}"></label>`;
    }
    return `<label class="studio-row"><span>${label}</span><input data-param="${key}" data-global="${global}" value="${value}"></label>`;
  }

  bind() {
    this.body.querySelectorAll('[data-choice="skin"] button').forEach((button) => {
      button.addEventListener("click", () => this.controller.setSkin(button.dataset.value));
    });
    this.body.querySelectorAll('[data-choice="state"] button').forEach((button) => {
      button.addEventListener("click", () => this.controller.setStudioState(button.dataset.value));
    });
    this.body.querySelector("[data-live]").addEventListener("click", () => {
      this.controller.clearStudioState();
      this.setStatus("Live assistant state restored");
    });
    this.body.querySelectorAll("[data-param]").forEach((input) => {
      input.addEventListener("input", () => {
        const value = input.type === "range" ? Number(input.value) : input.value;
        if (input.dataset.global === "true") this.controller.updateGlobal(input.dataset.param, value);
        else this.controller.updateParam(input.dataset.param, value);
      });
    });
    this.body.querySelector("[data-save]").addEventListener("click", () => {
      const name = this.body.querySelector("[data-preset-name]").value.trim() || "face-preset";
      this.presets.saveNamedPreset(name, JSON.parse(JSON.stringify(this.controller.config)));
      this.setStatus(`Saved ${name}`);
      this.render();
    });
    this.body.querySelector("[data-load-btn]").addEventListener("click", () => {
      const name = this.body.querySelector("[data-load]").value;
      const config = this.presets.loadNamedPreset(name);
      if (config) this.controller.setConfig(config);
      this.setStatus(config ? `Loaded ${name}` : "No preset selected");
    });
    this.body.querySelector("[data-reset]").addEventListener("click", () => this.controller.setConfig(createDefaultFacePresets()));
    this.body.querySelector("[data-export]").addEventListener("click", async () => {
      this.presets.exportDownload(this.controller.config);
      await this.presets.copyToClipboard(this.controller.config).catch(() => {});
      this.setStatus("Exported and copied JSON");
    });
    this.body.querySelector("[data-import]").addEventListener("click", () => this.body.querySelector("[data-file]").click());
    this.body.querySelector("[data-file]").addEventListener("change", (event) => this.importFile(event.target.files?.[0]));
    this.body.querySelector("[data-deploy]").addEventListener("click", async () => {
      const deployButton = this.body.querySelector("[data-deploy]");
      deployButton.disabled = true;
      this.setStatus("Deploying production config...");
      try {
        const result = await this.presets.deployProduction(this.controller.config);
        const routeNote = result.redirects_to_face ? ` Face route: ${result.face_url}` : "";
        this.setStatus(result.path ? `Deployed to ${result.path}.${routeNote}` : `Deployed production config.${routeNote}`);
      } catch (error) {
        this.presets.saveLocalProduction(this.controller.config);
        this.setStatus(`Backend deploy failed; saved browser config. ${error.message || ""}`.trim());
      } finally {
        deployButton.disabled = false;
      }
    });
  }

  async importFile(file) {
    if (!file) return;
    this.controller.setConfig(JSON.parse(await file.text()));
    this.setStatus(`Imported ${file.name}`);
  }

  setStatus(message) {
    this.status.textContent = message;
  }
}
