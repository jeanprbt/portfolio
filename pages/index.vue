<template>
    <canvas ref="canvas" class="fixed z-2"></canvas>
    <div ref="hero" class="h-screen w-full bg-secondary text-primary transition-colors duration-500">
        <ClientOnly>
            <button @click="toggleDarkMode()"
                class="fixed top-10 left-10 text-primary hover:opacity-80 transition-opacity z-3">
                <Icon :name="isDark ? 'i-heroicons-moon' : 'i-heroicons-sun'" size="1.5em" />
            </button>
        </ClientOnly>
        <h1
            class="text-6xl font-primary font-bold  drop-shadow-sm dark:drop-shadow-primary absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-1 text-center">
            Hi, I'm <span class="font-secondary italic">Jean</span>.
        </h1>
    </div>
    <div ref="about" class="h-auto w-full flex bg-secondary text-primary transition-colors duration-500">
        <div class="w-2/5 hidden md:block"></div>
        <div class="w-full md:w-3/5 flex flex-col gap-4 items-center justify-center">
            <p ref="aboutText" class="w-2/3 font-text text-4xl md:text-8xl text-center">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
                scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap
                into electronic typesetting, remaining essentially unchanged.
            </p>
        </div>
    </div>
    <div ref="experience"
        class="h-screen w-full  bg-secondary text-primary transition-colors duration-500 flex justify-center items-center">
        <h1 class="text-6xl font-primary font-bold  drop-shadow-sm dark:drop-shadow-primary">Placeholder</h1>
    </div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import GUI from 'lil-gui';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/all';
gsap.registerPlugin(ScrollTrigger, SplitText);

import vertexShader from '~/assets/shaders/vertex.glsl?raw';
import fragmentShader from '~/assets/shaders/fragment.glsl?raw';


// COLOR MODE --------------------------------------------------
const colorMode = useColorMode();
const isDark = ref(colorMode.value === "dark" ? true : false);
const toggleDarkMode = () => isDark.value = !isDark.value;
watch(isDark, (newValue) => {
    document.documentElement.classList.toggle('dark', newValue)
});

// HTML ELEMENTS --------------------------------------------------
const canvas = ref(null);
const hero = ref(null);
const about = ref(null);
const aboutText = ref(null);
const experience = ref(null);

// UTILS --------------------------------------------------
const getCSSColor = (variable: string) => getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
const isSmallScreen = computed(() => window.innerWidth <= 755);
const smallScreenCamera = 3.5;
const regularScreenCamera = 3;

