import { Ref } from "vue";
import { Store } from "vuex";
import StateProps from "../interface";

function initTransformHandler(
  container: HTMLCanvasElement,
  store: Store<StateProps>
): void {
  let moving = false,
    rotating = false,
    shift = false,
    lastX = -1,
    lastY = -1;

  window.addEventListener("keydown", (e) => {
    if (!shift && e && e.key === "Shift") {
      shift = true;
    }
  });
  window.addEventListener("keyup", () => {
    shift = false;
    moving = false;
  });

  container.addEventListener("mousedown", (e) => {
    if (e.button === 0) {
      ({ clientX: lastX, clientY: lastY } = e);
      // 鼠标左键点击 + shift键盘，移动操作
      if (shift) {
        moving = true;
      } else {
        // 鼠标左键点击，旋转操作
        rotating = true;
      }
    }
  });

  container.addEventListener("mousemove", (e) => {
    const { clientX: x, clientY: y } = e,
      factor = 100 / container.height,
      dx = factor * (x - lastX),
      dy = factor * (y - lastY);

    if (rotating) {
      // 角度改为弧度制
      store.commit("updateRotation", [
        (dy * Math.PI) / 180,
        (dx * Math.PI) / 180,
      ]);
    } else if (moving) {
      store.commit("updateTranslation", [dx / 50, -dy / 50]);
    }

    (lastX = x), (lastY = y);
  });

  window.addEventListener("mouseup", () => {
    moving = false;
    rotating = false;
  });
}

function initScaleHandler(
  container: HTMLCanvasElement,
  store: Store<StateProps>
): void {
  container.addEventListener("mousewheel", (e) => {
    const {
      camera: {
        perspective: { fov, ...res },
        sight,
      },
    } = store.state;

    // fov由角更改为弧度制
    store.commit("updateCamera", {
      perspective: {
        fov: Math.max(
          Math.min(fov + ((-e.deltaY / 50) * Math.PI) / 180, Math.PI - 0.1),
          0.1
        ),
        ...res,
      },
      sight,
    });
  });
}

function initResizeHandler(
  canvasSize: Ref<{ x: number; y: number; ratio: number }>
): void {
  window.addEventListener("resize", () => {
    const { innerWidth: width, innerHeight: height } = window;
    const { x, y, ratio } = canvasSize.value;

    // 保证画布等比例缩放，避免物体尺寸变形
    // 变化比率：宽 > 高，画布缩放比为宽度比，保证全屏
    if (width / height > ratio) {
      canvasSize.value = {
        x: width,
        y: (width * y) / x,
        ratio,
      };
    } else {
      canvasSize.value = {
        x: (height * x) / y,
        y: height,
        ratio,
      };
    }
  });
}

/*
 * 判断选择物体有两种方式：
 * 1.像素点颜色判断
 * 2.射线交互判断
 */
function initSelectHandler(
  container: HTMLCanvasElement,
  store: Store<StateProps>,
  draw: () => void
): void {
  container.addEventListener("mousedown", (e) => {
    const { gl } = store.state,
      pixels = new Uint8Array(4),
      { clientX: x, clientY: y } = e,
      rect = container.getBoundingClientRect();

    // 把之前传入的物体ID写入物体的透明度中，重新绘制
    store.commit("updatePickedObjID", -1);
    draw();
    // 读取像素点，保存至 pixels 数组中
    gl.readPixels(
      (x - rect.left) * window.devicePixelRatio,
      (rect.bottom - y) * window.devicePixelRatio,
      1,
      1,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      pixels
    );

    // 获取透明度（物体ID），高亮选择物体
    store.commit("updatePickedObjID", pixels[3]);
    // 刷新重绘视图
    draw();
  });
}

export {
  initTransformHandler,
  initSelectHandler,
  initResizeHandler,
  initScaleHandler,
};
