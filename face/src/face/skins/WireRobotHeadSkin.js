import * as THREE from "../../vendor/three.module.js";

const SVG_URL = "./assets/tfc_ai_robot_face_rigged.svg";

export class WireRobotHeadSkin {
  constructor(scene, context = {}) {
    this.group = new THREE.Group();
    this.params = {};
    this.parts = {};
    this.scene = scene;
    scene.add(this.group);

    const wrap = context.canvas?.closest(".orb-canvas-wrap") || context.canvas?.parentElement || document.body;
    this.root = document.createElement("div");
    this.root.className = "svg-robot-head-skin";
    this.root.setAttribute("aria-hidden", "true");
    wrap.appendChild(this.root);
    fetch(SVG_URL, { cache: "no-store" })
      .then((response) => response.text())
      .then((svg) => {
        this.root.innerHTML = svg;
        this.svg = this.root.querySelector("svg");
        this.cacheParts();
        this.applyConfig(this.params);
      })
      .catch(() => {
        this.root.textContent = "";
      });
  }

  cacheParts() {
    ["head_shell", "forehead", "upper_mask", "lower_mask", "jaw", "left_eye", "right_eye", "left_ear", "right_ear", "left_cheek", "right_cheek"].forEach((id) => {
      this.parts[id] = this.root.querySelector(`#${id}`);
    });
  }

  applyConfig(params) {
    this.params = params || {};
    const wire = this.params.wireframeColor || "#00ff66";
    const eye = this.params.eyeColor || "#ffffff";
    this.root.style.setProperty("--t1-green", wire);
    this.root.style.setProperty("--t1-green-dim", wire);
    this.root.style.setProperty("--t1-white", eye);
    this.root.style.opacity = String(Math.min(1, 0.5 + Number(this.params.wireframeIntensity || 1.45) / 3));
    if (this.svg) {
      this.svg.style.filter = `drop-shadow(0 0 ${4 + Number(this.params.wireframeIntensity || 1.45) * 4}px ${wire})`;
    }
  }

  update(delta, elapsed, context = {}) {
    if (!this.svg) return;
    const p = this.params;
    const speech = Number(context.speechLevel || 0);
    const glitch = Number(p.glitchAmount || 0);
    const headRot = Math.sin(elapsed * Number(p.headRotationSpeed || 0.35)) * 1.8;
    const glitchX = (Math.random() - 0.5) * glitch * 12;
    const pulse = 1 + Math.sin(elapsed * Number(p.eyePulseSpeed || 1.2) * 5) * 0.04 + speech * Number(p.speakingPulseAmount || 0.12);
    const panelMove = Math.sin(elapsed * Number(p.panelMovementSpeed || 0.9) * 2.5) * Number(p.panelMovementAmount || 0.06) * 42;
    const jawMove = speech * 18 + Math.max(0, Math.sin(elapsed * 10)) * speech * 8;

    this.svg.style.transform = `translateX(${glitchX}px) rotate(${headRot}deg)`;
    this.setTransform("left_eye", `scale(${pulse}) translate(${glitchX * 0.25}px, 0px)`);
    this.setTransform("right_eye", `scale(${pulse}) translate(${glitchX * -0.25}px, 0px)`);
    this.setTransform("jaw", `translateY(${jawMove}px) scaleY(${1 + speech * 0.06})`);
    this.setTransform("lower_mask", `translateY(${jawMove * 0.35}px)`);
    this.setTransform("forehead", `translateY(${panelMove * -0.25}px)`);
    this.setTransform("left_cheek", `translate(${panelMove * -0.2}px, ${panelMove * 0.08}px)`);
    this.setTransform("right_cheek", `translate(${panelMove * 0.2}px, ${panelMove * 0.08}px)`);
    this.setTransform("left_ear", `translateX(${panelMove * -0.12}px)`);
    this.setTransform("right_ear", `translateX(${panelMove * 0.12}px)`);
  }

  setTransform(id, transform) {
    if (this.parts[id]) this.parts[id].style.transform = transform;
  }

  dispose() {
    this.group.removeFromParent();
    this.root?.remove();
  }

  setInteraction(interaction) {
    if (!this.root) return;
    const scale = interaction.scale || { x: 1, y: 1 };
    const rotation = interaction.rotation || { x: 0, y: 0 };
    this.root.style.transform = `scale(${scale.x}, ${scale.y}) rotateX(${rotation.x}rad) rotateY(${rotation.y}rad)`;
  }
}
