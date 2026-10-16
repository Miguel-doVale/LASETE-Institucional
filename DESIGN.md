# LASETE — direção visual

## Direção confirmada na revisão

Preto neutro e branco. A identidade parte do emblema original e das pessoas da liga. A revisão do responsável rejeitou petróleo/azul, display condensado, navegação numerada, setas diagonais, palavras gigantes e chamadas repetidas. Essas decisões substituem a direção anterior.

## Fundação

Fundo #000000; superfícies #0c0c0c e #141414; texto #f5f5f5; secundário #a3a3a3; borda #292929; foco #ffffff. Sem acento azul/ciano. Cores naturais permanecem nas fotos fornecidas. Geist Variable em títulos, navegação e corpo; títulos de proporção normal, sem condensação, peso 500/600 e tracking até -0.035em. Monoespaçada apenas no ASCII e em código de verdade. Espaço em múltiplos de 4; leitura até 70ch; controles com pelo menos 44px.

## Composição

Hero de experiência: emblema como um volume cúbico feito de caracteres, centralizado em fundo preto; o único elemento de primeiro plano é o símbolo. Matrix em branco e cinza ligeiramente mais visível ao fundo, conforme ajuste posterior do responsável. Sem textos laterais, órbitas, botões de material ou palavra gigante. O vídeo WhatsApp Video 2026-10-14 at 16.13.42.mp4 é referência de volume por partículas e reação localizada. Mouse dispersa os caracteres perto do ponto atingido; arrastar gira o volume. A apresentação institucional começa abaixo da hero.

Navbar com nomes maiores, sem números e com Participar e contato por extenso. Acesso destacado à LASETE AI. Rodapé compacto com identidade, navegação e contato, sem lettering decorativo. Sete páginas públicas preservadas.

Home organiza apresentação, projetos, atividades reais, estudos, equipe, mídia e seleção/contato. Projetos têm exploração na própria página e ações diretas, sem pop-up de detalhes. Atividades e materiais podem expandir o relato no próprio cartão. Membros preserva filtros, busca e retratos. Contatos são visíveis no início de Participar e contato; o aviso grande do seletivo permanece.

## Movimento e operação

Um canvas WebGL na hero, sem superfície sólida visível, e um único campo 2D persistente para a Matrix. O WebGL só redesenha durante interação, rotação e retorno dos caracteres; fica ocioso em repouso. A Matrix opera em frequência reduzida. Ambos pausam fora da tela e com a aba oculta. Partículas e interação calculadas sem atualizar React por quadro; pausa fora da tela e em aba oculta; resolução limitada. Movimento reduzido mantém uma composição estática e rotação por teclado, sem Matrix animada. A saída da hero no scroll usa uma transição curta de posição e opacidade via GSAP. Navegação e foco funcionam sem animação. Scroll nativo em toque e resposta curta no desktop.

Painel usa login e persistência no Supabase, com autorização e RLS como descritos em PRODUCT.md. Não inventar pesquisas, cobertura de imprensa ou métricas. O estado do seletivo não altera o Google Forms.

## Acabamento aprovado após a primeira revisão

Manter a base preta, a tipografia e a estrutura elogiadas. Repetir o recorte vertical nas quatro quinas do volume para reconhecer a marca ao girar. Indicador Explore a LASETE na base da hero sinaliza a continuidade. Matrix contínua da hero à apresentação da Home, com redução gradual de intensidade, usando o mesmo campo de partículas. Nas páginas internas, a Matrix aparece apenas nos cabeçalhos de A liga, Membros e Projetos. Listas, textos longos, Atividades, Pesquisas, contatos, seletivo e admin ficam livres do efeito. Parallax curto na foto institucional, hover curto em fotos/projetos e transições nas abas; movimento reduzido desativa animações.

Conteúdos entram uma vez conforme o scroll, com fade, deslocamento de 20px e sequência curta em grupos. Conteúdo já visível ao abrir a página permanece imediato. A marcação de revelação não oculta nada em CSS; o movimento reduzido exibe tudo sem transição. As imagens com parallax mantêm um comportamento separado das entradas.

A linha de progresso da navbar foi removida após avaliação do responsável. A continuidade da Matrix é espacial: a máscara acompanha as áreas escolhidas enquanto o campo mantém a mesma fase. Ela não reinicia na passagem entre hero e apresentação e apaga antes das seções densas.

Preferências de movimento e breakpoints são acompanhados em tempo real. Alterar a preferência encerra/reverte as animações sem recarregar. O seletor de projetos acompanha a orientação visual no teclado; o menu móvel fecha e devolve o foco à marca ao entrar no desktop.

## Página não encontrada

O estado 404 usa números grandes em ASCII 3D centralizados, com dispersão localizada no mouse e orientação fixa, sem rotação por arraste, teclado ou toque. Reaproveita o motor da hero; demanda de renderização, limite de resolução, pausa fora da tela e alternativa estática preservam a navegação. Mensagem, Home e contato aparecem abaixo; três páginas públicas distintas são sorteadas a cada visita e permanecem estáveis durante a interação.

## Painel editorial e login

