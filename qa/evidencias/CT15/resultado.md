# CT15 – Semana 5, ciclo 1

- Data: 2026-11-18
- Executor: Vinícius
- Commit testado: 6c7d34f (backend idêntico ao fbdc93f)
- Técnica: Jest

## Verificações

| Verificação | Resultado |
|---|---|
| CT15 - eventos são isolados por administrador | **Falhou** |

## Mensagens de falha (Jest)

### CT15 - eventos são isolados por administrador

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 2
```

## Evidências de origem

- `../week5/jest/resultado-completo.json` e `../week5/jest/junit.xml`
- `../week5/logs/jest-api.log`, `jest-events.log` e `jest-completo.log`
- Ambiente: `../week5/relatorio-transmissao.md`
