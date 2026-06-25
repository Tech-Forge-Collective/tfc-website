import * as THREE from "../vendor/three.module.js";
import { GlassWaterSkin } from "./skins/GlassWaterSkin.js";
import { WireRobotHeadSkin } from "./skins/WireRobotHeadSkin.js";
import { OrganicBlobSkin } from "./skins/OrganicBlobSkin.js";
import { DeployedOrbSkin } from "./skins/DeployedOrbSkin.js";

const SKINS = { GlassWaterSkin, WireRobotHeadSkin, OrganicBlobSkin, DeployedOrbSkin };

export class FaceApp {
  constructor(canvas, controller) {
    this.canvas = canvas;
    this.controller = controller;
    this.clock = new THREE.Clock();
    this.currentSkinName = "";
    this.currentSkin = null;
    this.disposed = false;
    this.interaction = {
      hovered: false,
      pressed: false,
      downX: 0,
      downY: 0,
      dragX: 0,
      dragY: 0,
      currentScale: new THREE.Vector3(1, 1, 1),
      targetScale: new THREE.Vector3(1, 1, 1),
      currentRotation: new THREE.Vector3(0, 0, 0),
      targetRotation: new THREE.Vector3(0, 0, 0),
    };

    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
    this.controller.addEventListener("change", (event) => this.applySnapshot(event.detail));
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    this.bindInteraction();
    this.applySnapshot(this.controller.snapshot());
    this.resize();
    requestAnimationFrame((time) => this.render(time));
  }

  bindInteraction() {
    const target = this.canvas.closest(".orb-button") || this.canvas;
    const updateDrag = (event) => {
      if (!this.interaction.pressed) return;
      this.interaction.dragX = event.clientX - this.interaction.downX;
      this.interaction.dragY = event.clientY - this.interaction.downY;
    };
    target.addEventListener("pointerenter", () => {
      this.interaction.hovered = true;
    });
    target.addEventListener("pointerleave", () => {
      this.interaction.hovered = false;
      this.interaction.pressed = false;
      this.interaction.dragX = 0;
      this.interaction.dragY = 0;
    });
    target.addEventListener("pointerdown", (event) => {
      this.interaction.pressed = true;
      this.interaction.downX = event.clientX;
      this.interaction.downY = event.clientY;
      this.interaction.dragX = 0;
      this.interaction.dragY = 0;
      target.setPointerCapture?.(event.pointerId);
    });
    target.addEventListener("pointermove", updateDrag);
    target.addEventListener("pointerup", (event) => {
      updateDrag(event);
      this.interaction.pressed = false;
      target.releasePointerCapture?.(event.pointerId);
    });
    target.addEventListener("pointercancel", () => {
      this.interaction.pressed = false;
      this.interaction.dragX = 0;
      this.interaction.dragY = 0;
    });
  }

  updateInteraction(delta) {
    const i = this.interaction;
    let sx = 1;
    let sy = 1;
    let sz = 1;
    let rx = 0;
    let ry = 0;
    if (i.hovered) {
      sx = 1.025;
      sy = 0.965;
      sz = 0.94;
    }
    if (i.pressed) {
      const dragLength = Math.hypot(i.dragX, i.dragY);
      const stretch = Math.min(0.22, dragLength / 420);
      const ax = dragLength > 2 ? Math.abs(i.dragX) / dragLength : 0.5;
      const ay = dragLength > 2 ? Math.abs(i.dragY) / dragLength : 0.5;
      sx = 1.05 + stretch * ax;
      sy = 1.05 + stretch * ay;
      sz = 1.05;
      ry = THREE.MathUtils.clamp(i.dragX / 420, -0.18, 0.18);
      rx = THREE.MathUtils.clamp(-i.dragY / 420, -0.18, 0.18);
    }
    i.targetScale.set(sx, sy, sz);
    i.targetRotation.set(rx, ry, 0);
    const ease = Math.min(1, delta * 18);
    i.currentScale.lerp(i.targetScale, ease);
    i.currentRotation.lerp(i.targetRotation, ease);
    if (this.currentSkin?.setInteraction) {
      this.currentSkin.setInteraction({
        scale: i.currentScale,
        rotation: i.currentRotation,
        hovered: i.hovered,
        pressed: i.pressed,
        dragX: i.dragX,
        dragY: i.dragY,
      });
      return;
    }
    if (this.currentSkin?.group) {
      this.currentSkin.group.scale.copy(i.currentScale);
      this.currentSkin.group.rotation.x += (i.currentRotation.x - this.currentSkin.group.rotation.x) * ease;
      this.currentSkin.group.rotation.y += (i.currentRotation.y - this.currentSkin.group.rotation.y) * ease;
    }
  }

  applySnapshot(snapshot) {
    this.snapshot = snapshot;
    if (this.currentSkinName !== snapshot.skin) this.switchSkin(snapshot.skin);
    this.currentSkin?.applyConfig(snapshot.params, snapshot.global, snapshot);
    const global = snapshot.global || {};
    this.camera.position.set(0, Number(global.cameraHeight || 0), Number(global.cameraDistance || 5.8));
    this.camera.lookAt(0, 0, 0);
    this.renderer.setClearColor(0x000000, 0);
  }

  switchSkin(skinName) {
    this.currentSkin?.dispose();
    const Skin = SKINS[skinName] || GlassWaterSkin;
    this.currentSkin = new Skin(this.scene, { canvas: this.canvas });
    this.currentSkinName = skinName;
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const width = Math.max(320, Math.floor(rect.width || 320));
    const height = Math.max(320, Math.floor(rect.height || width));
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  render() {
    if (this.disposed) return;
    const delta = Math.min(0.05, this.clock.getDelta());
    const elapsed = this.clock.elapsedTime;
    if (!document.hidden) {
      this.updateInteraction(delta);
      this.currentSkin?.update(delta, elapsed, this.snapshot || {});
      this.renderer.render(this.scene, this.camera);
    }
    requestAnimationFrame(() => this.render());
  }

  dispose() {
    this.disposed = true;
    this.resizeObserver?.disconnect();
    this.currentSkin?.dispose();
    this.renderer.dispose();
  }
}
