import { BrowserRouter, Route, Routes } from "react-router-dom";
import KaraibaLayout from "@/template/Layout";
import KaraibaKanban from "@/template/Kanban";
import FeedbackPage from "@/pages/Feedback";
import Landing from "@/pages/Landing";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing />} />

      {/* Rotas de feedback */}
      <Route path="/id-feedback/:idFeedback/:numeroPedido" element={<FeedbackPage />} />
      <Route path="/id-feedback/:idFeedback" element={<FeedbackPage />} />
      {/* Alias curto */}
      <Route path="/feedback/:idFeedback/:numeroPedido" element={<FeedbackPage />} />
      <Route path="/feedback/:idFeedback" element={<FeedbackPage />} />

      {/* SPA fallback: landing vermelha */}
      <Route path="*" element={<Landing />} />
    </Routes>
  </BrowserRouter>
);

export default App;
