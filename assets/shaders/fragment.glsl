uniform bool uDarkMode;
uniform float uBrightness;
varying float vPerlinStrength;
varying float vInvert;

void main() {
    float temp = vPerlinStrength + uBrightness;
    temp *= 2.0;
    float invert = uDarkMode ? (1.0 - vInvert) : vInvert;
    float final = mix(temp, 1.0 - temp, invert);
    gl_FragColor = vec4(final, final, final, 1.0);
}