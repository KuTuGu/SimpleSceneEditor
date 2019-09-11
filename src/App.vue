<template>
  <div id="app">
    <canvas id="renderCanvas" ref="renderCanvas">
      Please open it in the browser that supports Canvas.
    </canvas>
    <MouseBar />
    <MenuBar />
    <Directory />
  </div>
</template>

<script>
import MouseBar from "./components/mouseBar";
import MenuBar from "./components/menuBar";
import Directory from "./components/directory";

export default {
  name: "app",
  components: {
    MouseBar,
    MenuBar,
    Directory
  },
  methods: {
    resizeCanvas() {
      const renderCanvas = this.$refs.renderCanvas;

      renderCanvas.width = window.innerWidth;
      renderCanvas.height = window.innerHeight;
    }
  },
  mounted() {
    this.resizeCanvas();
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  outline: none;
}

html,
body,
#app,
#app::after {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#app,
#app::after {
  position: relative;
  left: 0;
  top: 0;
  /* Set the double background to clear the blur white edge problem */
  background: url(./assets/star.jpg) no-repeat 50% 99%;
  background-size: cover;
  background-attachment: fixed;
}

#app::after {
  content: "";
  position: absolute;
  filter: blur(5px);
}

#renderCanvas {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>
