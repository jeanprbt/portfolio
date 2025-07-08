<template>
    <canvas ref="canvasRef" class="absolute z-2"></canvas>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'lil-gui';
import vertexShader from '~/assets/shaders/vertex.glsl?raw';
import fragmentShader from '~/assets/shaders/fragment.glsl?raw';

const props = defineProps(['isDark']);
const smallScreenThresh = 755;
const smallScreenCamera = 3.4;
const regularScreenCamera = 3;

const canvasRef = ref(null);
let gui: GUI | null = null;

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

    gui = new GUI();
    gui.domElement.style.position = 'absolute';
    gui.domElement.style.top = '10px';
    gui.domElement.style.right = '10px';
    gui.domElement.style.zIndex = '1000';

    const distortionFolder = gui.addFolder('Distortion');
    distortionFolder.add({ frequency: 2.0 }, 'frequency', 0, 10, 0.001).onChange((value: number) => material.uniforms.uDistortionFrequency.value = value);
    distortionFolder.add({ strength: 2.0 }, 'strength', 0, 10, 0.001).onChange((value: number) => material.uniforms.uDistortionStrength.value = value);

    const displacementFolder = gui.addFolder('Displacement');
    displacementFolder.add({ frequency: 1.0 }, 'frequency', 0, 5, 0.001).onChange((value: number) => material.uniforms.uDisplacementFrequency.value = value);
    displacementFolder.add({ strength: 0.1 }, 'strength', 0, 1, 0.001).onChange((value: number) => material.uniforms.uDisplacementStrength.value = value);

    const timeFolder = gui.addFolder('Time');
    timeFolder.add({ frequency: 0.5 }, 'frequency', 0.1, 2.0, 0.1).onChange((value: number) => material.uniforms.uTimeFrequency.value = value);

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