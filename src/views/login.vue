<template>
  <form
    @submit.prevent="login()"
    class="flex h-full flex-col items-center justify-center gap-2"
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
    <div
      v-if="error"
      class="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
      role="alert"
    >
      {{ error }}
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useGlobalStore } from '@/stores/global';
import router from '@/router';

const globalStore = useGlobalStore();

const mail = ref('');
const password = ref('');
const error = ref('');

async function login() {
  error.value = '';
  const res = await globalStore.login(mail.value, password.value);
  if (res.data) {
    router.replace({ name: 'home' }).catch(() => {
      /* logout */
    });
  } else {
    error.value = res.error;
  }
}
</script>
