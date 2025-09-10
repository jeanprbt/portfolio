import type { ShallowRef } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

import jobs from '~/content/jobs.json';

export const useExperienceAnimations = (
    experience: Ref,
    experienceContent: Ref,
    sphere: ShallowRef,
    toruses: ShallowRef
) => {

    const windowWidth = ref(0);
    const lg = computed(() => windowWidth.value >= 1024);

    type Job = {
        id: string;
        label: string;
        role: string;
        period: string;
        city: string;
        info: string;
    };
    const selectedJob = ref<Job | null>(null);

    onMounted(() => {
        // WINDOW SIZE
        let lastWidth = window.innerWidth;
        const onResize = () => {
            windowWidth.value = window.innerWidth;
            if (window.innerWidth != lastWidth) {
                lastWidth = window.innerWidth;
            }
        };
        window.addEventListener('resize', onResize);
        onResize();

       // TORUSES
        watch(toruses, (newVal) => {
            if (newVal.length === 4) {
                gsap.timeline({
                    scrollTrigger: {
                        trigger: experience.value,
                        start: lg.value ? 'top 60%' : 'top 40%',
                        end: 'top top',
                        scrub: true,
                    }
                }).to(toruses.value[1].position, {
                    y: 8
                }).to(toruses.value[1].rotation, {
                    y: -1.25 * Math.PI
                }, "<");

                gsap.timeline({
                    scrollTrigger: {
                        trigger: experience.value,
                        start: 'bottom 75%',
                        end: 'bottom top',
                        scrub: true,
                    }
                }).to(toruses.value[2].position, {
                    y: 8
                }).to(toruses.value[2].rotation, {
                    y: -0.5 * Math.PI
                }, "<");
            };
        });

        // SPHERE - TORUS
        ScrollTrigger.create({
            trigger: experience.value,
            start: "top bottom",
            onEnter: () => sphere.value!.material.uniforms.uTorusTransition.value = 2,
            onLeaveBack: () => sphere.value!.material.uniforms.uTorusTransition.value = 1
        });
        let sphereExperienceTL = gsap.timeline({
            scrollTrigger: {
                trigger: experience.value,
                start: lg.value ? 'top 70%' : 'top 55%',
                end: lg.value ? 'top 35%' : 'top 25%',
                scrub: true,
            }
        });
        if (lg.value) {
            sphereExperienceTL.to(sphere.value!.position, {
                z: -2,
                x: 0
            });
        } else {
            sphereExperienceTL.to(sphere.value!.scale, {
                x: 1,
                y: 1,
                z: 1,
                ease: "none"
            }).to(sphere.value!.position, {
                y: 0
            }, "<");
        };

        // SPHERE - SCALE OUT
        let scale = lg.value ? 8 : 5;
        gsap.timeline({
            scrollTrigger: {
                trigger: experience.value,
                start: 'top 25%',
                end: '+=75%',
                scrub: true,
            }
        }).to(sphere.value!.scale, {
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
        }).to(sphere.value!.material.uniforms.uDisplacementStrength, {
            value: 0,
        });
        gsap.timeline({
            scrollTrigger: {
                trigger: experience.value,
                start: 'top 35%',
                end: 'top 10%',
                scrub: true,
            }
        }).to(sphere.value!.material.uniforms.uBrightness, {
            value: 0,
        });

        // JOBS
        const base = lg.value ? window.innerHeight / 2 : window.innerHeight / 4;
        const sectionHeight = window.innerHeight / 2;
        const jobKeys = Object.keys(jobs);
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
            };
        });

        // SPHERE - SCALE IN
        gsap.timeline({
            scrollTrigger: {
                trigger: experience.value,
                start: `top+=${base + (jobKeys.length * sectionHeight)} top`,
                end: lg.value ? "+=75%" : "bottom 75%",
                scrub: true,
            }
        }).to(sphere.value!.scale, {
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
        }).to(sphere.value!.material.uniforms.uDisplacementStrength, {
            value: 0.1,
        });
        gsap.timeline({
            scrollTrigger: {
                trigger: experience.value,
                start: 'bottom 80%',
                end: 'bottom 60%',
                scrub: true,
            }
        }).to(sphere.value!.material.uniforms.uBrightness, {
            value: 0.05,
        });
    });

    return { selectedJob };
};