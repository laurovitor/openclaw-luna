Tags: deckclaw, architecture, phase1, product

**DeckClaw — Blueprint Fase 1 (Reset Arquitetural)**

**Objetivo da Fase 1**
- Subir um produto estável, multi-tenant por workspace, com front responsivo e base sólida para tempo real.
- Fase 1 prioriza funcionamento "redondo" com escopo controlado; melhorias avançadas ficam para fases posteriores.

**Infraestrutura alvo (fase 1)**
- Frontend: `deckclaw.app.br` (React + Vite)
- API: `deckclaw.api.br` (serviço separado)
- Banco: Railway Postgres (única fonte de verdade)
- DNS/SSL/WAF: Cloudflare
- E-mail transacional: Mailgun API
- Realtime: via API (WebSocket/SSE) e/ou arquitetura equivalente definida na implementação

**Princípios-chave**
- Banco e migrations centralizados no `deckclaw-api` (evitar duplicidade de schema em múltiplos projetos).
- Front consome API e recebe atualizações reativas.
- Multi-tenant por workspace (não por usuário).
- Responsividade obrigatória (mobile-first em todo o sistema).
- Modelo comercial: "Pague e Use" (trial e automação de cobrança ficam para fase posterior).

**Estrutura de navegação (Frontend) — Fase 1**

1) **Login / Registro**
- Manter fluxo atual de login + 2FA (já funcional).
- Adicionar social login (Google, Meta, GitHub).
- Footer com links: Terms/Policies, API DOC, Suporte, Version/Build.

2) **Painel (Dashboard)**
- Manter layout base atual.
- Preparar para ser a tela mais reativa (dados em tempo real).
- Conteúdo final será refinado depois (placeholder funcional na Fase 1).

3) **Agentes (Agents)**
- Inspirado na experiência visual de Candidates.
- Fase 1: listar agentes cadastrados com:
  - id do agente OpenClaw
  - função
  - OpenClaw ao qual pertence
- Edição de `.md` via UI fica para etapa posterior.

4) **OpenClaw**
- Evolução da tela atual de Vínculos OC.
- Nome final da seção: **OpenClaw**.
- Fase 1 mantém base funcional atual, com evolução incremental depois.

5) **Projetos (Projects)**
- Renomear/adequar fluxo atual de Jobs para Projetos.
- Ao abrir projeto: visão estilo kanban para acompanhar fluxo dos agentes.
- Fases/colunas mais completas ficam para etapa posterior; iniciar com versão básica funcional.

6) **Tarefas (Tasks)**
- Cadastro de task vinculada a Projeto e Agente.
- Estrutura mínima da task:
  - descrição
  - log de interação
  - área de chat entre agentes (base inicial)

7) **Relatórios (Reports)**
- Tela criada e pronta (placeholder na Fase 1).
- Métricas avançadas ficam para etapa posterior.

8) **Usuários (Users)**
- Gestão de usuários humanos, convites, funções/permissões.
- Ficha de usuário para consulta operacional.
- Edição de perfil concentrada aqui.

9) **Configurações (Settings)**
- Separar Profile de Settings:
  - Profile: editar via Users (incluindo o próprio usuário).
  - Settings: configurações do workspace DeckClaw (não confundir com workspace OpenClaw).
- Itens esperados:
  - idioma global
  - dados da organização
  - notificações/canais
  - excluir conta/workspace (regras por owner)

**Sidebar e área de conta (painel usuário)**
- Manter bloco do usuário logado com:
  - logout
  - editar perfil
  - troca de workspace (quando estiver em mais de um)
- Menu secreto de staff quando aplicável.
- Abaixo do bloco: exibir version/build + links:
  - Terms/Policies
  - API DOC (`deckclaw.api.br`)
  - Suporte

**Páginas públicas auxiliares (fase 1)**
- Terms/Policies: página pública acessível sem login (conteúdo base placeholder).
- API DOC: página/documentação pública em `deckclaw.api.br`.
- Suporte: página para abrir tickets e acompanhar tickets existentes.

**Modelo de Workspace / Multi-tenant**
- Tudo vinculado ao workspace.
- Um mesmo e-mail pode participar de múltiplos workspaces.
- Cada workspace possui exatamente 1 owner.
- Regras owner:
  - usuário pode criar workspace próprio se não tiver.
  - não pode ser owner de mais de um simultaneamente.
  - pode ter outros cargos em outros workspaces.
  - para virar owner de outro, deve remover o atual (regra de remoção/transferência refinada depois).
- Ao login, usuário entra no último workspace usado.
- URL com slug de workspace:
  - formato tipo `deckclaw.app.br/.../<workspace-slug>`
  - slug único no banco
  - slug editável em settings se não houver conflito.

**Comercial (fase 1)**
- Produtos e planos permanecem funcionais como estão agora.
- Em Settings, mostrar o que o workspace possui (entitlements/limites).
- Compra self-service e gateway de pagamento ficam para etapa posterior.

**Integração OpenClaw (fase 1 base)**
- Skill OpenClaw comunica com API versionada (`/api/v1/...`).
- Front recebe estado de vínculo/status de forma reativa.
- Evoluções de controle e automação ficam para próxima etapa.

**Requisitos não-funcionais obrigatórios**
- Responsividade forte em todo o sistema (mobile prioridade alta).
- Consistência de UX/copy.
- Versionamento visível no app.
- Arquitetura preparada para evolução sem retrabalho.

**Fora de escopo da Fase 1 (planejado para depois)**
- Cobrança automatizada por gateway (atualmente manual/painel).
- Trial completo com regras comerciais refinadas.
- Edição completa de arquivos de agente via UI.
- Relatórios avançados e analytics profundos.
- Regras rígidas de remoção/transferência de owner/workspace.
- Auditoria avançada de quase tudo (planejada).

**Checklist de aceite da Fase 1**
- Login/registro + 2FA + social login funcionando.
- Navegação principal completa com páginas base estáveis.
- Multi-tenant por workspace funcional.
- Workspaces com slug único e roteamento por slug.
- Troca de workspace e retorno ao último workspace funcionando.
- OpenClaw/Agents/Projects/Tasks operacionais em nível base.
- Settings/Users separação clara de responsabilidades.
- Terms/API DOC/Suporte acessíveis conforme regra.
- Front altamente responsivo no celular.
- Build/version visível no app.
