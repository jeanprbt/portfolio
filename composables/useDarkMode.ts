import type { ShallowRef } from "vue";

export const useDarkMode = (sphereMaterial: ShallowRef, torusTextMaterial: ShallowRef) => {
    const colorMode = useColorMode();
    const isDark = ref(colorMode.value === "dark" ? true : false);
    const toggleDarkMode = () => isDark.value = !isDark.value;

    onMounted(() => {
        watch(isDark, (newValue) => {
            document.documentElement.classList.toggle('dark', newValue);
            sphereMaterial.value!.uniforms.uDarkMode.value = newValue;
            torusTextMaterial.value!.color.set(getCSSColor('--color-primary'));
        });
        watch(colorMode, (newValue) => {
            isDark.value = newValue.value === 'dark';
            sphereMaterial.value!.uniforms.uDarkMode.value = newValue.value === 'dark';
            torusTextMaterial.value!.color.set(getCSSColor('--color-primary'));
        });
    });

    return { isDark, toggleDarkMode };
}