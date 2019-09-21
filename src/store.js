import Vue from "vue";
import Vuex from "vuex";
import { Matrix4, Vector3 } from "./utils/matrix";
import { getPropLocation } from "./utils/webgl.utils";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    gl: null,
    directory: [],
    viewProject: {},
    rotateAngle: [],
    fog: {},
    parallelLight: {},
    pointLight: {},
    ambientLight: [],
    objID: 0,
    pickedObjID: -2,
    mouseStatus: 0
  },
  mutations: {
    updateGL(state, payload) {
      state.gl = payload;
    },
    updateMouseStatus(state, payload) {
      state.mouseStatus = payload;
    },
    updateViewProject(state, payload) {
      const {
          perspective: { fov, near, far },
          sight
        } = payload,
        { gl } = state,
        viewProjMatrix = new Matrix4(),
        u_ViewProjMatrix = getPropLocation(gl, "u_ViewProjMatrix", true);

      viewProjMatrix.setPerspective(
        fov,
        gl.drawingBufferWidth / gl.drawingBufferHeight,
        near,
        far
      );
      viewProjMatrix.lookAt(...sight);
      gl.uniformMatrix4fv(u_ViewProjMatrix, false, viewProjMatrix.elements);

      state.viewProject = payload;
    },
    updateRotateAngle(state, payload) {
      const { gl } = state,
        modelMatrix = new Matrix4(),
        normalMatrix = new Matrix4(),
        u_ModelMatrix = getPropLocation(gl, "u_ModelMatrix", true),
        u_NormalMatrix = getPropLocation(gl, "u_NormalMatrix", true);

      modelMatrix.setRotate(payload[0], 1.0, 0.0, 0.0);
      modelMatrix.rotate(payload[1], 0.0, 1.0, 0.0);
      normalMatrix.setInverseOf(modelMatrix);
      normalMatrix.transpose();
      gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
      gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

      state.rotateAngle = payload;
    },
    updateFog(state, payload) {
      const { color, distance } = payload,
        { gl } = state,
        u_FogColor = getPropLocation(gl, "u_FogColor", true),
        u_FogDist = getPropLocation(gl, "u_FogDist", true);

      gl.uniform3fv(u_FogColor, new Float32Array(color));
      gl.uniform2fv(u_FogDist, new Float32Array(distance));

      state.fog = payload;
    },
    updateParallelLight(state, payload) {
      const { color, direction } = payload,
        { gl } = state,
        u_LightColor = getPropLocation(gl, "u_LightColor", true),
        u_LightDirection = getPropLocation(gl, "u_LightDirection", true),
        lightColor = new Vector3(color),
        lightDirection = new Vector3(direction);

      lightDirection.normalize();
      gl.uniform3fv(u_LightColor, lightColor.elements);
      gl.uniform3fv(u_LightDirection, lightDirection.elements);

      state.parallelLight = payload;
    },
    updatePointLight(state, payload) {
      const { color, position } = payload,
        { gl } = state,
        u_PointLightColor = getPropLocation(gl, "u_PointLightColor", true),
        u_PointLightPosition = getPropLocation(
          gl,
          "u_PointLightPosition",
          true
        );

      gl.uniform3f(u_PointLightColor, ...color);
      gl.uniform3f(u_PointLightPosition, ...position);

      state.pointLight = payload;
    },
    updateAmbientLight(state, payload) {
      const { gl } = state,
        u_AmbientLightColor = getPropLocation(gl, "u_AmbientLightColor", true);

      gl.uniform3f(u_AmbientLightColor, ...payload);

      state.ambientLight = payload;
    },
    updateClickCanvas(state, payload) {
      const { gl } = state,
        u_PickedObj = getPropLocation(gl, "u_PickedObj", true);

      gl.uniform1i(u_PickedObj, payload);

      state.pickedObjID = payload;
    },
    updateObjects(state, payload) {
      state.directory = payload;
    },
    updateObjID(state) {
      state.objID++;
    }
  }
});

export { Vue, store };