Modo Operate. Preservar o preto e branco da LASETE: base #0c0c0c, navegação #000000, superfícies #141414, bordas #292929 e texto secundário #a3a3a3. Geist, espaçamento em múltiplos de 4, controles de 44–50px. Componentes existentes de Button e Dialog, ícones Lucide; nenhuma nova biblioteca visual. Referência estrutural: painel editorial com navegação lateral e listas tabulares; entrada em duas colunas, marca à esquerda e formulário à direita. No celular, marca compacta e navegação horizontal. Sem Matrix no admin.

Login tem e-mail, senha com exibição opcional, feedback de erro e estados de verificação e conta sem autorização. Painel tem filtros Todos/Publicados/Rascunhos, busca, miniaturas e ações de editar, publicar e excluir. Retirar restauração local. Movimento restrito a feedback curto de controles e indicador de carregamento; respeitar movimento reduzido.

### Login — composição de hardware aprovada pelo responsável

Referência fornecida: dois dispositivos à esquerda e login em moldura discreta à direita. Substituir os celulares por uma composição monocromática de Flipper Zero branco e HackRF One preto personalizados com o emblema LASETE. Arte de produto ilustrativa criada para esta página; não representa inventário físico da liga. Asset local `public/images/admin-hardware.webp`. Header compacto com marca e retorno ao site; nenhum rodapé, cadastro, login social ou anúncio de aplicativo. Formulário centralizado, com senha visível opcional e os estados reais de autorização preservados. A tela inteira cabe no viewport em desktop e celular: a imagem é reduzida no celular e retirada em alturas muito pequenas para priorizar o acesso. Sem bloquear scroll globalmente: zoom e teclado virtual devem manter todos os controles alcançáveis.

### Painel — membros e continuidade da sessão

Abas de grupo iguais às da página pública: Diretoria, Ligantes, Orientadores e Todos. Hierarquia fixa: presidente, vice-presidente, secretaria e diretorias na ordem já adotada pela liga; depois ligantes e orientadores. Edições nunca colocam uma pessoa acima de um cargo superior. O mesmo comparador é aplicado à página pública.

A seção, os filtros e a busca são refletidos na URL e preservados por conta no sessionStorage. Eventos de sessão da mesma conta revalidam acesso em segundo plano, sem desmontar o painel ou descartar o formulário aberto.

Matrix mais presente apenas no cabeçalho do painel autenticado: intensidade própria, desaparecendo antes das listas e formulários. O login de hardware permanece visualmente igual ao aprovado. Movimento reduzido remove o canvas; a animação pausa em aba oculta.

### Interação dos controles

Admin e navbar pública recebem luz branca suave que acompanha o ponteiro dentro do controle, sem mover a área clicável. Links da navbar ganham sublinhado animado, mantendo a indicação da página ativa; ícones de navegação deslizam 2px e o ícone de adicionar gira ao hover. Botões de ação da tabela invertem para branco/preto. Teclado mantém foco e realce próprios; toque usa os estados de pressão. Movimento reduzido desativa deslocamentos e transições. Nenhum desses efeitos é aplicado ao login aprovado.

### Adaptação mobile — toque, navegação e login no dispositivo

A hero aceita toque para dispersar e arraste lateral para girar. `touch-action: pan-y` mantém a rolagem vertical nativa; o 404 permanece estático no toque. Um toque curto mantém o impacto ativo por 180ms para o render sob demanda registrá-lo. Preferência por movimento reduzido continua respeitada.

A Matrix reconhece regiões que chegam com carregamento tardio das rotas. Celular e desktop usam as mesmas regiões aprovadas: hero e apresentação da Home, cabeçalhos de A liga, Membros e Projetos. Não forçar movimento quando o sistema pede redução.

Menu móvel como painel lateral: ícones Lucide, nome completo de cada destino, fundo distinto na página ativa, setas de avanço, contato no fim e fechamento acessível. Altura dinâmica e áreas seguras, mantendo rolagem interna quando necessário.

Login mobile passa a ser uma interface dentro de uma moldura de HackRF One com PortaPack: conectores e antena acima, nome da liga no chassi, formulário HTML real dentro da tela, dial e controles decorativos abaixo. A foto separada é ocultada no celular; o desktop mantém a composição aprovada. Metal preto e cinza, detalhes em branco; decoração se compacta em alturas menores e não interfere com leitura, foco, toque ou acesso com teclado virtual. Controles decorativos ficam fora da árvore acessível.

### Revisão das páginas internas e do menu móvel

A pedido do responsável, Matrix passa a ocupar o fundo completo das seis páginas internas: A liga, Membros, Projetos, Pesquisas, Atividades e Participar e contato. Intensidade e rastros próprios tornam o efeito visível desde a abertura, mantendo superfícies de conteúdo à frente. Home, login e admin mantêm seus tratamentos anteriores; a redução de movimento continua respeitada.

O menu mobile substitui os ícones e setas por nomes em tipografia maior, divisórias finas e um pequeno sublinhado na página ativa. Sem numeração nem cartões por link. Mantém destinos, acessibilidade, retorno de foco e rolagem interna em telas curtas.

### Alcance final da Matrix por página

A liga, Membros e Participar e contato mantêm a Matrix no fundo completo. Projetos, Pesquisas e Atividades usam o efeito somente no cabeçalho, apagando após a abertura para liberar a leitura. A Home mantém sua composição anterior. Esta decisão substitui a aplicação integral anterior nas seis páginas.
