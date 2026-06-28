import * as THREE from "../../vendor/three.module.js";
import { color, disposeObject, organicNoise } from "./SkinUtils.js";

const vertexShader = `
uniform float uTime;
uniform float uWrinkleStrength;
uniform float uWrinkleScale;
uniform float uAnimationSpeed;
varying vec3 vNormal;
varying vec3 vWorld;
${organicNoise}
void main() {
  vNormal = normalize(normalMatrix * normal);
  float wrinkle = fbm(normal * uWrinkleScale + vec3(uTime * uAnimationSpeed));
  // uWrinkleStrength controls the water-like surface displacement.
  vec3 displaced = position + normal * (wrinkle - 0.5) * uWrinkleStrength;
  vec4 world = modelMatrix * vec4(displaced, 1.0);
  vWorld = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const fragmentShader = `
uniform vec3 uTint;
uniform float uOpacity;
uniform float uReflection;
uniform vec3 uLight1Color;
uniform vec3 uLight1Position;
uniform float uLight1Intensity;
uniform vec3 uLight2Color;
uniform vec3 uLight2Position;
uniform float uLight2Intensity;
varying vec3 vNormal;
varying vec3 vWorld;

vec3 surfaceLight(vec3 normal, vec3 viewDir, vec3 lightPosition, vec3 lightColor, float intensity) {
  vec3 lightDir = normalize(lightPosition - vWorld);
  float diffuse = max(0.0, dot(normal, lightDir));
  vec3 halfDir = normalize(lightDir + viewDir);
  float specular = pow(max(0.0, dot(normal, halfDir)), 72.0);
  return lightColor * intensity * (diffuse * 0.08 + specular * 1.65);
}

