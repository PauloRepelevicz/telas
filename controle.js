d// Função para mostrar o formulário selecionado
function showForm(formId) {
    // Oculta todos os formulários
    document.querySelectorAll('.form-container').forEach(form => {
        form.classList.remove('active');
    });
    
    // Oculta a mensagem de boas-vindas
    document.getElementById('welcome-message').style.display = 'none';
    
    // Mostra o formulário selecionado
    document.getElementById(formId + '-form').classList.add('active');
}

// Funções de exemplo para as funcionalidades
function gerarRelatorio() {
    const periodo = document.getElementById('relatorio-periodo').value;
    let resultado = '';
    
    switch(periodo) {
        case 'dia':
            resultado = '<p>Relatório do dia:<br>Receitas: R$ 1.200,00<br>Despesas: R$ 800,00<br>Saldo: R$ 400,00</p>';
            break;
        case 'semana':
            resultado = '<p>Relatório da semana:<br>Receitas: R$ 8.500,00<br>Despesas: R$ 5.200,00<br>Saldo: R$ 3.300,00</p>';
            break;
        case 'mes':
            resultado = '<p>Relatório do mês:<br>Receitas: R$ 35.000,00<br>Despesas: R$ 22.000,00<br>Saldo: R$ 13.000,00</p>';
            break;
    }
    
    document.getElementById('relatorio-resultado').innerHTML = resultado;
}

function pesquisarProduto() {
    const produto = document.getElementById('estoque-produto').value;
    // Simulação de busca
    document.getElementById('estoque-resultado').innerHTML = `
        <h3>Resultados para "${produto || 'todos os produtos'}"</h3>
        <table style="width:100%; border-collapse: collapse;">
            <thead>
                <tr style="background-color: #f2f2f2;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Produto</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Quantidade</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Preço</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">${produto || 'Arroz'} 5kg</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">120</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">R$ 22,90</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">${produto || 'Feijão'} 1kg</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">85</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">R$ 8,50</td>
                </tr>
            </tbody>
        </table>
    `;
}

// Adiciona eventos de submit aos formulários
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Formulário enviado com sucesso!');
        this.reset();
    });
});