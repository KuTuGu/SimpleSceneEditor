<template>
  <div class="container">
    <div ref="arrows">
      <div class="arrow-left"></div>
      <div class="arrow-left"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "directory"
};
</script>

<style scoped>
.container {
  position: absolute;
  right: -300px;
  top: 0;
  width: 300px;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 100;
  transition: right 0.7s ease-in-out;
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
</style>
