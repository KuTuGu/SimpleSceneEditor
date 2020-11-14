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
  sight: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
  ];
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
  gl: WebGL2RenderingContext;
  directory: DirectoryProps;
  camera: CameraProps;
  transform: Record<string, any>;
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
