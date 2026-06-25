import { FACE_STATES } from "../config/defaultFacePresets.js";

const STATE_ALIASES = {
  assistant_thinking: "thinking",
  llm_generating: "thinking",
  rag_searching: "thinking",
  preemptive_thinking: "thinking",
  tool_calling: "thinking",
  searching: "thinking",
  diagnostic: "thinking",
  transcribing: "listening",
  wake_detected: "wake",
  wake_listening: "wake",
  user_speaking: "listening",
  end_of_turn_pending: "listening",
  stt: "listening",
  recording: "listening",
  tts_playing: "speaking",
  happy: "success",
  warning: "error",
  fault: "error",
  estop: "error",
  offline: "sleeping",
  sleepy: "sleeping",
  booting: "wake",
  mission: "thinking",
};

export class FaceStateController extends EventTarget {
  constructor(config) {
    super();
    this.config = config;
    this.state = this.normalize(config.activeState || "idle");
    this.skin = config.activeSkin || "GlassWaterSkin";
    this.speechLevel = 0;
    this.previewLocked = false;
  }

  normalize(state) {
    const next = String(state || "idle").toLowerCase();
    const mapped = STATE_ALIASES[next] || next;
    return FACE_STATES.includes(mapped) ? mapped : "idle";
  }

  setConfig(config) {
    this.config = config;
    this.skin = config.activeSkin || this.skin;
    this.state = this.normalize(config.activeState || this.state);
    this.emit();
  }

  setSkin(skin) {
    this.skin = skin;
    this.config.activeSkin = skin;
    this.emit();
  }

  setState(state, speechLevel = this.speechLevel) {
    this.state = this.normalize(state);
    this.config.activeState = this.state;
    this.speechLevel = Math.max(0, Math.min(1, Number(speechLevel || 0)));
    this.emit();
  }

  setLiveState(state, speechLevel = this.speechLevel) {
    if (this.previewLocked) return false;
    this.setState(state, speechLevel);
    return true;
  }

  setStudioState(state, speechLevel = this.speechLevel) {
    this.previewLocked = true;
    this.setState(state, speechLevel);
  }

  clearStudioState() {
    this.previewLocked = false;
    this.emit();
  }

  updateGlobal(key, value) {
    this.config.global[key] = value;
    this.emit();
  }

  updateParam(key, value) {
    this.currentParams()[key] = value;
    this.emit();
  }

  currentParams() {
    const skinParams = this.config.skins?.[this.skin] || {};
    skinParams[this.state] ||= {};
    return skinParams[this.state];
  }

  snapshot() {
    return {
      config: this.config,
      skin: this.skin,
      state: this.state,
      params: this.currentParams(),
      global: this.config.global || {},
      speechLevel: this.speechLevel,
      previewLocked: this.previewLocked,
    };
  }

  emit() {
    this.dispatchEvent(new CustomEvent("change", { detail: this.snapshot() }));
  }
}
