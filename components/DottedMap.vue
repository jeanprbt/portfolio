<template>
    <div class="flex items-center justify-center h-screen w-full">
        <div class="relative w-full md:max-w-[80vw] 2xl:max-w-[70vw] aspect-[5/4] mx-auto opacity-20">
            <div v-for="(dot, i) in dots" :key="i"
                class="absolute bg-primary rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 hover:scale-125"
                :style="{ left: `${dot.x}%`, top: `${dot.y}%`, width: `${dotSize}px`, height: `${dotSize}px` }">
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import dots from '~/assets/json/dots.json';

const props = defineProps({
    md: {
        type: Boolean,
        required: true
    }
});

const dotSize = ref(0);
const updateSize = () => {
    const coef = props.md ? 0.01 : 0.015;
    dotSize.value = window.innerWidth * coef;
};

onMounted(() => {
    updateSize();
    window.addEventListener('resize', updateSize);
});
onUnmounted(() => window.removeEventListener('resize', updateSize));
</script>