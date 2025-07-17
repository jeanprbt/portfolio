<template>
    <canvas ref="canvas" class="fixed z-2"></canvas>
    <div ref="hero" class="h-screen w-full bg-secondary text-primary transition-colors duration-500">
        <ClientOnly>
            <button @click="toggleDarkMode()"
                class="fixed top-10 left-10 text-primary hover:opacity-80 transition-opacity z-10">
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
            <p ref="aboutText" class="w-2/3 font-text text-3xl md:text-8xl text-center">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
                scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap
                into electronic typesetting, remaining essentially unchanged.
            </p>
        </div>
    </div>
    <div ref="experience" class="h-[150vh] w-full  bg-secondary text-primary transition-colors duration-500">
        <div ref="experienceContent" :style="`clip-path: circle(${sphereRadiusPixels}px at 50% 50%)`"
            class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full z-3">
            <p ref="experienceText" class="font-text text-3xl md:text-8xl text-center opacity-0">
                <DottedMap />
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import * as THREE from 'three';

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

// LAYOUT --------------------------------------------------
const sphereRadiusPixels = ref(0);

// HTML ELEMENTS --------------------------------------------------
const canvas = ref(null);
const hero = ref(null);
const about = ref(null);
const aboutText = ref(null);
const experience = ref(null);
const experienceContent = ref(null);
const experienceText = ref(null);

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
        // update sphere
        sphereMaterial.uniforms.uTime.value = clock.getElapsedTime();
        sphereMaterial.uniforms.uTorusPosition.value.copy(sphereMaterial.uniforms.uTorusTransition.value === 1 ? torus1.position : torus2.position);
        sphereMaterial.uniforms.uTorusRotation.value.copy(sphereMaterial.uniforms.uTorusTransition.value === 1 ? torus1.rotation : torus2.rotation);
        renderer.render(scene, camera);

        // update clip-mask
        const fov = camera.fov * (Math.PI / 180);
        const distance = Math.abs(camera.position.z - sphere.position.z);
        const visibleHeight = 2 * Math.tan(fov / 2) * distance;
        const pixelsPerUnit = window.innerHeight / visibleHeight;
        sphereRadiusPixels.value = sphere.scale.x * pixelsPerUnit;
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
            start: 'top 60%',
            end: 'bottom 60%',
            scrub: true,
        },
    });
    gsap.to(aboutText.value, {
        opacity: 0,
        scrollTrigger: {
            trigger: about.value,
            start: 'bottom 60%',
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
            end: 'bottom bottom',
            scrub: true,
        }
    })
        .to(sphere.scale, { x: 8, y: 8, z: 8, ease: "none" })
        .to(experienceText.value, { opacity: 1 }, "<");
        
    gsap.to(sphereMaterial.uniforms.uDisplacementStrength, { value: 0,
            scrollTrigger: {
                trigger: experience.value,
                start: 'top 35%',
                end: 'top 25%',
                scrub: true,
            }
        }
    );
    gsap.to(sphereMaterial.uniforms.uBrightness, {
        value: 0,
        scrollTrigger: {
            trigger: experience.value,
            start: 'top 35%',
            end: 'top 10%',
            scrub: true,
        }
    });

    // COLOR MODE -------------------------------------------------
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
