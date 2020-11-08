<template>
  <div id="app" ref="app">
    <RenderCanvas />
    <MouseBar />
    <MenuBar
      :position="menuPos"
      :visible="menuVisible"
      :targetID="targetID"
      ref="menu"
    />
    <Directory />
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, watchEffect } from "vue";
import RenderCanvas from "./components/renderCanvas.vue";
import MouseBar from "./components/mouseBar.vue";
import MenuBar from "./components/menuBar.vue";
import Directory from "./components/directory/index.vue";
import { getObjPosition } from "./utils/menu.js";

export default defineComponent({
  name: "app",
  components: {
    RenderCanvas,
    MouseBar,
    MenuBar,
    Directory,
  },
  setup() {
    const app = ref(null);
    const menu = ref(null);
    const menuVisible = ref(false);
    const targetID = ref(undefined);
    const menuPos = ref({
      x: 0,
      y: 0,
    });

    onMounted(() => {
      // 阻止默认菜单
      document.oncontextmenu = () => false;

      app.value.addEventListener("mousedown", (e) => {
        if (e.buttons === 2) {
          const { width, height } = getComputedStyle(menu.value.$el);
          menuPos.value = getObjPosition(
            {
              x: e.clientX,
              y: e.clientY,
            },
            { width, height }
          );
          targetID.value = e.target.dataset.id;
          menuVisible.value = true;
        }
      });

      app.value.addEventListener("click", (e) => {
        if (
          e.target.tagName !== "UL" &&
          e.target.tagName !== "svg" &&
          e.target.tagName !== "path" &&
          e.target.dataset.type !== "list"
        ) {
          menuVisible.value = false;
        }
      });
    });

    return {
      app,
      menu,
      menuVisible,
      targetID,
      menuPos,
    };
  },
});
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
