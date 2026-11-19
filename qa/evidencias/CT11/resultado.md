# CT11 – Semana 5, ciclo 1

- Data: 2026-11-18
- Executor: Vinícius
- Commit testado: 6c7d34f (backend idêntico ao fbdc93f)
- Técnica: Jest

## Verificações

| Verificação | Resultado |
|---|---|
| CT11 - Isolamento por administrador Admin A vê somente registros de Admin A | Passou |
| CT11 - Isolamento por administrador Operador A1 vê somente registros de Admin A | Passou |
| CT11 - Isolamento por administrador Admin B vê somente registros de Admin B | Passou |
| CT11 - Isolamento por administrador Operador B1 vê somente registros de Admin B | Passou |
| CT11 - Isolamento por administrador operador órfão recebe erro sem vínculo | Passou |

## Evidências de origem

- `../week5/jest/resultado-completo.json` e `../week5/jest/junit.xml`
- `../week5/logs/jest-api.log`, `jest-events.log` e `jest-completo.log`
- Ambiente: `../week5/relatorio-transmissao.md`
