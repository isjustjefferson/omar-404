# Relatório de automação - Semana 6

- Data/hora: 2026-11-19T13:21:19.101Z
- Commit testado: 6c7d34fc14d7f030da61a356a8c64a5131c360d7
- Projeto: Omar-404 - Sistema de Administração de Funerária
- Ambiente: Windows, Node.js, PostgreSQL 18 (WSL2), Redis 8 (WSL2)
- Banco de teste: omar404_test
- Redis lógico: /1
- API: http://localhost:3000
- Frontend: http://localhost:5173
- Preparação de ambiente, massa de dados e automação: Jefferson
- Executor dos casos: Vinícius
- Escopo automatizado: CT05, CT06, CT17, CT18, CT19, CT20, CT21, CT22 e CT23
- Etapas com falha: 1

Este relatório registra apenas a execução das suítes. A decisão Aprovado/Reprovado/Bloqueado e o log de execução são de responsabilidade do executor.

## Comandos executados

| Etapa | Comando | Código |
| --- | --- | --- |
| setup-inicial | C:\Program Files\nodejs\node.exe scripts/reset-test-db.js | 0 |
| seed-inicial | C:\Program Files\nodejs\node.exe scripts/seed-test.js | 0 |
| setup-api | C:\Program Files\nodejs\node.exe scripts/reset-test-db.js | 0 |
| setup-api-seed | C:\Program Files\nodejs\node.exe scripts/seed-test.js | 0 |
| jest-api | npm.cmd run test:week6:api | 1 |
| setup-unit | C:\Program Files\nodejs\node.exe scripts/reset-test-db.js | 0 |
| setup-unit-seed | C:\Program Files\nodejs\node.exe scripts/seed-test.js | 0 |
| jest-unit | npm.cmd run test:week6:unit | 0 |
| setup-e2e | C:\Program Files\nodejs\node.exe scripts/reset-test-db.js | 0 |
| setup-e2e-seed | C:\Program Files\nodejs\node.exe scripts/seed-test.js | 0 |
| cypress | npm.cmd run test:week6:e2e | 0 |

## Evidências geradas

- `jest/api-junit.xml`
- `jest/unit-junit.xml`
- `cypress/videos/` e `cypress/screenshots/`
- `massa-dados.md`
- `logs/`
- `roteiro-executor.md`
