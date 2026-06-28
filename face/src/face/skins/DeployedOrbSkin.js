import * as THREE from "../../vendor/three.module.js";
import { color, disposeObject } from "./SkinUtils.js";

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform float uSpeechLevel;
uniform float uDisplacementStrength;
uniform float uPulseAmount;
uniform float uNoiseScale;
uniform float uRingIntensity;
uniform float uGridIntensity;
uniform float uOpacity;
uniform vec3 uOrbColor;
uniform vec3 uCoreColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = mat2(1.62, 1.18, -1.18, 1.62) * p + 0.17;
    a *= 0.5;
  }
  return v;
}

float ringLine(float r, float radius, float width) {
  return 1.0 - smoothstep(0.0, width, abs(r - radius));
}

float contour(float value, float count, float width) {
  float cell = abs(fract(value * count) - 0.5);
  return 1.0 - smoothstep(0.0, width, cell);
}

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  float r = length(uv);
  float angle = atan(uv.y, uv.x);
  float rot = uTime * (0.18 + uSpeechLevel * 0.22);
  mat2 spin = mat2(cos(rot), -sin(rot), sin(rot), cos(rot));
  vec2 p0 = spin * uv;
  float turbulence = fbm(p0 * (2.3 + uNoiseScale * 0.23) + vec2(uTime * 0.25, -uTime * 0.18));
  float fine = fbm(p0 * 6.4 - vec2(uTime * 0.48, uTime * 0.31));
  float speechWave = uSpeechLevel * sin(angle * 8.0 + uTime * 12.0) * 0.04;
  float baseRadius = 0.58 + uSpeechLevel * 0.03;
  float organicRadius = baseRadius + (turbulence - 0.5) * (0.07 * uDisplacementStrength) + (fine - 0.5) * 0.018 + speechWave;
  float inside = 1.0 - smoothstep(organicRadius - 0.012, organicRadius + 0.012, r);
  float edgeFade = smoothstep(organicRadius + 0.025, organicRadius - 0.02, r);
  vec2 sphereUv = uv / max(organicRadius, 0.001);

  float outline = ringLine(r, organicRadius, 0.012) * uRingIntensity;
  float latitude = contour(sphereUv.y + turbulence * 0.18 + sin(sphereUv.x * 3.1 + uTime * 0.2) * 0.035, 7.5, 0.055) * inside * uGridIntensity;
  float longitude = contour(sphereUv.x + fine * 0.11 + sin(sphereUv.y * 2.5 - uTime * 0.22) * 0.028, 7.0, 0.052) * inside * uGridIntensity;
  float veins = contour(turbulence + fine * 0.42 + angle * 0.07 + uTime * 0.04, 5.5, 0.05) * inside * uGridIntensity;
  float core = 1.0 - smoothstep(0.0, 0.07 + uSpeechLevel * 0.026, r);
  float coreRing = ringLine(r, 0.12 + uSpeechLevel * 0.035, 0.012) * uRingIntensity;
  float speechRing = uSpeechLevel * ringLine(r, 0.24 + 0.34 * fract(uTime * 1.45), 0.018) * edgeFade * uPulseAmount;

  float structure = max(max(outline, max(latitude, longitude)), max(veins, max(coreRing, speechRing)));
  float alpha = max(inside * edgeFade * 0.12, max(structure, core)) * uOpacity;
  vec3 finalColor = uOrbColor * (inside * 0.08 + outline * 1.35 + latitude * 0.72 + longitude * 0.72 + veins * 0.95 + speechRing);
  finalColor += uCoreColor * (core * (0.85 + uSpeechLevel * 0.45) + coreRing * 0.65);
  gl_FragColor = vec4(finalColor, alpha);
}
`;

export class DeployedOrbSkin {
  constructor(scene) {
    this.group = new THREE.Group();
    this.params = {};
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uSpeechLevel: { value: 0 },
        uDisplacementStrength: { value: 1 },
        uPulseAmount: { value: 0.35 },
        uNoiseScale: { value: 3.2 },
        uRingIntensity: { value: 1 },
        uGridIntensity: { value: 1 },
        uOpacity: { value: 1 },
        uOrbColor: { value: new THREE.Color("#00ff66") },
        uCoreColor: { value: new THREE.Color("#ffffff") },
      },
      vertexShader,
      fragmentShader,
    });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(3.25, 3.25), this.material);
    this.group.add(plane);
    scene.add(this.group);
  }

  applyConfig(params) {
    this.params = params || {};
    this.material.uniforms.uDisplacementStrength.value = Number(this.params.displacementStrength ?? 1);
    this.material.uniforms.uPulseAmount.value = Number(this.params.pulseAmount ?? 0.35);
    this.material.uniforms.uNoiseScale.value = Number(this.params.noiseScale ?? 3.2);
    this.material.uniforms.uRingIntensity.value = Number(this.params.ringIntensity ?? 1);
    this.material.uniforms.uGridIntensity.value = Number(this.params.gridIntensity ?? 1);
    this.material.uniforms.uOpacity.value = Number(this.params.opacity ?? 1);
    this.material.uniforms.uOrbColor.value.copy(color(this.params.orbColor));
    this.material.uniforms.uCoreColor.value.copy(color(this.params.coreColor, "#ffffff"));
  }

  update(delta, elapsed, context = {}) {
    this.material.uniforms.uTime.value = elapsed * Number(this.params.animationSpeed || 1);
    this.material.uniforms.uSpeechLevel.value = Number(context.speechLevel || 0);
  }

  dispose() {
    disposeObject(this.group);
    this.group.removeFromParent();
  }
}
