import { initArrayBuffer } from "./webgl.utils";

// Create a cube
//    v2----- v6
//   /|      /|
//  v3------v7|
//  | |     | |
//  | |v0---|-|v4
//  |/      |/
//  v1------v5
class Cube {
  constructor(props) {
    const { center, width, height, length } = props;
    this.center = Object.assign(center, { x: 0, y: 0.5, z: 0 });
    this.width = width || 1;
    this.height = height || 1;
    this.length = length || 1;

    this.init();
  }

  init() {
    const center = this.center,
      diffx = this.width / 2,
      diffy = this.height / 2,
      diffz = this.length / 2;
    this.vertices = new Float32Array([
      // front-v1
      center.x - diffx,
      center.y - diffy,
      center.z + diffz,
      // front-v3
      center.x - diffx,
      center.y + diffy,
      center.z + diffz,
      // front-v7
      center.x + diffx,
      center.y + diffy,
      center.z + diffz,
      // front-v5
      center.x + diffx,
      center.y - diffy,
      center.z + diffz,

      // back-v4
      center.x + diffx,
      center.y - diffy,
      center.z - diffz,
      // back-v6
      center.x + diffx,
      center.y + diffy,
      center.z - diffz,
      // back-v2
      center.x - diffx,
      center.y + diffy,
      center.z - diffz,
      // back-v0
      center.x - diffx,
      center.y - diffy,
      center.z - diffz,

      // top-v3
      center.x - diffx,
      center.y + diffy,
      center.z + diffz,
      // top-v2
      center.x - diffx,
      center.y + diffy,
      center.z - diffz,
      // top-v6
      center.x + diffx,
      center.y + diffy,
      center.z - diffz,
      // top-v7
      center.x + diffx,
      center.y + diffy,
      center.z + diffz,

      // bottom-v0
      center.x - diffx,
      center.y - diffy,
      center.z - diffz,
      // bottom-v1
      center.x - diffx,
      center.y - diffy,
      center.z + diffz,
      // bottom-v5
      center.x + diffx,
      center.y - diffy,
      center.z + diffz,
      // bottom-v4
      center.x + diffx,
      center.y - diffy,
      center.z - diffz,

      // left-v0
      center.x - diffx,
      center.y - diffy,
      center.z - diffz,
      // left-v2
      center.x - diffx,
      center.y + diffy,
      center.z - diffz,
      // left-v3
      center.x - diffx,
      center.y + diffy,
      center.z + diffz,
      // left-v1
      center.x - diffx,
      center.y - diffy,
      center.z + diffz,

      // right-v5
      center.x + diffx,
      center.y - diffy,
      center.z + diffz,
      // right-v7
      center.x + diffx,
      center.y + diffy,
      center.z + diffz,
      // right-v6
      center.x + diffx,
      center.y + diffy,
      center.z - diffz,
      // right-v4
      center.x + diffx,
      center.y - diffy,
      center.z - diffz
    ]);
    this.normals = new Uint8Array([
      // front
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      // back
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      // top
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      // bottom
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      // left
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      // right
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0
    ]);
    this.indices = new Uint8Array([
      // front
      0,
      1,
      2,
      0,
      2,
      3,
      // back
      4,
      5,
      6,
      4,
      6,
      7,
      // top
      8,
      9,
      10,
      8,
      10,
      11,
      // bottom
      12,
      13,
      14,
      12,
      14,
      15,
      // left
      16,
      17,
      18,
      16,
      18,
      19,
      // right
      20,
      21,
      22,
      20,
      22,
      23
    ]);
    this.colors = new Uint8Array([
      // front
      192,
      192,
      192,
      192,
      192,
      192,
      192,
      192,
      192,
      192,
      192,
      192,

      // back
      192,
      192,
      192,
      192,
      192,
      192,
      192,
      192,
      192,
      192,
      192,
      192,

      // top
      192,
      192,
      192,
      192,
      192,
      192,
      192,
      192,
      192,
      192,
      192,
      192,

      // bottom
      192,
      192,
      192,
      192,
      192,
      192,
      192,
      192,
      192,
      192,
      192,
      192,

      // left
      192,
      192,
      192,
      192,
      192,
      192,
      192,
      192,
      192,
      192,
      192,
      192,

      // right
      192,
      192,
      192,
      192,
      192,
      192,
      192,
      192,
      192,
      192,
      192,
      192
    ]);
  }

