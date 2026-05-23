const PERGUNTAS = [
  { q: "Quando alguém te chama de surpresa numa reunião, você...", ctx: "Situações inesperadas são o principal gatilho de timidez no ambiente corporativo (Zimbardo, 1972).", opts: ["Travo e digo pouco ou nada", "Respondo mas fico me arrependendo", "Sinto desconforto mas me expresso", "Respondo com naturalidade"] },
  { q: "Você está num almoço com pessoas que não conhece. Como age?", ctx: "A timidez em contextos de novidade afeta 40% dos profissionais (Cheek & Buss, 1981).", opts: ["Fico quieto e espero alguém falar", "Participo quando me perguntam", "Tento me incluir mesmo desconfortável", "Costumo puxar assunto naturalmente"] },
  { q: "Quando discorda de algo numa reunião, o que acontece?", ctx: "A dificuldade de se posicionar em público é a forma mais comum de timidez profissional (Leary, 1983).", opts: ["Fico em silêncio — evito o conflito", "Penso em falar mas não encontro o momento", "Falo mas me arrependo do modo", "Exponho minha visão com tranquilidade"] },
  { q: "Como se sente ao receber um elogio público do seu líder?", ctx: "A auto-exposição positiva também gera desconforto em pessoas com timidez interiorizada (Crozier, 2001).", opts: ["Fico visivelmente constrangido", "Agradeço rápido e desvio o olhar", "Aceito bem mas fico pensando depois", "Me sinto bem — gosto de reconhecimento"] },
  { q: "Precisa pedir algo importante ao seu gerente. Você...", ctx: "Pedir ajuda ativa o medo de julgamento, núcleo da timidez profissional (Buss, 1980).", opts: ["Adio ao máximo ou evito", "Preparo muito mas travo na hora", "Faço com desconforto real", "Faço de forma natural e direta"] },
  { q: "Em apresentações para grupos maiores, você se sente...", ctx: "O medo de falar em público afeta 74% das pessoas e é amplificado pela timidez (Ellis, 1962).", opts: ["É a situação que mais me paralisa", "Consigo mas com muita ansiedade", "Preparo bem e o desconforto é tolerável", "Me sinto bem em apresentações"] },
  { q: "Como lida com silêncios numa conversa?", ctx: "Intolerância ao silêncio é indicador de desconforto social moderado a alto (Pilkonis, 1977).", opts: ["Me sinto extremamente desconfortável", "Tento preencher com qualquer coisa", "Aguento mas fico agitado", "Encaro o silêncio com tranquilidade"] },
  { q: "Num ambiente novo — empresa, equipe, evento — seu padrão é...", ctx: "Ambientes novos ativam o sistema de inibição comportamental em pessoas tímidas (Gray, 1982).", opts: ["Ficar próximo a quem conheço ou me isolar", "Observar antes de me aproximar de alguém", "Me apresentar para algumas pessoas com esforço", "Me apresentar ativamente e me sentir bem"] }
];

const PERFIS = [
  { nome: "O Inibidor Profundo", tag: "Timidez constitucional", cor: "#FAEEDA", cortxt: "#633806", desc: "Sua timidez tem raízes temperamentais — você nasceu com um sistema nervoso mais sensível. É exatamente como o criador do método TZDC se sentia no início da carreira. O método foi desenvolvido para esse perfil.", insights: [{ ic: "ti-shield", bg: "#FAEEDA", icor: "#854F0B", t: "Gatilho principal", txt: "Novidade e imprevisibilidade. Situações inesperadas travam mais do que as planejadas." }, { ic: "ti-eye", bg: "#E6F1FB", icor: "#185FA5", t: "Seu ponto forte", txt: "Observadores profundos têm leitura de ambiente acima da média — ouro em relações corporativas." }, { ic: "ti-arrow-right", bg: "#E1F5EE", icor: "#0F6E56", t: "Primeiro passo", txt: "Ambiente controlado. Pratique em contextos seguros antes de expandir para o trabalho." }] },
  { nome: "O Ansioso Preparado", tag: "Timidez de performance", cor: "#E6F1FB", cortxt: "#0C447C", desc: "Você tem o conteúdo — o problema é o canal. Prepara tudo mas na hora H o nervosismo interfere. O método TZDC vai calibrar sua resposta emocional ao momento real.", insights: [{ ic: "ti-brain", bg: "#E6F1FB", icor: "#185FA5", t: "Gatilho principal", txt: "Auto-avaliação excessiva durante a fala. Você monitora seu desempenho em tempo real — isso consome energia." }, { ic: "ti-repeat", bg: "#FAEEDA", icor: "#854F0B", t: "Seu ponto forte", txt: "Alta capacidade de preparação. Quando isso vira hábito e não muleta, você se torna um comunicador poderoso." }, { ic: "ti-arrow-right", bg: "#E1F5EE", icor: "#0F6E56", t: "Primeiro passo", txt: "Simulações de alta pressão. Pratique situações difíceis até o sistema nervoso se recalibrar." }] },
  { nome: "O Consciente em Transição", tag: "Timidez residual", cor: "#E1F5EE", cortxt: "#085041", desc: "Você já superou os bloqueios mais agudos. O que sobra são padrões antigos em situações específicas. Está no ponto mais fértil — pequenos ajustes, grandes resultados.", insights: [{ ic: "ti-trending-up", bg: "#E1F5EE", icor: "#0F6E56", t: "Gatilho principal", txt: "Alta exposição. Reuniões grandes, apresentações para líderes seniores, situações de stake alto." }, { ic: "ti-star", bg: "#FAEEDA", icor: "#854F0B", t: "Seu ponto forte", txt: "Consciência de si mesmo. Você sabe quando trava e por quê — o primeiro passo para mudar." }, { ic: "ti-arrow-right", bg: "#E6F1FB", icor: "#185FA5", t: "Primeiro passo", txt: "Desafios de liderança lateral. Influenciar sem autoridade formal é o salto para o próximo nível." }] }
];

