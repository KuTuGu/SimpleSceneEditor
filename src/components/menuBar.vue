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
          :visible="childVisible[item.name]"
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
import { getChildPosition, createObj } from "../utils/utils";

export default {
  name: "menuBar",
  data: () => ({
    pos: {},
    childVisible: {}
  }),
  mounted() {
    const list = this.$refs.list,
      liChildren = [...list.children[0].children].filter(
        item => item.tagName === "LI" && item.children.length === 3
      );

    liChildren.map(liItem => {
      liItem.addEventListener("mouseenter", e => {
        const item = e.target;
        // is item && if have children list
        if (item.tagName === "LI" && item.children.length === 3) {
          this.$set(
            this.pos,
            item.title,
            getChildPosition(item, item.children[2])
          );
          this.$set(this.childVisible, item.title, true);
        }
      });

      liItem.addEventListener("mouseleave", e => {
        this.$set(this.childVisible, e.target.title, false);
      });
    });
  },
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
    clickItem(child, e) {
      let objTitles = ["Cube", "Sphere", "Plane", "Circle", "Triangle"];
      // click function button
      if (!child) {
        if (objTitles.indexOf(e.target.title) > -1) {
          createObj(e.target.title, this, this.targetID);
        } else console.log(e.target.title);
      }
    }
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
/* .container li > div {
  visibility: hidden;
}
.container li:hover > div:not([class*="hide"]) {
  visibility: visible;
} */
</style>
