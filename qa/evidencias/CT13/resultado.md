# CT13 – Semana 5, ciclo 1

- Data: 2026-11-18
- Executor: Vinícius
- Commit testado: 6c7d34f (backend idêntico ao fbdc93f)
- Técnica: Jest

## Verificações

| Verificação | Resultado |
|---|---|
| CT13 - Criação com vínculo de outro administrador não cria falecido nem serviço usando cliente de outro administrador | **Falhou** |

## Mensagens de falha (Jest)

### CT13 - Criação com vínculo de outro administrador não cria falecido nem serviço usando cliente de outro administrador

```
Error: expect(received).toContain(expected) // indexOf

Expected value: 201
Received array: [400, 403]
```

## Reprodução manual via API (`week5/manual/reproducao-api.js`)

```json
[
  {
    "ct": "CT13",
    "desc": "Admin B cria falecido com cliente 1 (de Admin A)",
    "status": 201,
    "body": {
      "id": 5,
      "nome": "Falecido Invadido",
      "data_nascimento": "1950-01-01T02:00:00.000Z",
      "data_falecimento": "2020-01-01T03:00:00.000Z",
      "causa_morte": "Teste",
      "cliente_id": 1,
      "admin_id": 2,
      "criado_em": "2026-11-18T23:20:47.763Z"
    }
  },
  {
    "ct": "CT13",
    "desc": "Admin B cria serviço com cliente 1 / falecido 1 (de Admin A)",
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
      "admin_id": 2,
      "status": "pendente",
      "criado_em": "2026-11-18T23:20:47.773Z"
    }
  }
]
```

## Evidências de origem

- `../week5/jest/resultado-completo.json` e `../week5/jest/junit.xml`
- `../week5/logs/jest-api.log`, `jest-events.log` e `jest-completo.log`
- Ambiente: `../week5/relatorio-transmissao.md`
