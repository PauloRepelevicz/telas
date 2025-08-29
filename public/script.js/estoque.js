async function cadastrarProduto(event) {
    event.preventDefault();
  
    const produto = {
        nome: document.getElementById("nomeprod").value,
        preco: parseFloat(document.getElementById("precoprod").value),
        descricao: document.getElementById("descricaoprod").value,
        categoria: document.getElementById("categoria").value,
        quantidade_estoque: parseInt(document.getElementById("quantidade_estoque").value),
        unidade_medida: document.getElementById("unidademedidaprod").value,
        estoque_emergencia: parseInt(document.getElementById("emergenciaprod").value),
    };
    alert('fornecedor_id');
  
    try {
        const response = await fetch('/produto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(produto)
        });
  
        const result = await response.json();
        if (response.ok) {
            alert("Produto cadastrado com sucesso!");
            document.getElementById("produto-form").reset();
        } else {
            alert(`Erro: ${result.message}`);
        }
    } catch (err) {
        console.error("Erro na solicitação:", err);
        alert("Erro ao cadastrar produto.");
    }
  }
  function buscarFornecedores() {
      alert("asdf");
    fetch('/buscar-fornecedores')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar fornecedores');
            }
            return response.json();
        })
        .then(servicos => {
            const select = document.getElementById('fornecedoresSelecionados');
            servicos.forEach(servico => {
                const option = document.createElement('option');
                option.value = servico.forn_id; // Usa o id como valor
                option.textContent = servico.forn_nome; // Nome do serviço exibido
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar os serviços:', error);
        });
  }
  async function listarProdutos() {
    try {
        const response = await fetch('/produto');
  
        if (response.ok) {
            const produtos = await response.json();
  
            const tabela = document.getElementById('tabela-clientes');
            tabela.innerHTML = ''; // Limpa a tabela antes de preencher
  
            produtos.forEach(produto => {
                const linha = document.createElement('tr');
                linha.innerHTML = `
                    <td>${produto.id}</td>
                    <td>${produto.nome}</td>
                    <td>${produto.preco.toFixed(2)}</td>
                    <td>${produto.quantidade_estoque}</td>
                `;
                tabela.appendChild(linha);
            });
        } else {
            alert('Erro ao listar produtos.');
        }
    } catch (error) {
        console.error('Erro ao listar produtos:', error);
        alert('Erro ao listar produtos.');
    }
  }
