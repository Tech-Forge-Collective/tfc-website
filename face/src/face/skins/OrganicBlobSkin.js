import * as THREE from "../../vendor/three.module.js";
import { color, disposeObject, organicNoise } from "./SkinUtils.js";

const vertexShader = `
uniform float uTime;
uniform float uStrength;
uniform float uScale;
uniform float uSpeed;
uniform float uPulseMin;
uniform float uPulsePeak;
uniform float uPulsePeakStrength;
uniform float uPulseSpeed;
uniform float uPulseSharpness;
varying vec3 vNormal;
varying vec3 vWorld;
${organicNoise}
void main() {
  vNormal = normalize(normalMatrix * normal);
  float n = fbm(normal * uScale + vec3(uTime * uSpeed, -uTime * uSpeed * 0.7, uTime * 0.15));
  // Pulse uniforms modulate the noise displacement from min percent to peak percent.
  float pulse = pow(0.5 + 0.5 * sin(uTime * uPulseSpeed * 6.2831853), max(0.1, uPulseSharpness));
  float pulsePercent = mix(uPulseMin, uPulsePeak, pulse) / 100.0;
  float peakStrength = max(uStrength, uPulsePeakStrength);
  float displacementAmplitude = mix(uStrength, peakStrength, pulse) * pulsePercent;
  vec3 displaced = position + normal * ((n - 0.42) * displacementAmplitude);
  vec4 world = modelMatrix * vec4(displaced, 1.0);
  vWorld = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const fragmentShader = `
uniform vec3 uColor;
uniform float uAlpha;
varying vec3 vNormal;
varying vec3 vWorld;
void main() {
  vec3 viewDir = normalize(cameraPosition - vWorld);
  float fresnel = pow(1.0 - max(0.0, dot(normalize(vNormal), viewDir)), 1.8);
  vec3 col = uColor * (0.18 + fresnel * 1.65) + vec3(1.0) * pow(fresnel, 5.0);
  gl_FragColor = vec4(col, clamp(uAlpha + fresnel * 0.24, 0.12, 0.9));
}
`;

export class OrganicBlobSkin {
  constructor(scene) {
    this.group = new THREE.Group();
    this.params = {};
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color("#00ff66") },
        uAlpha: { value: 0.62 },
        uStrength: { value: 0.22 },
        uScale: { value: 2.6 },
        uSpeed: { value: 0.62 },
        uPulseMin: { value: 0 },
        uPulsePeak: { value: 100 },
        uPulsePeakStrength: { value: 0.34 },
        uPulseSpeed: { value: 1.15 },
        uPulseSharpness: { value: 1.8 },
      },
      vertexShader,
      fragmentShader,
    });
    this.blob = new THREE.Mesh(new THREE.SphereGeometry(1.2, 160, 120), this.material);
    this.group.add(this.blob);
    this.light1 = new THREE.SpotLight(0xffffff, 3.2, 8, Math.PI / 5, 0.5, 1);
    this.light2 = new THREE.SpotLight(0x4bff8d, 2.3, 8, Math.PI / 5, 0.5, 1);
    this.group.add(this.light1, this.light2);
    scene.add(this.group);
  }

  applyConfig(params) {
    this.params = params;
    this.material.uniforms.uColor.value.copy(color(params.blobColor));
    this.material.uniforms.uAlpha.value = Number(params.translucency ?? 0.62);
    this.material.uniforms.uStrength.value = Number(params.displacementStrength ?? 0.22);
    this.material.uniforms.uScale.value = Number(params.displacementScale ?? 2.6);
    this.material.uniforms.uSpeed.value = Number(params.movementSpeed ?? 0.62);
    this.material.uniforms.uPulseMin.value = Number(params.pulseMinDisplacementPercent ?? 0);
    this.material.uniforms.uPulsePeak.value = Number(params.pulsePeakDisplacementPercent ?? 100);
    this.material.uniforms.uPulsePeakStrength.value = Number(params.pulsePeakDisplacementStrength ?? 0.34);
    this.material.uniforms.uPulseSpeed.value = Number(params.pulseSpeed ?? 1.15);
    this.material.uniforms.uPulseSharpness.value = Number(params.pulseSharpness ?? 1.8);
    this.light1.color.copy(color(params.spotlight1Color, "#d8fff0"));
    this.light1.intensity = Number(params.spotlight1Intensity ?? 3.2);
    this.light1.position.set(Number(params.spotlight1PositionX ?? -2.2), Number(params.spotlight1PositionY ?? 2.1), Number(params.spotlight1PositionZ ?? 3.2));
    this.light2.color.copy(color(params.spotlight2Color, "#4bff8d"));
    this.light2.intensity = Number(params.spotlight2Intensity ?? 2.3);
    this.light2.position.set(Number(params.spotlight2PositionX ?? 2.4), Number(params.spotlight2PositionY ?? -1.7), Number(params.spotlight2PositionZ ?? 2.6));
  }

  update(delta, elapsed) {
    this.material.uniforms.uTime.value = elapsed;
    this.blob.rotation.y += delta * 0.12 * Number(this.params.movementSpeed || 0.62);
    this.blob.rotation.x = Math.sin(elapsed * 0.28) * 0.08;
  }

  dispose() {
    disposeObject(this.group);
    this.group.removeFromParent();
  }
}