onMounted(() => {
    if (!canvas.value) return;

    // SCENE, RENDERER, CAMERA --------------------------------------------------
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ canvas: canvas.value, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    if (isSmallScreen.value) camera.position.z = smallScreenCamera;
    else camera.position.z = regularScreenCamera;

    // CONTROLS (DEBUG) --------------------------------------------------
    // const controls = new OrbitControls(camera, canvas.value);
    // controls.enableZoom = false;

    // SPHERE --------------------------------------------------
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
            uTorusTransition: { value: 1.0 },
            uDarkMode: { value: false },
            uBrightness: { value: 0.05 },
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
    });

    // LIL-GUI CONTROLS FOR UNIFORMS
    // const gui = new GUI();
    // const uniforms = sphereMaterial.uniforms;
    // gui.add(uniforms.uTimeFrequency, 'value').name('uTimeFrequency').min(0).max(5).step(0.01);
    // gui.add(uniforms.uDistortionFrequency, 'value').name('uDistortionFrequency').min(0).max(10).step(0.01);
    // gui.add(uniforms.uDistortionStrength, 'value').name('uDistortionStrength').min(0).max(10).step(0.01);
    // gui.add(uniforms.uDisplacementFrequency, 'value').name('uDisplacementFrequency').min(0).max(10).step(0.01);
    // gui.add(uniforms.uDisplacementStrength, 'value').name('uDisplacementStrength').min(0).max(2).step(0.01);
    // gui.add(uniforms.uBrightness, 'value').name('uBrightness').min(0).max(1).step(0.01);

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    // TORUS n°1 & n°2 --------------------------------------------------
    const torusGeometry = new THREE.TorusGeometry(1.5, 0.05, 10, 50);
    const torusMaterial = new THREE.MeshBasicMaterial({
        color: getCSSColor('--color-primary')
    })
    const torus1 = new THREE.Mesh(torusGeometry, torusMaterial);
    torus1.position.set(0, -6, -2);
    torus1.rotation.set(Math.PI / 2, -Math.PI / 5, 0);
    scene.add(torus1);
    const torus2 = new THREE.Mesh(torusGeometry, torusMaterial);
    torus2.position.set(0, -6, -2);
    torus2.rotation.set(Math.PI / 2, Math.PI / 5, 0);
    scene.add(torus2);

    // ANIMATION LOOP --------------------------------------------------
    const clock = new THREE.Clock();
    const animate = () => {
        sphereMaterial.uniforms.uTime.value = clock.getElapsedTime();
        sphereMaterial.uniforms.uTorusPosition.value.copy(sphereMaterial.uniforms.uTorusTransition.value === 1 ? torus1.position : torus2.position);
        sphereMaterial.uniforms.uTorusRotation.value.copy(sphereMaterial.uniforms.uTorusTransition.value === 1 ? torus1.rotation : torus2.rotation);
        renderer.render(scene, camera);
    };
    renderer.setAnimationLoop(animate);

    // RESIZE HANDLER --------------------------------------------------
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

    // ANIMATIONS -------------------------------------------------
    // sphere general rotation ----------
    gsap.to(sphere.rotation, {
        y: 20 * Math.PI,
        ease: 'none',
        scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
        }
    }); // ------------------------------

    // torus n°1 (hero) ----------
    gsap.timeline({
        scrollTrigger: {
            trigger: hero.value,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
        }
    })
        .to(torus1.position, { y: 6 })
        .to(torus1.rotation, { y: Math.PI / 4 }, "<");
    // ----------------------------

    // sphere movement n°1 (hero) ----------
    const sphereHeroTL = gsap.timeline({
        scrollTrigger: {
            trigger: hero.value,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
        }
    })
        .to(sphere.position, { y: -1, z: -2, ease: 'power1.out', duration: 0.25 });
    if (isSmallScreen.value) {
        sphereHeroTL
            .to(sphere.scale, { x: 0, y: 0, z: 0, duration: 0.2 }).to({}, { duration: 0.5 });
    } else {
        sphereHeroTL
            .to(sphere.position, { z: -1, duration: 0.75 })
            .to(sphere.position, { x: -2, y: 0, duration: 0.5 }, "<");
    }; // ----------------------------------

    // about text (about) ----------
    const split = new SplitText(aboutText.value, { type: "words" });
    gsap.from(split.words, {
        opacity: 0.1,
        stagger: 3,
        duration: 2,
        ease: "none",
        scrollTrigger: {
            trigger: about.value,
            endTrigger: experience.value,
            start: 'top 60%',
            end: 'top 60%',
            scrub: true,
        },
    });
    gsap.to(split.words, {
        opacity: 0,
        stagger: 3,
        duration: 2,
        ease: "none",
        scrollTrigger: {
            trigger: about.value,
            start: 'top+=20% top',
            end: 'bottom 30%',
            scrub: true,
        }
    }); // -------------------------

    // torus n°2 (experience) ----------
    gsap.timeline({
        scrollTrigger: {
            trigger: experience.value,
            start: 'top 50%',
            end: 'top top',
            scrub: true,
        }
    })
        .to(torus2.position, { y: 6 })
        .to(torus2.rotation, { y: - Math.PI / 5 }, "<");
    // ----------------------------

    // sphere movement n°2 (experience, torus) ----------
    ScrollTrigger.create({
        trigger: experience.value,
        start: "top bottom",
        onEnter: () => {
            sphereMaterial.uniforms.uTorusTransition.value = 2;
        },
        onLeaveBack: () => {
            sphereMaterial.uniforms.uTorusTransition.value = 1;
        }
    });
    const sphereExperienceTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: experience.value,
            start: 'top 70%',
            end: 'top 25%',
            scrub: true,
        }
    });
    if (isSmallScreen.value) {
        sphereExperienceTimeline
            .to(sphere.scale, { x: 1, y: 1, z: 1, ease: "none" })
            .to(sphere.position, { y: 0 }, "<");
    } else {
        sphereExperienceTimeline
            .to(sphere.position, { z: -2, x: 0 });
    }; // -----------------------------------------------

    // sphere movement n°3 (experience - scale out) ----------
    gsap.timeline({
        scrollTrigger: {
            trigger: experience.value,
            start: 'top 25%',
            end: 'top top',
            scrub: true,
        }
    })
        .to(sphere.scale, { x: 4, y: 4, z: 4 })
        .to(sphereMaterial.uniforms.uDisplacementStrength, { value: 0 }, "<")
        .to(sphereMaterial.uniforms.uBrightness, { value: 0 }, "<");

    ScrollTrigger.create({
        trigger: experience.value,
        start: "top top",
        onEnter: () => {
            sphere.scale.set(0, 0, 0);
        },
        onLeaveBack: () => {
            sphere.scale.set(5, 5, 5);
        }
    });
    // -------------------------------------------------------

    // COLOR MODE
    watch(isDark, (newValue) => {
        sphereMaterial.uniforms.uDarkMode.value = newValue;
        torusMaterial.color.set(getCSSColor('--color-primary'));
    });
    watch(colorMode, (newValue) => {
        sphereMaterial.uniforms.uDarkMode.value = newValue.value === 'dark';
        torusMaterial.color.set(getCSSColor('--color-primary'));
    });

    onUnmounted(() => {
        renderer.dispose();
        sphereGeometry.dispose();
        sphereMaterial.dispose();
        torusGeometry.dispose();
        torusMaterial.dispose();
        window.removeEventListener('resize', onResize);
    });
});
</script>