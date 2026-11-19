# CT10 – Semana 5, ciclo 1

- Data: 2026-11-18
- Executor: Vinícius
- Commit testado: 6c7d34f (backend idêntico ao fbdc93f)
- Técnica: Jest

## Verificações

| Verificação | Resultado |
|---|---|
| CT10 - Remoção de operadores (a) admin remove operador do próprio vínculo | **Falhou** |
| CT10 - Remoção de operadores (b) não remove operador de outro administrador | **Falhou** |
| CT10 - Remoção de operadores (c) não remove outro administrador | **Falhou** |
| CT10 - Remoção de operadores (d) ID inexistente retorna 404 | **Falhou** |

## Mensagens de falha (Jest)

### CT10 - Remoção de operadores (a) admin remove operador do próprio vínculo

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 500
```

### CT10 - Remoção de operadores (b) não remove operador de outro administrador

```
Error: expect(received).toContain(expected) // indexOf

Expected value: 500
Received array: [400, 403]
```

### CT10 - Remoção de operadores (c) não remove outro administrador

```
Error: expect(received).toContain(expected) // indexOf

Expected value: 500
Received array: [400, 403]
```

### CT10 - Remoção de operadores (d) ID inexistente retorna 404

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 404
Received: 500
```

## Reprodução manual via API (`week5/manual/reproducao-api.js`)

```json
[
  {
    "ct": "CT10a",
    "desc": "Admin A remove Operador A1 (id 3)",
    "status": 500,
    "body": {
      "erro": "PublicKeyCredential is not defined"
    }
  },
  {
    "ct": "CT10a",
    "banco": null
  },
  {
    "ct": "CT10b",
    "desc": "Admin A remove Operador B1 (id 4, de Admin B)",
    "status": 500,
    "body": {
      "erro": "PublicKeyCredential is not defined"
    }
  },
  {
    "ct": "CT10b",
    "banco": null
  },
  {
    "ct": "CT10c",
    "desc": "Admin A remove Admin B (id 2)",
    "status": 500,
    "body": {
      "erro": "PublicKeyCredential is not defined"
    }
  },
  {
    "ct": "CT10c",
    "banco": null
  },
  {
    "ct": "CT10d",
    "desc": "Admin A remove id inexistente 9999",
    "status": 500,
    "body": {
      "erro": "Cannot read properties of undefined (reading 'id')"
    }
  }
]
```

## Evidências de origem

- `../week5/jest/resultado-completo.json` e `../week5/jest/junit.xml`
- `../week5/logs/jest-api.log`, `jest-events.log` e `jest-completo.log`
- Ambiente: `../week5/relatorio-transmissao.md`
