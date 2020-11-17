import Body, { BodyPropsKey, BodyPropsType } from "./body";

// Create a cube
//    v2----- v6
//   /|      /|
//  v3------v7|
//  | |     | |
//  | |v0---|-|v4
//  |/      |/
//  v1------v5
interface CubeProps {
  center?: ThereDigitTuple;
  width?: number;
  height?: number;
  length?: number;
  color?: ThereDigitTuple;
  [propName: string]: unknown;
}

class Cube extends Body {
  constructor(props = <CubeProps>{}) {
    const {
      center = [0, 0.5, 0],
      width = 1,
      height = 1,
      length = 1,
      color = [1, 1, 1],
    } = props;

    super({
      ...props,
      vertices: Cube.vertices(center, width, height, length),
      barycentres: Cube.barycentres,
      indices: Cube.indices,
      normals: Cube.normals,
      texCoords: Cube.texCoords,
      colors: new Array(24).fill([...color]),
      center,
      width,
      height,
      length,
    });
  }

  static vertices(
    center: ThereDigitTuple,
    width: number,
    height: number,
    length: number
  ): BodyPropsType {
    const diffx = width / 2,
      diffy = height / 2,
      diffz = length / 2;

    return [
      // front-v1
      [center[0] - diffx, center[1] - diffy, center[2] + diffz],
      // front-v3
      [center[0] - diffx, center[1] + diffy, center[2] + diffz],
      // front-v7
      [center[0] + diffx, center[1] + diffy, center[2] + diffz],
      // front-v5
      [center[0] + diffx, center[1] - diffy, center[2] + diffz],

      // back-v4
      [center[0] + diffx, center[1] - diffy, center[2] - diffz],
      // back-v6
      [center[0] + diffx, center[1] + diffy, center[2] - diffz],
      // back-v2
      [center[0] - diffx, center[1] + diffy, center[2] - diffz],
      // back-v0
      [center[0] - diffx, center[1] - diffy, center[2] - diffz],

      // top-v3
      [center[0] - diffx, center[1] + diffy, center[2] + diffz],
      // top-v2
      [center[0] - diffx, center[1] + diffy, center[2] - diffz],
      // top-v6
      [center[0] + diffx, center[1] + diffy, center[2] - diffz],
      // top-v7
      [center[0] + diffx, center[1] + diffy, center[2] + diffz],

      // bottom-v0
      [center[0] - diffx, center[1] - diffy, center[2] - diffz],
      // bottom-v1
      [center[0] - diffx, center[1] - diffy, center[2] + diffz],
      // bottom-v5
      [center[0] + diffx, center[1] - diffy, center[2] + diffz],
      // bottom-v4
      [center[0] + diffx, center[1] - diffy, center[2] - diffz],

      // left-v0
      [center[0] - diffx, center[1] - diffy, center[2] - diffz],
      // left-v2
      [center[0] - diffx, center[1] + diffy, center[2] - diffz],
      // left-v3
      [center[0] - diffx, center[1] + diffy, center[2] + diffz],
      // left-v1
      [center[0] - diffx, center[1] - diffy, center[2] + diffz],

      // right-v5
      [center[0] + diffx, center[1] - diffy, center[2] + diffz],
      // right-v7
      [center[0] + diffx, center[1] + diffy, center[2] + diffz],
      // right-v6
      [center[0] + diffx, center[1] + diffy, center[2] - diffz],
      // right-v4
      [center[0] + diffx, center[1] - diffy, center[2] - diffz],
    ];
  }