  draw(gl, wireframe = false) {
    if (
      !initArrayBuffer(
        gl,
        gl.ARRAY_BUFFER,
        this.vertices,
        "a_Position",
        3,
        gl.FLOAT
      ) ||
      !initArrayBuffer(
        gl,
        gl.ARRAY_BUFFER,
        this.normals,
        "a_Normal",
        3,
        gl.UNSIGNED_BYTE
      ) ||
      !initArrayBuffer(
        gl,
        gl.ARRAY_BUFFER,
        this.colors,
        "a_Color",
        3,
        gl.UNSIGNED_BYTE
      ) ||
      !initArrayBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, this.indices)
    ) {
      return;
    }
    if (wireframe) {
      gl.drawElements(gl.LINE_LOOP, this.indices.length, gl.UNSIGNED_BYTE, 0);
    } else {
      gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_BYTE, 0);
    }
  }
}

class Sphere {
  constructor(props) {
    const { center, radius, latBands, lonBands } = props;
    this.center = Object.assign(center, { x: 0, y: 0.5, z: 0 });
    this.radius = radius || 1;
    this.latBands = latBands || 50;
    this.lonBands = lonBands || 50;

    this.init();
  }

  init() {
    this.vertices = [];
    this.texCoords = [];

    for (let i = 0; i <= this.latBands; i++) {
      // -π/2 ~ π/2
      let lat = (i * Math.PI) / this.latBands - Math.PI / 2,
        sinLat = Math.sin(lat),
        cosLat = Math.cos(lat);
      for (let j = 0; j <= this.lonBands; j++) {
        // -π ~ π
        let lon = (j * 2 * Math.PI) / this.lonBands - Math.PI,
          sinLon = Math.sin(lon),
          cosLon = Math.cos(lon),
          x = this.center.x + this.radius * cosLat * cosLon,
          z = this.center.z + this.radius * cosLat * sinLon,
          y = this.center.y + this.radius * sinLat;

        this.vertices.push(x, y, z);
        this.texCoords.push(j / this.lonBands, i / this.latBands);
      }
    }

    this.indices = [];
    this.normals = new Array(this.vertices.length);
    for (let i = 0; i < this.latBands; i++) {
      for (let j = 0; j < this.lonBands; j++) {
        let first = i * (this.lonBands + 1) + j,
          second = first + (this.lonBands + 1),
          x1 = this.vertices[first * 3],
          y1 = this.vertices[first * 3 + 1],
          z1 = this.vertices[first * 3 + 2],
          x2 = this.vertices[(first + 1) * 3],
          y2 = this.vertices[(first + 1) * 3 + 1],
          z2 = this.vertices[(first + 1) * 3 + 2],
          x3 = this.vertices[second * 3],
          y3 = this.vertices[second * 3 + 1],
          z3 = this.vertices[second * 3 + 2],
          nx = (y2 - y1) * (z3 - z1) - (y3 - y1) * (z2 - z1),
          ny = (z2 - z1) * (x3 - x1) - (z3 - z1) * (x2 - x1),
          nz = (x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1);

        //  second latBand: v2 ---- v2 + 1
        //                  |          |
        //  first latBand:  v1 ---- v1 + 1
        this.indices.push(
          first,
          first + 1,
          second,
          first + 1,
          second,
          second + 1
        );
        this.normals[first * 3] = this.normals[(first + 1) * 3] = this.normals[
          second * 3
        ] = this.normals[(second + 1) * 3] = nx;
        this.normals[first * 3 + 1] = this.normals[
          (first + 1) * 3 + 1
        ] = this.normals[second * 3 + 1] = this.normals[
          (second + 1) * 3 + 1
        ] = ny;
        this.normals[first * 3 + 2] = this.normals[
          (first + 1) * 3 + 2
        ] = this.normals[second * 3 + 2] = this.normals[
          (second + 1) * 3 + 2
        ] = nz;
      }
    }

    this.colors = new Array(this.vertices.length);
    this.colors.fill(0.0);

    this.vertices = new Float32Array(this.vertices);
    this.texCoords = new Float32Array(this.texCoords);
    this.indices = new Uint16Array(this.indices);
    this.normals = new Float32Array(this.normals);
    this.colors = new Uint8Array(this.colors);
  }

  draw(gl, wireframe = false) {
    if (
      !initArrayBuffer(
        gl,
        gl.ARRAY_BUFFER,
        this.vertices,
        "a_Position",
        3,
        gl.FLOAT
      ) ||
      !initArrayBuffer(
        gl,
        gl.ARRAY_BUFFER,
        this.normals,
        "a_Normal",
        3,
        gl.FLOAT
      ) ||
      !initArrayBuffer(
        gl,
        gl.ARRAY_BUFFER,
        this.colors,
        "a_Color",
        3,
        gl.UNSIGNED_BYTE
      ) ||
      !initArrayBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, this.indices)
    ) {
      return;
    }
    if (wireframe) {
      gl.drawElements(gl.LINE_LOOP, this.indices.length, gl.UNSIGNED_SHORT, 0);
    } else {
      gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
    }
  }
}

export { Cube, Sphere };
