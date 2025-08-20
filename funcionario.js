async function cadastrarFunc(event) {
    event.preventDefault();
    alert("asdf");

    const funcionario = {
        nome: document.getElementById('nome').value,
        cpf: document.getElementById('cpf').value,
        telefone: document.getElementById('telefone').value,
        cargo: document.getElementById('cargo').value,
        email: document.getElementById('email').value,
        data_nascimento: document.getElementById('dataNasc').value,
        genero: document.getElementById('genero').value,
        logradouro: document.getElementById('endereco').value,
        numero: document.getElementById('numero').value,
        bairro: document.getElementById('bairro').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value,
















        
        cep: document.getElementById('cep').value,
        complemento: document.getElementById('complemento').value,
        observacoes: document.getElementById('observacoes').value
    };

    try {
        const response = await fetch('/funcionario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(funcionario)
        });

        const result = await response.json();
        if (response.ok) {
            alert("Funcionário cadastrado com sucesso!");
            document.getElementById("func-Form").reset();
        } else {
            alert(`Erro: ${result.message}`);
        }
    } catch (err) {
        console.error("Erro na solicitação:", err);
        alert("Erro ao cadastrar Funcionário.?");
    }
}
// Função para listar todos os funcionários ou buscar funcionários por CPF
async function listarFuncionarios() {
    console.log("Voce é viado")
    const cpf = document.getElementById('cpf').value.trim();  // Pega o valor do CPF digitado no input

    let url = '/funcionarios';  // URL padrão para todos os funcionarios

    if (cpf) {
        // Se CPF foi digitado, adiciona o parâmetro de consulta
        url += `?cpf=${cpf}`;
    }
    console.log("Voce é viado 1000")
    try {
        const response = await fetch(url);
        const funcionarios = await response.json();

        const tabela = document.getElementById('tabela-funcionarios');
        tabela.innerHTML = ''; // Limpa a tabela antes de preencher

        if (funcionarios.length === 0) {
            // Caso não encontre funcionários, exibe uma mensagem
            tabela.innerHTML = '<tr><td colspan="6">Nenhum funcionário encontrado.</td></tr>';
        } else {
            funcionarios.forEach(funcionario => {
                const linha = document.createElement('tr');
                linha.innerHTML = `
                    <td>${funcionario.func_id}</td>
                    <td>${funcionario.func_nome}</td>
                    <td>${funcionario.func_cpf}</td>
                    <td>${funcionario.func_email}</td>
                    <td>${funcionario.func_telefone}</td>
                `;
                tabela.appendChild(linha);
            });
        }
    } catch (error) {
        console.error('Erro ao listar funcionários:', error);
    }
}
// Função para atualizar as informações do Funcionário
async function atualizarFuncionario() {
    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const endereco = document.getElementById('endereco').value;

    const funcionarioAtualizado = {
        nome,
        email,
        telefone,
        cargo,
        endereco,
        cpf
    };

    try {
        const response = await fetch(`/funcionario/cpf/${cpf}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(funcionarioAtualizado)
        });

        if (response.ok) {
            alert('Funcionário atualizado com sucesso!');
        } else {
            const errorMessage = await response.text();
            alert('Erro ao atualizar Funcionário: ' + errorMessage);
        }
    } catch (error) {
        console.error('Erro ao atualizar Funcionário:', error);
        alert('Erro ao atualizar Funcionário.');
    }
}


async function limpaFunc() {
    document.getElementById('nome').value = '';
    document.getElementById('cpf').value = '';
    document.getElementById('email').value = '';
    document.getElementById('telefone').value = '';
    document.getElementById('cargo').value = '';
    document.getElementById('endereco').value = '';
}
