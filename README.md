# Dalton Platform

Plataforma digital do **Instituto Dalton Salomão** — organização sem fins lucrativos em Presidente Epitácio/SP.

## Módulos

| App | Descrição | Status |
|-----|-----------|--------|
| `apps/web` | Sistema de Gestão Patrimonial — inventário, depreciação, relatórios | Produção |
| `apps/portal` | Portal de Transparência — prestação de contas pública | Planejado |

## Estrutura

```
dalton-platform/
├── apps/
│   ├── web/          # Next.js — app principal (autenticado)
│   └── portal/       # Next.js — portal público de transparência
├── docs/             # Documentação legal e regulatória
├── packages/
│   └── shared/       # Tipos e utilitários compartilhados
└── package.json      # Workspace config
```

## Desenvolvimento

```bash
# Instalar dependências
cd apps/web && npm install

# Dev server
npm run dev

# Testes e2e
npm run test:e2e

# Build
npm run build
```

## Stack

- **Framework:** Next.js 16
- **Database:** PostgreSQL (Prisma ORM)
- **Infra:** Google Cloud Run + Cloud SQL
- **Testes:** Playwright (e2e)

## Conformidade Legal

O sistema atende às exigências de:
- ITG 2002 (R1) — Entidade sem Finalidade de Lucros
- NBC TG 27 — Ativo Imobilizado
- Lei 13.019/2014 — Marco Regulatório das OSCs
- Lei 4.320/1964 — Normas Gerais de Direito Financeiro

Detalhes em [`docs/ESPECIFICACAO_LEGAL.md`](docs/ESPECIFICACAO_LEGAL.md).
