# CT25 – Semana 5, ciclo 1

- Data: 2026-11-18
- Executor: Vinícius
- Commit testado: 6c7d34f (backend idêntico ao fbdc93f)
- Técnica: Jest

## Verificações

| Verificação | Resultado |
|---|---|
| CT25 - Validação de valor do serviço valor -0.01 deve retornar 400 | Passou |
| CT25 - Validação de valor do serviço valor 0 deve retornar 201 | **Falhou** |
| CT25 - Validação de valor do serviço valor 0.01 deve retornar 201 | Passou |
| CT25 - Validação de valor do serviço valor 99999999.99 deve retornar 201 | Passou |
| CT25 - Validação de valor do serviço valor 100000000 deve retornar 400 | Passou |

## Mensagens de falha (Jest)

### CT25 - Validação de valor do serviço valor 0 deve retornar 201

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 201
Received: 400
```

## Reprodução manual via API (`week5/manual/reproducao-api.js`)

```json
[
  {
    "ct": "CT25",
    "desc": "Admin A cria serviço valor 0",
    "status": 400,
    "body": {
      "erro": "Tipo, valor, falecido e cliente são obrigatórios."
    }
  }
]
```

## Evidências de origem

- `../week5/jest/resultado-completo.json` e `../week5/jest/junit.xml`
- `../week5/logs/jest-api.log`, `jest-events.log` e `jest-completo.log`
- Ambiente: `../week5/relatorio-transmissao.md`
