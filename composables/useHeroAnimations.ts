import type { ShallowRef } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export const useHeroAnimations = (hero: Ref, sphere: ShallowRef, toruses: ShallowRef) => {

    const windowWidth = ref(0);
    const lg = computed(() => windowWidth.value >= 1024);

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

        // TORUS
        watch(toruses, (newVal) => {
            if (newVal.length === 3) {
                gsap.timeline({
                    scrollTrigger: {
                        trigger: hero.value,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: true,
                    }
                }).to(toruses.value[0].position, {
                    y: 8
                }).to(toruses.value[0].rotation, {
                    y: -0.5 * Math.PI
                }, "<");
            };
        });

        // SPHERE - GENERAL ROTATION
        gsap.timeline({
            scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: 'bottom bottom',
                scrub: true,
            }
        }).to(sphere.value!.rotation, {
            y: 30 * Math.PI,
            ease: 'none',
        });

        // SPHERE - TORUS
        const sphereHeroTL = gsap.timeline({
            scrollTrigger: {
                trigger: hero.value,
                start: 'top top',
                end: 'bottom+=10% top',
                scrub: true,
            }
        }).to(sphere.value!.position, {
            y: -1,
            z: -2,
            ease: 'power1.out',
            duration: 0.25
        });
        if (lg.value) {
            sphereHeroTL.to(sphere.value!.position, {
                z: -1,
                duration: 0.75
            }).to(sphere.value!.position, {
                x: -2,
                y: 1,
                duration: 0.5
            }, "<");
        } else {
            sphereHeroTL.to(sphere.value!.scale, {
                x: 0,
                y: 0,
                z: 0,
                duration: 0.2
            }).to({}, { duration: 0.5 });
        };
    });
}; 