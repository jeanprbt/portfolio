<template>
    <!-- <div class="absolute top-10 right-10 bg-transparent p-4 flex flex-col items-center z-3">
        <div class="flex flex-col items-right gap-4 text-primary font-secondary text-sm">
            <div class="flex flex-col gap-2">
                <label>
                    distortion frequency | <span class="text-lg">{{ distortionFrequency.toFixed(1) }}</span>
                </label>
                <USlider v-model="distortionFrequency" :min="0" :max="10" :step="0.001" color="primary" size="xs" />
            </div>
            <div class="flex flex-col gap-2">
                <label>
                    distortion strength | <span class="text-lg">{{ distortionStrength.toFixed(1) }}</span>
                </label>
                <USlider v-model="distortionStrength" :min="0" :max="10" :step="0.001" color="primary" size="xs" />
            </div>
            <div class="flex flex-col gap-2">
                <label>
                    displacement frequency | <span class="text-lg">{{ displacementFrequency.toFixed(1) }}</span>
                </label>
                <USlider v-model="displacementFrequency" :min="0" :max="5" :step="0.001" color="primary" size="xs" />
            </div>
            <div class="flex flex-col gap-2">
                <label>
                    displacement strength | <span class="text-lg">{{ displacementStrength.toFixed(1) }}</span>
                </label>
                <USlider v-model="displacementStrength" :min="0" :max="1" :step="0.001" color="primary" size="xs" />
            </div>
            <div class="flex flex-col gap-2">
                <label>
                    time frequency | <span class="text-lg">{{ timeFrequency.toFixed(1) }}</span>
                </label>
                <USlider v-model="timeFrequency" :min="0.1" :max="2.0" :step="0.1" color="primary" size="xs" />
            </div>
        </div>
    </div> -->
    <canvas ref="canvasRef" class="absolute z-2"></canvas>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import vertexShader from '~/assets/shaders/vertex.glsl?raw';
import fragmentShader from '~/assets/shaders/fragment.glsl?raw';

const props = defineProps(['isDark']);
const smallScreenThresh = 755;
const smallScreenCamera = 3.4;
const regularScreenCamera = 3;

const canvasRef = ref(null);
const timeFrequency = ref(0.5);
const distortionFrequency = ref(2.0);
const distortionStrength = ref(2.0);
const displacementFrequency = ref(1.0);
const displacementStrength = ref(0.1);

onMounted(() => {
    if (!canvasRef.value) return;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    if (window.innerWidth <= smallScreenThresh) {
        camera.position.z = smallScreenCamera;
    } else {
        camera.position.z = regularScreenCamera;
    }

    const controls = new OrbitControls(camera, canvasRef.value);
    controls.enableZoom = false;

    const geometry = new THREE.SphereGeometry(1, 512, 512);
    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uTimeFrequency: { value: 0.5 },
            uInvert: { value: false },
            uDistortionFrequency: { value: 2.0 },
            uDistortionStrength: { value: 2.0 },
            uDisplacementFrequency: { value: 1.0 },
            uDisplacementStrength: { value: 0.1 },
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const clock = new THREE.Clock();
    const animate = () => {
        material.uniforms.uTime.value = clock.getElapsedTime()
        renderer.render(scene, camera)
    };
    renderer.setAnimationLoop(animate);

    const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        if (window.innerWidth <= smallScreenThresh) {
            camera.position.z = smallScreenCamera;
        } else {
            camera.position.z = regularScreenCamera;
        }
    };
    window.addEventListener('resize', onResize);

    watch(() => props.isDark, (newValue) => material.uniforms.uInvert.value = newValue);
    watch(distortionFrequency, (newValue) => material.uniforms.uDistortionFrequency.value = newValue);
    watch(distortionStrength, (newValue) => material.uniforms.uDistortionStrength.value = newValue);
    watch(displacementFrequency, (newValue) => material.uniforms.uDisplacementFrequency.value = newValue);
    watch(displacementStrength, (newValue) => material.uniforms.uDisplacementStrength.value = newValue);
    watch(timeFrequency, (newValue) => material.uniforms.uTimeFrequency.value = newValue);
});
</script>