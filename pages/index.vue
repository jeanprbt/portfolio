<template>
    <canvas ref="canvas" class="fixed z-2"></canvas>
    <ClientOnly>
        <DarkModeToggle @toggle="toggleDarkMode" :is-dark="isDark" />
    </ClientOnly>
    <div ref="hero" class="h-lvh md:h-screen w-full bg-secondary text-primary transition-colors duration-500">
        <h1 :class="[
            'absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-1',
            'font-primary text-center',
            'text-6xl md:text-[4.25rem] lg:text-7xl xl:text-8xl 2xl:text-9xl',
        ]">
            Hi<span class="text-highlight">,</span> I<span class="text-highlight">'</span>m <span
                class="font-secondary italic">Jean</span><span class="text-highlight">.</span>
        </h1>
    </div>
    <div ref="about" class="h-auto w-full flex bg-secondary text-primary transition-colors duration-500">
        <div class="w-2/5 hidden lg:block"></div>
        <div class="w-full lg:w-3/5 flex flex-col gap-4 items-center justify-center">
            <p ref="aboutText" :class="[
                'w-4/5 font-text text-center',
                'text-3xl sm:text-5xl md:text-6xl xl:text-7xl 2xl:text-8xl',
            ]">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry<span
                    class="text-highlight">.</span> Lorem Ipsum has been the
                industry<span class="text-highlight">'</span>s standard dummy text ever since the 1500s<span
                    class="text-highlight">,</span> when an unknown printer took a galley of type and
                scrambled it to make a type specimen book<span class="text-highlight">.</span> It has survived not only
                five centuries<span class="text-highlight">,</span> but also the leap
                into electronic typesetting<span class="text-highlight">,</span> remaining essentially unchanged<span
                    class="text-highlight">.</span>
            </p>
        </div>
    </div>
    <div ref="experience"
        class="h-[350vh] lg:h-[400vh] w-full bg-secondary text-primary transition-colors duration-500">
        <div ref="experienceFrame" :style="`clip-path: circle(${sphereRadiusPixels}px at 50% 50%)`" :class="[
            'fixed h-svh md:h-screen w-full z-3',
            'top-0 left-1/2 transform -translate-x-1/2',
            { 'pointer-events-none': !hoverJobs }
        ]">
            <div ref="experienceContent"
                class="h-full flex flex-col justify-center lg:justify-between items-center opacity-0">
                <ClientOnly>
                    <DottedMap :md="md" :city="selectedJob?.city || 'none'"
                        class="w-full md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[65vw] 2xl:max-w-[60vw] transition-transform duration-300" />
                </ClientOnly>
                <div :class="[
                    'w-5/6 lg:w-11/12 -mt-5 sm:-mt-10 md:-mt-20 lg:-mt-100 lg:mb-10 2xl:mb-15',
                    'text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl',
                ]">
                    <p v-for="pair in [
                        { label: 'ROLE', value: selectedJob ? selectedJob.role : '' },
                        { label: 'PERIOD', value: selectedJob ? selectedJob.period : '' },
                        { label: 'INFO', value: selectedJob ? selectedJob.info : ' '.repeat(380) }
                    ]" :key="pair.label"
                        :class="['text-justify transition-opacity duration-500', { 'opacity-0': !selectedJob }]">
                        <span class="font-primary text-highlight">{{ pair.label }}</span>
                        <transition mode="out-in" enter-from-class="opacity-0" enter-active-class="duration-200 ease-in"
                            enter-to-class="opacity-100" leave-from-class="opacity-100"
                            leave-active-class="duration-200 ease-in" leave-to-class="opacity-0">
                            <span :key="pair.value"
                                :class="['font-text ml-2', { 'whitespace-break-spaces': !selectedJob }]">{{ pair.value
                                }}</span>
                        </transition>
                    </p>
                </div>
                <div :class="[
                    'fixed top-20 lg:top-0 left-1/2 lg:left-auto lg:right-10 transform -translate-x-1/2 lg:translate-x-0',
                    'font-primary text-center lg:text-right',
                    'text-[7vw] lg:text-[20vh] lg:leading-none',
                    'flex flex-row lg:flex-col gap-2 sm:gap-4 md:gap-6 lg:gap-0',
                ]">
                    <div v-for="job in jobs" :key="job.id" :class="[
                        'transition-opacity duration-500 w-full',
                        { 'opacity-5 dark:opacity-10': (selectedJob === null) || selectedJob?.id !== job.id },
                    ]" @mouseenter="selectedJob = job" @mouseleave="selectedJob = null">
                        {{ job.label }}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div ref="projects" class="h-screen w-full bg-secondary text-primary transition-colors duration-500"></div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/all';
