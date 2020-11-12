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
  sight: Array<number>;
}

export interface FogProps {
  color: Array<number>;
  distance: Array<number>;
}

export interface ParallelLightProps {
  color: Array<number>;
  direction: Array<number>;
}

export interface PointLightProps {
  color: Array<number>;
  position: Array<number>;
}

export default interface StateProps {
  gl: WebGL2RenderingContext;
  directory: DirectoryProps;
  camera: CameraProps;
  transform: Record<string, any>;
  translation: Array<number>;
  rotation: Array<number>;
  fog: FogProps;
  parallelLight: ParallelLightProps;
  pointLight: PointLightProps;
  ambientLight: Array<number>;
  objID: number;
  pickedObjID: number;
  mouseStatus: number;
}
