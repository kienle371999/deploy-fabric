import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/main.css';
import DashboardLayout from './components/DashboardLayout.vue';
import EmptyLayout from './components/EmptyLayout.vue';
import Multiselect from '@vueform/multiselect';
import Toaster from '@meforma/vue-toaster';
import { useLoading } from 'vue3-loading-overlay';

const app = createApp(App);
app.component('default-layout', DashboardLayout);
app.component('empty-layout', EmptyLayout);
app.component('multi-select', Multiselect);

app.use(router);
app.use(Toaster, {
  position: "top-right",
  duration: 1000,
  max: 1
});
app.config.globalProperties.$loading = () => useLoading();
app.mount('#app');
