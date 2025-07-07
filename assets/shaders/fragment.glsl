uniform bool uInvert;
varying vec3 vNormal;
varying float vPerlinStrength;

void main() {
    float temp = vPerlinStrength + 0.05;
    temp *= 2.0;
    if(uInvert) {
        temp = 1.0 - temp;
    }
    gl_FragColor = vec4(temp, temp, temp, 1.0);
}