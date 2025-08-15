import type { ShallowRef } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export const useProjectsAnimations = (
    projects: Ref,
    sphere: ShallowRef,
    sphereMaterial: ShallowRef,
    cloneSpheres: ShallowRef
) => {

    const windowWidth = ref(0);
    const md = computed(() => windowWidth.value >= 768);

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
                sphereMaterial.value!.uniforms.uTorusTransition.value = 3;
            },
            onLeaveBack: () => {
                sphereMaterial.value!.uniforms.uTorusTransition.value = 2;
            }
        });

        // CLONE SPHERES
        gsap.timeline({
            scrollTrigger: {
                trigger: projects.value,
                start: 'top 40%',
                end: 'top top',
                scrub: true,
            }
        }).to(sphereMaterial.value!.uniforms.uDisplacementStrength, {
            value: 0,
            duration: 0.1
        }).to(sphere.value!.position, {
            x: md.value ? 1.5 : 0,
            y: md.value ? 1.5 : 3
        }).to(cloneSpheres.value[0].position, {
            x: md.value ? -1.5 : 0,
            y: md.value ? 1.5 : 1
        }, "<").to(cloneSpheres.value[1].position, {
            x: md.value ? 1.5 : 0,
            y: md.value ? -1.5 : -1
        }, "<").to(cloneSpheres.value[2].position, {
            x: md.value ? -1.5 : 0,
            y: md.value ? -1.5 : -3
        }, "<").to(sphere.value!.scale, {
            x: md.value ? 0.8 : 0.6,
            y: md.value ? 0.8 : 0.6,
            z: md.value ? 0.8 : 0.6
        }, "<").to(sphereMaterial.value!.uniforms.uDisplacementStrength, {
            value: 0.09,
        }, "<+=30%").to(sphereMaterial.value!.uniforms.uDisplacementFrequency, {
            value: 0.5
        }, "<");
        ScrollTrigger.create({
            trigger: projects.value,
            start: "top 40%",
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
    });
};