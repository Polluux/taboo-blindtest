<template>
  <div class="flex h-full flex-col items-center justify-center gap-2">
    <div class="flex gap-5">
      <a
        href="https://vitejs.dev"
        target="_blank"
      >
        <img
          src="/vite.svg"
          class="logo h-40"
          alt="Vite logo"
        />
      </a>
      <a
        href="https://vuejs.org/"
        target="_blank"
      >
        <img
          src="@/assets/vue.svg"
          class="logo h-40"
          alt="Vue logo"
        />
      </a>
    </div>
    <HelloWorld msg="The big test !" />
    <router-link
      aria-label="back"
      class="btn"
      :to="{ name: 'test' }"
      type="button"
    >
      <span>to second page</span>
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import HelloWorld from '@/components/HelloWorld.vue';

const a = ref('oui');
</script>

<style scoped>
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
