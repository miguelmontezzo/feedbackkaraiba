import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDeliverers } from "@/hooks/useDeliverers";
import { Input } from "@/components/ui/input";

interface SelectDelivererModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (entregador: string) => void;
}

const SelectDelivererModal = ({ open, onClose, onConfirm }: SelectDelivererModalProps) => {
  const { deliverers, loading, error, reload } = useDeliverers();
  const [selected, setSelected] = useState<string>("");
  const [typed, setTyped] = useState<string>("");

  const confirm = () => {
    const value = selected || typed;
    if (value) onConfirm(value);
  };

  useEffect(() => {
    if (open) {
      reload();
      setSelected("");
      setTyped("");
    }
  }, [open, reload]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="w-[90vw] max-w-md">
        <DialogHeader>
          <DialogTitle>Escolher entregador</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {deliverers.length > 0 && !error ? (
            <Select value={selected} onValueChange={setSelected}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={loading ? "Carregando..." : "Selecione o entregador"} />
              </SelectTrigger>
              <SelectContent className="max-h-64 overflow-auto min-w-[12rem]">
                {deliverers.map((d) => (
                  <SelectItem key={d.id} value={d.nome}>{d.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="space-y-2">
              <Input
                placeholder={loading ? "Carregando..." : "Digite o nome do entregador"}
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
              />
              {error && <p className="text-xs text-destructive break-words">{error}</p>}
              {!error && !deliverers.length && !loading && (
                <p className="text-xs text-muted-foreground">Nenhum entregador carregado. Você pode digitar o nome manualmente.</p>
              )}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={confirm} disabled={!(selected || typed) || loading}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SelectDelivererModal;

