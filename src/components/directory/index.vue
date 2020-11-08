<template>
  <div class="container">
    <div ref="arrows">
      <div class="arrow-left"></div>
      <div class="arrow-left"></div>
    </div>
    <div class="directory">
      <p class="name">Directory</p>
      <hr />
      <DirectoryContent :list="renderDirectory" />
    </div>
    <div class="properties">
      <p class="name">Property</p>
      <hr />
      <div id="propertyPanel"></div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import DirectoryContent from "./components/directoryContent.vue";

export default defineComponent({
  name: "directory",
  components: {
    DirectoryContent,
  },
  setup() {
    const store = useStore();
    window.store = store;
    const renderDirectory = computed(() => {
      const { directory } = store.state;

      return Object.values(directory)
        .filter((item) => item.parent === undefined)
        .map((item) => deepInsertChildren(item, directory));
    });

    return {
      renderDirectory,
    };

    function deepInsertChildren(item, list) {
      let { children, ...res } = item;
      if (children.length) {
        const arr = [];
        children.map((id) => {
          arr.push(deepInsertChildren(list[id], list));
        });
        children = arr;
      }
      return { children, ...res };
    }
  },
});
</script>

<style scoped>
.container {
  display: flex;
  flex-wrap: nowrap;
  position: absolute;
  right: -500px;
  top: 0;
  width: 500px;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 100;
  transition: right 0.7s ease-in-out;
  color: white;
  border: solid 1px white;
}
.container:hover {
  right: 0;
}
.arrow-left {
  position: absolute;
  left: -30px;
  top: calc(50% - 14px);
  width: 25px;
  height: 25px;
  border-left: 3px solid rgba(255, 255, 255, 0.7);
  border-bottom: 3px solid rgba(255, 255, 255, 0.7);
  transform: rotateZ(45deg);
}
.arrow-left:first-child {
  left: -20px;
  border-left: 3px solid white;
  border-bottom: 3px solid white;
}
.directory {
  width: 30%;
  padding: 20px 0;
}
.properties {
  width: 70%;
  border-left: solid 1px white;
  padding: 20px 0;
}
.name {
  padding: 10px 0;
  margin: 0 20px 20px 20px;
  border-top: solid 1px white;
  border-bottom: solid 1px white;
  text-align: center;
}
</style>
