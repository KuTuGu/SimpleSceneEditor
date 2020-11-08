const SHADOW_VSHADER_SOURCE = `#version 300 es
  in vec4 a_Position;
  uniform mat4 u_MvpMatrix;
  void main() {
    gl_Position = u_MvpMatrix * a_Position;
  }
`,
  SHADOW_FSHADER_SOURCE = `#version 300 es
  #ifdef GL_ES
    precision mediump float;
  #endif

  out vec4 o_Color;

  void main() {
    // Write the z-value in R
    o_Color = vec4(gl_FragCoord.z, 0.0, 0.0, 0.0);
  }
`;

const TEXTURE_VSHADER_SOURCE = `#version 300 es
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
`,
  TEXTURE_FSHADER_SOURCE = `#version 300 es
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
`;

const COLOR_VSHADER_SOURCE = `#version 300 es
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
`,
  COLOR_FSHADER_SOURCE = `#version 300 es
  #ifdef GL_ES
    precision mediump float;
  #endif

  uniform vec3 u_AmbientLightColor;
  uniform vec3 u_PointLightColor;
  uniform vec3 u_PointLightPosition;
  uniform vec3 u_LightColor;
  uniform vec3 u_LightDirection;
  uniform sampler2D u_ShadowMap;
  uniform int u_PickedObj;
  uniform int u_ObjID;
  uniform vec3 u_FogColor;
  uniform vec2 u_FogDist;

  in vec4 v_Color;
  in vec3 v_Position;
  in vec3 v_Barycentre;
  in vec3 v_Normal;
  in float v_Dist;

  out vec4 o_Color;

  float edgeFactor3() {
    vec3 d = fwidth(v_Barycentre);
    vec3 a3 = smoothstep(vec3(0.0), d * 20.0, v_Barycentre);
    return min(min(a3.x, a3.y), a3.z);
  }

  void main() {
    float dotParallel = max(dot(u_LightDirection, v_Normal), 0.0);
    float dotPoint = max(dot(normalize(u_PointLightPosition - v_Position), v_Normal), 0.0);
    float fogFactor = clamp((u_FogDist.y - v_Dist) / (u_FogDist.y - u_FogDist.x), 0.0, 1.0);

    vec4 color = u_ObjID == u_PickedObj ? vec4(1, 0, 0, 1) : v_Color;
    vec3 fogedColor = mix(u_FogColor, vec3(color), fogFactor);

    vec3 diffuse = u_LightColor * fogedColor * dotParallel + u_PointLightColor * fogedColor * dotPoint;
    vec3 ambientColor = u_AmbientLightColor * fogedColor;

    if (u_PickedObj == -1) {
      o_Color = vec4(diffuse + ambientColor, float(u_ObjID) / 255.0);  
    } else{
      o_Color = vec4(diffuse + ambientColor, color.a);
    }

    if (u_ObjID != u_PickedObj && all(greaterThan(v_Barycentre, vec3(0.0)))) {
      float interopter = edgeFactor3();
      interopter = pow(interopter, 0.3);
      o_Color.rgb = mix(vec3(1.0, 0.0, 0.0), vec3(1.0), interopter);
    }
  }`;

export {
  SHADOW_VSHADER_SOURCE,
  SHADOW_FSHADER_SOURCE,
  TEXTURE_VSHADER_SOURCE,
  TEXTURE_FSHADER_SOURCE,
  COLOR_VSHADER_SOURCE,
  COLOR_FSHADER_SOURCE,
};
