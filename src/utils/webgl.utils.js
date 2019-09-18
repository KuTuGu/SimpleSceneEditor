function createTexture(gl, u_Sampler, image) {
  const texture = gl.createTexture(),
    img = new Image();
  if (!texture) {
    console.log("Failed to create the texture object");
    return false;
  }
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
}

function initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE) {
  const v_shader = gl.createShader(gl.VERTEX_SHADER),
    f_shader = gl.createShader(gl.FRAGMENT_SHADER),
    program = gl.createProgram();

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

function initArrayBuffer(
  gl,
  bufferType,
  data,
  attribute,
  size,
  type,
  normalized = false,
  stride = 0,
  offset = 0
) {
  // Create a buffer object
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log("Failed to create the buffer object");
    return false;
  }
  // Write date into the buffer object
  gl.bindBuffer(bufferType, buffer);
  gl.bufferData(bufferType, data, gl.STATIC_DRAW);

  if (bufferType === gl.ARRAY_BUFFER) {
    // Assign the buffer object to the attribute variable
    if (typeof attribute === "string") {
      attribute = getPropLocation(gl, attribute);
      if (attribute < 0) {
        return false;
      }
    }
    gl.vertexAttribPointer(attribute, size, type, normalized, stride, offset);
    // Enable the assignment of the buffer object to the attribute variable
    gl.enableVertexAttribArray(attribute);
  }

  return true;
}

function getPropLocation(gl, prop, uniform = false) {
  const res = uniform
    ? gl.getUniformLocation(gl.program, prop)
    : gl.getAttribLocation(gl.program, prop);
  if (res < 0) {
    console.error(`Failed to get ${prop} variable!`);
  }
  return res;
}

export { getPropLocation, initArrayBuffer, initShaders, createTexture };
