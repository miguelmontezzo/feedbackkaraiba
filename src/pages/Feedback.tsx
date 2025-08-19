import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabaseFeedback, type LogFeedback, FEEDBACK_SUPABASE_URL, FEEDBACK_SUPABASE_ANON_KEY } from "@/integrations/supabase/feedbackClient";

type RouteParams = {
  idFeedback?: string;
  numeroPedido?: string;
};

const MAX_LENGTH = 500;

export default function FeedbackPage() {
  const { idFeedback, numeroPedido } = useParams<RouteParams>();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loadingSheet, setLoadingSheet] = useState(true);
  const [sheetRecord, setSheetRecord] = useState<LogFeedback | null>(null);

  const webhookUrl = useMemo(() => {
    return import.meta.env.VITE_FEEDBACK_WEBHOOK_URL as string | undefined;
  }, []);

  const isDisabled = useMemo(() => {
    return (
      !idFeedback || !rating || message.trim().length === 0 || isSubmitting
    );
  }, [idFeedback, rating, message, isSubmitting]);

  useEffect(() => {
    let ignore = false;
    async function fetchFromSheet() {
      if (!idFeedback) return;
      setLoadingSheet(true);
      setError(null);
      try {
        // Buscar por ID (e, se houver, conferir numero_pedido)
        let query = supabaseFeedback
          .from('log_feedback')
          .select('*')
          .eq('id', idFeedback);
        if (numeroPedido) {
          query = query.eq('numero_pedido', numeroPedido);
        }
        const { data, error } = await query.limit(1).maybeSingle();
        if (error) throw error;
        if (!ignore) setSheetRecord(data || null);
        if (!data) navigate('/', { replace: true });
      } catch (e: any) {
        // Fallback direto via REST com headers, para contornar 401 em libs
        try {
          const url = `${FEEDBACK_SUPABASE_URL}/rest/v1/log_feedback?select=*&id=eq.${idFeedback}${numeroPedido ? `&numero_pedido=eq.${numeroPedido}` : ''}&limit=1`;
          const resp = await fetch(url, {
            headers: {
              apikey: FEEDBACK_SUPABASE_ANON_KEY,
              Authorization: `Bearer ${FEEDBACK_SUPABASE_ANON_KEY}`,
            },
          });
          if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
          const rows = await resp.json();
          const found = (rows && rows.length > 0) ? rows[0] : null;
          if (!ignore) setSheetRecord(found);
          if (!found) navigate('/', { replace: true });
        } catch {
          if (!ignore) setError("Não foi possível carregar dados do feedback.");
        }
      } finally {
        if (!ignore) setLoadingSheet(false);
      }
    }
    fetchFromSheet();
    return () => { ignore = true };
  }, [idFeedback, numeroPedido]);

  const displayName = useMemo(() => {
    if (!sheetRecord) return null;
    return (sheetRecord as any).nome_cliente || null;
  }, [sheetRecord]);

  async function handleSubmit() {
    setError(null);
    setSuccess(null);
    if (!webhookUrl) {
      setError("Configuração ausente: defina VITE_FEEDBACK_WEBHOOK_URL no ambiente.");
      return;
    }
    if (!idFeedback || !numeroPedido) {
      setError("Link inválido. Verifique o endereço enviado.");
      return;
    }
    if (!rating) {
      setError("Selecione uma nota de 1 a 5.");
      return;
    }
    setIsSubmitting(true);
    try {
      const resp = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedbackId: idFeedback,
          orderNumber: numeroPedido,
          rating,
          message: message.trim(),
        }),
      });
      if (!resp.ok) {
        throw new Error(`Falha ao enviar (HTTP ${resp.status})`);
      }
      setSuccess("Feedback enviado com sucesso. Obrigado!");
      setMessage("");
      setRating(null);
    } catch (e: any) {
      setError(e?.message || "Erro ao enviar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-red-900 text-white flex flex-col">
      <header className="pt-2" />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <img
              src={encodeURI("/Karaiba branco t- Oclo.png")}
              alt="Karaíba"
              className="mx-auto h-32 w-auto mb-3"
              loading="eager"
            />
            <h1 className="text-3xl font-bold leading-tight">
              Olá{displayName ? ", " : ""}{displayName ? String(displayName) : "cliente"}!
            </h1>
            <p className="text-red-100 text-sm mt-1">
              Pedido #{numeroPedido || (sheetRecord as any)?.numero_pedido || "-"}
            </p>
          </div>

          <div className="space-y-4 bg-red-800/60 rounded-lg p-4 shadow-sm">
          <div className="space-y-2">
            <Label htmlFor="message" className="text-white">Como foi sua experiência?</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, MAX_LENGTH))}
              placeholder="Escreva aqui seu comentário (elogio, sugestão ou problema)..."
              className="min-h-[140px] bg-white text-red-900 placeholder:text-red-500 focus-visible:ring-red-500"
            />
            <div className="flex justify-end text-xs text-red-100">
              {message.length}/{MAX_LENGTH}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Sua nota</Label>
            <div className="flex items-center gap-3" role="radiogroup" aria-label="Escolha sua nota">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  aria-label={`Nota ${star}`}
                  onClick={() => setRating(star)}
                  className={
                    "w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold transition-colors " +
                    (rating && rating >= star
                      ? "bg-red-500 text-white"
                      : "bg-red-950/40 text-red-200 hover:bg-red-900")
                  }
                >
                  {star}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-200 bg-red-950/40 rounded px-3 py-2">{error}</div>
          )}
          {success && (
            <div className="text-sm text-green-200 bg-green-950/20 rounded px-3 py-2">{success}</div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={isDisabled}
            className="w-full h-12 text-base bg-red-600 hover:bg-red-700 disabled:opacity-50"
          >
            {isSubmitting ? "Enviando..." : "Enviar"}
          </Button>
        </div>
        </div>
      </main>
      <footer className="pb-6 flex items-center justify-center gap-2 opacity-90">
        <span className="text-xs text-red-100/90">Desenvolvido por:</span>
        <img
          src={encodeURI("/alliacinzaass@2x.png")}
          alt="Allia"
          className="h-4 w-auto"
          loading="lazy"
        />
      </footer>
    </div>
  );
}

