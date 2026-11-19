# CT24 – Semana 5, ciclo 1

- Data: 2026-11-18
- Executor: Vinícius
- Commit testado: 6c7d34f (backend idêntico ao fbdc93f)
- Técnica: Jest

## Verificações

| Verificação | Resultado |
|---|---|
| CT24 - Cadastro de serviço (a) cria serviço e exibe nomes na listagem | Passou |
| CT24 - Cadastro de serviço (b) campos obrigatórios ausentes | Passou |
| CT24 - Cadastro de serviço (c) admin sem clientes recebe aviso | **Falhou** |
| CT24 - Cadastro de serviço (d) admin sem falecidos recebe aviso | **Falhou** |

## Mensagens de falha (Jest)

### CT24 - Cadastro de serviço (c) admin sem clientes recebe aviso

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 422
Received: 201
```

### CT24 - Cadastro de serviço (d) admin sem falecidos recebe aviso

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 422
Received: 201
```

## Reprodução manual via API (`week5/manual/reproducao-api.js`)

```json
[
  {
    "ct": "CT24c",
    "desc": "Admin C (sem clientes) cria serviço",
    "status": 201,
    "body": {
      "id": 5,
      "tipo": "Velório",
      "descricao": "Serviço de teste",
      "valor": "1500.00",
      "data_velorio": null,
      "data_sepultamento": null,
      "falecido_id": 1,
      "cliente_id": 1,
      "admin_id": 5,
      "status": "pendente",
      "criado_em": "2026-11-18T23:20:49.073Z"
    }
  },
  {
    "ct": "CT24d",
    "desc": "Admin D (sem falecidos) cria serviço",
    "status": 201,
    "body": {
      "id": 6,
      "tipo": "Velório",
      "descricao": "Serviço de teste",
      "valor": "1500.00",
      "data_velorio": null,
      "data_sepultamento": null,
      "falecido_id": 1,
      "cliente_id": 5,
      "admin_id": 6,
      "status": "pendente",
      "criado_em": "2026-11-18T23:20:49.083Z"
    }
  }
]
```

## Evidências de origem

- `../week5/jest/resultado-completo.json` e `../week5/jest/junit.xml`
- `../week5/logs/jest-api.log`, `jest-events.log` e `jest-completo.log`
- Ambiente: `../week5/relatorio-transmissao.md`
