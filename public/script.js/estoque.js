async function cadastrarProduto(event) {
    event.preventDefault();

    const produto = {
        nome: document.getElementById("nomeprod").value,
        venda: document.getElementById("precoprod").value,
        descricao: document.getElementById("descricaoprod").value,
        categoria: document.getElementById("categoriaprod").value,
        quantidade_estoque: document.getElementById("quantidadeprod").value,
        unidade_medida: document.getElementById("unidademedidaprod").value,
        estoque_emergencia: document.getElementById("emergenciaprod").value,
        fornecedor: document.getElementById("fornecedoresSelecionados").value
    }
    alert("COCOOOOOOOOOOOOOOOOOOO");

    try {
        const response = await fetch("/produto", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(produto),
        });
        alert("Glória a Deus!");
        const result = await response.json();
        if (response.ok) {
            alert("Produto cadastrado com sucesso!");
            document.getElementById("produtoForm").reset();
        } else {
            alert(`Erro: ${result.message}`);
        }
    alert("amem Jesus");
    } catch (err) {
        console.error("Erro na solicitação:", err);
        alert("Erro ao cadastrar produto.estoque.js");
    }
}

function buscarFornecedores() {

    fetch("/fornecedor")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erro ao buscar fornecedores");
            }
            return response.json();
        })
        .then((servicos) => {
            const select = document.getElementById("fornecedoresSelecionados");
            servicos.forEach((produto) => {
                const option = document.createElement("option");
                option.value = produto.forn_id; // Usa o id como valor
                option.textContent = produto.forn_nome; // Nome do serviço exibido
                select.appendChild(option);
            });
        })
        .catch((error) => {
            console.error("Erro ao carregar os serviços:", error);
        });
}

async function listarProdutos() {
    try {
        const response = await fetch("/produto");

        if (response.ok) {
            const produtos = await response.json();

            const tabela = document.getElementById("table-clientes");
            tabela.innerHTML = ""; // Limpa a tabela antes de preencher

            produtos.forEach((produto) => {
                const linha = document.createElement("tr");
                linha.innerHTML = `
                    <td>${produto.prod_id}</td>
                    <td>${produto.prod_nome}</td>
                    <td>${produto.prod_preco_venda.toFixed(2)}</td>
                    <td>${produto.cat_nome}</td>
                    <td>${produto.prod_quantidade_estoque}</td>
                    <td>${produto.forn_nome}</td>
                `;
                tabela.appendChild(linha);
            });
        } else {
            alert("Erro ao listar produtos.1111");
        }
    } catch (error) {
        console.error("Erro ao listar produtos:222222222", error);
        alert("Erro ao listar produtos3333333333333.");
    }
}

async function limpaform() {
  document.getElementById("nomeprod").value = "";
  document.getElementById("precoprod").value = "";
  document.getElementById("descricaoprod").value = "";
  document.getElementById("categoriaprod").value = "";
  document.getElementById("quantidadeprod").value = "";
  document.getElementById("emergenciaprod").value = "";
  document.getElementById("unidademedidaprod").value = "";
  document.getElementById("fornecedoresSelecionados").value = "";
}
a
