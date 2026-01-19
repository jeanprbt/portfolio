<template>
    <LoadingScreen :is-loaded="isLoaded" @introPlayed="introPlayed = true" />
    <ScrollBar />
    <div class="fixed inset-0 z-2 w-full h-lvh">
        <canvas ref="canvas" class="w-full h-full block"></canvas>
    </div>
    <SideMenu :is-dark="isDark" :about="about" :experience="experience" :projects="projects" :contact="contact" />
    <ClientOnly>
        <DarkModeToggle @toggle="toggleDarkMode" :is-dark="isDark" />
    </ClientOnly>
    <div ref="hero" class="h-lvh md:h-screen w-full bg-secondary text-primary transition-colors duration-500">
        <transition enter-from-class="translate-y-30 opacity-0" enter-active-class="transition duration-500 ease-out"
            enter-to-class="translate-y-0 opacity-100">
            <h1 v-if="isLoaded && introPlayed" :class="[
                'absolute top-[18%] left-1/2 transform -translate-x-1/2 z-1',
                'font-primary text-center',
                'text-6xl md:text-[4.25rem] lg:text-7xl xl:text-8xl 2xl:text-9xl',
            ]">
                Hi<span class="text-highlight">,</span> I'm <span class="font-secondary italic">Jean</span><span
                    class="text-highlight">. </span>
            </h1>
        </transition>
        <ScrollHint />
    </div>
    <div ref="about" class="h-auto w-full flex bg-secondary text-primary transition-colors duration-500">
        <div class="w-2/5 hidden lg:block"></div>
        <div class="w-full lg:w-3/5 flex flex-col gap-4 items-center justify-center">
            <p v-html="aboutHTML" ref="aboutText" :class="[
                'w-4/5 font-text text-center',
                'text-3xl sm:text-5xl xl:text-6xl',
            ]">
            </p>
        </div>
    </div>
    <div ref="experience"
        class="h-[350vh] lg:h-[400vh] w-full bg-secondary text-primary transition-colors duration-500">
        <div :style="`clip-path: circle(${sphereRadiusPixels}px at 50% 50%)`" :class="[
            'fixed h-lvh md:h-screen w-full z-3',
            'top-0 left-1/2 transform -translate-x-1/2',
        ]">
            <div ref="experienceContent"
                class="h-svh md:h-full flex flex-col justify-center lg:justify-between items-center opacity-0">
                <ClientOnly>
                    <DottedMap :city="selectedJob?.city || 'none'"
                        class="w-full md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[65vw] 2xl:max-w-[60vw] transition-transform duration-300" />
                </ClientOnly>
                <div :class="[
                    'w-5/6 lg:w-11/12 -mt-5 sm:-mt-10 md:-mt-20 lg:-mt-100 lg:mb-5 xl:mb-10 2xl:mb-15',
                    'text-sm sm:text-base xl:text-xl',
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
                                <span v-if="pair.label === 'INFO' && selectedJob?.svgs" class="gap-2">
                                    <img v-for="svg in selectedJob.svgs" :key="svg" :src="svgMap[svg]"
                                        class="mr-3 inline-block h-5 lg:h-6 w-5 lg:w-6 align-middle" alt="icon" />
                                </span>
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
            'flex flex-col justify-start gap-10 sm:gap-20 lg:gap-5 xl:gap-0 opacity-0',
        ]">
            <div class="h-1/3 md:h-5/12 xl:h-3/5 flex flex-col justify-between xl:flex-row xl:ml-10 mt-16 xl:mt-0">
                <div :class="[
                    'font-primary text-center xl:text-left',
                    'text-[6vw] xl:text-[20vh] xl:leading-none',
                    'flex flex-row xl:flex-col justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-0',
                ]">
                    <div v-for="proj in projs" :key="proj.id" :class="[
                        'transition-opacity duration-500',
                        { 'opacity-5 dark:opacity-10': (selectedProject === null) || selectedProject?.id !== proj.id },
                    ]">
                        {{ proj.label }}
                    </div>
                </div>
                <transition mode="out-in" enter-from-class="opacity-0" enter-active-class="duration-200 ease-in"
                    enter-to-class="opacity-100" leave-from-class="opacity-100"
                    leave-active-class="duration-100 ease-in" leave-to-class="opacity-0">
                    <img v-if="selectedProject" :src="`/img/${selectedProject.id}_${isDark ? 'dark' : 'light'}.png`"
                        :class="['h-full object-contain transition-opacity duration-200 xl:mt-10', { 'opacity-0': !selectedProject }]"
                        alt="project overview" />
                </transition>
            </div>
            <div
                class="h-2/3 md:h-7/12 xl:h-2/5 flex flex-col lg:flex-row justify-start lg:justify-between items-center gap-2 lg:ml-10">
                <div
                    class="w-5/6 lg:w-3/5 xl:w-4/5 2xl:w-9/10 mb-0 xl:mb-5 text-sm sm:text-base xl:text-xl">
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
                                 <span v-if="pair.label === 'INFO' && selectedProject?.svgs" class="gap-2">
                                    <img v-for="svg in selectedProject.svgs" :key="svg" :src="svgMap[svg]"
                                        class="mr-3 inline-block h-5 lg:h-6 w-5 lg:w-6 align-middle" alt="icon" />
                                </span>
                            </span>
                        </transition>
                    </p>
                </div>
                <transition mode="out-in" enter-from-class="opacity-0" enter-active-class="duration-200 ease-in"
                    enter-to-class="opacity-100" leave-from-class="opacity-100"
                    leave-active-class="duration-100 ease-in" leave-to-class="opacity-0">
                    <div v-if="selectedProject"
                        class="w-5/6 lg:w-2/5 flex flex-col items-left lg:items-center justify-center gap-2 lg:gap-8 text-primary relative">
                        <h1 class="font-primary text-highlight text-sm sm:text-base xl:text-lg 2xl:text-xl">
                            LINKS
                        </h1>
                        <div
                            class="lg:w-2/3 flex justify-start lg:justify-around items-center gap-2 sm:gap-4 text-primary text-xl sm:text-2xl xl:text-4xl">
                            <a v-for="link in selectedProject.links" :href="link.link"
                                class="flex items-center hover:opacity-50 transition-opacity duration-300 border-2 border-primary/20 p-1 lg:p-4 rounded-xl"
                                target="_blank" rel="noopener noreferrer">
                                <img :src="svgMap[link.svg]" class="h-5 lg:h-6 w-5 lg:w-6" alt="icon" />
                            </a>
                        </div>
                    </div>
                </transition>
            </div>
        </div>
    </div>
    <div ref="contact" class="h-[400vh] w-full bg-secondary text-primary transition-colors duration-500">
        <div ref="contactContent" :class="[
            'fixed h-svh md:h-screen w-full',
            'inset-0 transform opacity-0',
            'flex flex-col lg:flex-row px-10 gap-20 lg:gap-5 xl:gap-20 2xl:gap-40',
            selectedContact ? 'z-4' : 'z-2'
        ]">
            <div class="flex flex-col gap-15 sm:gap-10 lg:gap-5 items-center lg:items-start">
                <div :class="[
                    'font-primary text-center lg:text-left',
                    'text-[8vw] lg:text-[20vh] lg:leading-none',
                    'grid grid-cols-2 grid-rows-2 lg:flex lg:flex-col gap-5 md:gap-2 lg:gap-0',
                    'mt-30 sm:mt-20 md:mt-10 lg:mt-10 xl:mt-0'
                ]">
                    <div v-for="ctct in contacts" :key="ctct.id" :class="[
                        'transition-opacity duration-500',
                        { 'opacity-5 dark:opacity-10': (selectedContact === null) || selectedContact?.id !== ctct.id },
                    ]">
                        {{ ctct.label }}
                    </div>
                </div>
                <div
                    class="h-full lg:mb-10 flex justify-end items-center font-text text-primary text-xl sm:text-2xl xl:text-4xl">
                    <transition mode="out-in" enter-from-class="opacity-0" enter-active-class="duration-200 ease-in"
                        enter-to-class="opacity-100" leave-from-class="opacity-100"
                        leave-active-class="duration-100 ease-in" leave-to-class="opacity-0">
                        <div :key="selectedContact ? selectedContact!.link : ''">
                            <a :href="selectedContact?.link" target="_blank" rel="noopener noreferrer"
                                :class="['flex items-center gap-2 hover:opacity-50 transition-opacity duration-300 border-2 border-highlight p-2 md:p-4 rounded-xl', { 'opacity-0': !selectedContact }]">
                                <img v-if="selectedContact" :src="svgMap[selectedContact!.svg]" class="text-highlight h-6 w-6 lg:mt-1" />
                                <p>{{ selectedContact?.username || 0 }}</p>
                            </a>
                        </div>
                    </transition>
                </div>
            </div>
        </div>
    </div>
    <Footer />
