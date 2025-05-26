function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
  }

  function mostrarSecao(secaoId) {
    const secoes = document.querySelectorAll('.main section');
    secoes.forEach(secao => secao.style.display = 'none');
    document.getElementById(secaoId).style.display = 'block';
  }

  function mostrarFormularioProduto() {
    document.getElementById('formProduto').style.display = 'block';
  }

  function fecharFormularioProduto() {
    document.getElementById('formProduto').style.display = 'none';
  }

  // Dados fictícios para o gráfico de vendas
  const vendasData = [500, 700, 600, 800, 900, 1100, 700, 600, 800, 900, 1100, 700, 600, 800];
  const meses = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];

  // Criando gráfico de vendas
  const ctx = document.getElementById('graficoVendas').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: meses,
      datasets: [{
        label: 'Vendas por Mês (R$)',
        data: vendasData,
        borderColor: '#333',
        fill: false,
      }]
    }
  });

  function excluirProduto(button) {
    const row = button.closest('tr');
    row.remove();
  }

  function editarproduto(botao) {
    const linha = botao.closest('tr');
    const celulas = linha.cells;
    
    // Se já está em modo edição, não faz nada
    if (botao.textContent === 'Salvar') return;
    
    // Converte células para inputs
    for (let i = 0; i < celulas.length - 1; i++) {
        celulas[i].innerHTML = `<input value="${celulas[i].textContent}">`;
    }
    
    // Altera o botão para Salvar
    botao.textContent = 'Salvar';
    botao.onclick = function() { salvarEdicao(this); };
}

