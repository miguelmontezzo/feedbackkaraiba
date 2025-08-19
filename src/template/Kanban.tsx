const KaraibaKanban = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
      <div className="bg-card rounded-lg shadow-sm border">
        <div className="text-status-pending-foreground p-3 rounded-t-lg bg-neutral-300">
          <h2 className="font-semibold text-sm">Pendente (0)</h2>
        </div>
        <div className="p-2 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
          <p className="text-center text-muted-foreground py-8 text-sm">Nenhum pedido pendente</p>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-sm border">
        <div className="text-white p-3 rounded-t-lg bg-yellow-700">
          <h2 className="font-semibold text-sm">Confirmado (0)</h2>
        </div>
        <div className="p-2 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
          <p className="text-center text-muted-foreground py-8 text-sm">Nenhum pedido confirmado</p>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-sm border">
        <div className="bg-status-delivery text-status-delivery-foreground p-3 rounded-t-lg">
          <h2 className="font-semibold text-sm">Pronto para Entrega/Retirada (0)</h2>
        </div>
        <div className="p-2 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
          <p className="text-center text-muted-foreground py-8 text-sm">Nenhum pedido pronto para entrega/retirada hoje</p>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-sm border">
        <div className="bg-emerald-600 text-white p-3 rounded-t-lg">
          <h2 className="font-semibold text-sm">Entregue/Retirado - Hoje (0)</h2>
        </div>
        <div className="p-2 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
          <p className="text-center text-muted-foreground py-8 text-sm">Nenhum pedido entregue hoje</p>
        </div>
      </div>
    </div>
  );
};

export default KaraibaKanban;
