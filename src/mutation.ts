// store（初始化 || 更新）时的副作用
import { Matrix4, Vector3 } from "./utils/matrix";
import { getPropLocation } from "./utils/webgl.utils";
import {
  CameraProps,
  FogProps,
  ParallelLightProps,
  PointLightProps,
} from "./interface";

export default {
  camera(gl: WebGL2RenderingContext, payload: CameraProps): void {
    const {
        perspective: { fov, near, far },
        sight,
      } = payload,
      viewProjMatrix = new Matrix4(),
      u_ViewProjMatrix = getPropLocation(gl, "u_ViewProjMatrix", true);

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
    gl: WebGL2RenderingContext,
    payload: TwoDigitTuple,
    transform: Record<string, any> = {}
  ): Record<string, any> {
    const modelMatrix = transform.translate ? transform : new Matrix4(),
      u_ModelMatrix = getPropLocation(gl, "u_ModelMatrix", true);

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
    gl: WebGL2RenderingContext,
    payload: TwoDigitTuple,
    transform: Record<string, any> = {}
  ): Record<string, any> {
    const modelMatrix = transform.rotate ? transform : new Matrix4(),
      normalMatrix = new Matrix4(),
      u_ModelMatrix = getPropLocation(gl, "u_ModelMatrix", true),
      u_NormalMatrix = getPropLocation(gl, "u_NormalMatrix", true);

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
  fog(gl: WebGL2RenderingContext, payload: FogProps): void {
    const { color, distance } = payload,
      u_FogColor = getPropLocation(gl, "u_FogColor", true),
      u_FogDist = getPropLocation(gl, "u_FogDist", true);

    gl.uniform3fv(u_FogColor, new Float32Array(color));
    gl.uniform2fv(u_FogDist, new Float32Array(distance));
  },
  parallelLight(gl: WebGL2RenderingContext, payload: ParallelLightProps): void {
    const { color, direction } = payload,
      u_LightColor = getPropLocation(gl, "u_LightColor", true),
      u_LightDirection = getPropLocation(gl, "u_LightDirection", true),
      lightColor = new Vector3(color),
      lightDirection = new Vector3(direction);

    lightDirection.normalize();
    gl.uniform3fv(u_LightColor, lightColor.elements);
    gl.uniform3fv(u_LightDirection, lightDirection.elements);
  },
  pointLight(gl: WebGL2RenderingContext, payload: PointLightProps): void {
    const { color, position } = payload,
      u_PointLightColor = getPropLocation(gl, "u_PointLightColor", true),
      u_PointLightPosition = getPropLocation(gl, "u_PointLightPosition", true);

    gl.uniform3f(u_PointLightColor, ...color);
    gl.uniform3f(u_PointLightPosition, ...position);
  },
  ambientLight(gl: WebGL2RenderingContext, payload: ThereDigitTuple): void {
    const u_AmbientLightColor = getPropLocation(
      gl,
      "u_AmbientLightColor",
      true
    );

    gl.uniform3f(u_AmbientLightColor, ...payload);
  },
  clickCanvas(gl: WebGL2RenderingContext, payload: number): void {
    const u_PickedObj = getPropLocation(gl, "u_PickedObj", true);

    gl.uniform1i(u_PickedObj, payload);
  },
};
