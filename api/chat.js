// api/chat.js — Vercel Serverless Function
// Intermediador seguro entre o app TZDC e a API da Anthropic
// A chave de API fica apenas no servidor — nunca exposta no navegador

export default async function handler(req, res) {

  // Apenas POST é permitido
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // Verifica se a chave está configurada
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'Chave de API não configurada' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':       'application/json',
        'x-api-key':          process.env.ANTHROPIC_API_KEY,
        'anthropic-version':  '2023-06-01'
      },
      body: JSON.stringify({
        model:      req.body.model      || 'claude-sonnet-4-20250514',
        max_tokens: req.body.max_tokens || 1000,
        messages:   req.body.messages
      })
    });

    const data = await response.json();

    // Repassa a resposta da Anthropic para o frontend
    return res.status(response.status).json(data);

  } catch (error) {
    console.error('Erro ao chamar API Anthropic:', error);
    return res.status(500).json({ error: 'Erro interno. Tente novamente.' });
  }
}
