import type { ShallowRef } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

import projs from '~/content/projects.json';

export const useProjectsAnimations = (
    projects: Ref,
    projectsContent: Ref,
    sphere: ShallowRef,
    cloneSpheres: ShallowRef,
    sphereGroup: ShallowRef
) => {

    const windowWidth = ref(0);
    const sm = computed(() => windowWidth.value >= 640);
    const md = computed(() => windowWidth.value >= 768);
    const lg = computed(() => windowWidth.value >= 1024);

    type Project = {
        id: string;
        label: string;
        period: string;
        links: any;
        info: string;
    };
    const selectedProject = ref<Project | null>(null);

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

        // SPHERE - TORUS
        ScrollTrigger.create({
            trigger: projects.value,
            start: "top bottom",
            onEnter: () => {
                sphere.value!.material.uniforms.uTorusTransition.value = 3;
            },
            onLeaveBack: () => {
                sphere.value!.material.uniforms.uTorusTransition.value = 2;
            }
        });

        // CLONE SPHERES APPEAR
        ScrollTrigger.create({
            trigger: projects.value,
            start: "top 50%",
            onEnter: () => {
                cloneSpheres.value.forEach((cloneSphere: any) => {
                    cloneSphere.position.copy(sphere.value!.position);
                    cloneSphere.visible = true;
                })
            },
            onLeaveBack: () => {
                cloneSpheres.value.forEach((cloneSphere: any) => cloneSphere.visible = false);
            }
        });

        let radius = lg.value ? 1.5 : md.value ? 1.2 : sm.value ? 1 : 0.8;
        let scale = lg.value ? 0.25 : md.value ? 0.22 : sm.value ? 0.2 : 0.18;
        let position = lg.value ? 0 : md.value ? -0.7 : -1;
        const allSpheres = [sphere.value, ...cloneSpheres.value];
        gsap.timeline({
            scrollTrigger: {
                trigger: projects.value,
                start: 'top 50%',
                end: 'top top',
                scrub: true,
            }
        }).to(allSpheres.map((cs: any) => cs.material.uniforms.uDisplacementStrength), {
            value: 0,
            duration: 0.1
        }).to(allSpheres[0].position, {
            x: Math.cos(Math.PI / 6) * radius,
            z: Math.sin(Math.PI / 6) * radius
        }).to(allSpheres[1].position, {
            x: Math.cos(3 * Math.PI / 2) * radius,
            z: Math.sin(3 * Math.PI / 2) * radius
        }, "<").to(allSpheres[2].position, {
            x: Math.cos(5 * Math.PI / 6) * radius,
            z: Math.sin(5 * Math.PI / 6) * radius
        }, "<").to(sphere.value!.scale, {
            x: scale,
            y: scale,
            z: scale
        }, "<").to(sphereGroup.value!.rotation, {
            x: Math.PI / 8
        }, "<").to(sphereGroup.value!.position, {
            y: position
        }, "<").to(allSpheres.map((cs: any) => cs.material.uniforms.uDisplacementStrength), {
            value: 0.1,
        }, "<+=30%").to(projectsContent.value!, {
            opacity: 1,
        }, "<");

        // CLONE SPHERES REVEAL
        const sectionHeight = window.innerHeight;
        const margin = window.innerHeight / 4;
        const projKeys = Object.keys(projs);
        allSpheres.forEach((sphere, idx) => {
            let prevTime = 0;
            let isReversing = false;
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: projects.value,
                    start: `top+=${idx * sectionHeight} top`,
                    end: `top+=${(idx + 1) * sectionHeight - margin} top`,
                    scrub: true,
                    snap: {
                        snapTo: [0, 1],
                        delay: 0,
                        duration: {
                            min: 0.3,
                            max: 0.7
                        },
                    },
                }
            })
            if (idx > 0) {
                tl.to(allSpheres.toSpliced(idx - 1, 1).map((cs: any) => cs.material.uniforms.uOpacity), {
                    value: 1,
                    ease: "power3.out",
                    duration: 0.1,
                    onStart: () => selectedProject.value = null,
                    onReverseComplete: () => { selectedProject.value = projs[projKeys[idx - 1] as keyof typeof projs]; },
                });
            };
            tl.to(sphereGroup.value!.rotation, {
                y: -(1 + 2 * idx) * Math.PI / 3,
                ease: "none"
            }).to(allSpheres.filter(s => s !== sphere).map((cs: any) => cs.material.uniforms.uOpacity), {
                value: 0,
                ease: "power3.in",
                duration: 0.1,
                onComplete: () => { selectedProject.value = projs[projKeys[idx] as keyof typeof projs]; },
                onUpdate: () => {
                    if (tl.time() < prevTime && !isReversing) {
                        isReversing = true;
                        selectedProject.value = null
                    } else {
                        isReversing = false
                    }
                    prevTime = tl.time();
                }
            });
        });

        // CLONE SPHERES BACK TO ONE
        gsap.timeline({
            scrollTrigger: {
                trigger: projects.value,
                start: `top+=${3 * sectionHeight} top`,
                end: 'bottom 50%',
                scrub: true,
            }
        }).to(allSpheres.toSpliced(2, 1).map((cs: any) => cs.material.uniforms.uOpacity), {
            value: 1,
            ease: "power3.out",
            duration: 0.1,
            onStart: () => selectedProject.value = null,
            onReverseComplete: () => { selectedProject.value = projs[projKeys[2] as keyof typeof projs]; },
        }).to(sphereGroup.value!.rotation, {
            y: -2 * Math.PI,
            ease: "none"
        });

        gsap.timeline({
            scrollTrigger: {
                trigger: projects.value,
                start: 'bottom 50%',
                end: 'bottom top',
                scrub: true,
            }
        }).to(allSpheres.map((cs: any) => cs.material.uniforms.uDisplacementStrength), {
            value: 0,
            duration: 0.2
        }).to(projectsContent.value!, {
            opacity: 0,
        }, "<").to(sphereGroup.value!.position, {
            y: 0
        }, "<").to(sphereGroup.value!.rotation, {
            x: 0
        }, "<").to(sphere.value!.scale, {
            x: 1,
            y: 1,
            z: 1
        }, "<").to(allSpheres.map((cs: any) => cs.position), {
            x: 0,
            z: -2
        }, "<").to(allSpheres.map((cs: any) => cs.material.uniforms.uDisplacementStrength), {
            value: 0.1,
            duration: 0.2
        });

        ScrollTrigger.create({
            trigger: projects.value,
            start: "bottom top",
            onEnter: () => {
                cloneSpheres.value.forEach((cloneSphere: any) => {
                    cloneSphere.visible = false;
                })
            },
            onLeaveBack: () => {
                cloneSpheres.value.forEach((cloneSphere: any) => cloneSphere.visible = true);
            }
        });
    });

    return { selectedProject };
};