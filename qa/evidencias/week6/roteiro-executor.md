# Handoff da automação - Semana 6

## Escopo automatizado

| CT | Suíte | Evidência principal |
| --- | --- | --- |
| CT05 | Jest API | `jest/api-junit.xml`, `logs/jest-api.log` |
| CT06 | Jest API | `jest/api-junit.xml`, `logs/jest-api.log` |
| CT17 | Jest API | `jest/api-junit.xml`, `logs/jest-api.log` |
| CT18 | Jest API + Jest unitário | `jest/api-junit.xml`, `jest/unit-junit.xml` |
| CT19 | Jest API | `jest/api-junit.xml`, `logs/jest-api.log` |
| CT20 | Jest API | `jest/api-junit.xml`, `logs/jest-api.log` |
| CT21 | Cypress | `cypress/videos/`, `cypress/screenshots/` |
| CT22 | Jest API | `jest/api-junit.xml`, `logs/jest-api.log` |
| CT23 | Jest API | `jest/api-junit.xml`, `logs/jest-api.log` |

Não há BDD nem casos manuais novos na Semana 6. CT16 continua pendente da Semana 5 e não faz parte deste handoff.

## Pré-condições

1. Manter o WSL2 ativo: `wsl.exe -e sleep infinity`.
2. Confirmar PostgreSQL e Redis no WSL2.
3. Instalar dependências do projeto e do QA, se ainda não houver:
   - `npm ci` em `backend/` e `frontend/`.
   - `npm install` em `qa/`.
4. Conferir `qa/.env.test`: banco `omar404_test`, Redis lógico `/1`, segredo JWT próprio e conta de e-mail de teste.
5. Conferir ambiente com `npm --prefix qa run env:check`.

## Como executar

Da raiz do repositório:

```powershell
npm --prefix qa run test:week6
```

O orquestrador `qa/scripts/run-week6.js`:

1. reseta banco e Redis;
2. aplica a massa de teste;
3. sobe backend e frontend, se necessário;
4. executa Jest API, Jest unitário e Cypress;
5. grava `qa/evidencias/week6/relatorio-automacao.md`;
6. encerra os processos que iniciou.

Para repetir uma suíte isolada:

```powershell
npm --prefix qa run test:week6:api
npm --prefix qa run test:week6:unit
npm --prefix qa run test:week6:e2e
```

Cada comando isolado também reseta e semeia o banco por meio do `globalSetup` do Jest ou do config do Cypress usado pelo orquestrador.

## Massa de dados

A massa gerada fica em `qa/evidencias/week6/massa-dados.md`.

Pontos importantes:

- Admin A, Admin B, Operador A1, Operador B1, Admin C (sem clientes), Admin D (com cliente e sem falecidos) e operador órfão são recriados a cada reset.
- Os CPFs `529.982.247-25` e `11144477735` ficam reservados para CT17/CT21. A massa fixa usa outros CPFs para não interferir nesses casos.
- CT05 e CT06 geram e-mails únicos automaticamente. Não reutilize e-mails já confirmados.
- Senha comum dos usuários de teste: `Senha@123`.

## Cuidados específicos

### CT05 e CT06

O código de verificação é lido diretamente da tabela `verificacoes_email`, sem depender da chegada do e-mail. Se precisar conferir manualmente:

```sql
SELECT codigo, expira_em
FROM verificacoes_email
WHERE email = '...'
ORDER BY criado_em DESC
LIMIT 1;
```

Para ajustar manualmente o limite de 15 minutos:

```sql
UPDATE verificacoes_email
SET expira_em = NOW() + INTERVAL '14 minutes 59 seconds'
WHERE email = '...';
```

Use `NOW() - INTERVAL '1 second'` para simular 15 min 1 s.

### CT17 a CT21

- CT17 usa CPF válido com e sem máscara, e CPFs com 10 e 12 dígitos.
- CT18 valida CPFs inválidos na API e também em `Cliente.criar` com banco simulado.
- CT19 cria um cliente base com `52998224725` e tenta os dois formatos. Compare com o documento de casos de teste: se os dois formatos não forem reconhecidos como duplicidade, o caso deve ser tratado como divergência, não ajustado no script.
- CT20 usa registros da massa e cria registros auxiliares. Verifique no banco que CPF não foi alterado na atualização e que remoções com vínculo foram bloqueadas.
- CT21 usa a interface real. Guarde o vídeo do Cypress como evidência.

### CT22 e CT23

- As datas são calculadas em relação ao dia da execução, então o teste continua válido em qualquer data.
- CT22(c) envia apenas nome, data de falecimento e cliente.
- CT23(b) usa Admin C, que não possui clientes, e deve receber orientação para cadastrar um cliente antes.

## Próximos passos do executor

1. Abrir `qa/evidencias/week6/relatorio-automacao.md` e identificar se alguma etapa terminou com código diferente de zero.
2. Abrir `jest/api-junit.xml`, `jest/unit-junit.xml` e os vídeos de `cypress/videos/` e comparar cada CT com o documento `Omar-404 – Casos de Teste.md`.
3. Preencher o log de execução próprio da Semana 6 com **Aprovado**, **Reprovado** ou **Bloqueado** para cada CT.
4. Organizar a evidência por caso, por exemplo `qa/evidencias/week6/CT05/`, copiando o trecho do JUnit, o log ou o vídeo correspondente.
5. Se houver divergência de comportamento, avisar Elton com a ficha de incidente da seção 7 do guia de execução. Não alterar os testes para forçar aprovação.
6. Se o problema for de infraestrutura — banco, Redis, backend não reconhecido, timeout de inicialização ou erro no script — marcar como **Bloqueado** e chamar Jefferson.

## Observações

- `relatorio-automacao.md` não substitui o log de execução: ele apenas prova que as suítes rodaram.
- O relatório não registra `log-execucao.md` nem `hipoteses-defeito.md`; esses documentos pertencem ao executor e ao analista de defeitos.
- Não edite `.env.test` com credenciais reais de produção. O arquivo não é versionado.