  static get barycentres(): BodyPropsType {
    return [
      [1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
      [1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
      [1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
      [1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
      [1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
      [1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
    ];
  }

  static get normals(): BodyPropsType {
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
      [1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0],
    ];
  }

  static get indices(): BodyPropsType {
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
      [20, 21, 22, 20, 22, 23],
    ];
  }

  static get texCoords(): BodyPropsType {
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
      [0, 0, 0, 1, 1, 1, 1, 0],
    ];
  }

  render(gl: WebGLContext): void {
    if (this.texture) {
      this.draw(gl, "texture", gl.TRIANGLES);
    } else if (this.line) {
      this.draw(gl, "line", gl.LINE_LOOP);
    } else {
      this.draw(gl, "color", gl.TRIANGLES);
    }
  }
}

interface SphereProps {
  center?: ThereDigitTuple;
  radius?: number;
  latBands?: number;
  lonBands?: number;
  color?: ThereDigitTuple;
  [propName: string]: unknown;
}

class Sphere extends Body {
  constructor(props = <SphereProps>{}) {
    const {
      center = [0, 0.5, 0],
      radius = 0.5,
      latBands = 20,
      lonBands = 20,
      color = [1, 1, 1],
    } = props;

    super({
      ...props,
      ...Sphere.init(center, radius, latBands, lonBands, color),
      center,
      radius,
      latBands,
      lonBands,
    });
  }

  static init(
    center: ThereDigitTuple,
    radius: number,
    latBands: number,
    lonBands: number,
    color: ThereDigitTuple
  ): Record<BodyPropsKey | "barycentres", BodyPropsType> {
    const buffer = Sphere.initBufferCoords(
      center,
      radius,
      latBands,
      lonBands,
      color
    );
    const unbuffer = Sphere.unindexBuffer(buffer);
    const barycentres = Sphere.barycentres(unbuffer.vertices.length / 3);

    return {
      ...unbuffer,
      barycentres,
    };
  }

  static barycentres(count: number, removeEdge = true): BodyPropsType {
    const barycentres = [];

    // for each triangle in the geometry, add the barycentre coordinates
    for (let i = 0; i < count; i++) {
      const isEven = i % 2 === 0;
      const Q = removeEdge ? 1 : 0;
      if (isEven) {
        barycentres.push([0, 0, 1, 0, 1, Q, 1, 0, 0]);
      } else {
        barycentres.push([Q, 1, 0, 0, 0, 1, 1, 0, 0]);
      }
    }

    return barycentres;
  }

  static initBufferCoords(
    center: ThereDigitTuple,
    radius: number,
    latBands: number,
    lonBands: number,
    color: ThereDigitTuple
  ): Record<BodyPropsKey | "indices", BodyPropsType> {
    const vertices = [],
      texCoords = [],
      colors = [];

    for (let i = 0; i <= latBands; i++) {
      // -π/2 ~ π/2
      const lat = (i * Math.PI) / latBands - Math.PI / 2,
        sinLat = Math.sin(lat),
        cosLat = Math.cos(lat);
      for (let j = 0; j <= lonBands; j++) {
        // -π ~ π
        const lon = (j * 2 * Math.PI) / lonBands - Math.PI,
          sinLon = Math.sin(lon),
          cosLon = Math.cos(lon),
          x = center[0] + radius * cosLat * cosLon,
          z = center[2] + radius * cosLat * sinLon,
          y = center[1] + radius * sinLat;

        vertices.push([x, y, z]);
        colors.push([...color]);
        texCoords.push([j / lonBands, i / latBands]);
      }
    }

    const indices = [],
      normals = new Array(vertices.length);

    for (let i = 0; i < latBands; i++) {
      for (let j = 0; j < lonBands; j++) {
        const first = i * (lonBands + 1) + j,
          second = first + (lonBands + 1),
          [x1, y1, z1] = vertices[first],
          [x2, y2, z2] = vertices[first + 1],
          [x3, y3, z3] = vertices[second],
          nx = (y2 - y1) * (z3 - z1) - (y3 - y1) * (z2 - z1),
          ny = (z2 - z1) * (x3 - x1) - (z3 - z1) * (x2 - x1),
          nz = (x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1);

        //  second latBand: v2 ---- v2 + 1
        //                  |          |
        //  first latBand:  v1 ---- v1 + 1
        indices.push(
          [first, first + 1, second],
          [first + 1, second, second + 1]
        );

        normals[first] = normals[first + 1] = normals[second] = normals[
          second + 1
        ] = [nx, ny, nz];
      }
    }

    return {
      vertices,
      texCoords,
      indices,
      normals,
      colors,
    };
  }

  // 根据重心坐标同时绘制面和线框时，不能采用index buffer
  // 重新根据index，映射回赘余顶点数据的array
  // 即gl.ELEMENT_ARRAY_BUFFER => gl.ARRAY_BUFFER
  static unindexBuffer(
    buffer: Record<BodyPropsKey | "indices", BodyPropsType>
  ): Record<BodyPropsKey, BodyPropsType> {
    const { indices, ...attributes } = buffer;

    if (!(indices && indices.length)) {
      return buffer;
    } else {
      const newAttribData: Record<BodyPropsKey, BodyPropsType> = {
        vertices: [],
        texCoords: [],
        colors: [],
        normals: [],
      };

      for (let i = 0; i < indices.length; i++) {
        // vertices, texCoords, normals, colors 属性
        Object.keys(newAttribData).forEach((name) => {
          const newAttrib = newAttribData[name];
          const oldAttrib = attributes[name];

          // 每个indices[i]是一个三角形
          indices[i].forEach((index) => {
            const pointArr: Array<number> = [];
            for (let d = 0; d < oldAttrib[index].length; d++) {
              const v: number = oldAttrib[index][d];
              pointArr.push(v);
            }

            newAttrib.push(pointArr);
          });
        });
      }

      return newAttribData;
    }
  }

  render(gl: WebGLContext): void {
    if (this.texture) {
      this.draw(gl, "texture", gl.TRIANGLES);
    } else if (this.line) {
      this.draw(gl, "line", gl.LINE_LOOP);
    } else {
      this.draw(gl, "color", gl.TRIANGLES);
    }
  }
}

export { Cube, Sphere };
