import { createRouter, createWebHashHistory } from "vue-router";
import PropertyContent from "./components/directory/components/propertyContent.vue";

export default createRouter({
  history: createWebHashHistory(),
  routes: [{ path: "/:id", component: PropertyContent }],
});
