import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import karaibaLogo from "@/assets/karaiba-logo-original.png";

const KaraibaLoginScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <img src={karaibaLogo} alt="Karaíba Logo" className="h-20 w-auto" />
          </div>
          <h1 className="text-2xl font-bold text-primary">Painel Administrativo</h1>
          <p className="text-muted-foreground">Faça login para acessar o sistema</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <Label htmlFor="email">Usuário</Label>
              <Input id="email" type="text" placeholder="Digite seu usuário" required className="rounded-md" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" placeholder="Digite sua senha" required className="rounded-md" />
            </div>
            <Button type="submit" className="w-full rounded-md">Entrar</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default KaraibaLoginScreen;
