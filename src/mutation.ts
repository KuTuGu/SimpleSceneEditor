// store（初始化 || 更新）时的副作用
import { Matrix4, Vector3 } from "./utils/matrix";
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
      viewProjMatrix = new Matrix4(),
      u_ViewProjMatrix = getUniformLocation(gl, "u_ViewProjMatrix");

    // 视窗更新
    viewProjMatrix.setPerspective(
      fov,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      near,
      far
    );
    viewProjMatrix.lookAt(...sight);
    // 写入着色器缓冲区
    gl.uniformMatrix4fv(u_ViewProjMatrix, false, viewProjMatrix.elements);
  },
  translation(
    gl: WebGLContext,
    payload: TwoDigitTuple,
    transform: Record<string, any> = {}
  ): Record<string, any> {
    const modelMatrix = transform.translate ? transform : new Matrix4(),
      u_ModelMatrix = getUniformLocation(gl, "u_ModelMatrix");

    // 平移改变 顶点
    // x轴
    modelMatrix.translate(payload[0], 0.0, 0.0);
    // y轴
    modelMatrix.translate(0.0, payload[1], 0.0);
    // 写入着色器缓冲区
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    return modelMatrix;
  },
  rotation(
    gl: WebGLContext,
    payload: TwoDigitTuple,
    transform: Record<string, any> = {}
  ): Record<string, any> {
    const modelMatrix = transform.rotate ? transform : new Matrix4(),
      normalMatrix = new Matrix4(),
      u_ModelMatrix = getUniformLocation(gl, "u_ModelMatrix"),
      u_NormalMatrix = getUniformLocation(gl, "u_NormalMatrix");

    // 旋转改变 顶点和法线
    // x轴
    modelMatrix.rotate(payload[0], 1.0, 0.0, 0.0);
    // y轴
    modelMatrix.rotate(payload[1], 0.0, 1.0, 0.0);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    // 写入着色器缓冲区
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

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
      lightColor = new Vector3(color),
      lightDirection = new Vector3(direction);

    lightDirection.normalize();
    gl.uniform3fv(u_LightColor, lightColor.elements);
    gl.uniform3fv(u_LightDirection, lightDirection.elements);
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
  clickCanvas(gl: WebGLContext, payload: number): void {
    const u_PickedObj = getUniformLocation(gl, "u_PickedObj");

    gl.uniform1i(u_PickedObj, payload);
  },
};
