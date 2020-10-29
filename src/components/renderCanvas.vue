<template>
  <canvas
    id="renderCanvas"
    ref="renderCanvas"
    :width="canvasSize.x"
    :height="canvasSize.y"
  >
    Please open it in the browser that supports Canvas.
  </canvas>
</template>

<script>
import {
  initShaders,
  getPropLocation,
  createTexture
} from "../utils/webgl.utils";
import {
  COLOR_VSHADER_SOURCE,
  COLOR_FSHADER_SOURCE
  // TEXTURE_VSHADER_SOURCE,
  // TEXTURE_FSHADER_SOURCE
} from "../utils/shaders";
import {
  initTransformHandler,
  initScaleHandler,
  initSelectHandler
} from "../utils/events";
import BoxImage from "../assets/box.png";
import Mutation from "../mutation";

export default {
  name: "renderCanvas",
  data() {
    return {
      canvasSize: {
        x: window.innerWidth * window.devicePixelRatio,
        y: window.innerHeight * window.devicePixelRatio
      }
    };
  },
  computed: {
    directory() {
      return this.$store.state.directory;
    },
    gl() {
      return this.$store.state.gl;
    }
  },
  methods: {
    insertObjID(id) {
      const { gl } = this,
        u_ObjID = getPropLocation(gl, "u_ObjID", true);

      gl.uniform1i(u_ObjID, id);
    },
    clearCanvas() {
      const { gl } = this;

      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      // gl.depthMask(false);
    },
    beforeDraw() {
      const { renderCanvas } = this.$refs,
        { gl } = this;

      gl.viewport(0, 0, this.canvasSize.x, this.canvasSize.y);

      // 设置全局平移、旋转监听
      initTransformHandler(renderCanvas, this);
      // 设置全局缩放监听
      initScaleHandler(renderCanvas, this);
      // 设置全局物体选择监听
      initSelectHandler(renderCanvas, this);

      // set draw config
      gl.enable(gl.DEPTH_TEST);
      // gl.enable(gl.BLEND);
      // gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    },
    draw() {
      Object.values(this.directory).forEach(body => {
        this.insertObjID(body.id);
        body.render(this.gl);
      });
    },
    afterDraw() {
      this.gl.depthMask(true);
    },
    redraw() {
      this.clearCanvas();
      this.draw();
      this.afterDraw();
    },
    initTexture(data) {
      const { gl } = this,
        u_Sampler = getPropLocation(gl, "u_Sampler", true);

      createTexture(gl, u_Sampler, data);
    }
  },
  mounted() {
    const { renderCanvas } = this.$refs,
      gl = renderCanvas.getContext("webgl2");
    if (!gl) {
      console.error("Failed to get the rendering context of WebGL !");
      return;
    }

    // init shaders.
    gl.program = initShaders(
      gl,
      // TEXTURE_VSHADER_SOURCE,
      // TEXTURE_FSHADER_SOURCE
      COLOR_VSHADER_SOURCE,
      COLOR_FSHADER_SOURCE
    );
    if (!gl.program) {
      console.error("Failed to init shaders!");
      return;
    }

    this.$store.commit("updateGL", gl);

    this.initTexture(BoxImage);
    this.beforeDraw();

    const tick = () => {
      this.redraw();
      requestAnimationFrame(tick);
    };
    tick();

    const _this = this;
    window.addEventListener(
      "resize",
      (() => {
        let timer = false;
        const resize = () => {
          _this.canvasSize = {
            x: window.innerWidth * window.devicePixelRatio,
            y: window.innerHeight * window.devicePixelRatio
          };
        };
        return () => {
          if (!timer) {
            resize();
            timer = true;
            setTimeout(() => {
              resize();
              timer = false;
            }, 500);
          }
        };
      })()
    );
  },
  watch: {
    // 初始化视窗、光照等环境
    gl(newVal) {
      Object.keys(Mutation).forEach(effect => {
        Mutation[effect](newVal, this.$store.state[effect]);
      });
    }
  },
  updated() {
    this.redraw();
  }
};
</script>

<style scoped>
#renderCanvas {
  width: 100%;
  height: 100%;
}
</style>