</template>

<script setup lang="ts">
import ab from '~/content/about.json';
import jobs from '~/content/jobs.json';
import projs from '~/content/projects.json';
import contacts from '~/content/contact.json';

import python from '~/assets/svg/python.svg';
import langchain from '~/assets/svg/langchain.svg';
import huggingFace from '~/assets/svg/huggingface.svg';
import pytorch from '~/assets/svg/pytorch.svg';
import sklearn from '~/assets/svg/sklearn.svg';
import opensearch from '~/assets/svg/opensearch.svg';
import kubernetes from '~/assets/svg/kubernetes.svg';
import bash from '~/assets/svg/bash.svg';
import mistral from '~/assets/svg/mistral.svg';
import java from '~/assets/svg/java.svg';
import github from '~/assets/svg/github.svg';
import arxiv from '~/assets/svg/arxiv.svg';
import typescript from '~/assets/svg/typescript.svg';
import nuxt from '~/assets/svg/nuxt.svg';
import youtube from '~/assets/svg/youtube.svg';
import safari from '~/assets/svg/safari.svg';
import linkedin from '~/assets/svg/linkedin.svg';
import email from '~/assets/svg/email.svg';
import cv from '~/assets/svg/cv.svg';

const svgMap: Record<string, string> = {
    'python': python,
    'langchain': langchain,
    'huggingface': huggingFace,
    'pytorch': pytorch,
    'sklearn': sklearn,
    'opensearch': opensearch,
    'kubernetes': kubernetes,
    'bash': bash,
    'mistral': mistral,
    'java': java,
    'github': github,
    'arxiv': arxiv,
    'typescript': typescript,
    'nuxt': nuxt,
    'youtube': youtube,
    'safari': safari,
    'linkedin': linkedin,
    'email': email,
    'cv': cv,
}

