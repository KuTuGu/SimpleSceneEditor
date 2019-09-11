<template>
  <div class="container">
    <Icon v-bind:class="{ active: index === 0 }" v-on:click.native="setIndex(0)"
      ><HandSVG
    /></Icon>
    <Icon v-bind:class="{ active: index === 1 }" v-on:click.native="setIndex(1)"
      ><MoveSVG
    /></Icon>
    <Icon v-bind:class="{ active: index === 2 }" v-on:click.native="setIndex(2)"
      ><RotateSVG
    /></Icon>
    <Icon v-bind:class="{ active: index === 3 }" v-on:click.native="setIndex(3)"
      ><ScaleSVG
    /></Icon>
    <div ref="arrows">
      <div class="arrow-down"></div>
      <div class="arrow-down"></div>
    </div>
  </div>
</template>

<script>
import Icon from "../common/icon";
import HandSVG from "../assets/icons/hand";
import MoveSVG from "../assets/icons/move";
import RotateSVG from "../assets/icons/rotate";
import ScaleSVG from "../assets/icons/scale";

export default {
  name: "mouseBar",
  data: () => ({
    index: 0
  }),
  components: {
    Icon,
    HandSVG,
    MoveSVG,
    RotateSVG,
    ScaleSVG
  },
  methods: {
    setIndex(i) {
      this.index = i;
    }
  }
};
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
