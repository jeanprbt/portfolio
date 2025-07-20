<template>
    <div :class="[
        'aspect-[1/1] sm:aspect-[5/4] mx-auto',
        'relative flex items-center justify-center',
    ]">
        <div v-for="(dot, i) in dots" :key="i" :class="[
            'absolute rounded-full -translate-x-1/2 -translate-y-1/2 transition-colors duration-200',
            cityHighlight === 'none' ? 'bg-primary/20' : dot.label === cityHighlight ? 'bg-blue-500' : 'bg-primary/10'
        ]" :style="{ left: `${dot.x}%`, top: `${dot.y}%`, width: `${dotSize}px`, height: `${dotSize}px` }">
            <span :class="[
                'absolute left-full top-1/2 -translate-y-1/2 ml-1 lg:ml-2',
                'font-primary text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl',
                'transition-opacity duration-200', dot.label === cityHighlight ? 'opacity-100' : 'opacity-0'
            ]">
                {{ dot.label }}
            </span>
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
    if (props.job === 'kth') return 'Stockholm';
    if (props.job === 'finplify') return 'Geneva';
    if (props.job === 'epfl') return 'Lausanne';
    if (props.job === 'cern') return 'Geneva';
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