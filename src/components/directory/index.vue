<template>
  <div class="container">
    <div ref="arrows">
      <div class="arrow-left"></div>
      <div class="arrow-left"></div>
    </div>
    <div class="directory">
      <p class="name">目录</p>
      <hr />
      <DirectoryContent :list="generateRenderDirectory" />
    </div>
    <div class="properties">
      <p class="name">属性</p>
      <hr />
      <div id="propertyPanel"></div>
    </div>
  </div>
</template>

<script>
import DirectoryContent from "./components/directoryContent";

export default {
  name: "directory",
  components: {
    DirectoryContent
  },
  computed: {
    generateRenderDirectory() {
      const { directory: list } = this.$store.state;
      // parent id can be 0, so we must judge if it's undefined
      return list
        .filter(item => item.parent === undefined)
        .map(item => this.deepInsertChildren(item, list));
    }
  },
  methods: {
    deepInsertChildren(item, list) {
      if (item.children) {
        let arr = [];
        item.children.map(id => {
          arr.push(this.deepInsertChildren(list[id], list));
        });
        item.children = arr;
      }
      return item;
    }
  }
};
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
