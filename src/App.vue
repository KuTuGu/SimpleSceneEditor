<template>
  <div id="app" ref="app">
    <RenderCanvas />
    <MouseBar />
    <MenuBar :position="menuPos" :visible="menuVisible" ref="menu" />
    <Directory />
  </div>
</template>

<script>
import RenderCanvas from "./components/renderCanvas";
import MouseBar from "./components/mouseBar";
import MenuBar from "./components/menuBar";
import Directory from "./components/directory";
import { getObjPosition } from "./utils/humanizedCoord";

export default {
  name: "app",
  components: {
    RenderCanvas,
    MouseBar,
    MenuBar,
    Directory
  },
  data: () => ({
    menuPos: {
      x: 0,
      y: 0
    },
    menuVisible: false
  }),
  mounted() {
    const { app, menu } = this.$refs;

    // Custom menu bar
    app.onmousedown = e => {
      if (e.buttons === 2) {
        const { width, height } = getComputedStyle(menu.$el);
        // hide default menu
        document.oncontextmenu = () => false;

        this.menuPos = getObjPosition(
          {
            x: e.clientX,
            y: e.clientY
          },
          { width, height }
        );
        this.menuVisible = true;
      }
    };
    /* 
      Consistent with the menu click event，
      so that it can be stopped at bubbling stage.
    */
    app.onclick = e => {
      // if not UL && not list
      if (
        e.target.tagName !== "UL" &&
        e.target.tagName !== "svg" &&
        e.target.tagName !== "path" &&
        e.target.dataset.type !== "list"
      ) {
        this.menuVisible = false;
      }
    };
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  outline: none;
  box-sizing: border-box;
}

html,
body,
#app {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
