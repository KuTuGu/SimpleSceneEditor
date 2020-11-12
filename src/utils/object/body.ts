import { initArrayBuffer } from "../webgl.utils";

export interface CenterProps {
  x: number;
  y: number;
  z: number;
}

export interface BodyProps {
  vertices: Array<Array<number>>;
  barycentres?: Array<Array<number>>;
  indices?: Array<Array<number>>;
  colors: Array<Array<number>>;
  texCoords: Array<Array<number>>;
  normals: Array<Array<number>>;
  [propName: string]: any;
}

export default class Body {
  public vertices: Float32Array;
  public barycentres?: Uint8Array;
  public indices?: Uint16Array;
  public colors: Uint8Array;
  public texCoords: Float32Array;
  public normals: Float32Array;
  public line: boolean;
  public texture: boolean;

  constructor(props: BodyProps) {
    const {
      vertices,
      barycentres,
      indices,
      colors,
      texCoords,
      normals,
      ...properties
    } = props;

    // 通用属性参数
    this.vertices = new Float32Array(vertices.flat());
    this.barycentres = barycentres && new Uint8Array(barycentres.flat());
    this.indices = indices && new Uint16Array(indices.flat());
    this.colors = new Uint8Array(colors.flat());
    this.texCoords = new Float32Array(texCoords.flat());
    this.normals = new Float32Array(normals.flat());
    this.line = false;
    this.texture = false;
    // 其他属性参数
    Object.assign(this, properties);
  }

  /**
   * 初始化各种缓冲器
   * @method   initBuffer
   * @this     实例化对象
   *
   * @param    { WebGL2RenderingContext }   gl         WebGL绘制上下文
   * @param    { String }                   material   材质：1.line 2.texture 3.color
   *
   * @return   { Boolean }                  初始化结果
   */
  initBuffer(gl: WebGL2RenderingContext, material: string): boolean {
    /* eslint-disable */
    return (
      initArrayBuffer(gl, gl.ARRAY_BUFFER, this.vertices, "a_Position", 3, gl.FLOAT) &&
      !(this.barycentres && !initArrayBuffer(gl, gl.ARRAY_BUFFER, this.barycentres, "a_Barycentre", 3, gl.UNSIGNED_BYTE)) &&
      initArrayBuffer(gl, gl.ARRAY_BUFFER, this.normals,  "a_Normal",   3, gl.FLOAT) &&
      (
        material === "texture" ?
          initArrayBuffer(gl, gl.ARRAY_BUFFER, this.texCoords, "a_TexCoord", 2, gl.FLOAT) :
          initArrayBuffer(gl, gl.ARRAY_BUFFER, this.colors,    "a_Color",    3, gl.UNSIGNED_BYTE)
      ) &&
      !(this.indices && !initArrayBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, this.indices))
    );
    /* eslint-enable */
  }

  /**
   * 绘制
   * @method   draw
   * @this     绘制对象
   *
   * @param    { WebGL2RenderingContext }   gl         WebGL绘制上下文
   * @param    { String }                   material   材质：1.line 2.color 3.texture
   * @param    { Number }                   mode       绘制模式
   */
  draw(gl: WebGL2RenderingContext, material: string, mode: number): void {
    if (!this.initBuffer(gl, material)) {
      return;
    }

    this.indices
      ? gl.drawElements(mode, this.indices.length, gl.UNSIGNED_SHORT, 0)
      : gl.drawArrays(mode, 0, this.vertices.length / 3);
  }

  /**
   * 默认绘制接口，可覆写，控制进行不同绘制
   * @method   render
   * @this     绘制对象
   *
   * @param    { WebGL2RenderingContext }   gl         WebGL绘制上下文
   */
  render(gl: WebGL2RenderingContext): void {
    this.draw(gl, "color", gl.TRIANGLES);
  }
}
