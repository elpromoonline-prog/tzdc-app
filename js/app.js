// ─── APP TZDC v4 — LÓGICA PRINCIPAL ───────────────────────────────────────

const state = {
  perfilAtual: null,
  respostas: [],
  qAtual: 0,
  plano: null,
  limiteMax: 30,
  sessoesUsadas: 0,
  chat: { historico: [], turno: 0, persona: null }
};

// ── Navegação ──────────────────────────────────────────────────────────────
function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
  if (id === 's-home') renderUso();
  if (id === 's-cenarios') atualizarCenarios();
}

// ── Aviso ──────────────────────────────────────────────────────────────────
function toggleAviso(checkbox) {
  const visual = document.getElementById('chk-visual');
  const btn    = document.getElementById('btn-continuar');
  visual.classList.toggle('on', checkbox.checked);
  btn.disabled = !checkbox.checked;
}

// ── Planos ─────────────────────────────────────────────────────────────────
function iniciarJornada(plano, limite) {
  state.plano     = plano;
  state.limiteMax = limite;
  state.respostas = [];
  state.qAtual    = 0;
  renderPergunta();
  show('s-questionario');
}

// ── Questionário ───────────────────────────────────────────────────────────
function renderPergunta() {
  const p = PERGUNTAS[state.qAtual];
  const ls = ['A', 'B', 'C', 'D'];
  const prog = PERGUNTAS.map((_, i) =>
    `<div class="qp ${i < state.qAtual ? 'done' : i === state.qAtual ? 'cur' : ''}"></div>`
  ).join('');
  const opts = p.opts.map((o, i) =>
    `<button class="q-opt" onclick="responder(${i})">
      <div class="q-ltr">${ls[i]}</div><span>${o}</span>
    </button>`
  ).join('');
  document.getElementById('questionario-body').innerHTML = `
    <div class="q-prog">${prog}</div>
    <div class="q-counter">Pergunta ${state.qAtual + 1} de ${PERGUNTAS.length}</div>
    <div class="q-text">${p.q}</div>
    <div class="q-ctx">${p.ctx}</div>
    <div class="q-opts">${opts}</div>`;
}

function responder(i) {
  state.respostas.push(i);
  state.qAtual++;
  if (state.qAtual >= PERGUNTAS.length) mostrarLoading();
  else { renderPergunta(); window.scrollTo(0, 0); }
}

// ── Loading + Resultado ────────────────────────────────────────────────────
function mostrarLoading() {
  const score = state.respostas.reduce((a, b) => a + b, 0);
  state.perfilAtual = score <= 8 ? PERFIS[0] : score <= 16 ? PERFIS[1] : PERFIS[2];
  const p = state.perfilAtual;
  const ini = p.nome.split(' ').filter(w => w.length > 2).map(w => w[0]).join('').slice(0, 2);
  document.getElementById('resultado-body').innerHTML = `
    <div class="loading-wrap">
      <div class="loading-circle" style="background:${p.cor}">
        <span class="loading-initials" style="color:${p.cortxt}">${ini}</span>
      </div>
      <div class="loading-title">Gerando seu relatório personalizado...</div>
      <div class="loading-sub">Analisando suas respostas com o método TZDC</div>
      <div class="loading-dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
    </div>`;
  show('s-resultado');
  gerarRelatorio(p);
}

