# Relatório de transmissão - Semana 5

- Data/hora: 2026-11-17T18:09:46.448Z
- Commit testado: fbdc93f999575481ffe242ba0bac079a2ed5f80e
- Projeto: Omar-404 - Sistema de Administração de Funerária
- Ambiente: Windows, Node.js, PostgreSQL 18 (WSL2), Redis 8 (WSL2)
- Banco de teste: omar404_test
- Redis lógico: /1
- API: http://localhost:3000
- Frontend: http://localhost:5173
- Preparação de ambiente, massa de dados e automação: Jefferson

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
| cypress | npm.cmd run test:e2e | 0 |

## Evidências

- `jest/junit.xml`
- `cucumber/report.html` e `cucumber/report.json`
- `cypress/videos/` e `cypress/screenshots/`
- `massa-dados.md`
- `logs/`
