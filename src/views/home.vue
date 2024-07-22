<template>
  <div class="flex h-full flex-col items-center justify-center gap-2">
    <div v-if="globalStore.userSession">
      Logged as : {{ globalStore.userSession.user.email }}
    </div>
    <template v-else>
      <div>
        User not logged
      </div>
      <router-link
      aria-label="back"
      class="btn"
      :to="{ name: 'login' }"
      type="button"
      >
      <span>login</span>
    </router-link>
  </template>
  </div>
</template>

<script lang="ts" setup>
import { useGlobalStore } from '@/stores/global';

const globalStore = useGlobalStore();

// const musics = await supabase.from('musics').select();
// console.log(musics);
</script>
