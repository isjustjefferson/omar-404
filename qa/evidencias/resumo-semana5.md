# Resumo da Semana 5 – Execução, ciclo 1

**De:** Vinícius (Executor) · **Para:** Elton · **Data:** 18/11/2026 · **Commit testado:** `6c7d34f`

## Números

| Executados | Aprovados | Reprovados | Bloqueados | Pendentes | Total previsto |
|---|---|---|---|---|---|
| 17 | 10 | 7 | 0 | 1 | 18 |

- **Aprovados:** CT01, CT02, CT03, CT04, CT07, CT08, CT11, CT12, CT14, CT26.
- **Reprovados:** CT09, CT10, CT13, CT15, CT24, CT25, CT27. As fichas de incidente estão em [fichas-incidente-semana5.md](fichas-incidente-semana5.md).
- **Pendente:** CT16, caso manual com duas sessões e gravação de tela, ainda não executado.

## Destaques para a análise

1. **CT10:** a remoção de usuário retorna 500, mas **apaga o registro**. O Admin A conseguiu apagar o Admin B e o operador do Admin B.
2. **CT09:** qualquer pessoa, sem token, cria um administrador via `/auth/register` e faz login.
3. **CT13 e CT24 (c, d):** é possível criar falecido e serviço usando cliente e falecido de outro admin. A causa provável é comum aos dois.
4. **CT15:** os eventos em tempo real vão para todos os sockets conectados, inclusive os de outro admin e os sem token.
5. **CT25:** valor 0 é recusado. **CT27:** um PUT sem `status` apaga o status do serviço.

## Situação dos critérios

- **Critério de suspensão:** não atingido. Não há casos bloqueados (o limite é 30%).
- **Ambiente:** estável durante a execução. Houve uma falha de ambiente no Cypress, causada pela variável `ELECTRON_RUN_AS_NODE` do VS Code. Já foi resolvida, e o CT04 passou ao ser executado de novo.

## Pendências

- **Vinícius:** executar o CT16.
- **Elton:** analisar as 7 fichas, registrar os defeitos na matriz e preencher a coluna "Defeito vinculado" no [log de execução](log-execucao.md).
- **Jefferson:**
  - o Jest não encerra o processo sozinho ao final (*open handles*);
  - os testes CT15 e CT27 param na primeira asserção que falha, então parte do caso fica sem verificação.

## Onde está tudo

- Log de execução: [log-execucao.md](log-execucao.md)
- Evidências por caso: `CT01/` … `CT27/`, cada uma com um `resultado.md`
- Relatórios brutos (JUnit, Cucumber, vídeo do Cypress, logs): `week5/`
- Reprodução manual via API: `week5/manual/`
