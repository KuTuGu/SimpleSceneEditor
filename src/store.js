import Vue from "vue";
import Vuex from "vuex";
import Mutation from "./mutation";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    gl: null,
    directory: {},
    camera: {
      perspective: {
        fov: 25,
        near: 1,
        far: 100
      },
      sight: [3.0, 3.0, 6.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0]
    },
    transform: null,
    translation: [0.0, 0.0],
    rotation: [0.0, 0.0],
    fog: {
      color: [100, 0, 50],
      distance: [10, 20]
    },
    parallelLight: {
      color: [1, 1, 1],
      direction: [1, 1, 1]
    },
    pointLight: {
      color: [1, 1, 1],
      position: [5, 5, 5]
    },
    ambientLight: [3, 3, 3],
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
    updateCamera(state, payload) {
      Mutation.camera(state.gl, payload);
      state.camera = payload;
    },
    updateTranslation(state, payload) {
      state.transform = Mutation.translation(
        state.gl,
        payload,
        state.transform
      );
    },
    updateRotation(state, payload) {
      state.transform = Mutation.rotation(state.gl, payload, state.transform);
    },
    updateFog(state, payload) {
      Mutation.fog(state.gl, payload);
      state.fog = payload;
    },
    updateParallelLight(state, payload) {
      Mutation.parallelLight(state.gl, payload);
      state.parallelLight = payload;
    },
    updatePointLight(state, payload) {
      Mutation.pointLight(state.gl, payload);
      state.pointLight = payload;
    },
    updateAmbientLight(state, payload) {
      Mutation.ambientLight(state.gl, payload);
      state.ambientLight = payload;
    },
    updateClickCanvas(state, payload) {
      Mutation.clickCanvas(state.gl, payload);
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
