import * as THREE from 'three';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

import vertexShader from '~/assets/shaders/vertex.glsl?raw';
import fragmentShader from '~/assets/shaders/fragment.glsl?raw';

export const useThreeScene = (canvas: Ref<HTMLCanvasElement | null>) => {
    const sphereRadiusPixels = ref(0);
    const windowWidth = ref(0);
    const md = computed(() => windowWidth.value >= 768);
    const lg = computed(() => windowWidth.value >= 1024);

    const mediumScreenCamera = 3;
    const smallScreenCamera = 3.5;

    const sphere = shallowRef<THREE.Mesh | null>(null);
    const cloneSpheres = shallowRef<THREE.Mesh[]>([]);
    const sphereMaterial = shallowRef<THREE.ShaderMaterial | null>(null);
    const toruses = shallowRef<THREE.Mesh[]>([]);
    const torusTextMaterial = shallowRef<THREE.MeshBasicMaterial | null>(null);
    const torusDotMaterial = shallowRef<THREE.MeshBasicMaterial | null>(null);

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let sphereGeometry: THREE.SphereGeometry;
    let torusGeometries: TextGeometry[] = [];
    let onResize: () => void;

    const initScene = () => {
        // 1. Scene
        scene = new THREE.Scene();

        // 2. Camera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        // 3. Renderer
        renderer = new THREE.WebGLRenderer({
            canvas: canvas.value!,
            alpha: true,
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        // 4. Main sphere
        sphereGeometry = new THREE.SphereGeometry(1, 512, 512);
        sphereMaterial.value = new THREE.ShaderMaterial({
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
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        });
        sphere.value = new THREE.Mesh(sphereGeometry, sphereMaterial.value);
        scene.add(sphere.value);

        // 5. Clone spheres
        for (let i = 0; i < 3; i++) {
            const cloneSphere = sphere.value.clone();
            cloneSphere.material = sphereMaterial.value;
            cloneSphere.visible = false;
            scene.add(cloneSphere);
            cloneSpheres.value.push(cloneSphere);
        }

        // 6. Text toruses
        torusDotMaterial.value = new THREE.MeshBasicMaterial({
            color: getCSSColor('--color-highlight')
        });
        torusTextMaterial.value = new THREE.MeshBasicMaterial({
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
            ]
            torusParams.forEach((params) => {
                const geometry = new TextGeometry(params.text, {
                    font: font,
                    size: torusFontSize,
                    depth: torusFontDepth,
                }).scale(1, 4, 1);

                createDotGroup(geometry, params.text, font);
                positionOnCylinder(geometry, params.radius);

                const torus = new THREE.Mesh(geometry, [torusTextMaterial.value!, torusDotMaterial.value!]);
                torus.position.set(0, -8, -2);
                torus.rotation.set(0, params.rotation, 0);
                scene.add(torus);
                toruses.value = [...toruses.value, torus];
                torusGeometries.push(geometry);
            });
        })

        // 7. Animation loop
        const clock = new THREE.Clock();
        const animate = () => {
            // update sphere
            sphereMaterial.value!.uniforms.uTime.value = clock.getElapsedTime();
            const transition = sphereMaterial.value!.uniforms.uTorusTransition.value;
            if (toruses.value.length > 0) {
                if (transition === 1) sphereMaterial.value!.uniforms.uTorusPosition.value.copy(toruses.value[0].position);
                else if (transition === 2) sphereMaterial.value!.uniforms.uTorusPosition.value.copy(toruses.value[1].position);
                else if (transition === 3) sphereMaterial.value!.uniforms.uTorusPosition.value.copy(toruses.value[2].position);
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
            if (md.value) camera.position.z = mediumScreenCamera;
            else camera.position.z = smallScreenCamera;
            if (window.innerWidth != lastWidth) {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
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
        sphereGeometry.dispose();
        sphereMaterial.value!.dispose();
        torusGeometries.forEach(geometry => geometry.dispose());
        torusTextMaterial.value!.dispose();
        torusDotMaterial.value!.dispose();
        window.removeEventListener('resize', onResize);
    });

    return {
        sphereMaterial,
        sphere,
        cloneSpheres,
        sphereRadiusPixels,
        torusTextMaterial,
        toruses
    }
};