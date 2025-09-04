<template>
    <div v-if="lg" class="fixed right-0 top-1/2 z-50 h-full w-2 bg-secondary transform -translate-y-1/2">
        <div class="bg-highlight w-full" :style="{ height: `${scrollPercent}%` }"></div>
    </div>
</template>

<script setup lang="ts">
const scrollPercent = ref(0);
const windowWidth = ref(0);
const lg = computed(() => windowWidth.value >= 1024);

onMounted(() => {
    const updateScroll = () => {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        scrollPercent.value = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    };
    window.addEventListener('scroll', updateScroll);
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
</script>