import type { ShallowRef } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/all';
gsap.registerPlugin(ScrollTrigger, SplitText);

export const useAboutAnimations = (about: Ref, aboutText: Ref, sphere: ShallowRef) => {

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

        // TEXT
        const split = new SplitText(aboutText.value, { type: "words" });
        gsap.timeline({
            scrollTrigger: {
                trigger: about.value,
                start: 'top 60%',
                end: 'bottom 60%',
                scrub: true
            }
        }).from(aboutText.value.children, {
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
        });

        // SPHERE
        if (lg.value) {
            gsap.timeline({
                scrollTrigger: {
                    trigger: about.value,
                    start: 'top top',
                    end: 'bottom 30%',
                    scrub: true,
                }
            }).to(sphere.value!.position, {
                y: -1,
                duration: 0.8,
                ease: "none"
            }).to(sphere.value!.position, {
                y: 0,
                duration: 0.2,
                ease: "none"
            });
        };
    });
};
