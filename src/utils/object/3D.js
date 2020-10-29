import Body from "./body";

// Create a cube
//    v2----- v6
//   /|      /|
//  v3------v7|
//  | |     | |
//  | |v0---|-|v4
//  |/      |/
//  v1------v5
class Cube extends Body {
  constructor(props = {}) {
    const {
      center = { x: 0, y: 0.5, z: 0 },
      width = 1,
      height = 1,
      length = 1,
      color = [1, 1, 1]
    } = props;

    super({
      ...props,
      vertices: Cube.vertices(center, width, height, length),
      indices: Cube.indices,
      normals: Cube.normals,
      texCoords: Cube.texCoords,
      colors: new Array(24).fill([...color]),
      center,
      width,
      height,
      length
    });
  }

  static vertices(center, width, height, length) {
    const diffx = width / 2,
      diffy = height / 2,
      diffz = length / 2;

    return [
      // front-v1
      [center.x - diffx, center.y - diffy, center.z + diffz],
      // front-v3
      [center.x - diffx, center.y + diffy, center.z + diffz],
      // front-v7
      [center.x + diffx, center.y + diffy, center.z + diffz],
      // front-v5
      [center.x + diffx, center.y - diffy, center.z + diffz],

      // back-v4
      [center.x + diffx, center.y - diffy, center.z - diffz],
      // back-v6
      [center.x + diffx, center.y + diffy, center.z - diffz],
      // back-v2
      [center.x - diffx, center.y + diffy, center.z - diffz],
      // back-v0
      [center.x - diffx, center.y - diffy, center.z - diffz],

      // top-v3
      [center.x - diffx, center.y + diffy, center.z + diffz],
      // top-v2
      [center.x - diffx, center.y + diffy, center.z - diffz],
      // top-v6
      [center.x + diffx, center.y + diffy, center.z - diffz],
      // top-v7
      [center.x + diffx, center.y + diffy, center.z + diffz],

      // bottom-v0
      [center.x - diffx, center.y - diffy, center.z - diffz],
      // bottom-v1
      [center.x - diffx, center.y - diffy, center.z + diffz],
      // bottom-v5
      [center.x + diffx, center.y - diffy, center.z + diffz],
      // bottom-v4
      [center.x + diffx, center.y - diffy, center.z - diffz],

      // left-v0
      [center.x - diffx, center.y - diffy, center.z - diffz],
      // left-v2
      [center.x - diffx, center.y + diffy, center.z - diffz],
      // left-v3
      [center.x - diffx, center.y + diffy, center.z + diffz],
      // left-v1
      [center.x - diffx, center.y - diffy, center.z + diffz],

      // right-v5
      [center.x + diffx, center.y - diffy, center.z + diffz],
      // right-v7
      [center.x + diffx, center.y + diffy, center.z + diffz],
      // right-v6
      [center.x + diffx, center.y + diffy, center.z - diffz],
      // right-v4
      [center.x + diffx, center.y - diffy, center.z - diffz]
    ];
  }

  static get normals() {
    return [
      // front
      [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0],
      // back
      [0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0],
      // top
      [0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0],
      // bottom
      [0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0],
      // left
      [-1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0],
      // right
      [1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0]
    ];
  }

  static get indices() {
    return [
      // front
      [0, 1, 2, 0, 2, 3],
      // back
      [4, 5, 6, 4, 6, 7],
      // top
      [8, 9, 10, 8, 10, 11],
      // bottom
      [12, 13, 14, 12, 14, 15],
      // left
      [16, 17, 18, 16, 18, 19],
      // right
      [20, 21, 22, 20, 22, 23]
    ];
  }

  static get texCoords() {
    return [
      // front
      [0, 0, 0, 1, 1, 1, 1, 0],
      // back
      [0, 0, 0, 1, 1, 1, 1, 0],
      // top
      [0, 0, 0, 1, 1, 1, 1, 0],
      // bottom
      [0, 0, 0, 1, 1, 1, 1, 0],
      // left
      [0, 0, 0, 1, 1, 1, 1, 0],
      // right
      [0, 0, 0, 1, 1, 1, 1, 0]
    ];
  }

