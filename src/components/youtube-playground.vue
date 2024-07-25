<template>
  <div class="flex flex-col gap-3">
    <h2 class="text-xl font-bold">Youtube Playground</h2>
    <input
      type="text"
      v-model="search"
      placeholder="Search"
      class="h-8"
      @input="startSearch"
      :disabled="!globalStore.userSession?.idClient"
    />
    <div v-if="!globalStore.userSession?.idClient">You are not allowed to perform a youtube search</div>
    <div v-else-if="loading">Recherche...</div>
    <div v-else>
      <div v-for="video of data" :key="`${video.channelId}-${video.id}`">
        <div
          :url="video.thumbnails.default.url"
          class="h-24 w-32 bg-no-repeat bg-center"
          :style="`background-image: url('${video.thumbnails.default.url}')`"
          @click="toggleVideo(video)"
        />
        {{ video.title }} {{  video.player.state.playerState ? 'PLAYING' : '' }}
        <div :id="video.videoId" class="hidden" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from '@/stores/global';
import { nextTick, ref } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import Player from '@/classes/player';

const globalStore = useGlobalStore();
const search = ref('');
const error = ref('');
const loading = ref(false);
const data = ref([] as any[]);

const startSearch = useDebounceFn(async () => {
  destroyPlayers();
  loading.value = true;
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&key=${globalStore.userSession?.idClient}&q=${search.value}`
    );
    data.value = (await res.json()).items.map((i) => {
      return { ...i.snippet, ...i.id };
    });
    nextTick(initPlayers);
  } catch (err: any) {
    console.error(err);
    error.value = err;
  } finally {
    loading.value = false;
  }
}, 1000);

function destroyPlayers() {
  data.value.forEach((video) => {
    video.player?.destroy();
  });
}

function initPlayers() {
  data.value.forEach((video) => {
    video.player?.destroy();
    video.player = new Player(video.videoId, video.videoId);
  });
}

function toggleVideo(video) {
  if (video.player.state.playerState) {
    video.player?.pause();
  } else {
    video.player?.play();
  }
}
</script>
