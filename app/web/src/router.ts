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
import Networkconfiguration from "./views/Networkconfiguration.vue";
import NetworkSetupOrg from "./views/networksetup/NetworkSetupOrg.vue";
import NetworkSetupPeer from "./views/networksetup/NetworkSetupPeer.vue";
import NetworkSetupOrder from "./views/networksetup/NetworkSetupOrder.vue";


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
    name: "Networkconfiguration",
    component: Networkconfiguration,
  },
  {
    path: "/network-setup/organization",
    name: "NetworkSetupOrg",
    component: NetworkSetupOrg,
  },
  {
    path: "/network-setup/peer",
    name: "NetworkSetupPeer",
    component: NetworkSetupPeer,
  },
  {
    path: "/network-setup/order",
    name: "NetworkSetupOrder",
    component: NetworkSetupOrder,
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
