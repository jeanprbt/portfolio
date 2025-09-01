<template>
    <transition enter-active-class="transition-opacity duration-1000" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition-opacity duration-300" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="show" class="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <Icon name="i-heroicons-chevron-down" size="2em" class="size-3 text-highlight rounded-full animate-bounce" />
        </div>
    </transition>
</template>

<script setup lang="ts">
const show = ref(false);
let timeout: ReturnType<typeof setTimeout> | null = null;

onMounted(() => {
    timeout = setTimeout(() => {
        show.value = true;
    }, 2000);

    const handleScroll = () => {
        show.value = false;
        if (timeout) clearTimeout(timeout);
        window.removeEventListener('scroll', handleScroll);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
    if (timeout) clearTimeout(timeout);
    window.removeEventListener('scroll', () => { });
});
</script>