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
        <img ref="avatar" src="/img/jeanprbt.png" alt="avatar" :class="[
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

const introPlayed = ref(false);
const loadingComplete = ref(false);
const avatar = ref<HTMLImageElement | null>(null);
watch(() => props.isLoaded, (loaded) => {
    if (loaded && avatar.value) {
        avatar.value.addEventListener('animationiteration', () => {
            loadingComplete.value = true;
        }, { once: true });
    }
    setTimeout(() => {
        introPlayed.value = true;
        emit('introPlayed');
    }, 1200);
});

</script>