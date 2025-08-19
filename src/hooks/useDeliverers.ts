import { useEffect, useState, useCallback } from "react";
import { deliverersSupabase } from "@/integrations/supabase/deliverersClient";

export interface Deliverer {
  id: string | number;
  nome: string;
  usuario?: string | null;
}

export const useDeliverers = () => {
  const [deliverers, setDeliverers] = useState<Deliverer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDeliverers = useCallback(async () => {
    if (!deliverersSupabase) {
      setError("Configuração do Supabase dos entregadores ausente (defina VITE_DELIVERERS_SUPABASE_URL e VITE_DELIVERERS_SUPABASE_ANON_KEY)");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const tableCandidates = ["entregadores", "Entregadores", "public.entregadores"];
      let lastErr: any = null;
      let found: Deliverer[] | null = null;
      for (const tableName of tableCandidates) {
        const { data, error } = await deliverersSupabase
          .from(tableName as any)
          .select("id, nome, usuario")
          .order("nome", { ascending: true })
          .limit(1000);
        if (error) {
          lastErr = error;
          console.error("Erro carregando entregadores da tabela", tableName, error);
          continue;
        }
        const mapped = (data || []).map((d: any) => ({ id: d.id, nome: String(d.nome || ""), usuario: d.usuario ?? null }))
          .filter((d: Deliverer) => d.nome);
        if (mapped.length > 0) {
          found = mapped;
          break;
        }
      }
      if (found) {
        setDeliverers(found);
      } else {
        if (lastErr) {
          setError("Erro ao carregar entregadores. Verifique permissões RLS e o nome da tabela.");
        } else {
          setError("Nenhum entregador encontrado. Verifique o projeto/tabela e permissões.");
        }
        setDeliverers([]);
      }
    } catch (err: any) {
      setError(err.message || "Erro ao carregar entregadores");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeliverers();
  }, [fetchDeliverers]);

  return { deliverers, loading, error, reload: fetchDeliverers };
};

