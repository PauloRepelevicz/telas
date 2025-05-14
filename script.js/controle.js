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
  const vendasData = [500, 700, 600, 800, 900, 1100];
  const meses = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

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

    if (nome && quantidade && preco) {
      const tabela = document.getElementById('tabelaEstoque');
      const novaLinha = tabela.insertRow();
      novaLinha.innerHTML = `
        <td>${nome}</td>
        <td>${quantidade}</td>
        <td>${preco}</td>
        <td><button onclick="excluirProduto(this)">Excluir</button></td>
      `;

      // Limpar campos do formulário
      document.getElementById('nomeProduto').value = '';
      document.getElementById('quantidadeProduto').value = '';
      document.getElementById('precoProduto').value = '';

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