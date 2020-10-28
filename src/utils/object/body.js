import { initArrayBuffer } from "../webgl.utils";

export default class Body {
  constructor(props) {
    const {
      vertices,
      indices = [],
      colors,
      texCoords,
      normals,
      ...properties
    } = props;

    // 通用属性参数
    this.vertices = new Float32Array(vertices.flat());
    this.indices = indices && new Uint16Array(indices.flat());
    this.colors = new Uint8Array(colors.flat());
    this.texCoords = new Float32Array(texCoords.flat());
    this.normals = new Float32Array(normals.flat());
    // 是否只绘制线框
    this.line = false;
    // 材质资源
    this.texture = "";
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
   * @param    { Boolean }                  buffer     是否使用顶点缓冲区
   *
   * @return   { Boolean }                  初始化结果
   */
  initBuffer(gl, material, buffer = false) {
    /* eslint-disable */
    return (
      initArrayBuffer(gl, gl.ARRAY_BUFFER, this.vertices, "a_Position", 3, gl.FLOAT) &&
      initArrayBuffer(gl, gl.ARRAY_BUFFER, this.normals,  "a_Normal",   3, gl.FLOAT) &&
      (
        material === "texture" ?
          initArrayBuffer(gl, gl.ARRAY_BUFFER, this.texCoords, "a_TexCoord", 2, gl.FLOAT) :
          initArrayBuffer(gl, gl.ARRAY_BUFFER, this.colors, "a_Color",   3, gl.UNSIGNED_BYTE)
      ) &&
      !(buffer && !initArrayBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, this.indices))
    );
    /* eslint-enable */
  }

  /**
   * 绘制对象
   * @method   draw
   * @this     绘制对象
   *
   * @param    { WebGL2RenderingContext }   gl         WebGL绘制上下文
   * @param    { String }                   material   材质：1.line 2.color 3.texture
   * @param    { Object }                   opts       绘制相关配置
   */
  draw(gl, material, opts) {
    const { mode, buffer } = opts;

    if (!this.initBuffer(gl, material, buffer)) {
      return;
    }

    buffer
      ? gl.drawElements(mode, this.indices.length, gl.UNSIGNED_SHORT, 0)
      : gl.drawArrays(mode, 0, this.vertices.length / 3);
  }
}
