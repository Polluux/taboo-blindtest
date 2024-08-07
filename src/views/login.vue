<template>
  <div class="flex h-full flex-col items-center justify-center gap-5">
    <form
      class="flex flex-col gap-2"
      @submit.prevent="login()"
    >
      <input
        v-model="email"
        placeholder="email"
        type="email"
      />
      <input
        v-model="password"
        placeholder="password"
        type="password"
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

    <div id="gSignInButton" />
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import { useGlobalStore } from '@/stores/global';
import router from '@/router';

const globalStore = useGlobalStore();

const email = ref('');
const password = ref('');
const error = ref('');

onMounted(() => {
  nextTick(() => {
    if (typeof google !== 'undefined') {
      initSignIn();
    }
  });
});

async function login() {
  error.value = '';
  const res = await globalStore.login({ auth: { email: email.value, password: password.value } });
  if (res.data) {
    router.replace({ name: 'home' }).catch(() => {
      /* logout */
    });
  } else {
    error.value = res.error;
  }
}

async function handleSignInWithGoogle(response) {
  error.value = '';
  const res = await globalStore.login({ provider: { provider: 'google', token: response.credential } });
  if (res.data) {
    router.replace({ name: 'home' }).catch(() => {
      /* logout */
    });
  } else {
    error.value = res.error;
  }
}

function initSignIn() {
  google.accounts.id.initialize({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    callback: handleSignInWithGoogle
  });

  google.accounts.id.renderButton(document.getElementById('gSignInButton'), {
    type: 'standard',
    text: 'sign_in_with',
    theme: 'outline',
    size: 'large',
    width: '400'
  });
  google.accounts.id.prompt();
};
</script>