async function gerarRelatorio(p) {
  const resumo = PERGUNTAS.map((perg, i) =>
    `- ${perg.q}\n  Resposta escolhida: "${perg.opts[state.respostas[i]]}"`
  ).join('\n');

  const prompt = `Você é o Coach TZDC, criado por Rodrigo Lima — profissional que superou a timidez severa no início da carreira e construiu uma trajetória no alto escalão do relacionamento corporativo brasileiro.

O usuário completou o questionário TZDC Origem e recebeu o perfil: "${p.nome}" (${p.tag}).

Respostas do usuário:
${resumo}

Gere um relatório personalizado em português brasileiro com EXATAMENTE esta estrutura JSON (sem markdown, sem texto fora do JSON):

{
  "abertura": "3-4 frases acolhendo o usuário pelo perfil. Tom: humano, empático. Mencione que pessoas com esse perfil têm potencial enorme quando encontram o método certo.",
  "caracteristica": "4-5 frases explicando como essa timidez se manifesta no dia a dia profissional, o que acontece internamente quando a pessoa trava, e por que é mais comum do que parece. Sem termos médicos ou clínicos.",
  "pontos_atencao": [
    "Ponto 1 específico para as respostas dadas — 2 frases",
    "Ponto 2 específico — 2 frases",
    "Ponto 3 específico — 2 frases",
    "Ponto 4 específico — 2 frases"
  ],
  "dicas": [
    "Dica prática 1 — ação concreta que a pessoa pode fazer esta semana, 2-3 frases",
    "Dica prática 2 — 2-3 frases",
    "Dica prática 3 — 2-3 frases",
    "Dica prática 4 — 2-3 frases",
    "Dica prática 5 — 2-3 frases"
  ],
  "fechamento": "2-3 frases motivadoras e honestas. Reconheça que o caminho tem desconforto, mas que o desconforto é o sinal de que o músculo está sendo treinado. Conecte com a história do criador do método — sem citar nomes de empresas ou marcas."
}`;

  let rel;
  try {
    const raw = await chamarAPI([{ role: 'user', content: prompt }]);
    const clean = raw.replace(/```json|```/g, '').trim();
    rel = JSON.parse(clean);
  } catch (e) {
    rel = {
      abertura: p.desc,
      caracteristica: `Pessoas com o perfil "${p.nome}" costumam sentir o impacto da timidez especialmente em situações de exposição inesperada. Internamente, há um diálogo acelerado de autocrítica que consome energia antes mesmo de começar a falar. O ponto fundamental: esse perfil costuma ter muito a dizer — o bloqueio está no canal, não no conteúdo. E canais se treinam.`,
      pontos_atencao: p.insights.map(i => `${i.t}: ${i.txt}`),
      dicas: [
        "Observe antes de agir: passe uma semana notando como as pessoas ao seu redor iniciam conversas. O que dizem nos primeiros 5 segundos? Esse é o primeiro passo do método TZDC.",
        "Pratique em ambiente seguro: escolha uma pessoa de confiança e proponha uma conversa difícil simulada. O músculo da coragem se treina como qualquer outro.",
        "Use o contexto como abertura: em vez de pensar no que dizer, use o ambiente como gancho. O projeto, o café, a reunião que acabou. O contexto elimina o vazio.",
        "Estabeleça uma meta pequena por dia: falar uma vez sem ser chamado em reuniões, cumprimentar alguém primeiro, fazer uma pergunta. Metas pequenas constroem confiança real.",
        "Registre suas vitórias: ao final do dia, anote uma interação que correu bem. O cérebro tende a lembrar o que travou — forçar o registro do que funcionou recalibra essa tendência."
      ],
      fechamento: "O caminho tem desconforto — e isso é exatamente o sinal de que está funcionando. O criador deste método construiu uma carreira no alto escalão do relacionamento corporativo brasileiro partindo do mesmo ponto que você está agora. O que separa esses dois momentos não é talento. É prática deliberada, um dia de cada vez."
    };
  }

  renderRelatorio(p, rel);
}

