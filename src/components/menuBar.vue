<template>
  <div
    class="container"
    ref="list"
    :class="{ hide: !visible }"
    :style="{
      left: parseFloat(position.x) + 'px',
      top: parseFloat(position.y) + 'px'
    }"
  >
    <ul>
      <li
        v-for="item of structure"
        :key="item.name"
        :title="item.name"
        :data-type="item ? `list` : `item`"
        @click="clickItem(item.children, $event)"
      >
        <span :title="item.name" :data-type="item.children ? `list` : `item`">{{
          item.name
        }}</span>
        <Icon
          v-if="item.children"
          width="20"
          height="20"
          :name="item.name"
          :custom="{ margin: 0, padding: 0 }"
          ><ArrowSVG
        /></Icon>
        <menuBar
          v-if="item.children"
          :visible="visible"
          :position="pos[item.name]"
          :structure="item.children"
          :targetID="targetID"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import Icon from "../common/icon";
import ArrowSVG from "../assets/icons/arrow";
import { getChildPosition } from "../utils/utils";
import { ObjectConfig } from "../utils/config.js";

export default {
  name: "menuBar",
  data: () => ({
    pos: {},
    show: true
  }),
  props: {
    targetID: {
      type: String,
      default: undefined
    },
    visible: {
      type: Boolean,
      default: false
    },
    position: {
      type: Object,
      default: () => ({
        x: 0,
        y: 0
      })
    },
    structure: {
      type: Array,
      default: () => [
        {
          name: "Create",
          children: [
            {
              name: "3D",
              children: [{ name: "Cube" }, { name: "Sphere" }]
            },
            {
              name: "2D",
              children: [
                { name: "Triangle" },
                { name: "Plane" },
                { name: "Circle" },
                { name: "Text" }
              ]
            },
            {
              name: "Light",
              children: [
                { name: "Directional Light" },
                { name: "Point Light" },
                { name: "Ambient Light" }
              ]
            },
            { name: "Camera" }
          ]
        },
        { name: "Copy" },
        { name: "Paste" },
        { name: "Delete" }
      ]
    }
  },
  components: {
    Icon,
    ArrowSVG
  },
  methods: {
    createObj(type) {
      const { directory, objID } = this.$store.state;
      let parent;

      if (this.targetID !== undefined) {
        directory[this.targetID].children.push(objID);
        parent = this.targetID;
      }

      this.$store.commit("updateObjects", [
        ...directory,
        {
          id: objID,
          children: [],
          parent,
          properties: {
            name: type,
            type: type,
            ...JSON.parse(JSON.stringify(ObjectConfig[`${type}Config`]))
          }
        }
      ]);
      this.$store.commit("updateObjID");
    },
    clickItem(child, e) {
      // click function button
      if (!child) {
        // do something else
        switch (e.target.title) {
          case "Cube": {
            this.createObj(e.target.title);
            break;
          }
          case "Sphere": {
            this.createObj(e.target.title);
            break;
          }
          case "Plane": {
            this.createObj(e.target.title);
            break;
          }
          default:
            console.log(e.target.title);
        }
      }
    }
  },
  mounted() {
    const list = this.$refs.list;
    let lastItem = null;

    list.addEventListener("mousemove", e => {
      const item = e.target;
      // is item && if have children list && calculate once
      if (
        item.tagName === "LI" &&
        item.children.length === 3 &&
        lastItem !== item
      ) {
        lastItem = item;
        this.$set(
          this.pos,
          `${item.title}`,
          getChildPosition(item, item.children[2])
        );
      }
    });
  }
};
</script>

<style scoped>
.container {
  position: absolute;
  left: 0;
  top: 0;
  min-width: 100px;
  max-width: 150px;
  padding: 5px 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;
}
.container li {
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  /* flex-wrap: nowrap; */
  width: 100%;
  margin: 3px 0;
  padding: 0 5px 0 10px;
  list-style: none;
  color: white;
  cursor: pointer;
}
.container li > span {
  white-space: nowrap;
  user-select: none;
}
.container li:hover {
  background: purple;
}
.hide {
  visibility: hidden;
}

/* hidden default, show only when li is hover and div haven't been hidden*/
.container li > div {
  visibility: hidden;
}
.container li:hover > div:not([class*="hide"]) {
  visibility: visible;
}
</style>
