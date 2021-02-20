<template>
  <Suspense>
    <template #default>
      <component :is="layout">
        <router-view />
      </component>
    </template>
    <template #fallback>
      <div>Loading....</div>
    </template>
  </Suspense>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from "vue";
import { useRouter } from "vue-router";

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


<style>
.form-input:focus {
  border-color: none;
  box-shadow: 0 0 0 3px rgb(66 153 225 / 50%);
}
.form-input.border-red-600:focus {
  border-color: none;
  box-shadow: 0 0 0 3px rgb(220 53 69 / 25%);
}
</style>