function renderRelatorio(p, rel) {
  const pontosHTML = rel.pontos_atencao.map((pt, i) => `
    <div class="rel-item">
      <div class="rel-num" style="background:${p.cor};color:${p.cortxt}">${i + 1}</div>
      <div class="rel-item-txt">${pt}</div>
    </div>`).join('');

  const dicasHTML = rel.dicas.map(d => `
    <div class="rel-item">
      <div class="rel-icon" style="background:${p.cor}">
        <i class="ti ti-check" style="color:${p.cortxt}" aria-hidden="true"></i>
      </div>
      <div class="rel-item-txt">${d}</div>
    </div>`).join('');

  document.getElementById('resultado-body').innerHTML = `
    <div class="perfil-hero" style="background:${p.cor}">
      <div class="perfil-tag" style="color:${p.cortxt}">Seu perfil · ${p.tag}</div>
      <div class="perfil-nome" style="color:${p.cortxt}">${p.nome}</div>
      <div class="perfil-desc" style="color:${p.cortxt}">${rel.abertura}</div>
    </div>
    <div class="rel-section">
      <div class="rel-section-label" style="color:#185FA5">
        <i class="ti ti-brain" aria-hidden="true"></i>Como essa timidez se manifesta em você
      </div>
      <div class="rel-section-body">${rel.caracteristica}</div>
    </div>
    <div class="rel-section">
      <div class="rel-section-label" style="color:#854F0B">
        <i class="ti ti-alert-triangle" aria-hidden="true"></i>Pontos de atenção para o seu perfil
      </div>
      <div class="rel-items">${pontosHTML}</div>
    </div>
    <div class="rel-section">
      <div class="rel-section-label" style="color:#0F6E56">
        <i class="ti ti-bulb" aria-hidden="true"></i>Como enfrentar — 5 dicas práticas
      </div>
      <div class="rel-items">${dicasHTML}</div>
    </div>
    <div class="rel-fechamento">
      <div class="rel-aspas">"</div>
      <div class="rel-fechamento-txt">${rel.fechamento}</div>
      <div class="rel-assinatura">Método TZDC · Rodrigo Lima</div>
    </div>
    <div class="upsell">
      <div class="upsell-title">Quer continuar evoluindo?</div>
      <div class="upsell-sub">O TZDC Método transforma esse diagnóstico em desafios diários e um coach com IA que acompanha sua evolução semana a semana.</div>
      <button class="btn-primary" onclick="entrarNoApp()">Conhecer o TZDC Método — R$39,90/mês</button>
    </div>
    <button class="btn-ghost" onclick="show('s-planos')">Ver todos os planos</button>`;
}

// ── Dashboard ──────────────────────────────────────────────────────────────
function entrarNoApp() {
  if (state.perfilAtual) {
    const ini = state.perfilAtual.nome.split(' ').filter(w => w.length > 2).map(w => w[0]).join('').slice(0, 2);
    document.getElementById('d-avatar').textContent   = ini;
    document.getElementById('d-name').textContent     = 'Bem-vindo de volta!';
    document.getElementById('d-perfil').textContent   = state.perfilAtual.nome + ' · Nível 3';
    document.getElementById('sessao-perfil').innerHTML =
      `<i class="ti ti-brain" aria-hidden="true"></i> ${state.perfilAtual.nome}`;
  }
  renderStreak('streak-row');
  renderCenarios();
  renderConquistas();
  show('s-home');
}

// ── Barra de uso de sessões ────────────────────────────────────────────────
function renderUso() {
  const el = document.getElementById('uso-container');
  if (!el || state.plano === 'Origem') { if (el) el.innerHTML = ''; return; }
  const usadas  = state.sessoesUsadas;
  const max     = state.limiteMax;
  const pct     = Math.min(100, Math.round((usadas / max) * 100));
  const cor     = pct >= 90 ? '#E24B4A' : pct >= 70 ? '#BA7517' : '#0F6E56';
  const restam  = max - usadas;
  el.innerHTML = `
    <div class="uso-card">
      <div class="uso-header">
        <span class="uso-label"><i class="ti ti-message-chatbot" aria-hidden="true"></i>Sessões de coach este mês</span>
        <span class="uso-count" style="color:${cor}">${usadas}/${max}</span>
      </div>
      <div class="uso-bar"><div class="uso-fill" style="width:${pct}%;background:${cor}"></div></div>
      <div class="uso-hint">${restam} sessão${restam !== 1 ? 'ões' : ''} restante${restam !== 1 ? 's' : ''} · renova dia 1º</div>
    </div>`;
}

// ── Cenários (com bloqueio por limite) ────────────────────────────────────
function renderCenarios() {
  const el = document.getElementById('scenario-list');
  if (!el) return;
  el.innerHTML = CENARIOS.map((c, i) => `
    <div class="scenario" id="sc-${i}" onclick="iniciarChat(${i})">
      <div class="sc-icon" style="background:${c.iconBg}">
        <i class="ti ${c.icon}" style="color:${c.iconColor}" aria-hidden="true"></i>
      </div>
      <div>
        <div class="sc-title">${c.nome.split(' ')[0]} — ${c.tagTxt}</div>
        <div class="sc-sub">${c.sub}</div>
        <span class="sc-tag" style="background:${c.tagBg};color:${c.tagColor}">${c.nivel}</span>
      </div>
    </div>`).join('');
}

function atualizarCenarios() {
  const bloqueado = state.sessoesUsadas >= state.limiteMax && state.plano !== 'Origem';
  document.querySelectorAll('.scenario').forEach(s => {
    s.classList.toggle('bloqueado', bloqueado);
  });
  const aviso = document.getElementById('aviso-cenarios');
  if (aviso) aviso.style.display = bloqueado ? 'flex' : 'none';
}

