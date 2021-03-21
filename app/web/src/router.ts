import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import localStorageSetting from "./utils/LocalStorageSetting";

import Dashboard from "./views/Dashboard.vue";
import Forms from "./views/Forms.vue";
import UIElements from "./views/UIElements.vue";
import Login from "./views/Login.vue";
import Modal from "./views/Modal.vue";
import Card from "./views/Card.vue";
import Blank from "./views/Blank.vue";
import NotFound from "./views/NotFound.vue";
import NetworkConfiguration from "./views/NetworkConfiguration.vue";
import NetworkSetup from "./views/NetworkSetup.vue";
import Chaincode from "./views/Chaincode.vue";
import ExplorerSetup from './views/ExplorerSetup.vue';

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
    path: "/chaincode",
    name: "Chaincode",
    component: Chaincode,
  },
  {
    path: "/explorer",
    name: 'Explorer',
    component: ExplorerSetup
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
