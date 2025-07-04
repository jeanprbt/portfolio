<template>
    <div
        class="h-screen w-full flex flex-col items-center justify-center bg-secondary text-primary transition-colors duration-500">
        <button @click="toggleDarkMode()"
            class="absolute top-10 left-10 text-primary hover:opacity-80 transition-opacity">
            <Icon :name="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'" size="1.5em" />
        </button>

        <h1 class="text-4xl font-primary font-bold italic">Hi! I'm <span class="font-secondary">Jean</span>.</h1>
    </div>
</template>

<script setup>
const isDark = ref(false)
const applyDarkClass = (enabled) => document.documentElement.classList.toggle('dark', enabled)
const toggleDarkMode = () => isDark.value = !isDark.value

onMounted(() => {
    const stored = localStorage.getItem('darkMode')
    isDark.value = stored !== null
        ? JSON.parse(stored)
        : window.matchMedia('(prefers-color-scheme: dark)').matches
    applyDarkClass(isDark.value)
})

watch(isDark, (newValue) => {
    localStorage.setItem('darkMode', JSON.stringify(newValue))
    applyDarkClass(newValue)
})
</script>