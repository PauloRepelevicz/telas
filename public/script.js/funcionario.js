async function cadastrarFunc(event) {
    event.preventDefault();
    alert("LEOZAO VAI PEGA A ALESSANDRA E CASA COM ELA ELA É LINDINHA E O LEOZAO É UM BURRO E UM BURRO QUE É BURRO E BURRO E BURRO E BURRO E BURRO E BURRO E BURRO E BURRO E BURRO E BURRO E BURRO E BURRO ");

    const funcionario = {
        nome: document.getElementById('nomefunc').value,
        cpf: document.getElementById('cpfunc').value,
        telefone: document.getElementById('telefonefunc').value,
        cargo: document.getElementById('cargofunc').value,
        email: document.getElementById('emailfunc').value,
        data_nascimento: document.getElementById('dataNascfunc').value,
        genero: document.getElementById('generofunc').value,
        logradouro: document.getElementById('enderecofunc').value,
        numero: document.getElementById('numerofunc').value,
        bairro: document.getElementById('bairrofunc').value,
        cidade: document.getElementById('cidadefunc').value,
        estado: document.getElementById('estadofunc').value,
        cep: document.getElementById('cepfunc').value,
        complemento: document.getElementById('complementofunc').value,
        observacoes: document.getElementById('observacoesfunc').value
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
            document.getElementById("funcForm").reset();
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
     console.log("Leozao deu a bunda ")
     const cpf = document.getElementById('cpfunc').value.trim();  // Pega o valor do CPF digitado no input

     let url = '/funcionario';  // URL padrão para todos os funcionarios

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
                     <td>${funcionario.func_logradouro}</td>
                     <td>${funcionario.func_cargo}</td>
                     
                 `;
                 tabela.appendChild(linha);
             });
         }
     } catch (error) {
         console.error('Erro ao listar funcionários:', error);
     }
 }

async function atualizarFuncionario() {

    const cpf = document.getElementById("cpfunc").value;

    const funcionarioAtualizado = { 
        nome: document.getElementById("nomefunc").value,
        telefone: document.getElementById("telefonefunc").value,
        email: document.getElementById("emailfunc").value,
        data_nascimento: document.getElementById("dataNascfunc").value,
        cargo: document.getElementById("cargofunc").value,
        logradouro: document.getElementById("enderecofunc").value,
        numero: document.getElementById("numerofunc").value,
        bairro: document.getElementById("bairrofunc").value,
        cidade: document.getElementById("cidadefunc").value,
        estado: document.getElementById("estadofunc").value,
        cep: document.getElementById("cepfunc").value,
        complemento: document.getElementById("complementofunc").value,
        observacoes: document.getElementById("observacoesfunc").value
    };

    try {
        const response = await fetch(`/funcionario/cpf/${cpf}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(funcionarioAtualizado),
        });

        if (response.ok) {
            alert("Funcionário atualizado com sucesso!");
        } else {
            const errorMessage = await response.text();
            alert("Erro ao atualizar Funcionário: " + errorMessage);
        }
    } catch (error) {
        console.error("222Erro ao atualizar Funcionário:", error);
        alert("Erro ao atualizar Funcionário.");
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
