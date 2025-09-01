<template>
    <button @click="emit('toggle')"
        class="fixed top-10 left-10 text-primary hover:opacity-50 transition-opacity duration-500 z-10">
        <Icon :name="props.isDark ? 'i-heroicons-moon' : 'i-heroicons-sun'" size="1.5em" />
    </button>
</template>

<script setup lang="ts">
const emit = defineEmits(['toggle']);
const props = defineProps(['isDark']);
</script>