function createTexture(
  gl: WebGLContext,
  u_Sampler: WebGLUniformLocation,
  image: string
): void {
  const texture = gl.createTexture(),
    img = new Image();

  if (texture) {
    img.src = image;
    img.onload = () => {
      // flip y-axis
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      // Open texture unit0
      gl.activeTexture(gl.TEXTURE0);
      // Bind texture object
      gl.bindTexture(gl.TEXTURE_2D, texture);
      // Configure texture parameters
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      // Configure texture image
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      // Pass texture unit0 to the shader
      gl.uniform1i(u_Sampler, 0);
    };
    return;
  }

  console.error("Failed to create the texture object.");
}

function initShaders(
  gl: WebGLContext,
  VSHADER_SOURCE: string,
  FSHADER_SOURCE: string
): WebGLProgram | void {
  const v_shader = gl.createShader(gl.VERTEX_SHADER),
    f_shader = gl.createShader(gl.FRAGMENT_SHADER),
    program = gl.createProgram();

  if (v_shader && f_shader && program) {
    gl.shaderSource(v_shader, VSHADER_SOURCE);
    gl.shaderSource(f_shader, FSHADER_SOURCE);
    gl.compileShader(v_shader);
    gl.compileShader(f_shader);

    if (!gl.getShaderParameter(v_shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(v_shader));
      return;
    }
    if (!gl.getShaderParameter(f_shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(f_shader));
      return;
    }

    gl.attachShader(program, v_shader);
    gl.attachShader(program, f_shader);

    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    return program;
  }

  console.error("Failed to init shaders.");
}

function initBuffer(
  gl: WebGLContext,
  bufferType: GLenum,
  data: ArrayBuffer
): boolean {
  // Create a buffer object
  const buffer = gl.createBuffer();
  if (!buffer) {
    console.error("Failed to create the buffer object");
    return false;
  }

  // Write date into the buffer object
  gl.bindBuffer(bufferType, buffer);
  gl.bufferData(bufferType, data, gl.STATIC_DRAW);

  return true;
}

function initArrayBuffer(
  gl: WebGLContext,
  data: ArrayBuffer,
  attribute: string,
  size: GLint,
  type: GLenum,
  normalized = false,
  stride = 0,
  offset = 0
): boolean {
  if (!initBuffer(gl, gl.ARRAY_BUFFER, data)) {
    return false;
  }

  // Assign the buffer object to the attribute variable
  const indice = getAttribLocation(gl, attribute);
  if (indice === -1) {
    return false;
  }

  gl.vertexAttribPointer(indice, size, type, normalized, stride, offset);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(indice);

  return true;
}

function initIndexBuffer(gl: WebGLContext, data: ArrayBuffer): boolean {
  if (!initBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, data)) {
    return false;
  }

  return true;
}

function getAttribLocation(gl: WebGLContext, prop: string): GLint {
  const res = gl.getAttribLocation(gl.program, prop);

  if (res === -1) {
    console.error(`Failed to get ${prop} variable!`);
  }
  return res;
}

function getUniformLocation(
  gl: WebGLContext,
  prop: string
): WebGLUniformLocation | null {
  const res = gl.getUniformLocation(gl.program, prop);

  if (res === null) {
    console.error(`Failed to get ${prop} variable!`);
  }
  return res;
}

export {
  getAttribLocation,
  getUniformLocation,
  initArrayBuffer,
  initIndexBuffer,
  initShaders,
  createTexture,
};
