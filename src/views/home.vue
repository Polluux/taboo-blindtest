<template>
  <div class="flex h-full flex-col items-center justify-center gap-2">
    <div
      v-if="globalStore.userSession"
      class="flex items-center gap-2"
    >
      <div>Logged as : {{ globalStore.userSession.user.email }} {{ globalStore.userSession.isAdmin ? '[Administrator]' : '' }}</div>
      <button
        class="btn"
        type="button"
        @click="globalStore.logout"
      >
        Logout
      </button>
    </div>

    <div
      v-else
      class="flex items-center gap-2"
    >
      <div>User not logged</div>

      <router-link
        aria-label="back"
        class="btn"
        :to="{ name: 'login' }"
        type="button"
      >
        <span>login</span>
      </router-link>
    </div>

    <table>
      <thead>
        <tr>
          <th class="border p-4">id</th>
          <th class="border p-4">reference</th>
          <th class="border p-4">title</th>
          <th class="border p-4">artist</th>
          <th class="border p-4">words</th>
          <th v-if="globalStore.userSession?.isAdmin" class="border p-4" />
        </tr>
      </thead>
      <tbody>
        <tr v-for="music of musics">
          <td class="border p-4">{{ music.id }}</td>
          <td class="border p-4">{{ music.reference }}</td>
          <td class="border p-4">{{ music.title }}</td>
          <td class="border p-4">{{ music.artist }}</td>
          <td class="border p-4">{{ music.words }}</td>
          <td v-if="globalStore.userSession?.isAdmin" class="border p-4"><button class="btn" @click="removeItem(music)">Remove</button></td>
        </tr>
      </tbody>
    </table>

    <form v-if="globalStore.userSession?.isAdmin" @submit.prevent="addItem" class="flex gap-2">
      <input type="text" placeholder="reference" v-model="lineForm.reference" />
      <input type="text" placeholder="title" v-model="lineForm.title" />
      <input type="text" placeholder="artist" v-model="lineForm.artist" />
      <input type="text" placeholder="words, words" v-model="lineForm.words" />
      <button type="submit" class="btn">Add</button>
    </form>

    <div
      v-if="error"
      class="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
      role="alert"
    >
      {{ error }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useGlobalStore } from '@/stores/global';
import { onMounted, ref } from 'vue';

const globalStore = useGlobalStore();
const musics = ref([] as any[]); // TODO: typage
const error = ref('');
const lineForm = ref({
  reference: '',
  title: '',
  artist: '',
  words: ''
});

onMounted(async () => {
  refresh();
});

async function refresh() {
  error.value = '';
  try {
    const { data } = await globalStore.supabaseClient?.from('musics').select();
    musics.value = data ?? [];
  } catch (err) {
    console.error(err);
    error.value = err;
  }
}

async function removeItem(music: typeof musics.value[number]) {
  error.value = '';
  try {
    const res = await globalStore.supabaseClient?.from('musics').delete().eq('id', music.id);
    if (res?.error) throw res?.error;
    refresh();
  } catch (err) {
    console.error(err);
    error.value = err;
  }
}

async function addItem() {
  if (lineForm.value.reference && lineForm.value.title && lineForm.value.artist && lineForm.value.words) {
    error.value = '';
    try {
      const res = await globalStore.supabaseClient?.from('musics').insert({ ...lineForm.value, words: lineForm.value.words.split(', ') });
      if (res?.error) throw res?.error;
      refresh();
      lineForm.value = {
        reference: '',
        title: '',
        artist: '',
        words: ''
      };
    } catch (err) {
      console.error(err);
      error.value = err;
    }
  }
}
</script>