const CENARIOS = [
  { nome: "Marcos Carvalho", cargo: "Seu gerente direto", iniciais: "MC", bgCor: "#E6F1FB", txtCor: "#185FA5", contexto: "Você pediu uma reunião 1:1 para falar sobre seu desenvolvimento. Ele abriu espaço — mas você precisa conduzir.", tagTxt: "Pedir feedback", tagBg: "#FAEEDA", tagColor: "#633806", iconBg: "#E6F1FB", iconColor: "#185FA5", icon: "ti-user", sub: "Iniciar conversa sobre seu desenvolvimento", nivel: "Alta ansiedade" },
  { nome: "Ana Beatriz", cargo: "Colega de equipe sênior", iniciais: "AB", bgCor: "#EEEDFE", txtCor: "#3C3489", contexto: "Revisão de projeto em equipe. Você discorda de uma decisão — mas ainda não se posicionou. Ana abriu espaço para opiniões.", tagTxt: "Discordar em reunião", tagBg: "#E1F5EE", tagColor: "#085041", iconBg: "#EEEDFE", iconColor: "#534AB7", icon: "ti-messages", sub: "Se posicionar sem gerar conflito", nivel: "Nível 2" },
  { nome: "Carla Mendes", cargo: "Gerente de RH", iniciais: "CM", bgCor: "#FAEEDA", txtCor: "#854F0B", contexto: "Você agendou conversa sobre promoção. Carla está aberta — mas espera que você apresente seus argumentos com clareza e confiança.", tagTxt: "Negociar promoção", tagBg: "#E6F1FB", tagColor: "#0C447C", iconBg: "#FAEEDA", iconColor: "#854F0B", icon: "ti-trending-up", sub: "Apresentar seu valor com confiança", nivel: "Alto impacto" },
  { nome: "Roberto Almeida", cargo: "Executivo — evento corporativo", iniciais: "RA", bgCor: "#F1EFE8", txtCor: "#444441", contexto: "Evento da empresa. Roberto é sênior e está sozinho por um momento. É sua chance de se apresentar de forma genuína.", tagTxt: "Abordar executivo", tagBg: "#FAEEDA", tagColor: "#633806", iconBg: "#F1EFE8", iconColor: "#5F5E5A", icon: "ti-users", sub: "Iniciar conversa genuína num evento", nivel: "Zona de desconforto" }
];

const CONQUISTAS = [
  { icon: "ti-plant", bg: "#E1F5EE", icor: "#0F6E56", title: "Primeira semente", sub: "Completou o diagnóstico", locked: false },
  { icon: "ti-flame", bg: "#FAEEDA", icor: "#BA7517", title: "7 dias seguidos", sub: "Streak de uma semana", locked: false },
  { icon: "ti-message", bg: "#E6F1FB", icor: "#185FA5", title: "Primeira voz", sub: "Falou sem ser chamado", locked: false },
  { icon: "ti-lock", bg: "#F1EFE8", icor: "#888780", title: "Zona de maestria", sub: "Complete 30 desafios", locked: true },
  { icon: "ti-lock", bg: "#F1EFE8", icor: "#888780", title: "Negociador", sub: "Simule uma negociação", locked: true },
  { icon: "ti-lock", bg: "#F1EFE8", icor: "#888780", title: "O Arquiteto", sub: "Complete o programa", locked: true }
];

const LIMITES_PLANO = { 'Origem': 1, 'Método': 30, 'Maestria': 60 };

const API_CONFIG = {
  endpoint: "https://tzdc-proxy.rodrigoa-lima.workers.dev",
  model: "claude-sonnet-4-5",
  max_tokens: 1000
};
