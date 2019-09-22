import { Vue, store } from "./store";
import VueRouter from "vue-router";
import App from "./App.vue";

import PropertyContent from "./components/directory/components/propertyContent";

// Vue.config.productionTip = false;

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [{ path: "/:id", component: PropertyContent }]
});

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
