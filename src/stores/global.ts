import { defineStore } from 'pinia';

// eslint-disable-next-line import/prefer-default-export
export const useGlobalStore = defineStore('global', {
  state: () => ({
    counter: 0
  }),
  actions: {}
});
