function initRotateHandler(container, vm) {
  let dragging = false,
    lastX = -1,
    lastY = -1; // Last position of the mouse

  container.addEventListener("mousedown", e => {
    ({ clientX: lastX, clientY: lastY } = e);
    dragging = true;
  });

  container.addEventListener("mousemove", e => {
    let { clientX: x, clientY: y } = e;
    if (dragging) {
      let factor = 100 / container.height, // The rotation ratio
        dx = factor * (x - lastX),
        dy = factor * (y - lastY);
      // Limit x-axis rotation angle to -90 to 90 degrees
      vm.$set(
        vm.rotateAngle,
        0,
        Math.max(Math.min(vm.rotateAngle[0] + dy, 90.0), -90.0)
      );
      vm.$set(vm.rotateAngle, 1, vm.rotateAngle[1] + dx);
    }
    (lastX = x), (lastY = y);
  });

  window.onmouseup = () => {
    dragging = false;
  };
}

// function initClickHandler(
//   container,
//   gl,
//   u_PickedObj,
//   n,
//   u_ViewProjMatrix,
//   u_ModelMatrix,
//   u_NormalMatrix,
//   currentAngle
// ) {
//   gl.uniform1i(u_PickedObj, -1);

//   container.addEventListener("mousedown", e => {
//     let { clientX: x, clientY: y } = e,
//       rect = e.target.getBoundingClientRect(),
//       offset = {
//         x: x - rect.left,
//         y: rect.bottom - y
//       },
//       pixels = new Uint8Array(4); // To store the pixel
//     gl.uniform1i(u_PickedObj, 0); // write face number into a prop
//     draw(gl, n, u_ViewProjMatrix, u_ModelMatrix, u_NormalMatrix, currentAngle);
//     // read the pixels
//     gl.readPixels(offset.x, offset.y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
//     // reset the picked face
//     gl.uniform1i(u_PickedObj, pixels[3]);
//     draw(gl, n, u_ViewProjMatrix, u_ModelMatrix, u_NormalMatrix, currentAngle);
//   });
// }

export { initRotateHandler };
