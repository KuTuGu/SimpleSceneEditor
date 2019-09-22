const RenderConfig = {
  updateViewProject: {
    perspective: {
      fov: 25,
      near: 1,
      far: 100
    },
    sight: [3.0, 3.0, 6.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0]
  },
  updateRotateAngle: [0.0, 0.0],
  updateFog: {
    color: [100, 0, 0],
    distance: [10, 20]
  },
  updateParallelLight: {
    color: [1, 1, 1],
    direction: [1, 1, 1]
  },
  updatePointLight: {
    color: [1, 1, 1],
    position: [5, 5, 5]
  },
  updateAmbientLight: [3, 3, 3]
};

const ObjectConfig = {
  CubeConfig: {
    center: { x: 0, y: 0.5, z: 0 },
    width: 1,
    height: 1,
    length: 1
  },
  SphereConfig: {
    center: { x: 0, y: 0.5, z: 0 },
    radius: 0.5,
    latBands: 50,
    lonBands: 50
  },
  PlaneConfig: {
    center: { x: 0, y: 0, z: 0 },
    width: 1,
    height: 1
  }
};

export { RenderConfig, ObjectConfig };