onMounted(() => window.scrollTo(0, 0));
useHead({
    title: 'Jean Perbet | Portfolio',
    meta: [
        { name: 'description', content: 'Jean Perbet - Portfolio, experience, projects, and contact information.' },
        { name: 'keywords', content: 'Jean Perbet, portfolio, developer, projects, experience, contact' },
        { property: 'og:title', content: 'Jean Perbet | Portfolio' },
        { property: 'og:description', content: 'Discover Jean Perbet\'s work, experience, and projects.' },
        { property: 'og:type', content: 'website' }
    ]
});

const canvas = ref(null);
const hero = ref(null);
const about = ref(null);
const aboutText = ref(null);
const experience = ref(null);
const experienceContent = ref(null);
const projects = ref(null);
const projectsContent = ref(null);
const contact = ref(null);
const contactContent = ref(null);
const contactImage1 = ref(null);
const contactImage2 = ref(null);

const introPlayed = ref(false);
const aboutHTML = computed(() =>
    ab.text
        .replace(/\[(\w+)\]/g, (match, p1) => 
            svgMap[p1.toLowerCase()] 
                ? `<img src="${svgMap[p1.toLowerCase()]}" class="inline-block h-[0.8em] w-auto pb-[0.1em]" alt="${p1}" />` 
                : match
        )
        .replace(/(:\))/g, '<span class="text-highlight">:)</span>')
        .replace(/([.,:;!?])(?=\s|$)/g, '<span class="text-highlight">$1</span>')
);

const { isLoaded, sphere, sphereGroup, cloneSpheres, sphereRadiusPixels, toruses } = useThreeScene(canvas, introPlayed);
const { isDark, toggleDarkMode } = useDarkMode(sphere, toruses);
const _ = useHeroAnimations(hero, sphere, toruses);
const __ = useAboutAnimations(about, aboutText, sphere);
const { selectedJob } = useExperienceAnimations(experience, experienceContent, sphere, toruses);
const { selectedProject } = useProjectsAnimations(projects, projectsContent, sphere, cloneSpheres, sphereGroup);
const { selectedContact, lg } = useContactAnimations(contact, contactContent, contactImage1, contactImage2, sphere, toruses);
</script>
