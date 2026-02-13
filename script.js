const clienteForm = document.getElementById("cliente-form");
const produtoForm = document.getElementById("produto-form");
const listaClientes = document.getElementById("lista-clientes");
const listaProdutos = document.getElementById("lista-produtos");
const buscaCliente = document.getElementById("busca-cliente");
const buscaProduto = document.getElementById("busca-produto");

const STORAGE_CLIENTES = "cadastro_clientes";
const STORAGE_PRODUTOS = "cadastro_produtos";

let clientes = lerDados(STORAGE_CLIENTES).map((cliente) => ({
  ...cliente,
  id: cliente.id || gerarId()
}));
let produtos = lerDados(STORAGE_PRODUTOS).map((produto) => ({
  ...produto,
  id: produto.id || gerarId()
}));

let clienteEmEdicaoId = null;
let produtoEmEdicaoId = null;

salvarDados(STORAGE_CLIENTES, clientes);
salvarDados(STORAGE_PRODUTOS, produtos);

renderizarClientes();
renderizarProdutos();

clienteForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const cpf = document.getElementById("cliente-cpf").value.trim();
  const rg = document.getElementById("cliente-rg").value.trim();
  const nome = document.getElementById("cliente-nome").value.trim();
  const endereco = document.getElementById("cliente-endereco").value.trim();
  const dataNascimento = document.getElementById("cliente-data-nascimento").value;

  if (clienteEmEdicaoId) {
    clientes = clientes.map((cliente) => {
      if (cliente.id !== clienteEmEdicaoId) {
        return cliente;
      }

      return {
        ...cliente,
        cpf,
        rg,
        nome,
        endereco,
        dataNascimento
      };
    });

    clienteEmEdicaoId = null;
    clienteForm.querySelector("button[type='submit']").textContent = "Cadastrar Cliente";
  } else {
    clientes.push({ id: gerarId(), cpf, rg, nome, endereco, dataNascimento });
  }

  salvarDados(STORAGE_CLIENTES, clientes);
  renderizarClientes();
  clienteForm.reset();
});

produtoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const codigo = document.getElementById("produto-codigo").value.trim();
  const descricao = document.getElementById("produto-descricao").value.trim();
  const valorUnitario = Number(document.getElementById("produto-valor-unitario").value);
  const quantidadeEstoque = Number(document.getElementById("produto-quantidade-estoque").value);

  if (produtoEmEdicaoId) {
    produtos = produtos.map((produto) => {
      if (produto.id !== produtoEmEdicaoId) {
        return produto;
      }

      return {
        ...produto,
        codigo,
        descricao,
        valorUnitario,
        quantidadeEstoque
      };
    });

    produtoEmEdicaoId = null;
    produtoForm.querySelector("button[type='submit']").textContent = "Cadastrar Produto";
  } else {
    produtos.push({ id: gerarId(), codigo, descricao, valorUnitario, quantidadeEstoque });
  }

  salvarDados(STORAGE_PRODUTOS, produtos);
  renderizarProdutos();
  produtoForm.reset();
});

buscaCliente.addEventListener("input", () => {
  renderizarClientes();
});

buscaProduto.addEventListener("input", () => {
  renderizarProdutos();
});

listaClientes.addEventListener("click", (event) => {
  const botao = event.target;
  if (!(botao instanceof HTMLButtonElement)) {
    return;
  }

  const id = botao.dataset.id;
  const acao = botao.dataset.acao;
  if (!id || !acao) {
    return;
  }

  if (acao === "excluir") {
    const confirmarExclusao = window.confirm("Deseja realmente excluir este cliente?");
    if (!confirmarExclusao) {
      return;
    }

    clientes = clientes.filter((cliente) => cliente.id !== id);
    if (clienteEmEdicaoId === id) {
      clienteEmEdicaoId = null;
      clienteForm.reset();
      clienteForm.querySelector("button[type='submit']").textContent = "Cadastrar Cliente";
    }
    salvarDados(STORAGE_CLIENTES, clientes);
    renderizarClientes();
    return;
  }

  if (acao === "editar") {
    const cliente = clientes.find((item) => item.id === id);
    if (!cliente) {
      return;
    }

    document.getElementById("cliente-cpf").value = cliente.cpf || "";
    document.getElementById("cliente-rg").value = cliente.rg || "";
    document.getElementById("cliente-nome").value = cliente.nome || "";
    document.getElementById("cliente-endereco").value = cliente.endereco || "";
    document.getElementById("cliente-data-nascimento").value = cliente.dataNascimento || "";

    clienteEmEdicaoId = id;
    clienteForm.querySelector("button[type='submit']").textContent = "Salvar Cliente";
    window.scrollTo({ top: clienteForm.offsetTop - 20, behavior: "smooth" });
  }
});

