#version 300 es

#ifdef GL_ES
  precision mediump float;
#endif

out vec4 o_Color;

void main() {
  // Write the z-value in R
  o_Color = vec4(gl_FragCoord.z, 0.0, 0.0, 0.0);
}