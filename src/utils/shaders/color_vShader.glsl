#version 300 es

in vec4 a_Position;
in vec3 a_Barycentre;
in vec4 a_Normal;
in vec4 a_Color;
uniform mat4 u_NormalMatrix;
uniform mat4 u_ModelMatrix;
uniform mat4 u_ViewProjMatrix;

out vec4 v_Color;
out vec3 v_Position;
out vec3 v_Barycentre;
out vec3 v_Normal;
out float v_Dist;

void main() {
  gl_Position = u_ViewProjMatrix * u_ModelMatrix * a_Position;

  v_Position = vec3(u_ModelMatrix * a_Position);
  v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));
  v_Dist = gl_Position.w;
  v_Color = a_Color;
  v_Barycentre = a_Barycentre;
}