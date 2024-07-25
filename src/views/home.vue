<template>
  <div class="flex h-full flex-col gap-10 overflow-y-auto">
    <SupabasePlayground />
    <YoutubePlayground />
  </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from 'vue';

const SupabasePlayground = defineAsyncComponent(() => import('@/components/supabase-playground.vue'));
const YoutubePlayground = defineAsyncComponent(() => import('@/components/youtube-playground.vue'));
</script>
