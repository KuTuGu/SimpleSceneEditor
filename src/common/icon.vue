<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1024 1024"
    version="1.1"
    :width="width"
    :height="height"
    :style="{ ...custom }"
    :aria-labelledby="name"
    role="presentation"
  >
    <title :id="name" lang="en">{{ name }}</title>
    <g :fill="color">
      <slot />
    </g>
  </svg>
</template>

<script>
export default {
  name: "icon",
  props: {
    name: {
      type: String,
      default: "icon",
    },
    width: {
      type: [Number, String],
      default: 30,
    },
    height: {
      type: [Number, String],
      default: 30,
    },
    color: {
      type: String,
      default: "#ffffff",
    },
    custom: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>

<style scoped>
svg {
  display: inline-block;
  margin-left: 9px;
  margin-right: 9px;
  padding: 2px;
  cursor: pointer;
  border: 1px solid transparent;
}
</style>
