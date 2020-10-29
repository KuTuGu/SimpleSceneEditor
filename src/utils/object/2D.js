import Body from "./body";

// Create a triangle
//     v0
//    /  \
//   /    \
//  v1----v2
class Triangle extends Body {
  constructor(props = {}) {
    const {
      vertices = [0, 0, 0, 0, 0, -1, 1, 0, 0],
      color = [1, 1, 1],
      texCoords = [0, 0, 0, 1, 1, 0]
    } = props;

    super({
      ...props,
      vertices,
      texCoords,
      normals: Triangle.normals(...vertices),
      colors: new Array(3).fill([...color])
    });
  }

  static normals(p, a, b) {
    return [
      (a[1] - p[1]) * (b[2] - p[2]) - (a[2] - p[2]) * (b[1] - p[1]),
      (a[2] - p[2]) * (b[0] - p[0]) - (a[0] - p[0]) * (b[2] - p[2]),
      (a[0] - p[0]) * (b[1] - p[1]) - (a[1] - p[1]) * (b[0] - p[0])
    ];
  }

  render(gl) {
    if (this.texture) {
      this.draw(gl, "texture", {
        mode: gl.TRIANGLES,
        buffer: false
      });
    } else if (this.line) {
      this.draw(gl, "line", {
        mode: gl.LINE_LOOP,
        buffer: false
      });
    } else {
      this.draw(gl, "color", {
        mode: gl.TRIANGLES,
        buffer: false
      });
    }
  }
}

// Create a plane
//    v0------v2
//   /       /
//  v1------v3
class Plane extends Body {
  constructor(props = {}) {
    const {
      center = { x: 0, y: 0, z: 0 },
      width = 1,
      height = 1,
      color = [1, 1, 1]
    } = props;

    super({
      ...props,
      vertices: Plane.vertices(center, width, height),
      normals: Plane.normals,
      texCoords: Plane.texCoords,
      colors: new Array(4).fill([...color]),
      center,
      width,
      height
    });
  }

  static vertices(center, width, height) {
    const diffx = width / 2,
      diffz = height / 2;

    return [
      // v0
      [center.x - diffx, center.y, center.z - diffz],
      // v1
      [center.x - diffx, center.y, center.z + diffz],
      // v3
      [center.x + diffx, center.y, center.z + diffz],
      // v2
      [center.x + diffx, center.y, center.z - diffz]
    ];
  }

  static get normals() {
    return [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0];
  }

  static get texCoords() {
    return [0, 1, 0, 0, 1, 0, 1, 1];
  }

  render(gl) {
    if (this.texture) {
      this.draw(gl, "texture", {
        mode: gl.TRIANGLE_FAN,
        buffer: false
      });
    } else if (this.line) {
      this.draw(gl, "line", {
        mode: gl.LINE_LOOP,
        buffer: false
      });
    } else {
      this.draw(gl, "color", {
        mode: gl.TRIANGLE_FAN,
        buffer: false
      });
    }
  }
}

class Circle extends Body {
  constructor(props = {}) {
    const {
      center = { x: 0, y: 0, z: 0 },
      radius = 0.5,
      bands = 50,
      color = [1, 1, 1]
    } = props;

    super({
      ...props,
      ...Circle.initCoords(center, radius, bands, color),
      center,
      radius,
      bands
    });
  }

  static initCoords(center, radius, bands, color) {
    const vertices = [center.x, center.y, center.z],
      texCoords = [0.5, 0.5],
      normals = [0, 1, 0],
      colors = [...color],
      angle = (Math.PI * 2) / bands;

    for (let i = 0; i <= bands; i++) {
      const cosx = Math.cos(angle * i),
        sinx = Math.sin(angle * i),
        x = radius * cosx,
        z = radius * sinx;

      vertices.push(center.x + x, center.y, center.z + z);
      texCoords.push(0.5 + 0.5 * cosx, 0.5 - 0.5 * sinx);
      normals.push(0, 1, 0);
      colors.push(...color);
    }

    return {
      vertices,
      texCoords,
      normals,
      colors
    };
  }

  render(gl) {
    if (this.texture) {
      this.draw(gl, "texture", {
        mode: gl.TRIANGLE_FAN,
        buffer: false
      });
    } else if (this.line) {
      this.draw(gl, "line", {
        mode: gl.LINE_STRIP,
        buffer: false
      });
    } else {
      this.draw(gl, "color", {
        mode: gl.TRIANGLE_FAN,
        buffer: false
      });
    }
  }
}

export { Triangle, Plane, Circle };
