<template>
  <router-view />
</template>

<script setup lang="ts">
import { useGlobalStore } from '@/stores/global';

const globalStore = useGlobalStore();
globalStore.refreshSession();
</script>
