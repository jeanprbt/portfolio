import * as THREE from 'three';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

import { gsap } from 'gsap';

import vertexShader from '~/assets/shaders/vertex.glsl?raw';
import fragmentShader from '~/assets/shaders/fragment.glsl?raw';

export const useThreeScene = (canvas: Ref<HTMLCanvasElement | null>, introPlayed: Ref<boolean>) => {

    const isLoaded = ref(false);

    const sphere = shallowRef<THREE.Mesh | null>(null);
    const sphereGroup = shallowRef<THREE.Group | null>(null);
    const cloneSpheres = shallowRef<THREE.Mesh[]>([]);
    const sphereRadiusPixels = ref(0);
    const toruses = shallowRef<THREE.Mesh[]>([]);

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let onResize: () => void;

    const windowWidth = ref(0);
    const md = computed(() => windowWidth.value >= 768);
    const lg = computed(() => windowWidth.value >= 1024);
    const largeScreenScamera = 3;
    const mediumScreenCamera = 3.2;
    const smallScreenCamera = 4;

    const initScene = () => {
        // 1. Scene
        scene = new THREE.Scene();

        // 2. Camera
        const parent = canvas.value!.parentElement;
        camera = new THREE.PerspectiveCamera(
            75,
            parent!.clientWidth / parent!.clientHeight,
            0.1,
            1000
        );
        camera.position.z = 5;

        // 3. Renderer
        renderer = new THREE.WebGLRenderer({
            canvas: canvas.value!,
            alpha: true,
            antialias: true
        });
        renderer.setSize(parent!.clientWidth, parent!.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        // 4. Main sphere
        const sphereGeometry = new THREE.SphereGeometry(1, 128, 128);
        const sphereMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uTimeFrequency: { value: 0.5 },
                uDistortionFrequency: { value: 2.0 },
                uDistortionStrength: { value: 2.0 },
                uDisplacementFrequency: { value: 1.0 },
                uDisplacementStrength: { value: 0.1 },
                uTorusPosition: { value: new THREE.Vector3() },
                uTorusTransition: { value: 1.0 },
                uDarkMode: { value: false },
                uBrightness: { value: 0.05 },
                uOpacity: { value: 1.0 }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        });
        sphereMaterial.transparent = true;
        sphere.value = new THREE.Mesh(sphereGeometry, sphereMaterial);
        scene.add(sphere.value);

        // 5. Clone spheres
        sphereGroup.value = new THREE.Group();
        scene.add(sphereGroup.value);
        sphereGroup.value.add(sphere.value);

        for (let i = 0; i < 2; i++) {
            const cloneSphere = sphere.value.clone();

            const sphereMaterial = (sphere.value.material as THREE.ShaderMaterial);
            const cloneSphereMaterial = sphereMaterial.clone();
            cloneSphereMaterial.uniforms.uTime = sphereMaterial.uniforms.uTime;
            cloneSphereMaterial.uniforms.uTorusPosition = sphereMaterial.uniforms.uTorusPosition;
            cloneSphereMaterial.uniforms.uTorusTransition = sphereMaterial.uniforms.uTorusTransition;
            cloneSphereMaterial.uniforms.uDarkMode = sphereMaterial.uniforms.uDarkMode;
            cloneSphere.material = cloneSphereMaterial;

            cloneSphere.visible = false;
            scene.add(cloneSphere);
            cloneSpheres.value.push(cloneSphere);
            sphereGroup.value.add(cloneSphere);
        }

        // 6. Text toruses
        const torusDotMaterial = new THREE.MeshBasicMaterial({
            color: getCSSColor('--color-highlight')
        });
        const torusTextMaterial = new THREE.MeshBasicMaterial({
            color: getCSSColor('--color-primary')
        });
        const fontLoader = new FontLoader();
        fontLoader.load('/font.json', (font: Font) => {
            const torusFontSize = lg.value ? 0.2 : md.value ? 0.15 : 0.1;
            const torusFontDepth = 0.03;
            const torusParams = [
                {
                    text: "ABOUT.",
                    radius: lg.value ? 2 : md.value ? 1.75 : 1.5,
                    rotation: 2.25 * Math.PI
                },
                {
                    text: "EXPERIENCE.",
                    radius: lg.value ? 2.1 : md.value ? 1.8 : 1.5,
                    rotation: 2.5 * Math.PI
                },
                {
                    text: "PROJECTS.",
                    radius: lg.value ? 2.1 : md.value ? 1.8 : 1.5,
                    rotation: 2.25 * Math.PI
                },
                {
                    text: "CONTACT.",
                    radius: lg.value ? 2.1 : md.value ? 1.8 : 1.5,
                    rotation: 2.2 * Math.PI
                }
            ]
            torusParams.forEach((params) => {
                const geometry = new TextGeometry(params.text, {
                    font: font,
                    size: torusFontSize,
                    depth: torusFontDepth,
                }).scale(1, 4, 1);

                createDotGroup(geometry, params.text, font);
                positionOnCylinder(geometry, params.radius);

                const torus = new THREE.Mesh(geometry, [torusTextMaterial, torusDotMaterial]);
                torus.position.set(0, -8, -2);
                torus.rotation.set(0, params.rotation, 0);
                scene.add(torus);
                toruses.value = [...toruses.value, torus];
            });

            requestAnimationFrame(() => {
                isLoaded.value = true;
                watch(introPlayed, (newVal) => {
                    if (newVal) gsap.fromTo(
                        sphere.value!.scale,
                        { x: 0.1, y: 0.1, z: 0.1 },
                        { x: 1, y: 1, z: 1, duration: 1.2, ease: "power3.out" }
                    );
                });
            });
        });

        // 7. Animation loop
        const clock = new THREE.Clock();
        const animate = () => {
            // update sphere
            sphereMaterial.uniforms.uTime.value = clock.getElapsedTime();
            const transition = sphereMaterial.uniforms.uTorusTransition.value;
            if (toruses.value.length > 0) {
                if (transition === 1) sphereMaterial.uniforms.uTorusPosition.value.copy(toruses.value[0].position);
                else if (transition === 2) sphereMaterial.uniforms.uTorusPosition.value.copy(toruses.value[1].position);
                else if (transition === 3) sphereMaterial.uniforms.uTorusPosition.value.copy(toruses.value[2].position);
                else if (transition === 4) sphereMaterial.uniforms.uTorusPosition.value.copy(toruses.value[3].position);
            }
            renderer.render(scene, camera);

            // update projects spheres
            cloneSpheres.value.forEach((cloneSphere) => {
                cloneSphere.rotation.copy(sphere.value!.rotation);
                cloneSphere.scale.copy(sphere.value!.scale);
            })

            // update clip-mask
            const fov = camera.fov * (Math.PI / 180);
            const distance = Math.abs(camera.position.z - sphere.value!.position.z);
            const visibleHeight = 2 * Math.tan(fov / 2) * distance;
            const pixelsPerUnit = window.innerHeight / visibleHeight;
            sphereRadiusPixels.value = sphere.value!.scale.x * pixelsPerUnit;
            if (!lg.value) sphereRadiusPixels.value -= 6;
        };
        renderer.setAnimationLoop(animate);

        // 8. Resize handler
        let lastWidth = window.innerWidth;
        onResize = () => {
            windowWidth.value = window.innerWidth;
            camera.position.z = lg.value ? largeScreenScamera : md.value ? mediumScreenCamera : smallScreenCamera;
            if (window.innerWidth != lastWidth) {
                camera.aspect = parent!.clientWidth / parent!.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(parent!.clientWidth, parent!.clientHeight);
                lastWidth = window.innerWidth;
            }
        };
        window.addEventListener('resize', onResize);
        onResize();
    };

    onMounted(() => {
        if (!canvas.value) return;
        initScene();
    })

    onUnmounted(() => {
        renderer.dispose();
        (sphere.value!.geometry).dispose();
        (sphere.value!.material as THREE.ShaderMaterial).dispose();
        toruses.value!.forEach(t => t.geometry.dispose());
        toruses.value!.forEach(t => {
            if (Array.isArray(t.material)) {
                t.material.forEach(m => m.dispose());
            } else {
                t.material.dispose();
            }
        });
        window.removeEventListener('resize', onResize);
    });

    return {
        isLoaded,
        sphere,
        sphereGroup,
        cloneSpheres,
        sphereRadiusPixels,
        toruses
    }
};