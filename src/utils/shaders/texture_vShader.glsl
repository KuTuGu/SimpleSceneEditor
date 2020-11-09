#version 300 es

in vec4 a_Position;
in vec4 a_Normal;
in vec2 a_TexCoord;
uniform mat4 u_NormalMatrix;
uniform mat4 u_ModelMatrix;
uniform mat4 u_ViewProjMatrix;

out vec3 v_Position;
out vec3 v_Normal;
out vec2 v_TexCoord;
out float v_Dist;

void main() {
  gl_Position = u_ViewProjMatrix * u_ModelMatrix * a_Position;
  v_Position = vec3(u_ModelMatrix * a_Position);
  v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));
  v_TexCoord = a_TexCoord;
  v_Dist = gl_Position.w;
}