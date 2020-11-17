<template>
  <canvas
    ref="renderCanvas"
    :width="drawBuffer.x"
    :height="drawBuffer.y"
    :style="`width: ${canvasSize.x}px;height: ${canvasSize.y}px`"
  >
    Please open it in the browser that supports Canvas.
  </canvas>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watchEffect } from "vue";
import { useStore } from "vuex";
import {
  initShaders,
  getUniformLocation,
  // createTexture
} from "../utils/webgl.utils";
import COLOR_VSHADER_SOURCE from "../utils/shaders/color_vShader.glsl";
import COLOR_FSHADER_SOURCE from "../utils/shaders/color_fShader.glsl";
import {
  initTransformHandler,
  initScaleHandler,
  initSelectHandler,
  initResizeHandler,
} from "../utils/events";
// import BoxImage from "../assets/box.png";
import Mutation from "../mutation";
import StateProps from "../interface";

export default defineComponent({
  name: "renderCanvas",
  setup() {
    const store = useStore<StateProps>();
    const directory = computed(() => store.state.directory);
    const canvasSize = ref({
      x: window.innerWidth,
      y: window.innerHeight,
      ratio: window.innerWidth / window.innerHeight,
    });
    const webgl = ref(<WebGLContext>null);
    const renderCanvas = ref(<HTMLCanvasElement>null);
    const drawBuffer = computed(() => {
      const { x, y } = canvasSize.value;

      return {
        x: x * window.devicePixelRatio,
        y: y * window.devicePixelRatio,
      };
    });

    // 初始化视窗、光照等环境
    watchEffect(() => {
      const { x, y } = drawBuffer.value;

      if (webgl.value) {
        webgl.value.viewport(0, 0, x, y);

        for (let [name, effect] of Object.entries(Mutation)) {
          // effect对应多个函数，所以ts会报错，忽略即可
          effect(webgl.value, store.state[name]);
        }
      }
    });

    onMounted(() => {
      init();
      beforeDraw();

      (function tick() {
        draw();
        requestAnimationFrame(tick);
      })();
    });

    return {
      renderCanvas,
      drawBuffer,
      canvasSize,
    };

    function init() {
      webgl.value = <WebGLContext>renderCanvas.value.getContext("webgl2");
      const gl = webgl.value;

      store.commit("updateGL", gl);

      if (!gl) {
        console.error("Failed to get the rendering context of WebGL !");
        return;
      }

      // init shaders.
      initShaders(
        gl,
        // TEXTURE_VSHADER_SOURCE,
        // TEXTURE_FSHADER_SOURCE
        COLOR_VSHADER_SOURCE,
        COLOR_FSHADER_SOURCE
      );

      // init texture
      // const u_Sampler = getUniformLocation(gl, "u_Sampler");
      // createTexture(gl, u_Sampler, BoxImage);
    }

    function beforeDraw() {
      const canvas = renderCanvas.value;
      const gl = webgl.value;

      // 设置全局平移、旋转监听
      initTransformHandler(canvas, store);
      // 设置全局缩放监听
      initScaleHandler(canvas, store);
      // 设置全局物体选择监听
      initSelectHandler(canvas, store, draw);
      // 设置全局画布尺寸监听
      initResizeHandler(canvasSize);

      // 开启深度测试
      gl.enable(gl.DEPTH_TEST);
      // 开启混合功能
      // gl.enable(gl.BLEND);
      // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }

    function draw() {
      const gl = webgl.value;

      gl.clearColor(0, 0, 0, 0.4);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // 绘制物体
      const u_ObjID = getUniformLocation(gl, "u_ObjID");
      Object.values(directory.value).forEach((body) => {
        // 插入物体ID，以供点击选择
        gl.uniform1i(u_ObjID, body.id);
        body.render(gl);
      });
    }
  },
});
</script>
