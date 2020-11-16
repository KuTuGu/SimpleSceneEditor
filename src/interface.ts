import { mat4 } from "gl-matrix";

export interface ObjectProps {
  name: string;
  type: string;
  id: number;
  children: Array<number>;
  parent: number;
}

export interface DirectoryProps {
  [id: string]: ObjectProps;
}

export interface CameraProps {
  perspective: {
    fov: number;
    near: number;
    far: number;
  };
  sight: [ThereDigitTuple, ThereDigitTuple, ThereDigitTuple];
}

export interface FogProps {
  color: ThereDigitTuple;
  distance: TwoDigitTuple;
}

export interface ParallelLightProps {
  color: ThereDigitTuple;
  direction: ThereDigitTuple;
}

export interface PointLightProps {
  color: ThereDigitTuple;
  position: ThereDigitTuple;
}

export default interface StateProps {
  gl: WebGLContext;
  directory: DirectoryProps;
  camera: CameraProps;
  transform: mat4;
  translation: TwoDigitTuple;
  rotation: TwoDigitTuple;
  fog: FogProps;
  parallelLight: ParallelLightProps;
  pointLight: PointLightProps;
  ambientLight: ThereDigitTuple;
  objID: number;
  pickedObjID: number;
  mouseStatus: number;
}
