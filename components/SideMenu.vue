<template>
    <button @click="menu = !menu"
        class="fixed top-10 right-10 text-primary hover:opacity-50 transition-opacity duration-300 z-10">
        <transition mode="out-in" enter-from-class="opacity-0" enter-active-class="duration-500 ease-in"
            enter-to-class="opacity-100" leave-from-class="opacity-100" leave-active-class="duration-500 ease-in"
            leave-to-class="opacity-0">
            <Icon :key="menu ? 'x' : 'bars'" :name="menu ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3-bottom-right'"
                size="1.5em" />
        </transition>
    </button>
    <transition enter-from-class="translate-x-full" enter-active-class="transition-transform duration-500 ease-in"
        enter-to-class="translate-x-0 duration-500" leave-from-class="translate-x-0"
        leave-active-class="transition-transform duration-500 ease-in" leave-to-class="translate-x-full"
        @before-leave="unlockScroll" @after-enter="lockScroll">
        <aside v-show="aside" :class="[
            'fixed top-0 right-0 h-svh md:h-full w-full z-5',
            'border-l-10 border-highlight',
        ]">
            <div :class="[
                'w-full h-full bg-secondary xl:pb-10 xl:pr-10 z-5',
                'transition-colors duration-500',
                'flex flex-col justify-center xl:justify-end items-center xl:items-end',
                'font-primary text-right',
                'text-[12vw] xl:text-[18vh] leading-none',
            ]">
                <transition-group name="text-reveal" tag="div" enter-from-class="translate-y-10 opacity-0"
                    enter-active-class="transition duration-500 ease-out"
                    enter-to-class="translate-y-0 opacity-100" leave-from-class="translate-y-0"
                    leave-active-class="transition duration-300 ease-out" leave-to-class="translate-y-10 opacity-0"
                    @after-leave="aside = false">
                    <div v-if="menu" v-for="(pair, idx) in [
                        { label: 'ABOUT', section: props.about, offset: 6 },
                        { label: 'EXPERIENCE', section: props.experience, offset: -2 },
                        { label: 'PROJECTS', section: props.projects, offset: 8 },
                        { label: 'CONTACT', section: props.contact, offset: -1 }
                    ]" :key="pair.label" :style="{ transitionDelay: `${(idx + 1) * (xl ? 60 : 40) + 400}ms` }"
                        @transitionend="opacities[idx] = true" class="mb-5 xl:mb-0">
                        <p @click="() => handleScroll(pair.section, pair.offset)"
                            :class="[{ 'opacity-5 dark:opacity-15': opacities[idx] && xl }, 'text-primary hover:opacity-100 transition-opacity duration-400']">
                            {{ pair.label }}<span class="text-highlight">.</span>
                        </p>
                    </div>
                </transition-group>
            </div>
        </aside>
    </transition>
</template>

<script setup lang="ts">
const props = defineProps(['isDark', 'about', 'experience', 'projects', 'contact']);
const menu = ref(false);
const aside = ref(false);
const opacities = ref<boolean[]>([false, false, false, false]);
let scrollY = 0;

const windowWidth = ref(0);
const xl = computed(() => windowWidth.value >= 1280);

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
});

watch(menu, (newVal) => {
    if (newVal) aside.value = true;
    else opacities.value = [false, false, false, false];
});

const handleScroll = (section: HTMLElement, offset: number) => {
    menu.value = false;
    setTimeout(() => {
        smoothScrollTo(section, 2000, offset);
    }, 1200)
};

function smoothScrollTo(target: HTMLElement, duration: number, offset: number) {
    const start = window.scrollY;
    const end = target.getBoundingClientRect().top + window.scrollY - window.innerHeight / offset;
    const change = end - start;
    const startTime = performance.now();
    const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        window.scrollTo(0, start + change * easeInOutQuad(progress));
        if (progress < 1) {
            requestAnimationFrame(animateScroll);
        }
    };
    const easeInOutQuad = (t: number) => {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };
    requestAnimationFrame(animateScroll);
};

const lockScroll = () => {
    scrollY = window.scrollY
    document.documentElement.classList.add('overflow-hidden', 'overscroll-none')
    document.body.classList.add('overflow-hidden', 'overscroll-none')
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
};

const unlockScroll = () => {
    document.documentElement.classList.remove('overflow-hidden', 'overscroll-none')
    document.body.classList.remove('overflow-hidden', 'overscroll-none')
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    window.scrollTo(0, scrollY)
};
</script>