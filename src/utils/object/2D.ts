import Body, { BodyPropsKey, BodyPropsType } from "./body";

// Create a triangle
//     v0
//    /  \
//   /    \
//  v1----v2
interface TriangleProps {
  vertices?: [ThereDigitTuple, ThereDigitTuple, ThereDigitTuple];
  color?: ThereDigitTuple;
  texCoords?: BodyPropsType;
  [propName: string]: unknown;
}

class Triangle extends Body {
  constructor(props = <TriangleProps>{}) {
    const {
      vertices = [
        [0, 0, 0],
        [0, 0, -1],
        [1, 0, 0],
      ],
      color = [1, 1, 1],
      texCoords = [
        [0, 0],
        [0, 1],
        [1, 0],
      ],
    } = props;

    super({
      ...props,
      vertices,
      barycentres: Triangle.barycentres,
      texCoords,
      normals: new Array(3).fill(Triangle.normals(...vertices)),
      colors: new Array(3).fill([...color]),
    });
  }

  static normals(
    p: ThereDigitTuple,
    a: ThereDigitTuple,
    b: ThereDigitTuple
  ): ThereDigitTuple {
    return [
      (a[1] - p[1]) * (b[2] - p[2]) - (a[2] - p[2]) * (b[1] - p[1]),
      (a[2] - p[2]) * (b[0] - p[0]) - (a[0] - p[0]) * (b[2] - p[2]),
      (a[0] - p[0]) * (b[1] - p[1]) - (a[1] - p[1]) * (b[0] - p[0]),
    ];
  }

  static get barycentres(): BodyPropsType {
    return [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ];
  }

  render(gl: WebGLContext): void {
    if (this.texture) {
      this.draw(gl, "texture", gl.TRIANGLES);
    } else if (this.line) {
      this.draw(gl, "line", gl.TRIANGLES);
    } else {
      this.draw(gl, "color", gl.TRIANGLES);
    }
  }
}

// Create a plane
//    v0------v2
//   /       /
//  v1------v3
interface PlaneProps {
  center?: ThereDigitTuple;
  width?: number;
  height?: number;
  color?: ThereDigitTuple;
  [propName: string]: unknown;
}

class Plane extends Body {
  constructor(props = <PlaneProps>{}) {
    const {
      center = [0, 0, 0],
      width = 1,
      height = 1,
      color = [1, 1, 1],
    } = props;

    super({
      ...props,
      vertices: Plane.vertices(center, width, height),
      barycentres: Plane.barycentres,
      normals: Plane.normals,
      texCoords: Plane.texCoords,
      colors: new Array(4).fill([...color]),
      center,
      width,
      height,
    });
  }

  static vertices(
    center: ThereDigitTuple,
    width: number,
    height: number
  ): BodyPropsType {
    const diffx = width / 2,
      diffz = height / 2;

    return [
      // v0
      [center[0] - diffx, center[1], center[2] - diffz],
      // v1
      [center[0] - diffx, center[1], center[2] + diffz],
      // v3
      [center[0] + diffx, center[1], center[2] + diffz],
      // v2
      [center[0] + diffx, center[1], center[2] - diffz],
    ];
  }

  static get barycentres(): BodyPropsType {
    return [
      [1, 1, 0],
      [0, 1, 0],
      [0, 0, 1],
      [0, 0, 0],
    ];
  }

  static get normals(): BodyPropsType {
    return [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
    ];
  }

  static get texCoords(): BodyPropsType {
    return [
      [0, 1],
      [0, 0],
      [1, 0],
      [1, 1],
    ];
  }

  render(gl: WebGLContext): void {
    if (this.texture) {
      this.draw(gl, "texture", gl.TRIANGLE_FAN);
    } else if (this.line) {
      this.draw(gl, "line", gl.LINE_LOOP);
    } else {
      this.draw(gl, "color", gl.TRIANGLE_FAN);
    }
  }
}

interface CircleProps {
  center?: ThereDigitTuple;
  radius?: number;
  bands?: number;
  color?: ThereDigitTuple;
  [propName: string]: unknown;
}

class Circle extends Body {
  constructor(props = <CircleProps>{}) {
    const {
      center = [0, 0, 0],
      radius = 0.5,
      bands = 20,
      color = [1, 1, 1],
    } = props;

    super({
      ...props,
      ...Circle.initCoords(center, radius, bands, color),
      center,
      radius,
      bands,
    });
  }

  static initCoords(
    center: ThereDigitTuple,
    radius: number,
    bands: number,
    color: ThereDigitTuple
  ): Record<BodyPropsKey | "barycentres", BodyPropsType> {
    const vertices = [[center[0], center[1], center[2]]],
      barycentres = [[1, 1, 1]],
      texCoords = [[0.5, 0.5]],
      normals = [[0, 1, 0]],
      colors = [[...color]],
      angle = (Math.PI * 2) / bands;

    for (let i = 0; i <= bands; i++) {
      const cosx = Math.cos(angle * i),
        sinx = Math.sin(angle * i),
        x = radius * cosx,
        z = radius * sinx;

      vertices.push([center[0] + x, center[1], center[2] + z]);
      barycentres.push([0, 0, 0]);
      texCoords.push([0.5 + 0.5 * cosx, 0.5 - 0.5 * sinx]);
      normals.push([0, 1, 0]);
      colors.push([...color]);
    }

    return {
      vertices,
      barycentres,
      texCoords,
      normals,
      colors,
    };
  }

  render(gl: WebGLContext): void {
    if (this.texture) {
      this.draw(gl, "texture", gl.TRIANGLE_FAN);
    } else if (this.line) {
      this.draw(gl, "line", gl.LINE_STRIP);
    } else {
      this.draw(gl, "color", gl.TRIANGLE_FAN);
    }
  }
}

export { Triangle, Plane, Circle };
