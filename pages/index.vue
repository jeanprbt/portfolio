<template>
    <canvas ref="canvas" class="fixed z-2"></canvas>
    <div ref="hero" class="h-screen w-full bg-secondary text-primary transition-colors duration-500">
        <ClientOnly>
            <button @click="toggleDarkMode()"
                class="fixed top-10 left-10 text-primary hover:opacity-80 transition-opacity z-10">
                <Icon :name="isDark ? 'i-heroicons-moon' : 'i-heroicons-sun'" size="1.5em" />
            </button>
        </ClientOnly>
        <h1 :class="[
            'absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-1',
            'font-primary text-center',
            'text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl',
            'drop-shadow-sm dark:drop-shadow-primary'
        ]">
            Hi, I'm <span class="font-secondary italic">Jean</span>.
        </h1>
    </div>
    <div ref="about" class="h-auto w-full flex bg-secondary text-primary transition-colors duration-500">
        <div class="w-2/5 hidden lg:block"></div>
        <div class="w-full lg:w-3/5 flex flex-col gap-4 items-center justify-center">
            <p ref="aboutText" :class="[
                'w-4/5 font-text text-center',
                'text-3xl sm:text-5xl md:text-6xl xl:text-7xl 2xl:text-8xl',
            ]">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
                scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap
                into electronic typesetting, remaining essentially unchanged.
            </p>
        </div>
    </div>
    <div ref="experience" class="h-[150vh] w-full bg-secondary text-primary transition-colors duration-500">
        <div ref="experienceFrame" :style="`clip-path: circle(${sphereRadiusPixels}px at 50% 50%)`" :class="[
            'fixed h-screen w-full z-3',
            'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
            { 'pointer-events-none': !hoverJobs }
        ]">
            <div ref="experienceContent" :class="[
                'h-full opacity-0',
                { 'flex flex-col justify-center': !lg }
            ]">
                <ClientOnly>
                    <DottedMap :md="md" :job="job"
                        class="w-full md:max-w-[80vw] lg:max-w-[75vw] xl:max-w-[65vw] 2xl:max-w-[60vw]" />
                </ClientOnly>
                <div :class="[
                    'text-sm sm:text-base lg:text-lg',
                    'mx-10 sm:mx-15 -mt-5 sm:-mt-10',
                    { 'fixed bottom-8': lg }
                ]">
                    <p>
                        <span class="font-primary opacity-40">ROLE</span>
                        <transition 
                            mode="out-in"
                            enter-from-class="opacity-0"
                            enter-active-class="duration-200 ease-in"
                            enter-to-class="opacity-100" 
                            leave-from-class="opacity-100"
                            leave-active-class="duration-200 ease-in" 
                            leave-to-class="opacity-0"
                        >
                            <span :key="role" :class="['font-text ml-2 transition-opacity duration-200', { 'opacity-0': job === 'none' }]">{{ role }}</span>
                        </transition>
                    </p>
                    <p>
                        <span class="font-primary opacity-40">PERIOD</span>
                        <transition 
                            mode="out-in"
                            enter-from-class="opacity-0"
                            enter-active-class="duration-200 ease-in"
                            enter-to-class="opacity-100" 
                            leave-from-class="opacity-100"
                            leave-active-class="duration-200 ease-in" 
                            leave-to-class="opacity-0"
                        >
                            <span :key="period" :class="['font-text ml-2 transition-opacity duration-200', { 'opacity-0': job === 'none' }]">{{ period }}</span>
                        </transition>
                    </p>
                    <p class="text-justify">
                        <span class="font-primary opacity-40">INFO</span>
                        <transition 
                            mode="out-in"
                            enter-from-class="opacity-0"
                            enter-active-class="duration-200 ease-in"
                            enter-to-class="opacity-100" 
                            leave-from-class="opacity-100"
                            leave-active-class="duration-200 ease-in" 
                            leave-to-class="opacity-0"
                        >
                            <span :key="info" :class="['font-text ml-2 transition-opacity duration-200', { 'opacity-0': job === 'none' }]">{{ info }}</span>
                        </transition>
                    </p>
                </div>
                <div :class="[
                    'fixed w-5/6 top-0 left-1/2 lg:left-auto lg:right-0',
                    'transform -translate-x-1/2 lg:translate-x-0',
                    'font-primary text-center lg:text-right',
                    'lg:mr-10 mt-20 lg:mt-4 xl:mt-0',
                    'text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[10.5rem]',
                    'lg:flex lg:flex-col lg:w-auto gap-4',
                ]">
                    <div class="flex flex-row lg:flex-col justify-center">
                        <div :class="[
                            'transition-opacity duration-200 w-full',
                            { 'opacity-10': job !== 'none' && job !== 'kth' },
                        ]" @mouseenter="job = 'kth'" @mouseleave="job = 'none'">KTH</div>
                        <div :class="[
                            'transition-opacity duration-200 w-full',
                            { 'opacity-10': job !== 'none' && job !== 'finplify' },
                        ]" @mouseenter="job = 'finplify'" @mouseleave="job = 'none'">Finplify</div>
                    </div>
                    <div class="flex flex-row lg:flex-col justify-center">
                        <div :class="[
                            'transition-opacity duration-200 w-full',
                            { 'opacity-10': job !== 'none' && job !== 'epfl' },
                        ]" @mouseenter="job = 'epfl'" @mouseleave="job = 'none'">EPFL</div>
                        <div :class="[
                            'transition-opacity duration-200 w-full',
                            { 'opacity-10': job !== 'none' && job !== 'cern' },
                        ]" @mouseenter="job = 'cern'" @mouseleave="job = 'none'">CERN</div>
                    </div>
                </div>
            </div>
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
const hoverJobs = ref(false);
const job = ref('none');
const role = ref('');
const period = ref('');
const info = ref('Cras commodo commodo nisi vitae euismod. Cras vitae pharetra tortor. Nulla vel massa congue, ultrices elit ut, facilisis nunc. In ut mollis augue. Nullam a tellus metus. Aenean nisl orci, luctus sit amet tincidunt at, auctor eu augue. Phasellus vulputate elit ligula, porttitor luctus metus dignissim quis. Vestibulum accumsan convallis arcu, eget commodo ex tincidunt at. Fusce molestie porta metus.');

