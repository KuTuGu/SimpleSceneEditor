import { createStore } from "vuex";
import Mutation from "./mutation";
import StateProps, {
  DirectoryProps,
  CameraProps,
  FogProps,
  ParallelLightProps,
  PointLightProps,
} from "./interface";

export default createStore({
  state: {
    gl: <WebGLContext>{},
    directory: {},
    camera: {
      perspective: {
        fov: 25,
        near: 1,
        far: 100,
      },
      sight: [3.0, 3.0, 6.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0],
    },
    transform: {},
    translation: [0.0, 0.0],
    rotation: [0.0, 0.0],
    fog: {
      color: [100, 0, 50],
      distance: [10, 20],
    },
    parallelLight: {
      color: [1, 1, 1],
      direction: [1, 1, 1],
    },
    pointLight: {
      color: [1, 1, 1],
      position: [5, 5, 5],
    },
    ambientLight: [3, 3, 3],
    objID: 0,
    pickedObjID: -2,
    mouseStatus: 0,
  },
  mutations: {
    updateGL(state: StateProps, payload: WebGLContext) {
      state.gl = payload;
    },
    updateMouseStatus(state: StateProps, payload: number) {
      state.mouseStatus = payload;
    },
    updateCamera(state: StateProps, payload: CameraProps) {
      Mutation.camera(state.gl, payload);
      state.camera = payload;
    },
    updateTranslation(state: StateProps, payload: TwoDigitTuple) {
      state.transform = Mutation.translation(
        state.gl,
        payload,
        state.transform
      );
    },
    updateRotation(state: StateProps, payload: TwoDigitTuple) {
      state.transform = Mutation.rotation(state.gl, payload, state.transform);
    },
    updateFog(state: StateProps, payload: FogProps) {
      Mutation.fog(state.gl, payload);
      state.fog = payload;
    },
    updateParallelLight(state: StateProps, payload: ParallelLightProps) {
      Mutation.parallelLight(state.gl, payload);
      state.parallelLight = payload;
    },
    updatePointLight(state: StateProps, payload: PointLightProps) {
      Mutation.pointLight(state.gl, payload);
      state.pointLight = payload;
    },
    updateAmbientLight(state: StateProps, payload: ThereDigitTuple) {
      Mutation.ambientLight(state.gl, payload);
      state.ambientLight = payload;
    },
    updateClickCanvas(state: StateProps, payload: number) {
      Mutation.clickCanvas(state.gl, payload);
      state.pickedObjID = payload;
    },
    updateObjects(state: StateProps, payload: DirectoryProps) {
      state.directory = payload;
    },
    updateObjID(state: StateProps) {
      state.objID++;
    },
  },
});
