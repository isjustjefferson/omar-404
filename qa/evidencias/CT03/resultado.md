# CT03 – Semana 5, ciclo 1

- Data: 2026-11-18
- Executor: Vinícius
- Commit testado: 6c7d34f (backend idêntico ao fbdc93f)
- Técnica: Jest

## Verificações

| Verificação | Resultado |
|---|---|
| CT03 - Token JWT (a) token dentro da validade é aceito | Passou |
| CT03 - Token JWT (b) token expirado é recusado | Passou |
| CT03 - Token JWT (c) requisição sem token é recusada | Passou |
| CT03 - Token JWT (d) token com assinatura alterada é recusado | Passou |

## Evidências de origem

- `../week5/jest/resultado-completo.json` e `../week5/jest/junit.xml`
- `../week5/logs/jest-api.log`, `jest-events.log` e `jest-completo.log`
- Ambiente: `../week5/relatorio-transmissao.md`
