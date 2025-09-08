<template>
    <div :class="[
        'fixed inset-0 z-100 flex items-center justify-center',
        'flex items-center justify-center',
        'bg-secondary text-primary',
        'transition-opacity duration-400 ease-in-out',
        introPlayed && loadingComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'
    ]">
        <div :class="[
            'h-[4px] md:h-[8px] w-full bg-highlight origin-right [transform:scaleX(0)]',
            { '[animation:draw-line_1s_forwards]': loadingComplete },
        ]">
        </div>
        <img ref="avatar" src="~/assets/avatar.png" alt="avatar" :class="[
            'w-24 md:w-32 border-4 md:border-8 border-highlight rounded-full',
            { '[animation:spin_1s_linear_infinite]': !loadingComplete }
        ]" />
        <div :class="[
            'h-[4px] md:h-[8px] w-full bg-highlight origin-left [transform:scaleX(0)]',
            { '[animation:draw-line_1s_forwards]': loadingComplete },
        ]">
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps(['isLoaded']);
const emit = defineEmits(['introPlayed']);

const images = import.meta.glob('/public/img/*.{png,jpg,jpeg,gif,svg}', { eager: true });
const imageUrls = Object.keys(images).map(path => path.replace('/public', ''));

const imagesReady = ref(false);
const animationReady = ref(false);
const loadingComplete = ref(false);
const introPlayed = ref(false);
const avatar = ref<HTMLImageElement | null>(null);

const checkLoadingComplete = () => {
    if (imagesReady.value && animationReady.value) {
        loadingComplete.value = true;
        setTimeout(() => {
            introPlayed.value = true;
            emit('introPlayed');
        }, 1000);
    }
}

const preloadImages = (urls: string[]): Promise<void> => {
    return Promise.all(urls.map(url => {
        return new Promise<void>((resolve) => {
            const img = new window.Image();
            img.src = url;
            img.onload = () => resolve();
            img.onerror = () => resolve();
        });
    })).then(() => { });
}

onMounted(async () => {
    await preloadImages(imageUrls);
    imagesReady.value = true;
    checkLoadingComplete();
});

watch(() => props.isLoaded, (loaded) => {
    if (loaded && avatar.value) {
        avatar.value.addEventListener('animationiteration', () => {
            animationReady.value = true;
            checkLoadingComplete();
        }, { once: true });
    }
});
</script>