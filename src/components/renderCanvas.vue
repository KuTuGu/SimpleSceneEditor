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
  // COLOR_VSHADER_SOURCE,
  // COLOR_FSHADER_SOURCE,
  TEXTURE_VSHADER_SOURCE,
  TEXTURE_FSHADER_SOURCE
} from "../utils/shaders";
import { initRotateHandler, initClickHandler } from "../utils/events";
import { renderConfig } from "../utils/config.js";
import Object from "../utils/object/index";
import BoxImage from "../assets/box.png";

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

      // set rotate handler
      initRotateHandler(renderCanvas, this);
      // set click handler
      initClickHandler(renderCanvas, this);

      // set draw config
      gl.enable(gl.DEPTH_TEST);
      // gl.enable(gl.BLEND);
      // gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    },
    defalutDraw() {},
    draw() {
      const { gl, directory } = this;

      directory.map(obj => {
        const { type, ...res } = obj.properties,
          object = new Object[type](res);

        this.insertObjID(obj.id);
        object.drawTexture(gl);
      });
    },
    redraw() {
      this.clearCanvas();
      this.defalutDraw();
      this.draw();
      this.afterDraw();
    },
    afterDraw() {
      const { gl } = this;

      gl.depthMask(true);
    },
    createTexture(data) {
      const { gl } = this,
        u_Sampler = getPropLocation(gl, "u_Sampler", true);

      createTexture(gl, u_Sampler, data);
    }
  },
  mounted() {
    const { renderCanvas } = this.$refs,
      gl = renderCanvas.getContext("webgl");
    if (!gl) {
      console.error("Failed to get the rendering context of WebGL !");
      return;
    }

    // init shaders.
    gl.program = initShaders(
      gl,
      TEXTURE_VSHADER_SOURCE,
      TEXTURE_FSHADER_SOURCE
    );
    if (!gl.program) {
      console.error("Failed to init shaders!");
      return;
    }

    this.$store.commit("updateGL", gl);
    for (let commit in renderConfig) {
      this.$store.commit(commit, renderConfig[commit]);
    }

    this.createTexture(BoxImage);
    this.beforeDraw();

    const tick = () => {
      this.clearCanvas();
      this.defalutDraw();
      this.draw();
      this.afterDraw();

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
