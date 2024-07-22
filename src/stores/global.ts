import { SupabaseClient } from '@supabase/supabase-js';
import { defineStore } from 'pinia';
import { createClient } from '@supabase/supabase-js';

// eslint-disable-next-line import/prefer-default-export
export const useGlobalStore = defineStore('global', {
  state: () => ({
    supabaseClient: null as SupabaseClient | null, 
    userSession: null as any
  }),
  actions: {
    async createDatabaseClient() {
      if (!this.supabaseClient) {
        try {
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
          const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
          this.supabaseClient = createClient(supabaseUrl, supabaseKey);
        } catch(err) {
          console.error(err);
        }
      }
    },
    async refreshSession() {
      try {
        if (!this.supabaseClient) this.createDatabaseClient();
        const sessionInfos = await this.supabaseClient?.auth.getSession();
        this.userSession = sessionInfos?.data.session;
      } catch(err) {
        console.error(err);
      }
    },
    async login(email: string, password: string) {
      try {
        await this.refreshSession();
        if (this.userSession) return this.userSession;
        await this.supabaseClient?.auth.signInWithPassword({ email, password });
        await this.refreshSession();
        return this.userSession;
      } catch(err) {
        console.error(err);
      }
    }
  }
});
