-- Adiciona colunas necessárias para validação de retirada/entrega
-- Execute esta migração no seu projeto Supabase (SQL Editor) se ainda não existirem

ALTER TABLE public.pedidos_karaiba
  ADD COLUMN IF NOT EXISTS codigo_entrega text,
  ADD COLUMN IF NOT EXISTS entregador text,
  ADD COLUMN IF NOT EXISTS entregador_usuario text,
  ADD COLUMN IF NOT EXISTS codigo_validado_em timestamptz;

-- Habilita realtime completo, caso ainda não esteja
ALTER TABLE public.pedidos_karaiba REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pedidos_karaiba;