function salvarEdicao(botao) {
    const linha = botao.closest('tr');
    const celulas = linha.cells;
    
    // Salva os valores dos inputs
    for (let i = 0; i < celulas.length - 1; i++) {
        celulas[i].textContent = celulas[i].querySelector('input').value;
    }
    
    // Restaura o botão Editar
    botao.textContent = 'Editar';
    botao.onclick = function() { editarProduto(this); };
}

  function buscarProduto() {
    const filter = document.getElementById('buscaProduto').value.toLowerCase();
    const rows = document.querySelectorAll('#tabelaEstoque tr');
    rows.forEach(row => {
      const td = row.getElementsByTagName('td')[0];
      if (td) {
        const text = td.textContent || td.innerText;
        if (text.toLowerCase().indexOf(filter) > -1) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      }
    });
  }

  function adicionarProduto() {
    const nome = document.getElementById('nomeProduto').value;
    const quantidade = document.getElementById('quantidadeProduto').value;
    const preco = document.getElementById('precoProduto').value;
    const marca = document.getElementById('marcaProduto').value;
    const fornecedor = document.getElementById('nomeFornecedor').value;

    if (nome && quantidade && preco && marca && fornecedor) {
      const tabela = document.getElementById('tabelaEstoque');
      const novaLinha = tabela.insertRow();
      novaLinha.innerHTML = `
        <td>${nome}</td>
        <td>${quantidade}</td>
        <td>${preco}</td>
        <td>${marca}</td>
        <td>${fornecedor}</td>
        <td><button onclick="excluirProduto(this)">Excluir</button><button onclick="editarproduto(this)">Editar</button></td>
      `;

      // Limpar campos do formulário
      document.getElementById('nomeProduto').value = '';
      document.getElementById('quantidadeProduto').value = '';
      document.getElementById('precoProduto').value = '';
      document.getElementById('marcaProduto').value = '';
      document.getElementById('nomeFornecedor').value = '';

      // Fechar formulário
      fecharFormularioProduto();
    }
  }

  function adicionarLancamento() {
    const tipo = document.getElementById('tipoLancamento').value;
    const descricao = document.getElementById('descricaoLancamento').value;
    const valor = parseFloat(document.getElementById('valorLancamento').value);
    if (tipo && descricao && !isNaN(valor)) {
      const lista = document.getElementById('listaLancamentos');
      const li = document.createElement('li');
      li.textContent = `${tipo === 'receita' ? 'Receita' : 'Despesa'} - ${descricao}: R$ ${valor.toFixed(2)}`;
      lista.appendChild(li);

      // Atualizar totais de receitas e despesas
      const totalReceitas = document.getElementById('totalReceitas');
      const totalDespesas = document.getElementById('totalDespesas');
      let receitas = parseFloat(totalReceitas.textContent) || 0;
      let despesas = parseFloat(totalDespesas.textContent) || 0;

      if (tipo === 'receita') {
        receitas += valor;
        totalReceitas.textContent = receitas.toFixed(2);
      } else {
        despesas += valor;
        totalDespesas.textContent = despesas.toFixed(2);
      }

      const saldo = receitas - despesas;
      document.getElementById('saldoFinal').textContent = saldo.toFixed(2);
    }
  }

  document.getElementById("cpf").addEventListener("input", function(e) {
    // Remove tudo que não é dígito
    let value = e.target.value.replace(/\D/g, "");
    
    // Limita a 11 caracteres (CPF tem 11 dígitos)
    if (value.length > 11) value = value.slice(0, 11);
    
    // Adiciona os pontos e hífen DURANTE a digitação
    value = value.replace(/(\d{3})(\d)/, "$1.$2"); // Primeiro ponto
    value = value.replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3"); // Segundo ponto
    value = value.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4"); // Hífen
    
    e.target.value = value;
  });

  document.getElementById('telefone').addEventListener('input', function(e) {
    // Remove tudo que não é número
    let value = e.target.value.replace(/\D/g, '');
    
    // Aplica a máscara
    if (value.length > 0) {
      value = '(' + value;
    }
    if (value.length > 3) {
      value = value.substring(0, 3) + ') ' + value.substring(3);
    }
    if (value.length > 10) {
      value = value.substring(0, 10) + '-' + value.substring(10);
    }
    
    // Limita ao tamanho máximo do formato (99) 99999-9999 (15 caracteres)
    if (value.length > 15) {
      value = value.substring(0, 15);
    }
    
    e.target.value = value;
  });

  const cepInput = document.getElementById('cep');
  
  // Formatação do CEP
  cepInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 5) {
      value = value.substring(0, 5) + '-' + value.substring(5, 8);
    }
    e.target.value = value;
  });

  // Consulta a API quando o CEP estiver completo
  cepInput.addEventListener('blur', async function(e) {
    const cep = e.target.value.replace(/\D/g, '');
    
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          document.getElementById('logradouro').value = data.logradouro || '';
          document.getElementById('bairro').value = data.bairro || '';
          document.getElementById('cidade').value = data.localidade || '';
          document.getElementById('uf').value = data.uf || '';
        } else {
          alert('CEP não encontrado!');
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        alert('Erro ao consultar CEP. Tente novamente.');
      }
    }
  });

  // Variável para armazenar o último ID gerado
  let ultimoId = 0;
        
  // Função para gerar novo ID
  function gerarNovoId() {
      ultimoId += 1; // Incrementa o ID
      return ultimoId;
  }
  
  // Evento de clique do botão
  document.getElementById('cadfunc').addEventListener('click', function() {
      const novoId = gerarNovoId();
      document.getElementById('resultado').innerHTML = `
          <p>ID: <strong>${novoId}</strong></p>
      `;
  });

  function mostrarfuncionarionovo() {
    document.getElementById('formfunc').style.display = 'block';
  }

  function demitir() {
    document.getElementById('formfunc').style.display = 'none';
  }

  document.getElementById('telefone1').addEventListener('input', function(e) {
    // Remove tudo que não é número
    let value = e.target.value.replace(/\D/g, '');
    
    // Aplica a máscara
    if (value.length > 0) {
      value = '(' + value;
    }
    if (value.length > 3) {
      value = value.substring(0, 3) + ') ' + value.substring(3);
    }
    if (value.length > 10) {
      value = value.substring(0, 10) + '-' + value.substring(10);
    }
    
    // Limita ao tamanho máximo do formato (99) 99999-9999 (15 caracteres)
    if (value.length > 15) {
      value = value.substring(0, 15);
    }
    
    e.target.value = value;
  });

  document.getElementById("cpf1").addEventListener("input", function(e) {
    // Remove tudo que não é dígito
    let value = e.target.value.replace(/\D/g, "");
    
    // Limita a 11 caracteres (CPF tem 11 dígitos)
    if (value.length > 11) value = value.slice(0, 11);
    
    // Adiciona os pontos e hífen DURANTE a digitação
    value = value.replace(/(\d{3})(\d)/, "$1.$2"); // Primeiro ponto
    value = value.replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3"); // Segundo ponto
    value = value.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4"); // Hífen
    
    e.target.value = value;
  });

  // Função para gerar ID automático quando a página carrega
