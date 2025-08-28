import type { ShallowRef } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export const useContactAnimations = (contact: Ref, sphere: ShallowRef, toruses: ShallowRef, contacts: ShallowRef) => {

    const windowWidth = ref(0);
    const lg = computed(() => windowWidth.value >= 1024);
    const sm = computed(() => windowWidth.value >= 640);

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
            if (newVal.length === 4) {
                gsap.timeline({
                    scrollTrigger: {
                        trigger: contact.value,
                        start: 'top 50%',
                        end: 'top+=50% top',
                        scrub: true,
                    }
                }).to(toruses.value[3].position, {
                    y: 8
                }).to(toruses.value[3].rotation, {
                    y: -0.5 * Math.PI
                }, "<");
            };
        });
        ScrollTrigger.create({
            trigger: contact.value,
            start: "top bottom",
            onEnter: () => {
                sphere.value!.material.uniforms.uTorusTransition.value = 4;
            },
            onLeaveBack: () => {
                sphere.value!.material.uniforms.uTorusTransition.value = 3;
            }
        });
    });
};