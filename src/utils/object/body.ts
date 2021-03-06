import { initArrayBuffer, initIndexBuffer } from "../webgl.utils";

export type BodyPropsType = Array<Array<number>>;
export type BodyPropsKey = "vertices" | "colors" | "texCoords" | "normals";

export interface BodyProps extends Record<BodyPropsKey, BodyPropsType> {
  barycentres?: BodyPropsType;
  indices?: BodyPropsType;
  [propName: string]: unknown;
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
   * @param    { WebGLContext }   gl         WebGL绘制上下文
   * @param    { String }                   material   材质：1.line 2.texture 3.color
   *
   * @return   { Boolean }                  初始化结果
   */
  private initBuffer(gl: WebGLContext, material: string): boolean {
    /* eslint-disable */
    return (
      initArrayBuffer(gl, this.vertices, "a_Position", 3, gl.FLOAT) &&
      !(this.barycentres && !initArrayBuffer(gl, this.barycentres, "a_Barycentre", 3, gl.UNSIGNED_BYTE)) &&
      initArrayBuffer(gl, this.normals,  "a_Normal",   3, gl.FLOAT) &&
      (
        material === "texture" ?
          initArrayBuffer(gl, this.texCoords, "a_TexCoord", 2, gl.FLOAT) :
          initArrayBuffer(gl, this.colors,    "a_Color",    3, gl.UNSIGNED_BYTE)
      ) &&
      !(this.indices && !initIndexBuffer(gl, this.indices))
    );
    /* eslint-enable */
  }

  /**
   * 绘制
   * @method   draw
   * @this     绘制对象
   *
   * @param    { WebGLContext }   gl         WebGL绘制上下文
   * @param    { String }                   material   材质：1.line 2.color 3.texture
   * @param    { Number }                   mode       绘制模式
   */
  protected draw(gl: WebGLContext, material: string, mode: number): void {
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
   * @param    { WebGLContext }   gl         WebGL绘制上下文
   */
  public render(gl: WebGLContext): void {
    this.draw(gl, "color", gl.TRIANGLES);
  }
}
