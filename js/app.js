async function chamarAPI(messages) {
  try {
    const res = await fetch(API_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'SUA_CHAVE_AQUI',
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: API_CONFIG.model,
        max_tokens: API_CONFIG.max_tokens,
        messages
      })
    });
    const data = await res.json();
    return data.content?.map(i => i.text || '').join('').trim() || 'Não consegui processar. Tente novamente.';
  } catch (e) {
    return 'Conexão instável. Verifique sua internet e tente novamente.';
  }
}
