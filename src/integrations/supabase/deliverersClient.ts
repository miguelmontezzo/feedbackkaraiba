import { createClient } from '@supabase/supabase-js';

// Segundo projeto (entregadores): fikhhcdxsutcdtvqbqkm
// Configure via variáveis de ambiente Vite para segurança.
const DELIVERERS_SUPABASE_URL = import.meta.env.VITE_DELIVERERS_SUPABASE_URL as string | undefined;
const DELIVERERS_SUPABASE_ANON_KEY = import.meta.env.VITE_DELIVERERS_SUPABASE_ANON_KEY as string | undefined;

export const deliverersSupabase = DELIVERERS_SUPABASE_URL && DELIVERERS_SUPABASE_ANON_KEY
  ? createClient(DELIVERERS_SUPABASE_URL, DELIVERERS_SUPABASE_ANON_KEY, {
      auth: {
        storage: localStorage,
        storageKey: 'deliverers-supabase-auth',
        persistSession: false,
        autoRefreshToken: false,
      }
    })
  : null;

