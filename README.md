# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/54a3469a-5082-4b53-82a4-b0a097c9012e

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/54a3469a-5082-4b53-82a4-b0a097c9012e) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Karaíba Templates

Você pode reutilizar o layout, o kanban estático e a tela de login como um template base para novos projetos Karaíba.

Arquivos:

- `src/template/Layout.tsx`: cabeçalho e container padrão.
- `src/template/Kanban.tsx`: kanban estático com colunas e estilos.
- `src/template/Login.tsx`: tela de login estática com UI shadcn.

Como copiar os templates para outro projeto:

```sh
npm run scaffold:karaiba -- /caminho/para/outro/projeto
```

Como usar no código:

```tsx
import KaraibaLayout from '@/template/Layout'
import KaraibaKanban from '@/template/Kanban'
import KaraibaLogin from '@/template/Login'

export default function App() {
  return (
    <KaraibaLayout title="Painel de Pedidos" subtitle="Bem-vindo">
      <KaraibaKanban />
    </KaraibaLayout>
  )
}
```

## Página de Feedback (mobile-first)

- Rota: `/id-feedback/:idFeedback/:numeroPedido`
- Layout: tema vermelho (mobile-first), campo de texto, seleção de nota (1 a 5) e botão enviar.
- Envio: via webhook configurado na variável `VITE_FEEDBACK_WEBHOOK_URL`.

### Variáveis de ambiente

Crie um arquivo `.env` na raiz com:

```
VITE_FEEDBACK_WEBHOOK_URL=https://seu-webhook-aqui
```

O webhook receberá JSON no formato:

```json
{
  "feedbackId": "<idFeedback>",
  "orderNumber": "<numeroPedido>",
  "rating": 1,
  "message": "texto do feedback"
}
```

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/54a3469a-5082-4b53-82a4-b0a097c9012e) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