// ── Desafio ────────────────────────────────────────────────────────────────
function completarDesafio() {
  const btn = document.getElementById('btn-desafio');
  btn.textContent = 'Concluído! +50 XP';
  btn.style.background = '#085041';
  btn.disabled = true;
}

// ── Chat com IA ────────────────────────────────────────────────────────────
function iniciarChat(idx) {
  if (state.sessoesUsadas >= state.limiteMax && state.plano !== 'Origem') return;
  const c = CENARIOS[idx];
  state.chat = { historico: [], turno: 0, persona: c };
  state.sessoesUsadas++;

  const av = document.getElementById('p-av');
  av.textContent = c.iniciais; av.style.background = c.bgCor; av.style.color = c.txtCor;
  document.getElementById('p-name').textContent = c.nome;
  document.getElementById('p-role').textContent = c.cargo;
  document.getElementById('p-ctx').textContent  = c.contexto;

  const tag = document.getElementById('chat-tag');
  tag.textContent = c.tagTxt; tag.style.background = c.tagBg; tag.style.color = c.tagColor;

  const pNome = state.perfilAtual ? state.perfilAtual.nome : 'Ansioso Preparado';
  document.getElementById('sessao-perfil').innerHTML =
    `<i class="ti ti-brain" aria-hidden="true"></i> ${pNome}`;
  document.getElementById('sessao-count').textContent =
    `${state.sessoesUsadas}/${state.limiteMax} sessões`;

  const avisoUltima = document.getElementById('aviso-ultima-sessao');
  avisoUltima.style.display = (state.sessoesUsadas === state.limiteMax) ? 'flex' : 'none';

  document.getElementById('chat-msgs').innerHTML = '';
  document.getElementById('fb-bar').style.display = 'none';
  document.getElementById('msg-input').value = '';
  document.getElementById('send-btn').disabled = false;

  show('s-chat');
  setTimeout(() => primeiraFala(), 500);
}

async function primeiraFala() {
  const c    = state.chat.persona;
  const pNome = state.perfilAtual ? state.perfilAtual.nome : 'Ansioso Preparado';
  mostrarTyping();
  const prompt = `Você é ${c.nome}, ${c.cargo}, num simulador de conversas do app TZDC — programa de desenvolvimento pessoal criado por Rodrigo Lima, profissional com carreira construída no alto escalão do relacionamento corporativo brasileiro.

Contexto: ${c.contexto}
Perfil do usuário: ${pNome}

Inicie a conversa de forma natural e humana. Máximo 2 frases curtas. Português brasileiro. Sem asteriscos.`;
  const r = await chamarAPI([{ role: 'user', content: prompt }]);
  removerTyping();
  adicionarBubble('them', r);
  state.chat.historico.push({ role: 'assistant', content: r });
}

async function enviar() {
  const input = document.getElementById('msg-input');
  const txt   = input.value.trim();
  if (!txt || document.getElementById('send-btn').disabled) return;
  input.value = ''; autoResize(input);
  adicionarBubble('me', txt);
  document.getElementById('fb-bar').style.display = 'none';
  state.chat.historico.push({ role: 'user', content: txt });
  state.chat.turno++;
  document.getElementById('send-btn').disabled = true;
  mostrarTyping();

  const c     = state.chat.persona;
  const pNome = state.perfilAtual ? state.perfilAtual.nome : 'Ansioso Preparado';
  const sys   = `Você é ${c.nome}, ${c.cargo}, num simulador do app TZDC. Usuário tem perfil "${pNome}". Contexto: ${c.contexto}. Responda naturalmente. Se o usuário foi vago, pressione gentilmente. Máximo 3 frases. Português. Sem asteriscos.`;
  const msgs  = [{ role: 'user', content: sys }, ...state.chat.historico];
  const r     = await chamarAPI(msgs);

  removerTyping();
  adicionarBubble('them', r);
  state.chat.historico.push({ role: 'assistant', content: r });
  document.getElementById('send-btn').disabled = false;
  if (state.chat.turno >= 2) document.getElementById('fb-bar').style.display = 'flex';
  if (state.chat.turno >= 3) setTimeout(() => coachInsight(), 800);
}

