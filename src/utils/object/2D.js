import { initArrayBuffer } from "../webgl.utils";
import { flatArray } from "../utils";

// Create a triangle
//     v0
//    /  \
//   /    \
//  v1----v2
class Triangle {
  constructor(props) {
    const { points, colors, texCoords } = props;

    this.vertices = new Float32Array(flatArray(points));
    this.texCoords = new Float32Array(flatArray(texCoords));
    this.colors = new Uint8Array(flatArray(colors));
    this.normals = new Float32Array(this.threeCross(...points));
  }

  threeCross(p, a, b) {
    return [
      (a[1] - p[1]) * (b[2] - p[2]) - (a[2] - p[2]) * (b[1] - p[1]),
      (a[2] - p[2]) * (b[0] - p[0]) - (a[0] - p[0]) * (b[2] - p[2]),
      (a[0] - p[0]) * (b[1] - p[1]) - (a[1] - p[1]) * (b[0] - p[0])
    ];
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
      )
    ) {
      return;
    }
    if (wireframe) {
      gl.drawArrays(gl.LINE_LOOP, 0, this.vertices.length / 3);
    } else {
      gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);
    }
  }

  drawTexture(gl) {
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
        this.texCoords,
        "a_TexCoord",
        2,
        gl.FLOAT
      )
    ) {
      return;
    }
    gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);
  }
}

// Create a plane
//    v0------v2
//   /       /
//  v1------v3
class Plane {
  constructor(props) {
    const { center, width, height, colors, texCoords } = props;
    this.center = Object.assign({ x: 0, y: 0, z: 0 }, center);
    this.texCoords = new Float32Array(flatArray(texCoords));
    this.colors = new Uint8Array(flatArray(colors));
    this.width = width || 1;
    this.height = height || 1;

    this.init();
  }

  init() {
    const center = this.center,
      diffx = this.width / 2,
      diffz = this.height / 2;
    this.vertices = new Float32Array([
      // v0
      center.x - diffx,
      center.y,
      center.z - diffz,
      // v1
      center.x - diffx,
      center.y,
      center.z + diffz,
      // v2
      center.x + diffx,
      center.y,
      center.z - diffz,
      // v3
      center.x + diffx,
      center.y,
      center.z + diffz
    ]);
    this.frameVertices = new Float32Array([
      // v0
      center.x - diffx,
      center.y,
      center.z - diffz,
      // v1
      center.x - diffx,
      center.y,
      center.z + diffz,
      // v2
      center.x + diffx,
      center.y,
      center.z + diffz,
      // v3
      center.x + diffx,
      center.y,
      center.z - diffz
    ]);
    this.normals = new Uint8Array([0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0]);
  }

  draw(gl, wireframe = false) {
    if (
      !initArrayBuffer(
        gl,
        gl.ARRAY_BUFFER,
        wireframe ? this.frameVertices : this.vertices,
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
      )
    ) {
      return;
    }
    if (wireframe) {
      gl.drawArrays(gl.LINE_LOOP, 0, this.frameVertices.length / 3);
    } else {
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vertices.length / 3);
    }
  }

  drawTexture(gl) {
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
        this.texCoords,
        "a_TexCoord",
        2,
        gl.FLOAT
      )
    ) {
      return;
    }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vertices.length / 3);
  }
}

class Circle {
  constructor(props) {
    const { center, radius, bands, colors } = props;
    this.center = Object.assign({ x: 0, y: 0, z: 0 }, center);
    this.singleColor = colors;
    this.radius = radius || 0.5;
    this.bands = bands || 50;

    this.init();
  }

  init() {
    this.vertices = [this.center.x, this.center.y, this.center.z];
    this.texCoords = [0.5, 0.5];
    this.normals = [0, 1, 0];
    this.colors = [...this.singleColor];

    let angle = (Math.PI * 2) / this.bands;

    for (let i = 0; i <= this.bands; i++) {
      let cosx = Math.cos(angle * i),
        sinx = Math.sin(angle * i),
        x = this.radius * cosx,
        z = this.radius * sinx;

      this.vertices.push(this.center.x + x, this.center.y, this.center.z + z);
      this.texCoords.push(0.5 + 0.5 * cosx, 0.5 - 0.5 * sinx);
      this.normals.push(0, 1, 0);
      this.colors.push(...this.singleColor);
    }

    this.vertices = new Float32Array(this.vertices);
    this.texCoords = new Float32Array(this.texCoords);
    this.normals = new Uint8Array(this.normals);
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
        gl.UNSIGNED_BYTE
      ) ||
      !initArrayBuffer(
        gl,
        gl.ARRAY_BUFFER,
        this.colors,
        "a_Color",
        3,
        gl.UNSIGNED_BYTE
      )
    ) {
      return;
    }
    if (wireframe) {
      gl.drawArrays(gl.LINE_STRIP, 0, this.vertices.length / 3);
    } else {
      gl.drawArrays(gl.TRIANGLE_FAN, 0, this.vertices.length / 3);
    }
  }

  drawTexture(gl) {
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
        this.texCoords,
        "a_TexCoord",
        2,
        gl.FLOAT
      )
    ) {
      return;
    }
    gl.drawArrays(gl.TRIANGLE_FAN, 0, this.vertices.length / 3);
  }
}

export { Triangle, Plane, Circle };