void main() {
  vec3 viewDir = normalize(cameraPosition - vWorld);
  vec3 normal = normalize(vNormal);
  float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 2.2);
  vec3 reflected = surfaceLight(normal, viewDir, uLight1Position, uLight1Color, uLight1Intensity);
  reflected += surfaceLight(normal, viewDir, uLight2Position, uLight2Color, uLight2Intensity);
  vec3 col = reflected * (0.18 + fresnel * (0.7 + uReflection));
  col += vec3(0.52, 0.78, 0.9) * fresnel * 0.08;
  gl_FragColor = vec4(col, clamp(uOpacity + fresnel * 0.32, 0.08, 0.92));
}
`;

function randomUnitVector() {
  const z = Math.random() * 2 - 1;
  const t = Math.random() * Math.PI * 2;
  const r = Math.sqrt(Math.max(0, 1 - z * z));
  return new THREE.Vector3(r * Math.cos(t), r * Math.sin(t), z);
}

export class GlassWaterSkin {
  constructor(scene) {
    this.group = new THREE.Group();
    this.params = {};
    this.particleData = [];
    this.glassMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uTint: { value: new THREE.Color("#a9ffe1") },
        uOpacity: { value: 0.42 },
        uReflection: { value: 0.7 },
        uWrinkleStrength: { value: 0.16 },
        uWrinkleScale: { value: 2.8 },
        uAnimationSpeed: { value: 0.55 },
        uLight1Color: { value: new THREE.Color("#ffffff") },
        uLight1Position: { value: new THREE.Vector3(-2.4, 2.3, 3.4) },
        uLight1Intensity: { value: 3.4 },
        uLight2Color: { value: new THREE.Color("#8fdcff") },
        uLight2Position: { value: new THREE.Vector3(2.5, -1.6, 2.8) },
        uLight2Intensity: { value: 2.2 },
      },
      vertexShader,
      fragmentShader,
    });
    const glass = new THREE.Mesh(new THREE.SphereGeometry(1.25, 128, 96), this.glassMaterial);
    this.group.add(glass);
    this.light1 = new THREE.SpotLight(0xffffff, 3.4, 10, Math.PI / 5, 0.45, 1);
    this.light2 = new THREE.SpotLight(0x8fdcff, 2.2, 10, Math.PI / 5, 0.45, 1);
    this.group.add(this.light1, this.light2);
    this.particles = new THREE.Group();
    this.group.add(this.particles);
    scene.add(this.group);
  }

  applyConfig(params, global) {
    this.params = params;
    this.glassMaterial.uniforms.uOpacity.value = Number(params.glassOpacity ?? 0.42);
    this.glassMaterial.uniforms.uReflection.value = Number(global.environmentReflectionStrength ?? 0.65);
    this.glassMaterial.uniforms.uWrinkleStrength.value = Number(params.waterWrinkleStrength ?? 0.16);
    this.glassMaterial.uniforms.uWrinkleScale.value = Number(params.waterWrinkleScale ?? 2.8);
    this.glassMaterial.uniforms.uAnimationSpeed.value = Number(params.waterAnimationSpeed ?? 0.55);
    this.glassMaterial.uniforms.uTint.value.copy(color(params.particleColor, "#00ff88"));
    this.light1.color.copy(color(params.spotlight1Color, "#ffffff"));
    this.light1.intensity = Number(params.spotlight1Intensity ?? 3.4);
    this.light1.position.set(Number(params.spotlight1PositionX ?? -2.4), Number(params.spotlight1PositionY ?? 2.3), Number(params.spotlight1PositionZ ?? 3.4));
    this.light2.color.copy(color(params.spotlight2Color, "#8fdcff"));
    this.light2.intensity = Number(params.spotlight2Intensity ?? 2.2);
    this.light2.position.set(Number(params.spotlight2PositionX ?? 2.5), Number(params.spotlight2PositionY ?? -1.6), Number(params.spotlight2PositionZ ?? 2.8));
    this.glassMaterial.uniforms.uLight1Color.value.copy(this.light1.color);
    this.glassMaterial.uniforms.uLight1Position.value.copy(this.light1.position);
    this.glassMaterial.uniforms.uLight1Intensity.value = this.light1.intensity;
    this.glassMaterial.uniforms.uLight2Color.value.copy(this.light2.color);
    this.glassMaterial.uniforms.uLight2Position.value.copy(this.light2.position);
    this.glassMaterial.uniforms.uLight2Intensity.value = this.light2.intensity;
    this.syncParticles();
  }

  syncParticles() {
    const count = Math.max(8, Math.min(260, Number(this.params.particleCount || 90)));
    while (this.particles.children.length < count) {
      const material = new THREE.MeshBasicMaterial({
        color: color(this.params.particleColor),
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), material);
      mesh.position.copy(randomUnitVector().multiplyScalar(Math.random() * 0.9));
      this.particleData.push({ velocity: randomUnitVector().multiplyScalar(0.15 + Math.random() * 0.35) });
      this.particles.add(mesh);
    }
    while (this.particles.children.length > count) {
      const child = this.particles.children.pop();
      this.particleData.pop();
      disposeObject(child);
    }
    this.particles.children.forEach((particle) => {
      particle.material.color.copy(color(this.params.particleColor));
      particle.scale.setScalar(Number(this.params.particleSize || 0.035) * Number(this.params.particleGlowIntensity || 1.8));
    });
  }

  update(delta, elapsed) {
    this.glassMaterial.uniforms.uTime.value = elapsed;
    const speed = Number(this.params.particleSpeed || 0.8);
    this.particles.children.forEach((particle, index) => {
      const data = this.particleData[index];
      particle.position.addScaledVector(data.velocity, delta * speed);
      if (particle.position.length() > 0.98) data.velocity.reflect(particle.position.clone().normalize()).multiplyScalar(0.96);
      particle.material.opacity = 0.55 + Math.sin(elapsed * speed * 3 + index) * 0.25;
    });
    this.group.rotation.y += delta * 0.08;
  }

  dispose() {
    disposeObject(this.group);
    this.group.removeFromParent();
  }
}
