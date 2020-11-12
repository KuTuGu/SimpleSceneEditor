<template>
  <div
    class="container"
    ref="list"
    :class="{ hide: !visible }"
    :style="{
      left: parseFloat(position.x) + 'px',
      top: parseFloat(position.y) + 'px',
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
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import { useStore } from "vuex";
import Icon from "../common/icon.vue";
import ArrowSVG from "../assets/icons/arrow.vue";
import { getChildPosition, createObj } from "../utils/menu";

export default defineComponent({
  name: "menuBar",
  components: {
    Icon,
    ArrowSVG,
  },
  props: {
    targetID: {
      type: String,
      default: undefined,
    },
    visible: {
      type: Boolean,
      default: true,
    },
    position: {
      type: Object,
      default: () => ({
        x: 0,
        y: 0,
      }),
    },
    structure: {
      type: Array,
      default: () => [
        {
          name: "Create",
          children: [
            {
              name: "3D",
              children: [{ name: "Cube" }, { name: "Sphere" }],
            },
            {
              name: "2D",
              children: [
                { name: "Triangle" },
                { name: "Plane" },
                { name: "Circle" },
                { name: "Text" },
              ],
            },
            {
              name: "Light",
              children: [
                { name: "Directional Light" },
                { name: "Point Light" },
                { name: "Ambient Light" },
              ],
            },
            { name: "Camera" },
          ],
        },
        { name: "Copy" },
        { name: "Paste" },
        { name: "Delete" },
      ],
    },
  },
  setup(props) {
    const { targetID } = toRefs(props);
    const store = useStore();
    const pos = reactive({});
    const childVisible = reactive({});
    const list = ref(null);
    // 非功能键子元素数
    const hasChildCount = 3;

    onMounted(() => {
      // 选出所有非功能键
      const liChildren = [...list.value.children[0].children].filter(
        (item) =>
          item.tagName === "LI" && item.children.length === hasChildCount
      );

      // 控制子菜单显示
      liChildren.map((liItem) => {
        liItem.addEventListener("mouseenter", () => {
          if (!pos[liItem.title]) {
            pos[liItem.title] = getChildPosition(liItem, liItem.children[2]);
          }
          childVisible[liItem.title] = true;
        });

        liItem.addEventListener("mouseleave", () => {
          childVisible[liItem.title] = false;
        });
      });
    });

    return {
      ...toRefs(props),
      pos,
      childVisible,
      list,
      clickItem,
    };

    function clickItem(child, e) {
      let objTitles = ["Cube", "Sphere", "Plane", "Circle", "Triangle"];
      // 点击菜单功能键
      if (!child) {
        if (objTitles.indexOf(e.target.title) > -1) {
          createObj(e.target.title, store, targetID.value);
        } else console.log(e.target.title);
      }
    }
  },
});
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
