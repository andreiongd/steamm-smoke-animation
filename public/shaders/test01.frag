precision highp float;

varying vec2 vUv;

void main() {
  // Define two colors for the gradient
  vec3 color1 = vec3(1.0, 0.0, 0.0); // Red
  vec3 color2 = vec3(0.0, 0.0, 1.0); // Blue

  // Interpolate between the colors based on vUv.y
  vec3 color = mix(color1, color2, vUv.x);

  gl_FragColor = vec4(color, 1.0); // Output the color
}
