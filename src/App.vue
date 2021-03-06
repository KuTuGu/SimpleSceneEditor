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

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import RenderCanvas from "./components/renderCanvas.vue";
import MouseBar from "./components/mouseBar.vue";
import MenuBar from "./components/menuBar.vue";
import Directory from "./components/directory/index.vue";
import { getObjPosition } from "./utils/menu";

export default defineComponent({
  name: "app",
  components: {
    RenderCanvas,
    MouseBar,
    MenuBar,
    Directory,
  },
  setup() {
    const app = ref(<HTMLDivElement>null);
    const menu = ref(<typeof MenuBar>null);
    const menuVisible = ref(false);
    const targetID = ref("");
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
          const dom = e.target as HTMLElement;

          menuPos.value = getObjPosition(
            {
              x: e.clientX,
              y: e.clientY,
            },
            {
              width: parseFloat(width),
              height: parseFloat(height),
            }
          );
          targetID.value = dom.dataset.id;
          menuVisible.value = true;
        }
      });

      app.value.addEventListener("click", (e) => {
        const dom = e.target as HTMLElement;

        if (
          dom.tagName !== "UL" &&
          dom.tagName !== "svg" &&
          dom.tagName !== "path" &&
          dom.dataset.type !== "list"
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
