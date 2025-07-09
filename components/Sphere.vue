<template>
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

onMounted(() => {
    if (!canvasRef.value) return;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    if (window.innerWidth <= smallScreenThresh) camera.position.z = smallScreenCamera;
    else camera.position.z = regularScreenCamera;

    const controls = new OrbitControls(camera, canvasRef.value);
    controls.enableZoom = false;
    controls.enablePan = false;

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
            uOffset: { value: new THREE.Vector3(0, 0, 0) }
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
        if (window.innerWidth <= smallScreenThresh) camera.position.z = smallScreenCamera;
        else camera.position.z = regularScreenCamera;
    };
    window.addEventListener('resize', onResize);

    watch(() => props.isDark, (newValue) => material.uniforms.uInvert.value = newValue);
});
</script>