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
    length: 1,
    colors: [
      // front
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
      // back
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
      // top
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
      // bottom
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
      // left
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
      // right
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1]
    ],
    texCoords: [
      // front-v1
      [0, 0],
      // front-v3
      [0, 1],
      // front-v7
      [1, 1],
      // front-v5
      [1, 0],

      // back-v4
      [0, 0],
      // back-v6
      [0, 1],
      // back-v2
      [1, 1],
      // back-v0
      [1, 0],

      // top-v3
      [0, 0],
      // top-v2
      [0, 1],
      // top-v6
      [1, 1],
      // top-v7
      [1, 0],

      // bottom-v0
      [0, 0],
      // bottom-v1
      [0, 1],
      // bottom-v5
      [1, 1],
      // bottom-v4
      [1, 0],

      // left-v0
      [0, 0],
      // left-v2
      [0, 1],
      // left-v3
      [1, 1],
      // left-v1
      [1, 0],

      // right-v5
      [0, 0],
      // right-v7
      [0, 1],
      // right-v6
      [1, 1],
      // right-v4
      [1, 0]
    ]
  },
  SphereConfig: {
    center: { x: 0, y: 0.5, z: 0 },
    colors: [1, 1, 1],
    radius: 0.5,
    latBands: 50,
    lonBands: 50
  },
  TriangleConfig: {
    points: [
      [0, 0, 0],
      [0, 0, -1],
      [1, 0, 0]
    ],
    center: { x: 0.5, y: 0, z: -0.5 },
    colors: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1]
    ],
    texCoords: [
      [0, 0],
      [0, 1],
      [1, 0]
    ]
  },
  PlaneConfig: {
    center: { x: 0, y: 0, z: 0 },
    width: 1,
    height: 1,
    colors: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1]
    ],
    texCoords: [
      [0, 1],
      [0, 0],
      [1, 0],
      [1, 1]
    ]
  },
  CircleConfig: {
    center: { x: 0, y: 0, z: 0 },
    radius: 0.5,
    bands: 50,
    colors: [1, 1, 1]
  }
};

export { RenderConfig, ObjectConfig };