  render(gl) {
    if (this.texture) {
      this.draw(gl, "texture", {
        mode: gl.TRIANGLES,
        buffer: true
      });
    } else if (this.line) {
      this.draw(gl, "line", {
        mode: gl.LINE_LOOP,
        buffer: true
      });
    } else {
      this.draw(gl, "color", {
        mode: gl.TRIANGLES,
        buffer: true
      });
    }
  }
}

class Sphere extends Body {
  constructor(props = {}) {
    const {
      center = { x: 0, y: 0.5, z: 0 },
      radius = 0.5,
      latBands = 50,
      lonBands = 50,
      color = [1, 1, 1]
    } = props;

    super({
      ...props,
      ...Sphere.initCoords(center, radius, latBands, lonBands, color),
      center,
      radius,
      latBands,
      lonBands
    });
  }

  static initCoords(center, radius, latBands, lonBands, color) {
    const vertices = [],
      texCoords = [],
      colors = [];

    for (let i = 0; i <= latBands; i++) {
      // -π/2 ~ π/2
      let lat = (i * Math.PI) / latBands - Math.PI / 2,
        sinLat = Math.sin(lat),
        cosLat = Math.cos(lat);
      for (let j = 0; j <= lonBands; j++) {
        // -π ~ π
        let lon = (j * 2 * Math.PI) / lonBands - Math.PI,
          sinLon = Math.sin(lon),
          cosLon = Math.cos(lon),
          x = center.x + radius * cosLat * cosLon,
          z = center.z + radius * cosLat * sinLon,
          y = center.y + radius * sinLat;

        vertices.push(x, y, z);
        colors.push(...color);
        texCoords.push(j / lonBands, i / latBands);
      }
    }

    const indices = [],
      normals = new Array(vertices.length);

    for (let i = 0; i < latBands; i++) {
      for (let j = 0; j < lonBands; j++) {
        let first = i * (lonBands + 1) + j,
          second = first + (lonBands + 1),
          x1 = vertices[first * 3],
          y1 = vertices[first * 3 + 1],
          z1 = vertices[first * 3 + 2],
          x2 = vertices[(first + 1) * 3],
          y2 = vertices[(first + 1) * 3 + 1],
          z2 = vertices[(first + 1) * 3 + 2],
          x3 = vertices[second * 3],
          y3 = vertices[second * 3 + 1],
          z3 = vertices[second * 3 + 2],
          nx = (y2 - y1) * (z3 - z1) - (y3 - y1) * (z2 - z1),
          ny = (z2 - z1) * (x3 - x1) - (z3 - z1) * (x2 - x1),
          nz = (x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1);

        /* eslint-disable */

        //  second latBand: v2 ---- v2 + 1
        //                  |          |
        //  first latBand:  v1 ---- v1 + 1
        indices.push(
          first, first + 1, second,
          first + 1, second, second + 1
        );

        normals[first * 3] =
          normals[(first + 1) * 3] =
            normals[second * 3] =
              normals[(second + 1) * 3] = nx;

        normals[first * 3 + 1] =
          normals[(first + 1) * 3 + 1] =
            normals[second * 3 + 1] =
              normals[(second + 1) * 3 + 1] = ny;

        normals[first * 3 + 2] =
          normals[(first + 1) * 3 + 2] =
            normals[second * 3 + 2] =
              normals[(second + 1) * 3 + 2] = nz;

        /* eslint-enable */
      }
    }

    return {
      vertices,
      texCoords,
      indices,
      normals,
      colors
    };
  }

  render(gl) {
    if (this.texture) {
      this.draw(gl, "texture", {
        mode: gl.TRIANGLES,
        buffer: true
      });
    } else if (this.line) {
      this.draw(gl, "line", {
        mode: gl.LINE_LOOP,
        buffer: true
      });
    } else {
      this.draw(gl, "color", {
        mode: gl.TRIANGLES,
        buffer: true
      });
    }
  }
}

export { Cube, Sphere };
