<template>
    <div :class="[
        'fixed inset-0 z-4 flex items-center justify-center',
        'bg-secondary text-primary',
        'transition-opacity duration-500 ease-in-out',
        isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
    ]" aria-live="polite" aria-busy="true">
        <div class="w-12 h-12 border-[3px] border-current border-t-transparent rounded-full animate-spin [animation-duration:0.8s]"
            role="status" aria-label="Loading"></div>
    </div>
    <div class="fixed inset-0 z-2 w-full h-lvh">
        <canvas ref="canvas" class="w-full h-full block"></canvas>
    </div>
    <ClientOnly>
        <DarkModeToggle @toggle="toggleDarkMode" :is-dark="isDark" />
    </ClientOnly>
    <div ref="hero" class="h-lvh md:h-screen w-full bg-secondary text-primary transition-colors duration-500">
        <h1 :class="[
            'absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-1',
            'font-primary text-center',
            'text-6xl md:text-[4.25rem] lg:text-7xl xl:text-8xl 2xl:text-9xl',
        ]">
            Hi<span class="text-highlight">,</span> I<span class="text-highlight">'</span>m <span
                class="font-secondary italic">Jean</span><span class="text-highlight">.</span>
        </h1>
    </div>
    <div ref="about" class="h-auto w-full flex bg-secondary text-primary transition-colors duration-500">
        <div class="w-2/5 hidden lg:block"></div>
        <div class="w-full lg:w-3/5 flex flex-col gap-4 items-center justify-center">
            <p ref="aboutText" :class="[
                'w-4/5 font-text text-center',
                'text-3xl sm:text-5xl md:text-6xl xl:text-7xl 2xl:text-8xl',
            ]">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry<span
                    class="text-highlight">.</span> Lorem Ipsum has been the
                industry<span class="text-highlight">'</span>s standard dummy text ever since the 1500s<span
                    class="text-highlight">,</span> when an unknown printer took a galley of type and
                scrambled it to make a type specimen book<span class="text-highlight">.</span> It has survived not only
                five centuries<span class="text-highlight">,</span> but also the leap
                into electronic typesetting<span class="text-highlight">,</span> remaining essentially unchanged<span
                    class="text-highlight">.</span>
            </p>
        </div>
    </div>
    <div ref="experience"
        class="h-[350vh] lg:h-[400vh] w-full bg-secondary text-primary transition-colors duration-500">
        <div :style="`clip-path: circle(${sphereRadiusPixels}px at 50% 50%)`" :class="[
            'fixed h-svh md:h-screen w-full z-3',
            'top-0 left-1/2 transform -translate-x-1/2',
        ]">
            <div ref="experienceContent"
                class="h-full flex flex-col justify-center lg:justify-between items-center opacity-0">
                <ClientOnly>
                    <DottedMap :city="selectedJob?.city || 'none'"
                        class="w-full md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[65vw] 2xl:max-w-[60vw] transition-transform duration-300" />
                </ClientOnly>
                <div :class="[
                    'w-5/6 lg:w-11/12 -mt-5 sm:-mt-10 md:-mt-20 lg:-mt-100 lg:mb-10 2xl:mb-15',
                    'text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl',
                ]">
                    <p v-for="pair in [
                        { label: 'ROLE', value: selectedJob ? selectedJob.role : '' },
                        { label: 'PERIOD', value: selectedJob ? selectedJob.period : '' },
                        { label: 'INFO', value: selectedJob ? selectedJob.info : ' '.repeat(380) }
                    ]" :key="pair.label"
                        :class="['text-justify transition-opacity duration-500', { 'opacity-0': !selectedJob }]">
                        <span class="font-primary text-highlight">{{ pair.label }}</span>
                        <transition mode="out-in" enter-from-class="opacity-0" enter-active-class="duration-200 ease-in"
                            enter-to-class="opacity-100" leave-from-class="opacity-100"
                            leave-active-class="duration-200 ease-in" leave-to-class="opacity-0">
                            <span :key="pair.value"
                                :class="['font-text ml-2', { 'whitespace-break-spaces': !selectedJob }]">
                                {{ pair.value }}
                            </span>
                        </transition>
                    </p>
                </div>
                <div :class="[
                    'fixed top-20 lg:top-0 left-1/2 lg:left-auto lg:right-10 transform -translate-x-1/2 lg:translate-x-0',
                    'font-primary text-center lg:text-right',
                    'text-[7vw] lg:text-[20vh] lg:leading-none',
                    'flex flex-row lg:flex-col gap-2 sm:gap-4 md:gap-6 lg:gap-0',
                ]">
                    <div v-for="job in jobs" :key="job.id" :class="[
                        'transition-opacity duration-500 w-full',
                        { 'opacity-5 dark:opacity-10': (selectedJob === null) || selectedJob?.id !== job.id },
                    ]">
                        {{ job.label }}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div ref="projects" class="h-[400vh] w-full bg-secondary text-primary transition-colors duration-500">
        <div ref="projectsContent" :class="[
            'fixed h-svh md:h-screen w-full z-3',
            'top-0 left-1/2 transform -translate-x-1/2',
            'flex flex-col gap-4 justify-between md:justify-start opacity-0',
        ]">
            <div class="flex flex-col gap-4 md:gap-0 md:flex-row md:ml-10 mt-20 md:mt-0 h-2/5 md:h-3/5">
                <div :class="[
                    'font-primary text-center lg:text-left',
                    'text-[6vw] lg:text-[20vh] lg:leading-none',
                    'flex flex-row lg:flex-col gap-2 sm:gap-4 md:gap-6 lg:gap-0',
                ]">
                    <div v-for="proj in projs" :key="proj.id" :class="[
                        'transition-opacity duration-500 w-full',
                        { 'opacity-5 dark:opacity-10': (selectedProject === null) || selectedProject?.id !== proj.id },
                    ]">
                        {{ proj.label }}
                    </div>
                </div>
                <transition mode="out-in" enter-from-class="opacity-0" enter-active-class="duration-200 ease-in"
                    enter-to-class="opacity-100" leave-from-class="opacity-100"
                    leave-active-class="duration-100 ease-in" leave-to-class="opacity-0">
                    <img v-if="selectedProject" :src="`/img/${selectedProject.id}_${isDark ? 'dark' : 'light'}.png`"
                        class="md:h-full" />
                </transition>
            </div>
            <div class="md:mx-10 flex flex-col md:flex-row justify-between">
                <div class="md:w-2/5 text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl">
                    <p v-for="pair in [
                        { label: 'PERIOD', value: selectedProject ? selectedProject.period : '' },
                        { label: 'INFO', value: selectedProject ? selectedProject.info : ' '.repeat(380) }
                    ]" :key="pair.label"
                        :class="['text-justify transition-opacity duration-200', { 'opacity-0': !selectedProject }]">
                        <span class="font-primary text-highlight">{{ pair.label }}</span>
                        <transition mode="out-in" enter-from-class="opacity-0" enter-active-class="duration-200 ease-in"
                            enter-to-class="opacity-100">
                            <span :key="pair.value"
                                :class="['font-text ml-2', { 'whitespace-break-spaces': !selectedProject }]">
                                {{ pair.value }}
                            </span>
                        </transition>
                    </p>
                </div>
                <transition mode="out-in" enter-from-class="opacity-0" enter-active-class="duration-200 ease-in"
                    enter-to-class="opacity-100" leave-from-class="opacity-100"
                    leave-active-class="duration-100 ease-in" leave-to-class="opacity-0">
                    <div v-if="selectedProject"
                        class="w-2/5 flex flex-col items-center justify-center gap-8 text-primary">
                        <h1 class="font-primary text-highlight text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl">LINKS</h1>
                        <div class="w-2/3 flex items-center justify-around gap-4 text-primary">
                            <a v-for="link in selectedProject.links" :href="link.link"
                                class="hover:opacity-50 transition-opacity" target="_blank" rel="noopener noreferrer">
                                <Icon :name="link.icon" size="3em" />
                            </a>
                        </div>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import jobs from '~/content/jobs.json';
import projs from '~/content/projects.json';

const canvas = ref(null);
const hero = ref(null);
const about = ref(null);
const aboutText = ref(null);
const experience = ref(null);
const experienceContent = ref(null);
const projects = ref(null);
const projectsContent = ref(null);

const { isLoaded, sphere, sphereGroup, cloneSpheres, sphereRadiusPixels, toruses } = useThreeScene(canvas);
const { isDark, toggleDarkMode } = useDarkMode(sphere, toruses);
const _ = useHeroAnimations(hero, sphere, toruses);
const __ = useAboutAnimations(about, aboutText, sphere);
const { selectedJob } = useExperienceAnimations(experience, experienceContent, sphere, toruses);
const { selectedProject } = useProjectsAnimations(projects, projectsContent, sphere, cloneSpheres, sphereGroup);
</script>
