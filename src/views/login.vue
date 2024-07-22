<template>
  <form
    @submit.prevent="login()"
    class="flex flex-col items-center h-full justify-center gap-2"
  >
    <input
      type="mail"
      placeholder="email"
      v-model="mail"
    />
    <input
      type="password"
      placeholder="password"
      v-model="password"
    />
    <button>Submit</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useGlobalStore } from '@/stores/global';
import router from '@/router';

const globalStore = useGlobalStore();

const mail = ref('');
const password = ref('');

async function login() {
  const userData = await globalStore.login(mail.value, password.value);
  if (userData) {
    router.replace({ name: 'home' }).catch(() => {/* logout */});
  } else {
    // TODO: error
  }
}
</script>
