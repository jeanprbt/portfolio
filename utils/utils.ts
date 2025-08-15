import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { Font } from 'three/examples/jsm/Addons.js';

// getCSSColor
export const getCSSColor = (variable: string) => getComputedStyle(document.documentElement).getPropertyValue(variable).trim();

// positionOnCylinder
export const positionOnCylinder = (geometry: TextGeometry, cylinderRadius: number) => {
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = positions.getZ(i);

        const angle = -(x / cylinderRadius) * Math.PI * 2;
        const newX = cylinderRadius * Math.cos(angle);
        const newZ = cylinderRadius * Math.sin(angle);

        positions.setX(i, newX);
        positions.setY(i, y);
        positions.setZ(i, newZ + z);
    }
    positions.needsUpdate = true;
};

// createDotGroup
export const createDotGroup = (geometry: TextGeometry, text: string, font: Font) => {
    let charVertexStart = 0;
    for (let i = 0; i < text.length; i++) {
        const charGeo = new TextGeometry(text[i], {
            font: font,
            size: 0.2,
            depth: 0.01,
        }).scale(1, 4, 1);
        if (i === text.length - 1) {
            const vertexCount = charGeo.attributes.position.count;
            const dotVertexStart = charVertexStart;
            const dotVertexEnd = charVertexStart + vertexCount;

            const faceCount = geometry.attributes.position.count / 3;
            geometry.clearGroups();
            for (let f = 0; f < faceCount; f++) {
                const v1 = f * 3;
                const isDotFace = (v1 >= dotVertexStart && v1 < dotVertexEnd);
                geometry.addGroup(v1, 3, isDotFace ? 1 : 0);
            }
            break;
        }
        charVertexStart += charGeo.attributes.position.count;
    }
};