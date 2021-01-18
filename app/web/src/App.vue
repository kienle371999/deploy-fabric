<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import auth from "./request/foundation/Authenticator";
import localStorageSetting from "./utils/LocalStorageSetting"

const defaultLayout = "default";

export default defineComponent({
  setup() {
    const { currentRoute } = useRouter();
    const layout = computed(
      () => `${currentRoute.value.meta.layout || defaultLayout}-layout`
    );

    return {
      layout,
    };
  },
});
</script>
