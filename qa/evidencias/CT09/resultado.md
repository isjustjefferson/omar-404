# CT09 – Semana 5, ciclo 1

- Data: 2026-11-18
- Executor: Vinícius
- Commit testado: 6c7d34f (backend idêntico ao fbdc93f)
- Técnica: Jest

## Verificações

| Verificação | Resultado |
|---|---|
| CT09 - Auto-registro de administrador não permite criar administrador via /auth/register | **Falhou** |

## Mensagens de falha (Jest)

### CT09 - Auto-registro de administrador não permite criar administrador via /auth/register

```
Error: expect(received).toContain(expected) // indexOf

Expected value: 201
Received array: [401, 403]
```

## Reprodução manual via API (`week5/manual/reproducao-api.js`)

```json
[
  {
    "ct": "CT09",
    "desc": "POST /auth/register perfil=admin sem token",
    "status": 201,
    "body": {
      "mensagem": "Usuário criado com sucesso",
      "usuario": {
        "id": 8,
        "nome": "Intruso",
        "email": "intruso@teste.com",
        "perfil": "admin"
      }
    }
  },
  {
    "ct": "CT09",
    "desc": "login do admin criado",
    "status": 200,
    "body": {
      "mensagem": "Login realizado com sucesso",
      "token": "<omitido>",
      "usuario": {
        "id": 8,
        "nome": "Intruso",
        "email": "intruso@teste.com",
        "perfil": "admin"
      }
    }
  }
]
```

## Evidências de origem

- `../week5/jest/resultado-completo.json` e `../week5/jest/junit.xml`
- `../week5/logs/jest-api.log`, `jest-events.log` e `jest-completo.log`
- Ambiente: `../week5/relatorio-transmissao.md`
