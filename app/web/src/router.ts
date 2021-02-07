import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import localStorageSetting from "./utils/LocalStorageSetting";

import Dashboard from "./views/Dashboard.vue";
import Forms from "./views/Forms.vue";
import Tables from "./views/Tables.vue";
import UIElements from "./views/UIElements.vue";
import Login from "./views/Login.vue";
import Modal from "./views/Modal.vue";
import Card from "./views/Card.vue";
import Blank from "./views/Blank.vue";
import NotFound from "./views/NotFound.vue";
import NetworkConfiguration from "./views/NetworkConfiguration.vue";
import NetworkSetup from "./views/NetworkSetup.vue";
import NetworkElement from "./views/NetworkElement.vue";
import JoinChannel from "./views/JoinChannel.vue";


const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Login",
    component: Login,
    meta: { layout: "empty" },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/forms",
    name: "Forms",
    component: Forms,
  },
  {
    path: "/cards",
    name: "Cards",
    component: Card,
  },
  {
    path: "/tables",
    name: "Tables",
    component: Tables,
  },
  {
    path: "/ui-elements",
    name: "UIElements",
    component: UIElements,
  },
  {
    path: "/modal",
    name: "Modal",
    component: Modal,
  },
  {
    path: "/blank",
    name: "Blank",
    component: Blank,
  },
  {
    path: "/network-configuration",
    name: "NetworkConfiguration",
    component: NetworkConfiguration,
  },
  {
    path: "/network-setup",
    name: "NetworkSetup",
    component: NetworkSetup,
  },
  {
    path: "/network-setup/:networkId",
    name: "NetworkElement",
    component: NetworkElement,
  },
  {
    path: "/join-channel",
    name: "JoinChannel",
    component: JoinChannel,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated: boolean = localStorageSetting._getAccessToken() ? true : false;
  if (to.name !== "Login" && !isAuthenticated) next({ name: 'Login' });
  else next();
});

export default router;
