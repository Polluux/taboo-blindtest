<template>
  <h1>{{ msg }}</h1>

  <div class="flex flex-col items-center gap-5 p-2">
    <button class="btn" type="button" @click="globalStore.counter++">counter is {{ globalStore.counter }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Learn more about IDE Support for Vue in the
    <a
      href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
      target="_blank"
      >Vue Docs Scaling up Guide</a
    >.
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<script setup lang="ts">
import { useGlobalStore } from '@/stores/global';

const globalStore = useGlobalStore();

defineProps({
  msg: String,
})
</script>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
