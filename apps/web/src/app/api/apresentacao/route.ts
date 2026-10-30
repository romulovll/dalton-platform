import { NextResponse } from "next/server";

export async function GET() {
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Dalton Platform — Apresentação</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; background: #f8f9fa; color: #333; }

    .slide {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 60px 80px;
      page-break-after: always;
    }
    @media (max-width: 768px) { .slide { padding: 30px 20px; } }
    @media print { .slide { min-height: auto; padding: 30px 40px; } .no-print { display: none; } }

    /* Slide 1 — Cover */
    .cover { background: linear-gradient(135deg, #1B5E34, #4CAF50); color: white; text-align: center; }
    .cover h1 { font-size: 3.5rem; font-weight: 800; line-height: 1.1; }
    .cover h2 { font-size: 1.4rem; font-weight: 400; opacity: 0.85; margin-top: 16px; }
    .cover .logo { width: 100px; height: 100px; border-radius: 20px; margin: 0 auto 30px; }
    .cover .badge { display: inline-block; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); border-radius: 30px; padding: 8px 20px; font-size: 0.85rem; margin-top: 30px; }

    /* Slide styles */
    .slide h2 { font-size: 2rem; font-weight: 700; color: #1B5E34; margin-bottom: 8px; }
    .slide .subtitle { font-size: 1rem; color: #888; margin-bottom: 30px; }
    .slide p { font-size: 1rem; line-height: 1.7; max-width: 800px; }

    /* Cards grid */
    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-top: 20px; }
    .card { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); border-left: 4px solid #1B5E34; }
    .card h3 { font-size: 1rem; font-weight: 700; color: #1B5E34; margin-bottom: 6px; }
    .card p { font-size: 0.85rem; color: #666; line-height: 1.5; }

    /* Table */
    table { width: 100%; border-collapse: collapse; font-size: 0.85rem; margin-top: 15px; }
    th { background: #1B5E34; color: white; text-align: left; padding: 10px 14px; font-weight: 600; }
    td { padding: 10px 14px; border-bottom: 1px solid #eee; }
    tr:hover { background: #f5f5f5; }
    .check { color: #1B5E34; font-weight: 700; }
    .dash { color: #ccc; }

    /* Pillars */
    .pillars { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 24px; }
    .pillar { background: white; border-radius: 16px; padding: 30px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
    .pillar .icon { font-size: 2.5rem; margin-bottom: 12px; }
    .pillar h3 { font-size: 1.1rem; font-weight: 700; color: #1B5E34; margin-bottom: 8px; }
    .pillar p { font-size: 0.85rem; color: #666; }
    @media (max-width: 768px) { .pillars { grid-template-columns: 1fr; } }

    /* Stats */
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 20px; }
    .stat { background: white; border-radius: 12px; padding: 20px; text-align: center; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
    .stat .number { font-size: 2rem; font-weight: 800; color: #1B5E34; }
    .stat .label { font-size: 0.75rem; color: #888; margin-top: 4px; }
    @media (max-width: 768px) { .stats { grid-template-columns: repeat(2, 1fr); } }

    /* List */
    .features { list-style: none; margin-top: 15px; }
    .features li { padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 0.95rem; display: flex; align-items: center; gap: 10px; }
    .features li::before { content: "✓"; color: #1B5E34; font-weight: 700; font-size: 1.1rem; }

    /* Alert box */
    .alert { background: #FFF3E0; border: 1px solid #FFB74D; border-radius: 10px; padding: 16px 20px; margin-top: 20px; font-size: 0.9rem; }
    .alert strong { color: #E65100; }

    /* Footer */
    .slide-footer { margin-top: auto; padding-top: 30px; font-size: 0.7rem; color: #bbb; text-align: center; }

    /* Nav */
    .nav { position: fixed; bottom: 20px; right: 20px; display: flex; gap: 8px; z-index: 100; }
    .nav button { background: #1B5E34; color: white; border: none; border-radius: 8px; padding: 10px 16px; cursor: pointer; font-size: 0.85rem; }
    .nav button:hover { background: #2E7D32; }
  </style>
</head>
<body>

<!-- Navigation -->
<div class="nav no-print">
  <button onclick="prev()">← Anterior</button>
  <button onclick="next()">Próximo →</button>
</div>

<!-- Slide 1: Cover -->
<div class="slide cover" id="s1">
  <div>
    <img src="/logo_dalton.jpeg" alt="Logo" class="logo">
    <h1>Dalton Platform</h1>
    <h2>Plataforma Digital do Instituto Dalton Salomão</h2>
    <div class="badge">Gestão Patrimonial · Atividades Sociais · Transparência Pública</div>
  </div>
</div>

<!-- Slide 2: Vision -->
<div class="slide" id="s2">
  <h2>O que é o Dalton Platform?</h2>
  <p class="subtitle">Uma plataforma web que centraliza toda a gestão do Instituto</p>
  <div class="pillars">
    <div class="pillar">
      <div class="icon">📦</div>
      <h3>Gestão Patrimonial</h3>
      <p>Controle de bens, tombamento, depreciação, movimentações, inventário periódico e relatórios contábeis.</p>
    </div>
    <div class="pillar">
      <div class="icon">👥</div>
      <h3>Atividades Sociais</h3>
      <p>Cadastro de participantes, atividades (Jiu-Jitsu, SCFV, Tênis de Mesa), controle de presença diária e atendimento psicológico.</p>
    </div>
    <div class="pillar">
      <div class="icon">📋</div>
      <h3>Transparência Pública</h3>
      <p>Portal aberto com documentos de prestação de contas. PDFs com dados pessoais são redijidos automaticamente (LGPD).</p>
    </div>
  </div>
</div>

<!-- Slide 3: Modules -->
<div class="slide" id="s3">
  <h2>Módulos do Sistema</h2>
  <p class="subtitle">16 módulos integrados em uma única plataforma</p>
  <table>
    <tr><th>Módulo</th><th>Funcionalidade</th></tr>
    <tr><td><strong>Painel</strong></td><td>Dashboard com estatísticas e gráficos</td></tr>
    <tr><td><strong>Bens Patrimoniais</strong></td><td>Cadastro, busca, filtros, QR Code, foto, importação CSV</td></tr>
    <tr><td><strong>Unidades</strong></td><td>Sedes e espaços do Instituto com setores</td></tr>
    <tr><td><strong>Movimentações</strong></td><td>Transferências, baixas, manutenção</td></tr>
    <tr><td><strong>Parcerias</strong></td><td>Termos com poder público (Lei 13.019/2014)</td></tr>
    <tr><td><strong>Inventários</strong></td><td>Levantamento periódico (Localizado / Não Localizado / Divergente)</td></tr>
    <tr><td><strong>Participantes</strong></td><td>Crianças e idosos atendidos, com dados de saúde e família</td></tr>
    <tr><td><strong>Atividades</strong></td><td>Atividades oferecidas, cada uma com seu professor</td></tr>
    <tr><td><strong>Presença</strong></td><td>Chamada diária por atividade com relatórios</td></tr>
    <tr><td><strong>Psicologia</strong></td><td>Agenda de atendimentos (sem dados clínicos — CFP/LGPD)</td></tr>
    <tr><td><strong>Relatórios</strong></td><td>Depreciação, notas explicativas (ITG 2002), CSV e PDF</td></tr>
    <tr><td><strong>Documentos</strong></td><td>Upload para Portal de Transparência com redação automática LGPD</td></tr>
    <tr><td><strong>Auditoria</strong></td><td>Log de todas as ações (quem fez o quê e quando)</td></tr>
    <tr><td><strong>Chamados</strong></td><td>Canal para relatar erros ou sugestões</td></tr>
  </table>
</div>

<!-- Slide 4: Access Profiles -->
<div class="slide" id="s4">
  <h2>Perfis de Acesso</h2>
  <p class="subtitle">Cada usuário vê apenas o que é relevante para sua função</p>
  <table>
    <tr><th>Perfil</th><th>Patrimônio</th><th>Social</th><th>Psicologia</th><th>Admin</th></tr>
    <tr><td><strong>Administrador Geral</strong></td><td class="check">✓</td><td class="check">✓</td><td class="check">✓</td><td class="check">✓</td></tr>
    <tr><td><strong>Gestor Patrimonial</strong></td><td class="check">✓</td><td class="check">✓</td><td class="check">✓</td><td class="dash">—</td></tr>
    <tr><td><strong>Professor</strong></td><td class="dash">—</td><td class="check">✓ (só suas)</td><td class="dash">—</td><td class="dash">—</td></tr>
    <tr><td><strong>Psicólogo</strong></td><td class="dash">—</td><td class="dash">—</td><td class="check">✓ (só sua agenda)</td><td class="dash">—</td></tr>
    <tr><td><strong>Contador</strong></td><td class="check">✓ (leitura)</td><td class="dash">—</td><td class="dash">—</td><td class="dash">—</td></tr>
    <tr><td><strong>Auditor</strong></td><td class="check">✓ (leitura)</td><td class="dash">—</td><td class="dash">—</td><td class="check">Auditoria</td></tr>
    <tr><td><strong>Consulta</strong></td><td class="dash">—</td><td class="dash">—</td><td class="dash">—</td><td class="dash">—</td></tr>
  </table>
  <p style="margin-top:15px;font-size:0.85rem;color:#888">O controle é aplicado no servidor — digitar a URL diretamente não funciona.</p>
</div>

<!-- Slide 5: Security -->
<div class="slide" id="s5">
  <h2>Segurança e LGPD</h2>
  <p class="subtitle">Proteção de dados pessoais em conformidade com a lei</p>
  <div class="cards">
    <div class="card">
      <h3>Login Seguro</h3>
      <p>Google Sign-In ou e-mail/senha. Sessão expira em 10 minutos. Bloqueio após 5 tentativas.</p>
    </div>
    <div class="card">
      <h3>Redação Automática de PDFs</h3>
      <p>Google Cloud Vision (OCR) + Cloud DLP (IA) detectam CPFs, RGs, telefones, endereços e cobrem com *** no PDF original.</p>
    </div>
    <div class="card">
      <h3>Auditoria Completa</h3>
      <p>Toda ação (criar, editar, excluir) é registrada com nome do usuário, data e hora.</p>
    </div>
    <div class="card">
      <h3>Psicologia Protegida</h3>
      <p>Nenhum dado clínico no sistema. Só agendamento e presença. Prontuário é do profissional (CFP 5/2025).</p>
    </div>
    <div class="card">
      <h3>Headers de Segurança</h3>
      <p>HSTS, X-Frame-Options DENY, nosniff, reCAPTCHA Enterprise contra bots.</p>
    </div>
    <div class="card">
      <h3>Controle de Acesso</h3>
      <p>RBAC no middleware — cada rota é bloqueada pelo perfil do usuário, não apenas pelo menu.</p>
    </div>
  </div>
</div>

<!-- Slide 6: Legal Compliance -->
<div class="slide" id="s6">
  <h2>Conformidade Legal</h2>
  <p class="subtitle">16 obrigações legais atendidas</p>
  <div class="stats">
    <div class="stat"><div class="number">16</div><div class="label">Obrigações Legais</div></div>
    <div class="stat"><div class="number">16</div><div class="label">Implementadas</div></div>
    <div class="stat"><div class="number">0</div><div class="label">Pendentes</div></div>
    <div class="stat"><div class="number">92</div><div class="label">Testes Automatizados</div></div>
  </div>
  <ul class="features" style="margin-top:30px">
    <li>Tombamento patrimonial com número único (IDS-NNNNNN)</li>
    <li>Depreciação linear conforme NBC TG 27 e ITG 2002</li>
    <li>Cláusula de inalienabilidade (Lei 13.019/2014, Art. 36)</li>
    <li>Inventário periódico (Lei 4.320/64)</li>
    <li>Notas explicativas para auditores (ITG 2002 R1)</li>
    <li>Registro fotográfico e QR Code por bem</li>
    <li>Portal de Transparência público (Lei 13.019/2014)</li>
    <li>Proteção de dados pessoais (LGPD — Lei 13.709/2018)</li>
  </ul>
</div>

<!-- Slide 7: Technology -->
<div class="slide" id="s7">
  <h2>Tecnologia</h2>
  <p class="subtitle">Stack moderna, infraestrutura na nuvem</p>
  <div class="cards">
    <div class="card"><h3>Next.js 16</h3><p>Framework React com SSR e Server Actions</p></div>
    <div class="card"><h3>PostgreSQL</h3><p>Banco de dados relacional com Prisma ORM</p></div>
    <div class="card"><h3>Google Cloud Run</h3><p>Hospedagem serverless em São Paulo</p></div>
    <div class="card"><h3>Cloud Vision + DLP</h3><p>OCR e detecção de dados sensíveis por IA</p></div>
    <div class="card"><h3>Playwright</h3><p>92 testes end-to-end automatizados</p></div>
    <div class="card"><h3>Cloud Storage</h3><p>Fotos e documentos na nuvem</p></div>
  </div>
  <div class="alert" style="margin-top:30px">
    <strong>Custo mensal estimado:</strong> inferior a R$ 50. Cloud Run cobra por uso. Cloud Vision e DLP têm camada gratuita (1.000 páginas/mês e 1 GB/mês).
  </div>
</div>

<!-- Slide 8: Access -->
<div class="slide" id="s8">
  <h2>Como Acessar</h2>
  <p class="subtitle">Disponível de qualquer dispositivo com internet</p>
  <div class="cards" style="grid-template-columns: 1fr 1fr;">
    <div class="card">
      <h3>Sistema (login)</h3>
      <p style="font-family:monospace;font-size:0.9rem;margin-top:10px;word-break:break-all">
        <a href="https://dalton-web-20602711487.southamerica-east1.run.app" style="color:#1B5E34" target="_blank">
          dalton-web-20602711487.southamerica-east1.run.app
        </a>
      </p>
      <p style="margin-top:8px">Entrar com Google ou e-mail/senha</p>
    </div>
    <div class="card">
      <h3>Portal de Transparência (público)</h3>
      <p style="font-family:monospace;font-size:0.9rem;margin-top:10px;word-break:break-all">
        <a href="https://dalton-web-20602711487.southamerica-east1.run.app/transparencia" style="color:#1B5E34" target="_blank">
          .../transparencia
        </a>
      </p>
      <p style="margin-top:8px">Acesso livre, sem login</p>
    </div>
  </div>
  <div style="margin-top:40px">
    <h3 style="color:#1B5E34;margin-bottom:12px">Primeiros Passos</h3>
    <ol style="font-size:0.95rem;line-height:2;padding-left:20px">
      <li>Cadastrar unidades do Instituto</li>
      <li>Cadastrar bens patrimoniais (ou importar via CSV)</li>
      <li>Cadastrar participantes das atividades</li>
      <li>Criar atividades e atribuir professores</li>
      <li>Cadastrar usuários com perfis de acesso</li>
      <li>Fazer upload dos documentos de transparência</li>
    </ol>
  </div>
  <div class="slide-footer">
    Instituto Dalton Salomão — Presidente Epitácio/SP<br>
    "Futuro se faz com amor"
  </div>
</div>

<script>
  const slides = document.querySelectorAll('.slide');
  let current = 0;
  function goTo(i) {
    if (i >= 0 && i < slides.length) {
      current = i;
      slides[i].scrollIntoView({ behavior: 'smooth' });
    }
  }
  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
  });
</script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
