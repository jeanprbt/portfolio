<template>
    <canvas ref="canvas" class="fixed z-2"></canvas>
    <div ref="hero" class="h-screen w-full bg-secondary text-primary transition-colors duration-500">
        <button @click="toggleDarkMode()"
            class="fixed top-10 left-10 text-primary hover:opacity-80 transition-opacity z-3">
            <Icon :name="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'" size="1.5em" />
        </button>
        <h1
            class="text-6xl font-primary font-bold  drop-shadow-sm dark:drop-shadow-primary absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-1 text-center">
            Hi, I'm <span class="font-secondary italic">Jean</span>.
        </h1>
    </div>
    <div ref="about" class="h-screen w-full flex bg-secondary text-primary transition-colors duration-500">
        <div class="w-2/5 hidden md:block"></div>
        <div class="w-full md:w-3/5 flex items-center justify-center text-center">
            <h1 class="text-6xl font-primary font-bold  drop-shadow-sm dark:drop-shadow-primary">
                About
            </h1>
        </div>
    </div>
</template>

<script setup lang="ts">
import * as THREE from 'three';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

import vertexShader from '~/assets/shaders/vertex.glsl?raw';
import fragmentShader from '~/assets/shaders/fragment.glsl?raw';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const colorMode = useColorMode();
const isDark = ref(false);
const toggleDarkMode = () => isDark.value = !isDark.value;
watch(isDark, (newValue) => {
    document.documentElement.classList.toggle('dark', newValue)
});

const isSmallScreen = computed(() => window.innerWidth <= 755);
const smallScreenCamera = 3.5;
const regularScreenCamera = 3;

const canvas = ref(null);
const hero = ref(null);
const about = ref(null);

const getCSSColor = (variable: string) => getComputedStyle(document.documentElement).getPropertyValue(variable).trim();

onMounted(() => {
    if (!canvas.value) return;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ canvas: canvas.value, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    if (isSmallScreen.value) camera.position.z = smallScreenCamera;
    else camera.position.z = regularScreenCamera;

    const controls = new OrbitControls(camera, canvas.value);
    controls.enableZoom = false;

    const sphereGeometry = new THREE.SphereGeometry(1, 512, 512);
    const sphereMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uTimeFrequency: { value: 0.5 },
            uDistortionFrequency: { value: 2.0 },
            uDistortionStrength: { value: 2.0 },
            uDisplacementFrequency: { value: 1.0 },
            uDisplacementStrength: { value: 0.1 },
            uTorusPosition: { value: new THREE.Vector3() },
            uTorusRotation: { value: new THREE.Vector3() },
            uDarkMode: { value: false }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
    });

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    const torusGeometry = new THREE.TorusGeometry(1.5, 0.05, 10, 50);
    const torusMaterial = new THREE.MeshBasicMaterial({
        color: getCSSColor('--color-primary')
    })
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(0, -6, -2);
    torus.rotation.set(Math.PI / 2, -Math.PI / 5, 0);
    scene.add(torus);

    const clock = new THREE.Clock();
    const animate = () => {
        sphereMaterial.uniforms.uTime.value = clock.getElapsedTime();
        sphereMaterial.uniforms.uTorusPosition.value.copy(torus.position);
        sphereMaterial.uniforms.uTorusRotation.value.copy(torus.rotation);
        renderer.render(scene, camera);
    };
    renderer.setAnimationLoop(animate);

    let lastWidth = window.innerWidth;
    const onResize = () => {
        if (window.innerWidth != lastWidth) {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            if (isSmallScreen.value) camera.position.z = smallScreenCamera;
            else camera.position.z = regularScreenCamera;
            lastWidth = window.innerWidth;
        }
    };
    window.addEventListener('resize', onResize);

    gsap.to(torus.position, {
        y: 6,
        scrollTrigger: {
            trigger: hero.value,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
        }
    });
    gsap.to(torus.rotation, {
        y: Math.PI / 5,
        scrollTrigger: {
            trigger: hero.value,
            start: 'bottom 90%',
            end: 'bottom 40%',
            scrub: true
        }
    })

    const tl1 = gsap.timeline({
        scrollTrigger: {
            trigger: hero.value,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
        }
    }).to(sphere.position, {
        z: -2,
        ease: 'power2.out',
        duration: 0.25
    });

    const tl2 = gsap.timeline({
        scrollTrigger: {
            trigger: hero.value,
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    }).to(sphere.position, {
        y: -1,
        duration: 0.5
    });

    if (isSmallScreen.value) {
        tl1.to({}, { duration: 0.75 })
        tl2.to(sphere.scale, {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.3
        })
            .to({}, { duration: 0.2 });
    } else {
        tl1.to(sphere.position, {
            z: -1,
            duration: 0.75
        });
        tl2.to(sphere.position, {
            y: 0,
            duration: 0.5
        });
        gsap.to(sphere.position, {
            x: -2,
            scrollTrigger: {
                trigger: hero.value,
                start: 'bottom 60%',
                end: 'bottom top',
                scrub: true
            }
        })
    }

    gsap.to(sphere.rotation, {
        y: 4 * Math.PI,
        scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true
        }
    });


    onUnmounted(() => {
        controls.dispose();
        renderer.dispose();
        sphereGeometry.dispose();
        sphereMaterial.dispose();
        torusGeometry.dispose();
        torusMaterial.dispose();
        window.removeEventListener('resize', onResize);
    });

    watch(isDark, (newValue) => {
        sphereMaterial.uniforms.uDarkMode.value = newValue;
        torusMaterial.color.set(getCSSColor('--color-primary'));
    });
    watch(colorMode, (newValue) => {
        sphereMaterial.uniforms.uDarkMode.value = newValue.value === 'dark';
        torusMaterial.color.set(getCSSColor('--color-primary'));
    })
});
</script>