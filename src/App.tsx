import KaraibaLayout from "@/template/Layout";
import KaraibaKanban from "@/template/Kanban";

const App = () => (
  <KaraibaLayout title="Painel de Pedidos" subtitle="Bem-vindo">
    <KaraibaKanban />
  </KaraibaLayout>
);

export default App;
