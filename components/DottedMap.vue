<template>
    <div class="flex items-center justify-center h-screen w-full">
        <div class="relative w-full max-w-screen-md aspect-[5/4] mx-auto">
            <div v-for="(dot, i) in dots" :key="i"
                class="absolute bg-primary rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 hover:scale-125"
                :style="{ left: `${dot.x}%`, top: `${dot.y}%`, width: `${dotSize}px`, height: `${dotSize}px` }">
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import dots from '~/assets/json/dots.json';

const dotSize = ref(0);
const updateDotSize = () => {
    const coef = window.innerWidth >= 768 ? 0.01 : 0.015;
    dotSize.value = window.innerWidth * coef;
};

onMounted(() => {
    updateDotSize();
    window.addEventListener('resize', updateDotSize);
});
onUnmounted(() => {
    window.removeEventListener('resize', updateDotSize);
});
</script>