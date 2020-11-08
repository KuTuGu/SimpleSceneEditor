<template>
  <div class="container">
    <Icon
      name="Hand"
      :class="{ active: status === MouseStatus.Hand }"
      @click="updateMouseStatus(MouseStatus.Hand)"
      ><HandSVG
    /></Icon>
    <Icon
      name="Move"
      :class="{ active: status === MouseStatus.Move }"
      @click="updateMouseStatus(MouseStatus.Move)"
      ><MoveSVG
    /></Icon>
    <Icon
      name="Rotate"
      :class="{ active: status === MouseStatus.Rotate }"
      @click="updateMouseStatus(MouseStatus.Rotate)"
      ><RotateSVG
    /></Icon>
    <Icon
      name="Scale"
      :class="{ active: status === MouseStatus.Scale }"
      @click="updateMouseStatus(MouseStatus.Scale)"
      ><ScaleSVG
    /></Icon>
    <div ref="arrows">
      <div class="arrow-down"></div>
      <div class="arrow-down"></div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import Icon from "../common/icon.vue";
import HandSVG from "../assets/icons/hand.vue";
import MoveSVG from "../assets/icons/move.vue";
import RotateSVG from "../assets/icons/rotate.vue";
import ScaleSVG from "../assets/icons/scale.vue";

export default defineComponent({
  name: "mouseBar",
  components: {
    Icon,
    HandSVG,
    MoveSVG,
    RotateSVG,
    ScaleSVG,
  },
  setup() {
    const store = useStore();
    const status = computed(() => store.state.mouseStatus);
    const MouseStatus = {
      Hand: 0,
      Move: 1,
      Rotate: 2,
      Scale: 3,
    };

    return {
      status,
      MouseStatus,
      updateMouseStatus,
    };

    function updateMouseStatus(status) {
      store.commit(`updateMouseStatus`, status);
    }
  },
});
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: absolute;
  left: 0;
  top: -50px;
  min-width: 100px;
  height: 50px;
  background: rgba(0, 0, 0, 0.4);
  z-index: 100;
  transition: top 0.5s ease-in-out;
}
.container:hover {
  top: 0;
}
.arrow-down {
  position: absolute;
  left: calc(50% - 10px);
  top: 55px;
  width: 18px;
  height: 18px;
  border-left: 3px solid rgba(255, 255, 255, 0.7);
  border-bottom: 3px solid rgba(255, 255, 255, 0.7);
  transform: rotateZ(-45deg);
}
.arrow-down:first-child {
  top: 45px;
  border-left: 3px solid white;
  border-bottom: 3px solid white;
}
.active {
  border: 1px solid white;
}
</style>
