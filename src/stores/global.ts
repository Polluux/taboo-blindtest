import { AuthTokenResponse, SignInWithIdTokenCredentials, SignInWithPasswordCredentials, SupabaseClient } from '@supabase/supabase-js';
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
          return { data: this.supabaseClient, error: null };
        } catch(err) {
          console.error(err);
          return { data: null, error: err };
        }
      }
    },
    async refreshSession() {
      try {
        if (!this.supabaseClient) this.createDatabaseClient();
        const sessionInfos = await this.supabaseClient?.auth.getSession();
        this.userSession = sessionInfos?.data.session;
        if (this.userSession) {
          const profileInfos = await this.supabaseClient?.from('profiles').select();
          this.userSession.isAdmin = profileInfos?.data[0]?.is_admin || false;
        }
        return this.userSession;
      } catch(err) {
        console.error(err);
          return { data: null, error: err };
      }
    },
    async login(params: {
      auth?: SignInWithPasswordCredentials,
      provider?: SignInWithIdTokenCredentials
    }) {
      try {
        await this.refreshSession();
        if (this.userSession) return this.userSession;
        let res: undefined | AuthTokenResponse;
        if (params.auth) {
          res = await this.supabaseClient?.auth.signInWithPassword(params.auth);
        } else if (params.provider) {
          res = await this.supabaseClient?.auth.signInWithIdToken(params.provider)
        }
        console.log(res);
        if (res?.error) throw res?.error;
        await this.refreshSession();
        return { data: this.userSession, error: null };
      } catch(err) {
        console.error(err);
        return { data: null, error: err };
      }
    },
    async logout() {
      try {
        if (this.userSession && this.supabaseClient) {
          await this.supabaseClient.auth.signOut();
          this.userSession = null;
        }
        return { data: true, error: null };
      } catch(err) {
        console.error(err);
          return { data: null, error: err };
      }
    }
  }
});
