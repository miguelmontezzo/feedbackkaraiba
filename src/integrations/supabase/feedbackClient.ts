import { createClient } from '@supabase/supabase-js';

// Usa ENV se disponível, caso contrário utiliza as credenciais fornecidas
// Fixar credenciais para evitar 401 causados por env incorretas durante o desenvolvimento
export const FEEDBACK_SUPABASE_URL = 'https://fikhhcdxsutcdtvqbqkm.supabase.co';
export const FEEDBACK_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpa2hoY2R4c3V0Y2R0dnFicWttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NTgzODIsImV4cCI6MjA2ODQzNDM4Mn0.q-EUHCawjpRrKS0oVhnEcEcNYIqAg-jSxktpv3ckek0';

export const supabaseFeedback = createClient(
  FEEDBACK_SUPABASE_URL,
  FEEDBACK_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    db: { schema: 'public' },
    global: {
      headers: {
        apikey: FEEDBACK_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${FEEDBACK_SUPABASE_ANON_KEY}`,
      },
    },
  }
);

export type LogFeedback = {
  id?: string | number;
  id_feedback?: string | number;
  numero_pedido?: string | number;
  pedido_numero?: string | number;
  numeroPedido?: string | number;
  [key: string]: any;
};

