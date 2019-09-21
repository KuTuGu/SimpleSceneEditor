import { initArrayBuffer } from "../webgl.utils";

// Create a plane
//    v0------v3
//   /       /
//  v1------v2
class Plane {
  constructor(props) {
    const { center, width, height } = props;
    this.center = Object.assign({ x: 0, y: -1, z: 0 }, center);
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
      center.z + diffz,
      // v3
      center.x + diffx,
      center.y,
      center.z - diffz
    ]);
    this.normals = new Uint8Array([0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0]);
    this.indices = new Uint8Array([0, 1, 2, 0, 2, 3]);
    this.colors = new Uint8Array([
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
    this.texCoords = new Uint8Array([0, 1, 0, 0, 1, 0, 1, 1]);
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
        gl.UNSIGNED_BYTE
      ) ||
      !initArrayBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, this.indices)
    ) {
      return;
    }
    gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_BYTE, 0);
  }
}

export { Plane };
