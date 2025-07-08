<template>
    <div class="h-screen w-full bg-secondary text-primary transition-colors duration-500">
        <button @click="toggleDarkMode()"
            class="absolute top-10 left-10 text-primary hover:opacity-80 transition-opacity z-3">
            <Icon :name="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'" size="1.5em" />
        </button>
        <Sphere :is-dark="isDark"/>
        <h1 class="text-6xl font-primary font-bold drop-shadow-primary drop-shadow-sm dark:drop-shadow-none absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-1 text-center">
            Hi, I'm <span class="font-secondary italic">Jean</span>.
        </h1>
    </div>
</template>

<script setup lang="ts">
const isDark = ref(false);
const toggleDarkMode = () => isDark.value = !isDark.value;
watch(isDark, (newValue) => {
    document.documentElement.classList.toggle('dark', newValue)
});
</script>