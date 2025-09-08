import type { ShallowRef } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

import contacts from '~/content/contact.json';

export const useContactAnimations = (
    contact: Ref,
    contactContent: Ref,
    sphere: ShallowRef,
    toruses: ShallowRef
) => {

    const windowWidth = ref(0);
    const lg = computed(() => windowWidth.value >= 1024);

    type Contact = {
        id: string;
        label: string;
        link: string;
        username: string;
        icon: string;
    };
    const selectedContact = ref<Contact | null>(null);

    onMounted(() => {
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
                        end: 'top+=30% top',
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

        // SPHERE FADE OUT
        gsap.timeline({
            scrollTrigger: {
                trigger: contact.value,
                start: 'top top',
                end: 'top+=30% top',
                scrub: true
            }
        }).to(sphere.value!.scale, {
            x: 0,
            y: 0,
            z: 0
        }).to(contactContent.value!, {
            opacity: 1,
            ease: "power3.out"
        }, "<+=10%");

        // CONTACTS
        const base = window.innerHeight;
        const sectionHeight = window.innerHeight / 2;
        const contactKeys = Object.keys(contacts);
        contactKeys.forEach((key, idx) => {
            ScrollTrigger.create({
                trigger: contact.value,
                start: () => `top+=${base + idx * sectionHeight} top`,
                onEnter: () => selectedContact.value = contacts[key as keyof typeof contacts],
                onLeaveBack: () =>  selectedContact.value = idx > 0 ? contacts[contactKeys[idx - 1] as keyof typeof contacts] : null,
            });
        });
    });

    return { selectedContact };
};