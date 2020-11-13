// ts支持vue组件
declare module "*.vue" {
  import { Component } from "vue";
  const component: Component;
  export default component;
}

// ts修改事件监听参数
declare interface HTMLElementEventMap {
  'mousewheel': WheelEvent;
}