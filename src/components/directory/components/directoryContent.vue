<template>
  <div v-if="list" class="directoryContent" :data-level="level">
    <ul>
      <li v-for="item of list" :key="item.id">
        <router-link :to="`${item.id}`">
          <p
            class="item"
            :style="{ paddingLeft: level * 18 + 'px' }"
            :title="item.name"
            :data-id="item.id"
            :data-type="item.children.length ? `list` : `item`"
            :data-status="expanded[item.id] ? `expanded` : `hidden`"
            @click.stop="clickItem(item.id, !!item.children.length)"
          >
            <span :data-id="item.id">{{ item.name }}</span>
          </p>
          <directoryContent
            v-if="expanded[item.id]"
            :list="item.children"
            :level="level + 1"
          />
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "directoryContent",
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    level: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const store = useStore();
    const expanded = reactive({});

    return {
      ...toRefs(props),
      expanded,
      clickItem,
    };

    function clickItem(id, list) {
      // 展开父节点
      if (list) {
        expanded[id] = !expanded[id];
      }

      // 高亮选择物体
      store.commit("updateClickCanvas", id);
    }
  },
});
</script>

<style scoped>
.directoryContent[data-level="0"] {
  padding: 10px 0;
}
.directoryContent > ul {
  list-style-type: none;
}
.directoryContent a {
  color: white;
  text-decoration: none;
}
.item {
  width: 100%;
  user-select: none;
}
.item:hover {
  background-color: purple;
  cursor: pointer;
}
.item[data-type="list"] {
  display: flex;
  align-items: center;
}
.item[data-type="item"] > span {
  margin-left: 8px;
}
.item[data-type="list"][data-status="hidden"]::before {
  content: "";
  width: 0px;
  height: 0px;
  border-right: 0px solid transparent;
  border-top: 6px solid transparent;
  border-left: 10px solid white;
  border-bottom: 6px solid transparent;
  margin: 0 8px;
}
.item[data-type="list"][data-status="expanded"]::before {
  content: "";
  width: 0px;
  height: 0px;
  border-bottom: 0px solid transparent;
  border-left: 5px solid transparent;
  border-top: 10px solid white;
  border-right: 5px solid transparent;
  margin: 0 8px;
}
</style>
