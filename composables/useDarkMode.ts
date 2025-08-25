import type { ShallowRef } from "vue";

export const useDarkMode = (sphere: ShallowRef, toruses: ShallowRef) => {
    const colorMode = useColorMode();
    const isDark = ref(colorMode.value === "dark" ? true : false);
    const toggleDarkMode = () => isDark.value = !isDark.value;

    onMounted(() => {
        watch(isDark, (newValue) => {
            document.documentElement.classList.toggle('dark', newValue);
            sphere.value!.material.uniforms.uDarkMode.value = newValue;
            toruses.value!.forEach((t: any) => t.material[0].color.set(getCSSColor('--color-primary')));
        });
        watch(colorMode, (newValue) => {
            isDark.value = newValue.value === 'dark';
            sphere.value!.material.uniforms.uDarkMode.value = newValue.value === 'dark';
            toruses.value!.forEach((t: any) => t.material[0].color.set(getCSSColor('--color-primary')));
        });
    });

    return { isDark, toggleDarkMode };
}