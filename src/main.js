import { createApp } from "vue"
import { createWebHistory, createRouter } from "vue-router";

import App from "./vue/App.vue";
import NFTCollectionLauncher from "./vue/components/NFTCollectionLauncher.vue";

import { EventBus } from './js/events.js';

const routes = [
    { path: "", component: NFTCollectionLauncher }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
  });

const app = createApp(App);
app.config.globalProperties.$eventBus = new EventBus();
app.use(router).mount("#app")