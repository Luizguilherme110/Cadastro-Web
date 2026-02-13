# Cadastro Web

Projeto simples de cadastro de **clientes** e **produtos**, feito para rodar direto no navegador.

## Tecnologias usadas

- **HTML**: estrutura da página e formulários.
- **CSS**: estilo visual com tema roxo neon em gradiente (sem exagero).
- **JavaScript (vanilla)**: lógica de cadastro, busca, edição, exclusão e persistência dos dados.

## Como funciona

- Você preenche os formulários de cliente e produto.
- Ao clicar em cadastrar, os dados aparecem na lista abaixo.
- Dá para buscar:
  - cliente por **nome** ou **CPF**;
  - produto por **código** ou **descrição**.
- Cada item tem ações de **editar** e **excluir**.
- Antes de excluir, o sistema pede confirmação.
- Os dados ficam salvos no navegador usando **localStorage**.

## Campos do sistema

### Cliente

- CPF
- RG
- Nome
- Endereço
- Data de nascimento

### Produto

- Código
- Descrição
- Valor unitário
- Quantidade em estoque

## Como executar

1. Abra a pasta do projeto.
2. Abra o arquivo `index.html` no navegador.
3. Pronto, já pode usar.

---

Se quiser evoluir depois, uma boa próxima melhoria é exportar os dados para CSV/JSON.