gsap.registerPlugin(ScrollTrigger, SplitText);

import vertexShader from '~/assets/shaders/vertex.glsl?raw';
import fragmentShader from '~/assets/shaders/fragment.glsl?raw';
import jobs from '~/content/jobs.json';

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
type Job = {
    id: string;
    label: string;
    role: string;
    period: string;
    city: string;
    info: string;
};
const selectedJob = ref<Job | null>(null);

// HTML ELEMENTS --------------------------------------------------
const canvas = ref(null);
const hero = ref(null);
const about = ref(null);
const aboutText = ref(null);
const experience = ref(null);
const experienceFrame = ref(null);
const experienceContent = ref(null);
const projects = ref(null);

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
            uTorusTransition: { value: 1.0 },
            uDarkMode: { value: false },
            uBrightness: { value: 0.05 },
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
    const sphere2 = sphere.clone();
    sphere2.material = sphereMaterial;
    sphere2.visible = false;
    scene.add(sphere2);
    const sphere3 = sphere.clone();
    sphere3.material = sphereMaterial;
    sphere3.visible = false;
    scene.add(sphere3);
    const sphere4 = sphere.clone();
    sphere4.material = sphereMaterial;
    sphere4.visible = false;
    scene.add(sphere4);

    // TORUSES --------------------------------------------------
    const fontLoader = new FontLoader();
    const torusMaterial = new THREE.MeshBasicMaterial({
        color: getCSSColor('--color-primary')
    });
    let torus1: THREE.Mesh;
    let torus2: THREE.Mesh;
    let torus3: THREE.Mesh;
    let torus1Geometry: TextGeometry;
    let torus2Geometry: TextGeometry;
    let torus3Geometry: TextGeometry;
    fontLoader.load('/font.json', (font: Font) => {
        const positionOnCylinder = (geometry: TextGeometry, cylinderRadius: number) => {
            const positions = geometry.attributes.position;
            for (let i = 0; i < positions.count; i++) {
                const x = positions.getX(i);
                const y = positions.getY(i);
                const z = positions.getZ(i);

                const angle = -(x / cylinderRadius) * Math.PI * 2;
                const newX = cylinderRadius * Math.cos(angle);
                const newZ = cylinderRadius * Math.sin(angle);

                positions.setX(i, newX);
                positions.setY(i, y);
                positions.setZ(i, newZ + z);
            }
            positions.needsUpdate = true;
        };

        // TORUS n°1 "ABOUT"
        const torus1Radius = 2;
        torus1Geometry = new TextGeometry('ABOUT', {
            font: font,
            size: 0.25,
            depth: 0.1,
        }).scale(1, 2, 1);
        positionOnCylinder(torus1Geometry, torus1Radius);
        torus1 = new THREE.Mesh(torus1Geometry, torusMaterial);
        torus1.position.set(0, -8, -2);
        torus1.rotation.set(0, 2.25 * Math.PI, 0);
        scene.add(torus1);

        gsap.timeline({
            scrollTrigger: {
                trigger: hero.value,
                start: 'top top',
                end: 'bottom top',
                scrub: true,
            }
        }).to(torus1.position, {
            y: 8
        }).to(torus1.rotation, {
            y: -0.5 * Math.PI
        }, "<");

        // TORUS n°2 "EXPERIENCE"
        const torus2Radius = 2.25;
        torus2Geometry = new TextGeometry('EXPERIENCE', {
            font: font,
            size: 0.2,
            depth: 0.1
        }).scale(1, 3, 1);
        positionOnCylinder(torus2Geometry, torus2Radius);
        torus2 = new THREE.Mesh(torus2Geometry, torusMaterial);
        torus2.position.set(0, -8, -2);
        torus2.rotation.set(0, 2.5 * Math.PI, 0);
        scene.add(torus2);

        gsap.timeline({
            scrollTrigger: {
                trigger: experience.value,
                start: lg.value ? 'top 60%' : 'top 40%',
                end: 'top top',
                scrub: true,
            }
        }).to(torus2.position, {
            y: 8
        }).to(torus2.rotation, {
            y: -0.75 * Math.PI
        }, "<");

        // TORUS n°3 "PROJECTS"
        const torus3Radius = 2.1;
        torus3Geometry = new TextGeometry('PROJECTS', {
            font: font,
            size: 0.25,
            depth: 0.1
        }).scale(1, 2.5, 1);
        positionOnCylinder(torus3Geometry, torus3Radius);
        torus3 = new THREE.Mesh(torus3Geometry, torusMaterial);
        torus3.position.set(0, -8, -2);
        torus3.rotation.set(0, 2.25 * Math.PI, 0);
        scene.add(torus3);

        gsap.timeline({
            scrollTrigger: {
                trigger: experience.value,
                start: 'bottom 75%',
                end: 'bottom top',
                scrub: true,
            }
        }).to(torus3.position, {
            y: 8
        }).to(torus3.rotation, {
            y: -0.5 * Math.PI
        }, "<");
    });

    // ANIMATION LOOP --------------------------------------------------
    const clock = new THREE.Clock();
    const animate = () => {
        // update sphere
        sphereMaterial.uniforms.uTime.value = clock.getElapsedTime();
        const transition = sphereMaterial.uniforms.uTorusTransition.value;
        if (torus1) {
            if (transition === 1) sphereMaterial.uniforms.uTorusPosition.value.copy(torus1.position);
            else if (transition === 2) sphereMaterial.uniforms.uTorusPosition.value.copy(torus2.position);
            else if (transition === 3) sphereMaterial.uniforms.uTorusPosition.value.copy(torus3.position);
        }
        renderer.render(scene, camera);

        // update projects spheres
        sphere2.rotation.copy(sphere.rotation);
        sphere2.scale.copy(sphere.scale);
        sphere3.rotation.copy(sphere.rotation);
        sphere3.scale.copy(sphere.scale);
        sphere4.rotation.copy(sphere.rotation);
        sphere4.scale.copy(sphere.scale);

        // update clip-mask
        const fov = camera.fov * (Math.PI / 180);
        const distance = Math.abs(camera.position.z - sphere.position.z);
        const visibleHeight = 2 * Math.tan(fov / 2) * distance;
        const pixelsPerUnit = window.innerHeight / visibleHeight;
        sphereRadiusPixels.value = sphere.scale.x * pixelsPerUnit;
        if (!lg.value) sphereRadiusPixels.value -= 6;
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
    gsap.timeline({
        scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
        }
    }).to(sphere.rotation, {
        y: 30 * Math.PI,
        ease: 'none',
    }); // ------------------------------

    // sphere movement n°1 (hero, sphere @ torus) ----------
    const sphereHeroTL = gsap.timeline({
        scrollTrigger: {
            trigger: hero.value,
            endTrigger: about.value,
            start: 'top top',
            end: 'top+=10% top',
            scrub: true,
        }
    }).to(sphere.position, {
        y: -1,
        z: -2,
        ease: 'power1.out',
        duration: 0.25
    });
    if (lg.value) {
        sphereHeroTL.to(sphere.position, {
            z: -1,
            duration: 0.75
        }).to(sphere.position, {
            x: -2,
            y: 1,
            duration: 0.5
        }, "<");
    } else {
        sphereHeroTL.to(sphere.scale, {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.2
        }).to({}, { duration: 0.5 });
    }; // --------------------------------------------------

    // about text (about) ----------
    const split = new SplitText(aboutText.value, { type: "words" });
    gsap.timeline({
        scrollTrigger: {
            trigger: about.value,
            start: 'top 60%',
            end: 'bottom 60%',
            scrub: true
        }
    }).from(split.words, {
        opacity: 0.1,
        stagger: 3,
        duration: 2,
        ease: "none",
    });
    gsap.timeline({
        scrollTrigger: {
            trigger: about.value,
            start: 'bottom 60%',
            end: 'bottom 30%',
            scrub: true,
        }
    }).to(aboutText.value, {
        opacity: 0,
    }); // -------------------------

    // sphere movement n°2 (about, sphere) ----------
    if (lg.value) {
        gsap.timeline({
            scrollTrigger: {
                trigger: about.value,
                endTrigger: experience.value,
                start: 'top top',
                end: 'top 30%',
                scrub: true,
            }
        }).to(sphere.position, {
            y: -1,
            duration: 0.8,
            ease: "none"
        }).to(sphere.position, {
            y: 0,
            duration: 0.2,
            ease: "none"
        });
    } // --------------------------------------------

    // sphere movement n°3 (experience, sphere @ torus) ----------
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
    let sphereExperienceTL = gsap.timeline({
        scrollTrigger: {
            trigger: experience.value,
            start: lg.value ? 'top 70%' : 'top 60%',
            end: lg.value ? 'top 35%' : 'top 25%',
            scrub: true,
        }
    });
    if (lg.value) {
        sphereExperienceTL.to(sphere.position, {
            z: -2,
            x: 0
        });
    } else {
        sphereExperienceTL.to(sphere.scale, {
            x: 1,
            y: 1,
            z: 1,
            ease: "none"
        }).to(sphere.position, {
            y: 0
        }, "<");
    }; // --------------------------------------------------------

    // sphere movement n°4 (experience - scale out) ----------
    let scale = lg.value ? 8 : 5;
    gsap.timeline({
        scrollTrigger: {
            trigger: experience.value,
            start: 'top 25%',
            end: '+=75%',
            scrub: true,
        }
    }).to(sphere.scale, {
        x: scale,
        y: scale,
        z: scale,
        ease: "none",
    });
    gsap.timeline({
        scrollTrigger: {
            trigger: experience.value,
            start: 'top 25%',
            end: 'top 20%',
            scrub: true
        }
    }).to(experienceContent.value, {
        opacity: 1,
    });
    gsap.timeline({
        scrollTrigger: {
            trigger: experience.value,
            start: 'top 35%',
            end: 'top 25%',
            scrub: true,
        }
    }).to(sphereMaterial.uniforms.uDisplacementStrength, {
        value: 0,
    });
    gsap.timeline({
        scrollTrigger: {
            trigger: experience.value,
            start: 'top 35%',
            end: 'top 10%',
            scrub: true,
        }
    }).to(sphereMaterial.uniforms.uBrightness, {
        value: 0,
    }); // ---------------------------------------------------

    // scrolling through jobs (experience, selectedJob) ----------
    const base = lg.value ? window.innerHeight / 2 : window.innerHeight / 4;
    const sectionHeight = window.innerHeight / 2;
    const jobKeys = ['kth', 'finplify', 'epfl', 'cern'];
    jobKeys.forEach((key, idx) => {
        ScrollTrigger.create({
            trigger: experience.value,
            start: () => `top+=${base + idx * sectionHeight} top`,
            onEnter: () => selectedJob.value = jobs[key as keyof typeof jobs],
            onLeaveBack: () => selectedJob.value = idx > 0 ? jobs[jobKeys[idx - 1] as keyof typeof jobs] : null,
        });
        if (idx === jobKeys.length - 1) {
            ScrollTrigger.create({
                trigger: experience.value,
                start: () => `top+=${base + (idx + 1) * sectionHeight} top`,
                onEnter: () => selectedJob.value = null,
                onLeaveBack: () => selectedJob.value = jobs[jobKeys[idx] as keyof typeof jobs],
            });
        }
    }); // -------------------------------------------------------

    // sphere movement n°5 (experience - scale in) ----------
    gsap.timeline({
        scrollTrigger: {
            trigger: experience.value,
            start: `top+=${base + (jobKeys.length * sectionHeight)} top`,
            end: lg.value ? "+=75%" : "bottom 75%",
            scrub: true,
        }
    }).to(sphere.scale, {
        x: 1,
        y: 1,
        z: 1,
        ease: "none"
    });
    gsap.timeline({
        scrollTrigger: {
            trigger: experience.value,
            start: 'bottom 80%',
            end: 'bottom 75%',
            scrub: true,
        }
    }).to(experienceContent.value, {
        opacity: 0,
    });

    gsap.timeline({
        scrollTrigger: {
            trigger: experience.value,
            start: 'bottom 75%',
            end: 'bottom 65%',
            scrub: true,
        }
    }).to(sphereMaterial.uniforms.uDisplacementStrength, {
        value: 0.1,
    });
    gsap.timeline({
        scrollTrigger: {
            trigger: experience.value,
            start: 'bottom 80%',
            end: 'bottom 60%',
            scrub: true,
        }
    }).to(sphereMaterial.uniforms.uBrightness, {
        value: 0.05,
    }); // ---------------------------------------------------

    // sphere movement n°6 (projects, sphere @ torus)
    ScrollTrigger.create({
        trigger: experience.value,
        start: "bottom bottom",
        onEnter: () => {
            sphereMaterial.uniforms.uTorusTransition.value = 3;
        },
        onLeaveBack: () => {
            sphereMaterial.uniforms.uTorusTransition.value = 2;
        }
    });

    gsap.timeline({
        scrollTrigger: {
            trigger: projects.value,
            start: 'top 40%',
            end: 'top top',
            scrub: true,
        }
    }).to(sphereMaterial.uniforms.uDisplacementStrength, {
        value: 0,
        duration: 0.1
    }).to(sphere.position, {
        x: md.value ? 1.5 : 0,
        y: md.value ? 1.5 : 3
    }).to(sphere2.position, {
        x: md.value ? -1.5 : 0,
        y: md.value ? 1.5 : 1
    }, "<").to(sphere3.position, {
        x: md.value ? 1.5 : 0,
        y: md.value ? -1.5 : -1
    }, "<").to(sphere4.position, {
        x: md.value ? -1.5 : 0,
        y: md.value ? -1.5 : -3
    }, "<").to(sphere.scale, {
        x: md.value ? 0.8 : 0.6,
        y: md.value ? 0.8 : 0.6,
        z: md.value ? 0.8 : 0.6
    }, "<").to(sphereMaterial.uniforms.uDisplacementStrength, {
        value: 0.09,
    }, "<+=30%").to(sphereMaterial.uniforms.uDisplacementFrequency, {
        value: 0.5
    }, "<");

    ScrollTrigger.create({
        trigger: projects.value,
        start: "top 40%",
        onEnter: () => {
            sphere2.position.copy(sphere.position);
            sphere2.visible = true;
            sphere3.position.copy(sphere.position);
            sphere3.visible = true;
            sphere4.position.copy(sphere.position);
            sphere4.visible = true;
        },
        onLeaveBack: () => {
            sphere2.visible = false;
            sphere3.visible = false;
            sphere4.visible = false;
        }
    })

    // COLOR MODE -------------------------------------------------
    watch(isDark, (newValue) => {
        sphereMaterial.uniforms.uDarkMode.value = newValue;
        torusMaterial.color.set(getCSSColor('--color-primary'));
    });
    watch(colorMode, (newValue) => {
        isDark.value = newValue.value === 'dark';
        sphereMaterial.uniforms.uDarkMode.value = newValue.value === 'dark';
        torusMaterial.color.set(getCSSColor('--color-primary'));
    });

    onUnmounted(() => {
        renderer.dispose();
        sphereGeometry.dispose();
        sphereMaterial.dispose();
        torus1Geometry.dispose();
        torus2Geometry.dispose();
        torus3Geometry.dispose();
        torusMaterial.dispose();
        window.removeEventListener('resize', onResize);
    });
});
</script>
