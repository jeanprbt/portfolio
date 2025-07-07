<template>
    <div class="relative h-screen w-full text-primary bg-secondary transition-colors duration-1000 ">
        <canvas ref="canvasRef" class="absolute inset-0"></canvas>
        <div class="relative  h-full w-full flex flex-col items-center justify-center pointer-events-none">
            <button @click="toggleDarkMode()"
                class="absolute top-10 left-10 hover:opacity-80 transition-opacity pointer-events-auto">
                <Icon :name="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'" size="1.5em" />
            </button>
            <!-- <h1 class="text-4xl font-primary font-bold">Hi, I'm <span class="font-secondary italic">Jean</span>.</h1> -->
        </div>
    </div>
</template>

<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import vertexShader from '~/assets/shaders/vertex.glsl?raw'
import fragmentShader from '~/assets/shaders/fragment.glsl?raw'

const isDark = ref(false)
const canvasRef = ref(null)
let sphere = null

const getCSSColor = (variable) => getComputedStyle(document.documentElement).getPropertyValue(variable).trim()
const toggleDarkMode = () => isDark.value = !isDark.value

onMounted(() => {
    if (!canvasRef.value) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, alpha: true })
    camera.position.z = 3
    renderer.setSize(window.innerWidth, window.innerHeight)

    const controls = new OrbitControls(camera, canvasRef.value)
    controls.enableDamping = true
    controls.dampingFactor = 0.25
    controls.enableZoom = false

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5)
    scene.add(ambientLight)

    // const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
    // directionalLight.position.set(2, 2, 2)
    // scene.add(directionalLight)

    const geometry = new THREE.SphereGeometry(1, 512, 512)
    // const material = new THREE.MeshPhongMaterial({
    //     // color: getCSSColor('--color-neutral'),
    //     // transparent: true,
    //     // opacity: 1,
    //     // specular: '#000000',
    //     wireframe: true
    // })

    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uInvert: { value: false },
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    })
    sphere = new THREE.Mesh(geometry, material)
    scene.add(sphere)

    const clock = new THREE.Clock()
    const animate = () => {
        requestAnimationFrame(animate)
        // sphere.rotation.x += 0.01
        // sphere.rotation.y += 0.01
        material.uniforms.uTime.value = clock.getElapsedTime()
        controls.update()
        renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    watch(isDark, (newValue) => {
        document.documentElement.classList.toggle('dark', newValue)
        // sphere.material.color.set(getCSSColor('--color-neutral'))
        material.uniforms.uInvert.value = newValue
    })


    onBeforeUnmount(() => {
        window.removeEventListener('resize', handleResize)
        [renderer, geometry, material, directionalLight, ambientLight, controls].forEach(obj => obj?.dispose?.())
    })
})
</script>