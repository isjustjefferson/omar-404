# CT27 – Semana 5, ciclo 1

- Data: 2026-11-18
- Executor: Vinícius
- Commit testado: 6c7d34f (backend idêntico ao fbdc93f)
- Técnica: Jest

## Verificações

| Verificação | Resultado |
|---|---|
| CT27 - PUT sem status preserva status e com status publica evento | **Falhou** |

## Mensagens de falha (Jest)

### CT27 - PUT sem status preserva status e com status publica evento

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: "em_andamento"
Received: null
```

## Reprodução manual via API (`week5/manual/reproducao-api.js`)

```json
[
  {
    "ct": "CT27",
    "desc": "PUT /servicos/1 sem status (status anterior em_andamento)",
    "status": 200,
    "body": {
      "id": 1,
      "tipo": "Velório",
      "descricao": "Serviço de teste",
      "valor": "1500.00",
      "data_velorio": null,
      "data_sepultamento": null,
      "falecido_id": 1,
      "cliente_id": 1,
      "admin_id": 1,
      "status": null,
      "criado_em": "2026-11-18T23:20:51.333Z"
    }
  },
  {
    "ct": "CT27",
    "banco": {
      "id": 1,
      "status": null
    }
  }
]
```

## Evidências de origem

- `../week5/jest/resultado-completo.json` e `../week5/jest/junit.xml`
- `../week5/logs/jest-api.log`, `jest-events.log` e `jest-completo.log`
- Ambiente: `../week5/relatorio-transmissao.md`
