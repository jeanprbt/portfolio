<template>
    <div class="flex items-center justify-center h-screen w-full">
        <div :class="[
            'relative w-full md:max-w-[80vw] 2xl:max-w-[70vw] mx-auto',
            'aspect-[1/1] sm:aspect-[5/4]',
            'mb-30 sm:mb-0',
        ]">
            <div v-for="(dot, i) in dots" :key="i"
                :class="[
                    'absolute rounded-full -translate-x-1/2 -translate-y-1/2 transition-colors duration-300',
                    cityHighlight === 'none' ? 'bg-primary/20' : dot.label === cityHighlight ? 'bg-primary' : 'bg-primary/10'
                ]"
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
    },
    job: {
        type: String,
        required: false
    }
});

const cityHighlight = computed(() => {
    if (props.job === 'kth') return 'stockholm';
    if (props.job === 'finplify') return 'geneva';
    if (props.job === 'epfl') return 'lausanne';
    if (props.job === 'cern') return 'geneva';
    else return 'none';
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