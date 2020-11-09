#version 300 es

#ifdef GL_ES
  precision mediump float;
#endif

uniform vec3 u_AmbientLightColor;
uniform vec3 u_PointLightColor;
uniform vec3 u_PointLightPosition;
uniform vec3 u_LightColor;
uniform vec3 u_LightDirection;
uniform sampler2D u_Sampler;
uniform sampler2D u_ShadowMap;
uniform int u_PickedObj;
uniform int u_ObjID;
uniform vec3 u_FogColor;
uniform vec2 u_FogDist;

in vec3 v_Position;
in vec3 v_Normal;
in vec2 v_TexCoord;
in float v_Dist;

out vec4 o_Color;

void main() {
  float dotParallel = max(dot(u_LightDirection, v_Normal), 0.0);
  float dotPoint = max(dot(normalize(u_PointLightPosition - v_Position), v_Normal), 0.0);
  float fogFactor = clamp((u_FogDist.y - v_Dist) / (u_FogDist.y - u_FogDist.x), 0.0, 1.0);

  vec4 texColor = u_ObjID == u_PickedObj ? vec4(1, 0, 0, 1) : texture(u_Sampler, v_TexCoord);
  vec3 fogedColor = mix(u_FogColor, vec3(texColor), fogFactor);

  vec3 diffuse = u_LightColor * fogedColor * dotParallel + u_PointLightColor * fogedColor * dotPoint;
  vec3 ambientColor = u_AmbientLightColor * fogedColor;

  if (u_PickedObj == -1) {
    o_Color = vec4(diffuse + ambientColor, float(u_ObjID) / 255.0);   
  } else{
    o_Color = vec4(diffuse + ambientColor, texColor.a);
  }
}