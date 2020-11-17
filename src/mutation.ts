// store（初始化 || 更新）时的副作用
import { mat4, vec3 } from "gl-matrix";
import { getUniformLocation } from "./utils/webgl.utils";
import {
  CameraProps,
  FogProps,
  ParallelLightProps,
  PointLightProps,
} from "./interface";

export default {
  camera(gl: WebGLContext, payload: CameraProps): void {
    const {
        perspective: { fov, near, far },
        sight,
      } = payload,
      viewProjMatrix = mat4.create(),
      lookAtMatrix = mat4.create(),
      u_ViewProjMatrix = getUniformLocation(gl, "u_ViewProjMatrix");

    // 摄像机视窗
    mat4.perspective(
      viewProjMatrix,
      fov,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      near,
      far
    );
    // 摄像机视角
    mat4.lookAt(lookAtMatrix, ...sight);
    mat4.multiply(viewProjMatrix, viewProjMatrix, lookAtMatrix);

    // 写入着色器缓冲区
    gl.uniformMatrix4fv(u_ViewProjMatrix, false, viewProjMatrix);
  },
  translation(
    gl: WebGLContext,
    payload: TwoDigitTuple,
    transform = mat4.create()
  ): mat4 {
    const modelMatrix = transform,
      offset = vec3.fromValues(...payload, 0),
      u_ModelMatrix = getUniformLocation(gl, "u_ModelMatrix");

    // 平移改变 顶点
    mat4.translate(modelMatrix, modelMatrix, offset);
    // 写入着色器缓冲区
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix);

    return modelMatrix;
  },
  rotation(
    gl: WebGLContext,
    payload: TwoDigitTuple,
    transform = mat4.create()
  ): mat4 {
    const modelMatrix = transform,
      normalMatrix = mat4.create(),
      u_ModelMatrix = getUniformLocation(gl, "u_ModelMatrix"),
      u_NormalMatrix = getUniformLocation(gl, "u_NormalMatrix");

    // 旋转改变 顶点和法线
    // x轴
    mat4.rotate(
      modelMatrix,
      modelMatrix,
      payload[0],
      vec3.fromValues(1.0, 0.0, 0.0)
    );
    // y轴
    mat4.rotate(
      modelMatrix,
      modelMatrix,
      payload[1],
      vec3.fromValues(0.0, 1.0, 0.0)
    );

    // 逆转矩阵，计算法线
    mat4.invert(normalMatrix, modelMatrix);
    mat4.transpose(normalMatrix, normalMatrix);

    // 写入着色器缓冲区
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix);
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix);

    return modelMatrix;
  },
  fog(gl: WebGLContext, payload: FogProps): void {
    const { color, distance } = payload,
      u_FogColor = getUniformLocation(gl, "u_FogColor"),
      u_FogDist = getUniformLocation(gl, "u_FogDist");

    gl.uniform3fv(u_FogColor, new Float32Array(color));
    gl.uniform2fv(u_FogDist, new Float32Array(distance));
  },
  parallelLight(gl: WebGLContext, payload: ParallelLightProps): void {
    const { color, direction } = payload,
      u_LightColor = getUniformLocation(gl, "u_LightColor"),
      u_LightDirection = getUniformLocation(gl, "u_LightDirection"),
      lightDirection = vec3.fromValues(...direction);

    vec3.normalize(lightDirection, lightDirection);

    gl.uniform3fv(u_LightColor, color);
    gl.uniform3fv(u_LightDirection, lightDirection);
  },
  pointLight(gl: WebGLContext, payload: PointLightProps): void {
    const { color, position } = payload,
      u_PointLightColor = getUniformLocation(gl, "u_PointLightColor"),
      u_PointLightPosition = getUniformLocation(gl, "u_PointLightPosition");

    gl.uniform3f(u_PointLightColor, ...color);
    gl.uniform3f(u_PointLightPosition, ...position);
  },
  ambientLight(gl: WebGLContext, payload: ThereDigitTuple): void {
    const u_AmbientLightColor = getUniformLocation(gl, "u_AmbientLightColor");

    gl.uniform3f(u_AmbientLightColor, ...payload);
  },
};
