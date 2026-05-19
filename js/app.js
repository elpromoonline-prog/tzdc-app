async function chamarAPI(messages) {
  try {
    const res = await fetch(API_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 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,
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