window.onload = function() {
  const randomId = Math.floor(100000 + Math.random() * 900000);
  document.getElementById('clienteId').value = 'CLI-' + randomId;
};

// Função para permitir apenas números
function apenasNumeros(event) {
  const charCode = event.which ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
  }
  return true;
}

// Formatar CPF
function formatarCPF(input) {
  let value = input.value.replace(/\D/g, '');
  
  if (value.length > 3 && value.length <= 6) {
      value = value.replace(/^(\d{3})/, '$1.');
  } else if (value.length > 6 && value.length <= 9) {
      value = value.replace(/^(\d{3})(\d{3})/, '$1.$2.');
  } else if (value.length > 9) {
      value = value.replace(/^(\d{3})(\d{3})(\d{3})/, '$1.$2.$3-');
  }
  
  input.value = value;
}

// Formatar Telefone Celular
function formatarTelefone(input) {
  let value = input.value.replace(/\D/g, '');
  
  if (value.length > 0) {
      value = value.replace(/^(\d{2})/, '($1) ');
  }
  if (value.length > 9) {
      value = value.replace(/(\d{5})/, '$1-');
  }
  
  input.value = value.substring(0, 15);
}

// Formatar Telefone Fixo
function formatarTelefoneFixo(input) {
  let value = input.value.replace(/\D/g, '');
  
  if (value.length > 0) {
      value = value.replace(/^(\d{2})/, '($1) ');
  }
  if (value.length > 9) {
      value = value.replace(/(\d{4})/, '$1-');
  }
  
  input.value = value.substring(0, 14);
}

// Formatar CEP
function formatarCEP(input) {
  let value = input.value.replace(/\D/g, '');
  
  if (value.length > 5) {
      value = value.replace(/^(\d{5})/, '$1-');
  }
  
  input.value = value.substring(0, 9);
}

// Buscar endereço via API ViaCEP
function buscarEndereco(cep) {
  cep = cep.replace(/\D/g, '');
  
  if (cep.length === 8) {
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
          .then(response => response.json())
          .then(data => {
              if (!data.erro) {
                  document.getElementById('rua1').value = data.logradouro || '';
                  document.getElementById('bairro1').value = data.bairro || '';
                  document.getElementById('cidade1').value = data.localidade || '';
                  document.getElementById('estado1').value = data.estado || '';
                  
                  // Focar no campo número após preencher os dados
                  document.getElementById('numero').focus();
              } else {
                  alert('CEP não encontrado. Por favor, preencha manualmente.');
              }
          })
          .catch(error => {
              console.error('Erro ao buscar CEP:', error);
              alert('Erro ao buscar CEP. Por favor, preencha manualmente.');
          });
  }
}

// Validar cadastro antes de enviar
function validarCadastro() {
  // Validações básicas
  if (!document.getElementById('nomeCompleto').value) {
      alert('Por favor, preencha o nome completo');
      return;
  }
  
  if (!document.getElementById('cpf').value || document.getElementById('cpf').value.length < 14) {
      alert('CPF inválido');
      return;
  }
  
  // Aqui você pode adicionar mais validações conforme necessário
  
  alert('Cliente cadastrado com sucesso!');
  // Na prática, você enviaria os dados para o servidor aqui
}