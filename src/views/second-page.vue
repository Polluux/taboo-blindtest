<template>
  <router-link
    aria-label="back"
    class="btn"
    :to="{ name: 'home' }"
    type="button"
  >
    <span>back</span>
  </router-link>
  <div>Current counter state : {{ globalStore.counter }}</div>
</template>

<script setup lang="ts">
import { useGlobalStore } from '@/stores/global';

const globalStore = useGlobalStore();
</script>