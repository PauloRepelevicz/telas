document.addEventListener('DOMContentLoaded', function() {
    const contentBox = document.getElementById('content-box');
    const links = document.querySelectorAll('[data-section]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            
            // Atualiza o conteúdo do main
            contentBox.className = 'content-box'; // Reseta as classes
            contentBox.classList.add(section); // Adiciona a classe da seção
            
            // Exemplo de conteúdo dinâmico (pode ser substituído por AJAX ou algo similar)
            const titles = {
                'cliente': 'Cadastro de Cliente',
                'funcionario': 'Cadastro de Funcionário',
                'relatorio': 'Relatório Financeiro',
                'receita': 'Adicionar Receita',
                'despesa': 'Adicionar Despesa',
                'estoque': 'Controle de Estoque'
            };
            
            contentBox.innerHTML = `<h1>${titles[section]}</h1><p>Conteúdo da seção ${section}.</p>`;
        });
    });
});