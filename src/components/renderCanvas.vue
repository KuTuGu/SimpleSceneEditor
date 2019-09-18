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
import { initShaders, getPropLocation } from "../utils/webgl.utils";
import { COLOR_VSHADER_SOURCE, COLOR_FSHADER_SOURCE } from "../utils/shaders";
import { initRotateHandler } from "../utils/events";
import { Cube, Sphere } from "../utils/3D";
import { Plane } from "../utils/2D";
import { Matrix4, Vector3 } from "../utils/matrix";

export default {
  name: "renderCanvas",
  data: () => ({
    canvasSize: {
      x: window.innerWidth * window.devicePixelRatio,
      y: window.innerHeight * window.devicePixelRatio
    },
    dictionary: {},
    viewProject: {
      perspective: {
        fov: 25,
        near: 1,
        far: 100
      },
      sight: [3.0, 3.0, 6.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0]
    },
    rotateAngle: [0.0, 0.0],
    fog: {
      color: [0, 0, 255],
      distance: [0, 9]
    },
    parallelLight: {
      color: [1.0, 1.0, 1.0],
      direction: [0.5, 3.0, 4.0]
    },
    pointLight: {
      color: [0.4, 0.4, 0.4],
      position: [10, 10, 10]
    },
    ambientLight: [0.5, 0.5, 0.5]
  }),
  watch: {
    viewProject: {
      handler(newVal) {
        this.updatedViewProject(newVal);
      }
    },
    rotateAngle: {
      handler(newVal) {
        this.updatedRotateAngle(newVal);
      }
    },
    fog: {
      handler(newVal) {
        this.updatedFog(newVal);
      }
    },
    parallelLight: {
      handler(newVal) {
        this.updatedParallelLight(newVal);
      }
    },
    pointLight: {
      handler(newVal) {
        this.updatedPointLight(newVal);
      }
    },
    ambientLight: {
      handler(newVal) {
        this.updatedAmbientLight(newVal);
      }
    }
  },
  methods: {
    clearCanvas() {
      const gl = this.gl;

      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.depthMask(false);
    },
    beforeDraw() {
      const { renderCanvas } = this.$refs,
        gl = this.gl;

      // set rotate handler
      initRotateHandler(renderCanvas, this);

      // set draw config
      gl.enable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    },
    defalutDraw() {
      const aCube = new Cube({
          center: {
            x: 0,
            y: 0.5,
            z: 0
          },
          width: 0.5,
          height: 0.5,
          length: 0.5
        }),
        aSphere = new Sphere({
          center: {
            x: 0,
            y: 0.5,
            z: 0
          },
          radius: 1
        }),
        aPlane = new Plane({
          center: {
            x: 0,
            y: 0,
            z: 0
          },
          width: 0.5,
          height: 0.5
        });
      aCube.draw(this.gl, true);
      aSphere.draw(this.gl, true);
      aPlane.draw(this.gl, true);
    },
    draw() {},
    redraw() {
      this.clearCanvas();
      this.defalutDraw();
      this.draw();
      this.afterDraw();
    },
    afterDraw() {
      const gl = this.gl;

      gl.depthMask(true);
      gl.flush();
    },

    updatedViewProject(data) {
      const gl = this.gl,
        {
          perspective: { fov, near, far },
          sight
        } = data,
        viewProjMatrix = new Matrix4(),
        u_ViewProjMatrix = getPropLocation(gl, "u_ViewProjMatrix", true);

      viewProjMatrix.setPerspective(
        fov,
        this.canvasSize.x / this.canvasSize.y,
        near,
        far
      );
      viewProjMatrix.lookAt(...sight);
      gl.uniformMatrix4fv(u_ViewProjMatrix, false, viewProjMatrix.elements);
    },
    updatedRotateAngle(data) {
      const gl = this.gl,
        modelMatrix = new Matrix4(),
        normalMatrix = new Matrix4(),
        u_ModelMatrix = getPropLocation(gl, "u_ModelMatrix", true),
        u_NormalMatrix = getPropLocation(gl, "u_NormalMatrix", true);

      modelMatrix.setRotate(data[0], 1.0, 0.0, 0.0);
      modelMatrix.rotate(data[1], 0.0, 1.0, 0.0);
      normalMatrix.setInverseOf(modelMatrix);
      normalMatrix.transpose();
      gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
      gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    },
    updatedFog(data) {
      const gl = this.gl,
        { color, distance } = data,
        u_FogColor = getPropLocation(gl, "u_FogColor", true),
        u_FogDist = getPropLocation(gl, "u_FogDist", true);

      gl.uniform3fv(u_FogColor, new Float32Array(color));
      gl.uniform2fv(u_FogDist, new Float32Array(distance));
    },
    updatedParallelLight(data) {
      const gl = this.gl,
        { color, direction } = data,
        u_LightColor = getPropLocation(gl, "u_LightColor", true),
        u_LightDirection = getPropLocation(gl, "u_LightDirection", true),
        lightColor = new Vector3(color),
        lightDirection = new Vector3(direction);

      lightDirection.normalize();
      gl.uniform3fv(u_LightColor, lightColor.elements);
      gl.uniform3fv(u_LightDirection, lightDirection.elements);
    },
    updatedPointLight(data) {
      const gl = this.gl,
        { color, position } = data,
        u_PointLightColor = getPropLocation(gl, "u_PointLightColor", true),
        u_PointLightPosition = getPropLocation(
          gl,
          "u_PointLightPosition",
          true
        );

      gl.uniform3f(u_PointLightColor, ...color);
      gl.uniform3f(u_PointLightPosition, ...position);
    },
    updatedAmbientLight(data) {
      const gl = this.gl,
        u_AmbientLightColor = getPropLocation(gl, "u_AmbientLightColor", true);

      gl.uniform3f(u_AmbientLightColor, ...data);
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
    gl.program = initShaders(gl, COLOR_VSHADER_SOURCE, COLOR_FSHADER_SOURCE);
    if (!gl.program) {
      console.error("Failed to init shaders!");
      return;
    }

    this.gl = gl;
    this.updatedViewProject(this.viewProject);
    this.updatedRotateAngle(this.rotateAngle);
    this.updatedFog(this.fog);
    this.updatedParallelLight(this.parallelLight);
    this.updatedPointLight(this.pointLight);
    this.updatedAmbientLight(this.ambientLight);

    this.beforeDraw();

    const tick = () => {
      this.clearCanvas();
      this.defalutDraw();
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
