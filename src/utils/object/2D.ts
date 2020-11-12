import Body, { CenterProps, BodyProps } from "./body";

// Create a triangle
//     v0
//    /  \
//   /    \
//  v1----v2
interface TriangleProps {
  vertices?: Array<Array<number>>;
  color?: Array<number>;
  texCoords?: Array<Array<number>>;
  [propName: string]: any;
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
    p: Array<number>,
    a: Array<number>,
    b: Array<number>
  ): Array<number> {
    return [
      (a[1] - p[1]) * (b[2] - p[2]) - (a[2] - p[2]) * (b[1] - p[1]),
      (a[2] - p[2]) * (b[0] - p[0]) - (a[0] - p[0]) * (b[2] - p[2]),
      (a[0] - p[0]) * (b[1] - p[1]) - (a[1] - p[1]) * (b[0] - p[0]),
    ];
  }

  static get barycentres(): Array<Array<number>> {
    return [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ];
  }

  render(gl: WebGL2RenderingContext): void {
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
  center?: CenterProps;
  width?: number;
  height?: number;
  color?: Array<number>;
  [propName: string]: any;
}

class Plane extends Body {
  constructor(props = <PlaneProps>{}) {
    const {
      center = { x: 0, y: 0, z: 0 },
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
    center: CenterProps,
    width: number,
    height: number
  ): Array<Array<number>> {
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
      [center.x + diffx, center.y, center.z - diffz],
    ];
  }

  static get barycentres(): Array<Array<number>> {
    return [
      [1, 1, 0],
      [0, 1, 0],
      [0, 0, 1],
      [0, 0, 0],
    ];
  }

  static get normals(): Array<Array<number>> {
    return [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
    ];
  }

  static get texCoords(): Array<Array<number>> {
    return [
      [0, 1],
      [0, 0],
      [1, 0],
      [1, 1],
    ];
  }

  render(gl: WebGL2RenderingContext): void {
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
  center?: CenterProps;
  radius?: number;
  bands?: number;
  color?: Array<number>;
  [propName: string]: any;
}

class Circle extends Body {
  constructor(props = <CircleProps>{}) {
    const {
      center = { x: 0, y: 0, z: 0 },
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
    center: CenterProps,
    radius: number,
    bands: number,
    color: Array<number>
  ): BodyProps {
    const vertices = [[center.x, center.y, center.z]],
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

      vertices.push([center.x + x, center.y, center.z + z]);
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

  render(gl: WebGL2RenderingContext): void {
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