listaProdutos.addEventListener("click", (event) => {
  const botao = event.target;
  if (!(botao instanceof HTMLButtonElement)) {
    return;
  }

  const id = botao.dataset.id;
  const acao = botao.dataset.acao;
  if (!id || !acao) {
    return;
  }

  if (acao === "excluir") {
    const confirmarExclusao = window.confirm("Deseja realmente excluir este produto?");
    if (!confirmarExclusao) {
      return;
    }

    produtos = produtos.filter((produto) => produto.id !== id);
    if (produtoEmEdicaoId === id) {
      produtoEmEdicaoId = null;
      produtoForm.reset();
      produtoForm.querySelector("button[type='submit']").textContent = "Cadastrar Produto";
    }
    salvarDados(STORAGE_PRODUTOS, produtos);
    renderizarProdutos();
    return;
  }

  if (acao === "editar") {
    const produto = produtos.find((item) => item.id === id);
    if (!produto) {
      return;
    }

    document.getElementById("produto-codigo").value = produto.codigo || "";
    document.getElementById("produto-descricao").value = produto.descricao || "";
    document.getElementById("produto-valor-unitario").value = produto.valorUnitario ?? "";
    document.getElementById("produto-quantidade-estoque").value = produto.quantidadeEstoque ?? "";

    produtoEmEdicaoId = id;
    produtoForm.querySelector("button[type='submit']").textContent = "Salvar Produto";
    window.scrollTo({ top: produtoForm.offsetTop - 20, behavior: "smooth" });
  }
});

function lerDados(chave) {
  try {
    const valor = localStorage.getItem(chave);
    return valor ? JSON.parse(valor) : [];
  } catch {
    return [];
  }
}

function salvarDados(chave, dados) {
  localStorage.setItem(chave, JSON.stringify(dados));
}

function gerarId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function renderizarClientes() {
  listaClientes.innerHTML = "";

  const termo = buscaCliente.value.trim().toLowerCase();
  const clientesFiltrados = clientes.filter((cliente) => {
    if (!termo) {
      return true;
    }

    const nome = (cliente.nome || "").toLowerCase();
    const cpf = (cliente.cpf || "").toLowerCase();
    return nome.includes(termo) || cpf.includes(termo);
  });

  if (!clientesFiltrados.length) {
    listaClientes.innerHTML = '<li class="vazio">Nenhum cliente cadastrado.</li>';
    return;
  }

  clientesFiltrados.forEach((cliente) => {
    const item = document.createElement("li");
    const dataFormatada = cliente.dataNascimento
      ? new Date(`${cliente.dataNascimento}T00:00:00`).toLocaleDateString("pt-BR")
      : "Não informada";

    item.innerHTML = `
      <div class="item-texto">CPF: ${cliente.cpf || "-"} • RG: ${cliente.rg || "-"} • Nome: ${cliente.nome || "-"} • Endereço: ${cliente.endereco || "-"} • Nascimento: ${dataFormatada}</div>
      <div class="item-acoes">
        <button type="button" class="btn-acao" data-acao="editar" data-id="${cliente.id}">Editar</button>
        <button type="button" class="btn-acao btn-excluir" data-acao="excluir" data-id="${cliente.id}">Excluir</button>
      </div>
    `;
    listaClientes.appendChild(item);
  });
}

function renderizarProdutos() {
  listaProdutos.innerHTML = "";

  const termo = buscaProduto.value.trim().toLowerCase();
  const produtosFiltrados = produtos.filter((produto) => {
    if (!termo) {
      return true;
    }

    const codigo = (produto.codigo || "").toLowerCase();
    const descricao = (produto.descricao || "").toLowerCase();
    return codigo.includes(termo) || descricao.includes(termo);
  });

  if (!produtosFiltrados.length) {
    listaProdutos.innerHTML = '<li class="vazio">Nenhum produto cadastrado.</li>';
    return;
  }

  produtosFiltrados.forEach((produto) => {
    const item = document.createElement("li");
    const valorFormatado = Number(produto.valorUnitario || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });

    item.innerHTML = `
      <div class="item-texto">Código: ${produto.codigo || "-"} • Descrição: ${produto.descricao || "-"} • Valor unitário: ${valorFormatado} • Estoque: ${Number(produto.quantidadeEstoque || 0)}</div>
      <div class="item-acoes">
        <button type="button" class="btn-acao" data-acao="editar" data-id="${produto.id}">Editar</button>
        <button type="button" class="btn-acao btn-excluir" data-acao="excluir" data-id="${produto.id}">Excluir</button>
      </div>
    `;
    listaProdutos.appendChild(item);
  });
}