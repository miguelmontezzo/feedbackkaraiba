import karaibaWhiteLogo from "@/assets/karaiba-logo-white.png";
import { ReactNode } from "react";

interface KaraibaLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

const KaraibaLayout = ({ children, title = "Painel de Pedidos", subtitle = "Bem-vindo" }: KaraibaLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <header className="shadow-md bg-red-700">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between bg-red-700">
          <div className="flex items-center space-x-4">
            <img src={karaibaWhiteLogo} alt="Karaíba" className="h-8 w-auto" />
            <div>
              <h1 className="text-lg font-bold text-primary-foreground">{title}</h1>
              <p className="text-xs text-primary-foreground/80">{subtitle}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default KaraibaLayout;
