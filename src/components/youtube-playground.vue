<template>
  <div class="flex flex-col gap-3">
    <h2 class="text-xl font-bold">Youtube Playground</h2>
    <input
      type="text"
      v-model="search"
      placeholder="Search"
      class="h-8"
      @input="startSearch"
    />
    <div v-if="loading">Recherche...</div>
    <div v-else>
      <div v-for="video of data">
        <div
          :url="video.thumbnails.default.url"
          class="h-24 w-32 bg-no-repeat bg-center"
          :style="`background-image: url('${video.thumbnails.default.url}')`"
        />
        {{ video.title }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from '@/stores/global';
import { ref } from 'vue';
import { useDebounceFn } from '@vueuse/core';

const globalStore = useGlobalStore();
const search = ref('');
const error = ref('');
const loading = ref(false);
const data = ref([] as any[]);

const startSearch = useDebounceFn(async () => {
  loading.value = true;
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&key=${globalStore.userSession?.idClient}&q=${search.value}`
    );
    data.value = (await res.json()).items.map((i) => {
      return { ...i.snippet, ...i.id };
    });
    console.log(data.value);
  } catch (err: any) {
    console.error(err);
    error.value = err;
  } finally {
    loading.value = false;
  }
}, 1000);
</script>