async function coachInsight() {
  mostrarTyping('coach');
  const pNome = state.perfilAtual ? state.perfilAtual.nome : 'Ansioso Preparado';
  const conv  = state.chat.historico.map(m =>
    `${m.role === 'user' ? 'Usuário' : 'Persona'}: ${m.content}`).join('\n');
  const prompt = `Você é o Coach TZDC, baseado no método de Rodrigo Lima — profissional que superou a timidez severa e construiu uma carreira no alto escalão do relacionamento corporativo brasileiro.

Analise esta conversa de simulação:
${conv}

Perfil do usuário: ${pNome}
Contexto: ${state.chat.persona.contexto}

Dê um insight prático em 2 frases. Direto, encorajador, baseado no método TZDC (observar → praticar em ambiente seguro → expandir). Português. Sem asteriscos.`;
  const r = await chamarAPI([{ role: 'user', content: prompt }]);
  removerTyping();
  adicionarBubble('coach', '✦ Coach TZDC: ' + r);
}

async function darFeedback(txt) {
  document.getElementById('fb-bar').style.display = 'none';
  adicionarBubble('me', txt);
  mostrarTyping('coach');
  const pNome = state.perfilAtual ? state.perfilAtual.nome : 'Ansioso Preparado';
  const prompt = `Você é o Coach TZDC. O usuário deu este feedback sobre a simulação: "${txt}". Perfil: ${pNome}. Responda com empatia e uma orientação prática do método TZDC em 2 frases. Português. Sem asteriscos.`;
  const r = await chamarAPI([{ role: 'user', content: prompt }]);
  removerTyping();
  adicionarBubble('coach', '✦ Coach TZDC: ' + r);
  document.getElementById('send-btn').disabled = false;
}

// ── API ────────────────────────────────────────────────────────────────────
async function chamarAPI(messages) {
  try {
    const res  = await fetch(API_CONFIG.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: API_CONFIG.model, max_tokens: API_CONFIG.max_tokens, messages })
    });
    const data = await res.json();
    return data.content?.map(i => i.text || '').join('').trim() || 'Não consegui processar. Tente novamente.';
  } catch (e) {
    console.error('Erro API:', e);
    return 'Conexão instável. Verifique sua internet e tente novamente.';
  }
}

// ── Helpers de chat ────────────────────────────────────────────────────────
function adicionarBubble(tipo, texto) {
  const msgs = document.getElementById('chat-msgs');
  const div  = document.createElement('div');
  div.className = `bubble ${tipo}`; div.textContent = texto;
  msgs.appendChild(div); msgs.scrollTop = msgs.scrollHeight;
}

function mostrarTyping(tipo = 'them') {
  const msgs = document.getElementById('chat-msgs');
  const div  = document.createElement('div');
  div.className = 'typing'; div.id = 'typing-ind';
  if (tipo === 'coach') div.style.background = '#EEEDFE';
  div.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
  msgs.appendChild(div); msgs.scrollTop = msgs.scrollHeight;
}

function removerTyping() { const t = document.getElementById('typing-ind'); if (t) t.remove(); }
function handleKey(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar(); } }
function autoResize(el) { el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 80) + 'px'; }

// ── Streak ─────────────────────────────────────────────────────────────────
function renderStreak(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = Array.from({ length: 9 }, (_, i) => `
    <div class="s-dot ${i < 7 ? 'done' : ''}">
      <i class="ti ti-check" style="opacity:${i < 7 ? '1' : '.2'}" aria-hidden="true"></i>
    </div>`).join('');
}

// ── Conquistas ─────────────────────────────────────────────────────────────
function renderConquistas() {
  const el = document.getElementById('conq-grid');
  if (!el) return;
  el.innerHTML = CONQUISTAS.map(c => `
    <div class="conq ${c.locked ? 'locked' : ''}">
      <div class="conq-ico" style="background:${c.bg}">
        <i class="ti ${c.icon}" style="color:${c.icor}" aria-hidden="true"></i>
      </div>
      <div class="conq-title">${c.title}</div>
      <div class="conq-sub">${c.sub}</div>
    </div>`).join('');
  renderStreak('streak-conq');
}

// ── Init ───────────────────────────────────────────────────────────────────
(function init() {
  renderStreak('streak-row');
  renderCenarios();
  renderConquistas();
})();
