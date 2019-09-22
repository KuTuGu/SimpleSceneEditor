function initRotateHandler(container, vm) {
  let dragging = false,
    lastX = -1,
    lastY = -1; // Last position of the mouse

  container.addEventListener("mousedown", e => {
    if (e.buttons > 0) {
      ({ clientX: lastX, clientY: lastY } = e);
      dragging = true;
    }
  });

  container.addEventListener("mousemove", e => {
    if (dragging) {
      let { clientX: x, clientY: y } = e,
        factor = 100 / container.height, // The rotation ratio
        dx = factor * (x - lastX),
        dy = factor * (y - lastY),
        { rotateAngle } = vm.$store.state;

      // Limit x-axis rotation angle to -90 to 90 degrees
      vm.$store.commit("updateRotateAngle", [
        Math.max(Math.min(rotateAngle[0] + dy, 90.0), -90.0),
        rotateAngle[1] + dx
      ]);
      (lastX = x), (lastY = y);
    }
  });

  window.addEventListener("mouseup", () => {
    dragging = false;
  });
}

function initClickHandler(container, vm) {
  let { gl } = vm.$store.state,
    pixels = new Uint8Array(4); // To store the pixel

  vm.$store.commit("updateClickCanvas", -2);

  container.addEventListener("mousedown", e => {
    let { clientX: x, clientY: y } = e,
      rect = e.target.getBoundingClientRect();

    vm.$store.commit("updateClickCanvas", -1); // write face number into a prop
    vm.redraw();
    // read the pixels
    gl.readPixels(
      (x - rect.left) * window.devicePixelRatio,
      (rect.bottom - y) * window.devicePixelRatio,
      1,
      1,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      pixels
    );

    // do something else with data
    vm.$store.commit("updateClickCanvas", pixels[3]);
    vm.redraw();
  });
}

function initZoomHandler(container, vm) {
  container.addEventListener("mousewheel", e => {
    let {
      viewProject: {
        perspective: { fov, ...res },
        sight
      }
    } = vm.$store.state;
    vm.$store.commit("updateViewProject", {
      perspective: {
        fov: Math.max(Math.min(fov + e.wheelDelta / 50, 179), 1),
        ...res
      },
      sight
    });
  });
}

export { initRotateHandler, initClickHandler, initZoomHandler };
