# Relatório de transmissão - Semana 5

- Data/hora: 2026-11-18T20:08:22.257Z
- Commit testado: 6c7d34fc14d7f030da61a356a8c64a5131c360d7
- Projeto: Omar-404 - Sistema de Administração de Funerária
- Ambiente: Windows 11, Node.js 22.15.0, PostgreSQL 16 (Docker, porta 5434), Redis 7 (Docker, porta 6379)
- Banco de teste: omar404_test
- Redis lógico: /1
- API: http://localhost:3000
- Frontend: http://localhost:5173
- Executor (ciclo 1): Vinícius (scripts de automação entregues por Jefferson)
- Análise dos reprovados: Elton

## Comandos executados

| Etapa | Comando | Código |
| --- | --- | --- |
| setup-inicial | C:\Program Files\nodejs\node.exe scripts/reset-test-db.js | 0 |
| seed-inicial | C:\Program Files\nodejs\node.exe scripts/seed-test.js | 0 |
| setup-api | C:\Program Files\nodejs\node.exe scripts/reset-test-db.js | 0 |
| setup-api-seed | C:\Program Files\nodejs\node.exe scripts/seed-test.js | 0 |
| jest-api | npm.cmd run test:api | 1 |
| setup-unit | C:\Program Files\nodejs\node.exe scripts/reset-test-db.js | 0 |
| setup-unit-seed | C:\Program Files\nodejs\node.exe scripts/seed-test.js | 0 |
| jest-unit | npm.cmd run test:unit | 0 |
| setup-events | C:\Program Files\nodejs\node.exe scripts/reset-test-db.js | 0 |
| setup-events-seed | C:\Program Files\nodejs\node.exe scripts/seed-test.js | 0 |
| jest-events | npm.cmd run test:events | 1 |
| setup-bdd | C:\Program Files\nodejs\node.exe scripts/reset-test-db.js | 0 |
| setup-bdd-seed | C:\Program Files\nodejs\node.exe scripts/seed-test.js | 0 |
| cucumber | npm.cmd run test:bdd | 0 |
| setup-e2e | C:\Program Files\nodejs\node.exe scripts/reset-test-db.js | 0 |
| setup-e2e-seed | C:\Program Files\nodejs\node.exe scripts/seed-test.js | 0 |
| cypress | npm.cmd run test:e2e | 1 → 0 (ver observação) |

## Evidências

- `jest/junit.xml`
- `cucumber/report.html` e `cucumber/report.json`
- `cypress/videos/` e `cypress/screenshots/`
- `manual/reproducao-api.json` (reprodução manual dos reprovados via API)
- `massa-dados.md`
- `logs/`
## Observações

- **Cypress (1ª tentativa, código 1):** não abriu porque o terminal do VS Code define `ELECTRON_RUN_AS_NODE=1` (erro `bad option: --smoke-test`). É falha do ambiente, não do sistema. Com a variável removida, o CT04 foi executado de novo (reset e seed antes) e passou: 2/2, código 0.
- **Jest:** a suíte completa foi executada mais uma vez com `--json` (`jest/resultado-completo.json`, 37 testes, 26 aprovados e 11 reprovados), com os mesmos resultados das etapas `jest-api`, `jest-events` e `jest-unit`. O Jest termina com o aviso de *open handles* e não fecha sozinho. Isso não afeta os resultados, mas o Jefferson deve rever (`--detectOpenHandles`).
- **Commit:** o `6c7d34f` só adiciona arquivos em `qa/`. Backend, frontend e banco são idênticos ao `fbdc93f` (`git diff fbdc93f 6c7d34f -- backend frontend database` vazio).
