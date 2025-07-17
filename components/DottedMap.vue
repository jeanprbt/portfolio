<template>
    <div class="flex items-center justify-center h-screen w-full">
        <div class="relative w-full lg:max-w-[60vw] aspect-[5/4] mx-auto opacity-20">
            <div v-for="(dot, i) in dots" :key="i"
                class="absolute bg-primary rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 hover:scale-125"
                :style="{ left: `${dot.x}%`, top: `${dot.y}%`, width: `${dotSize}px`, height: `${dotSize}px` }">
            </div>
        </div>
        <p ref="experienceText"
            class="fixed top-1/2 left-1/2 lg:left-0 transform -translate-x-1/2 lg:translate-x-0 -translate-y-1/2 font-primary text-[6rem] md:text-9xl lg:text-[9rem] xl:text-[10rem] 2xl:text-[11rem] text-center lg:text-left">
            EPFL<br v-if="lg"><span v-if="!lg">&nbsp;</span>KTH<br>Finplify<br v-if="lg"><span v-if="!lg">&nbsp;</span>CERN
        </p>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import dots from '~/assets/json/dots.json';

const lg = computed(() => window.innerWidth >= 1024);
const dotSize = ref(0);

const updateDotSize = () => {
    const coef = lg.value ? 0.01 : 0.015;
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