// HTML ELEMENTS --------------------------------------------------
const canvas = ref(null);
const hero = ref(null);
const about = ref(null);
const aboutText = ref(null);
const experience = ref(null);
const experienceFrame = ref(null);
const experienceContent = ref(null);

// UTILS --------------------------------------------------
const getCSSColor = (variable: string) => getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
const windowWidth = ref(0);
const md = computed(() => windowWidth.value >= 768);
const lg = computed(() => windowWidth.value >= 1024);
const mediumScreenCamera = 3;
const smallScreenCamera = 3.5;

onMounted(() => {
    if (!canvas.value) return;

    // SCENE, RENDERER, CAMERA --------------------------------------------------
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ canvas: canvas.value, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

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
        windowWidth.value = window.innerWidth;
        if (md.value) camera.position.z = mediumScreenCamera;
        else camera.position.z = smallScreenCamera;
        if (window.innerWidth != lastWidth) {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            lastWidth = window.innerWidth;
        }
    };
    window.addEventListener('resize', onResize);
    onResize();

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
    if (lg.value) {
        sphereHeroTL
            .to(sphere.position, { z: -1, duration: 0.75 })
            .to(sphere.position, { x: -2, y: 0, duration: 0.5 }, "<");
    } else {
        sphereHeroTL
            .to(sphere.scale, { x: 0, y: 0, z: 0, duration: 0.2 }).to({}, { duration: 0.5 });
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
            scrub: true
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
    if (lg.value) {
        sphereExperienceTimeline
            .to(sphere.position, { z: -2, x: 0 });
    } else {
        sphereExperienceTimeline
            .to(sphere.scale, { x: 1, y: 1, z: 1, ease: "none" })
            .to(sphere.position, { y: 0 }, "<");
    }; // -----------------------------------------------

    // sphere movement n°3 (experience - scale out) ----------
    gsap.to(sphere.scale, {
        x: 8,
        y: 8,
        z: 8,
        ease: "none",
        scrollTrigger: {
            trigger: experience.value,
            start: 'top 25%',
            end: 'bottom bottom',
            scrub: true,
        }
    });
    gsap.to(experienceContent.value, {
        opacity: 1,
        scrollTrigger: {
            trigger: experience.value,
            start: 'top 25%',
            end: 'top 20%',
            scrub: true
        }
    });
    gsap.to(sphereMaterial.uniforms.uDisplacementStrength, {
        value: 0,
        scrollTrigger: {
            trigger: experience.value,
            start: 'top 35%',
            end: 'top 25%',
            scrub: true,
        }
    });
    gsap.to(sphereMaterial.uniforms.uBrightness, {
        value: 0,
        scrollTrigger: {
            trigger: experience.value,
            start: 'top 35%',
            end: 'top 10%',
            scrub: true,
        }
    });
    ScrollTrigger.create({
        trigger: experience.value,
        start: "bottom-=1% bottom",
        onEnter: () => hoverJobs.value = true,
        onLeaveBack: () => hoverJobs.value = false
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
    watch(job, (newValue) => {
        if (newValue === 'kth') {
            role.value = 'Student Assistant';
            period.value = '02/2024 - 05/2024';
            info.value = 'Proin nec suscipit justo, eget tristique mauris. Fusce interdum dolor nisi, vel elementum nunc accumsan vel. Curabitur laoreet et elit a porttitor. Morbi a commodo massa. Nullam quam ligula, pulvinar id scelerisque in, bibendum sed sapien. In aliquet fermentum lectus eu bibendum. Ut sit amet libero sit amet diam volutpat vulputate eget rhoncus sem. Curabitur dictum at velit eu mollis.';
        } else if (newValue === 'finplify') {
            role.value = 'Data Science Intern';
            period.value = '06/2024 - 08/2024';
            info.value = 'Fusce sagittis quam id nisl porta interdum. Integer ac leo volutpat metus pretium commodo vitae eget neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vitae dignissim nisi, ac pellentesque lorem. Aenean ac volutpat turpis. Vestibulum mattis pellentesque fringilla. Etiam iaculis nunc eu justo varius pretium. Phasellus vulputate sollicitudin elit at venenatis. Praesent id consectetur ante.';
        } else if (newValue === 'epfl') {
            role.value = 'ML Research Assistant';
            period.value = '03/2025 - 05/2025';
            info.value = 'Cras commodo commodo nisi vitae euismod. Cras vitae pharetra tortor. Nulla vel massa congue, ultrices elit ut, facilisis nunc. In ut mollis augue. Nullam a tellus metus. Aenean nisl orci, luctus sit amet tincidunt at, auctor eu augue. Phasellus vulputate elit ligula, porttitor luctus metus dignissim quis. Vestibulum accumsan convallis arcu, eget commodo ex tincidunt at. Fusce molestie porta metus.';
        } else if (newValue === 'cern') {
            role.value = 'DataOps Intern';
            period.value = '06/2025 - 08/2025';
            info.value = 'Maecenas nec venenatis sem, non tempor massa. Nulla quis dui lacus. Pellentesque in lectus urna. Maecenas a risus tempus neque vulputate varius. Phasellus id maximus magna. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer interdum in nunc sit amet interdum. Pellentesque ac sem nunc. Cras at mauris vel nisl sollicitudin venenatis. Maecenas libero arcu, lobortis ac diam.';
        } else {
            role.value = '';
            period.value = '';
            info.value = 'Cras commodo commodo nisi vitae euismod. Cras vitae pharetra tortor. Nulla vel massa congue, ultrices elit ut, facilisis nunc. In ut mollis augue. Nullam a tellus metus. Aenean nisl orci, luctus sit amet tincidunt at, auctor eu augue. Phasellus vulputate elit ligula, porttitor luctus metus dignissim quis. Vestibulum accumsan convallis arcu, eget commodo ex tincidunt at. Fusce molestie porta metus.';
        }
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
