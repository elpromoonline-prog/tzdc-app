# TZDC — Método Rodrigo Lima
## Guia de instalação para o desenvolvedor

---

## Estrutura do projeto

```
tzdc-app/
├── index.html          ← App principal (todas as telas)
├── css/
│   └── style.css       ← Estilos completos
├── js/
│   ├── data.js         ← Dados, perguntas, perfis, cenários
│   └── app.js          ← Lógica principal e integração com IA
└── pages/
    ├── termos.html     ← Termos de Uso (criar com o conteúdo do .docx)
    └── privacidade.html← Política de Privacidade (criar com o conteúdo do .docx)
```

---

## Como hospedar (Vercel — recomendado)

1. Crie uma conta em vercel.com
2. Instale o CLI: `npm install -g vercel`
3. Na pasta do projeto, rode: `vercel`
4. Pronto — o app estará no ar com HTTPS gratuito

Alternativa gratuita: **Netlify** (arrastar a pasta no netlify.com/drop)

---

## Configuração da API da Anthropic (OBRIGATÓRIO)

### ⚠️ NUNCA exponha sua chave de API no frontend em produção

O arquivo `js/data.js` contém `API_CONFIG` com o endpoint da Anthropic.
Em produção, você DEVE criar um backend intermediário.

### Opção recomendada: Vercel Functions

Crie o arquivo `api/chat.js` na raiz do projeto:

```javascript
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify(req.body)
  });

  const data = await response.json();
  res.status(200).json(data);
}
```

Depois, em `js/data.js`, altere:
```javascript
endpoint: "/api/chat"  // aponta para sua Vercel Function
```

Configure a variável de ambiente no painel da Vercel:
- Nome: `ANTHROPIC_API_KEY`
- Valor: sua chave da API (começa com `sk-ant-...`)

---

## Integração com plataforma de pagamento

### Fluxo recomendado

1. O usuário escolhe o plano na tela de planos
2. Clica em um botão que redireciona para o link de checkout (Hotmart/Kiwify)
3. Após o pagamento, a plataforma redireciona para uma URL de sucesso
4. Na URL de sucesso, o usuário é liberado para o app

### No arquivo `js/app.js`, função `iniciarJornada()`:

Substitua ou adicione após a navegação:
```javascript
// Redirecionar para checkout antes de mostrar o questionário
const links = {
  'Origem':   'https://seu-link-hotmart-origem',
  'Método':   'https://seu-link-hotmart-metodo',
  'Maestria': 'https://seu-link-hotmart-maestria'
};
// window.open(links[plano], '_blank'); // abre checkout em nova aba
```

---

## Domínio personalizado

Após hospedar na Vercel:
1. Acesse o painel do projeto → Settings → Domains
2. Adicione seu domínio (ex: app.tzdc.com.br)
3. Configure o DNS conforme instruções da Vercel

---

## Páginas legais

Crie os arquivos `pages/termos.html` e `pages/privacidade.html`
com o conteúdo dos documentos Word fornecidos (TZDC_Termos_de_Uso.docx
e TZDC_Politica_de_Privacidade.docx).

---

## Suporte técnico

Este projeto usa apenas HTML, CSS e JavaScript puro — sem frameworks.
Qualquer desenvolvedor frontend com 1-2 horas de trabalho consegue
colocar no ar e integrar os pagamentos.

Desenvolvido por: Claude (Anthropic) para EEL Promocoes de Vendas LTDA
Método: Rodrigo Lima — TZDC
