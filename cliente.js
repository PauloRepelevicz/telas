document.addEventListener('DOMContentLoaded', function () {
    // Menu toggle
    const toggleBtn = document.querySelector('.toggle-btn');
    const sidebar = document.getElementById('sidebar');
    toggleBtn.addEventListener('click', function () {
        sidebar.classList.toggle('active');
    });

    // Formulário de cliente
    const clienteForm = document.getElementById('clienteForm');
    const listaClientes = document.createElement('div');
    listaClientes.className = 'card';
    listaClientes.innerHTML = `
        <h2>Listagem de Clientes</h2>
        <div class="search-container">
            <input type="text" id="searchNome" placeholder="Buscar por nome...">
            <button onclick="buscarClientes()">Buscar</button>
            <button onclick="listarClientes()">Mostrar Todos</button>
        </div>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>CPF</th>
                        <th>Telefone</th>
                        <th>Data Nasc.</th>
                        <th>Endereço</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody id="tabela-clientes"></tbody>
            </table>
        </div>
    `;
    clienteForm.parentNode.insertBefore(listaClientes, clienteForm.nextSibling);

    // Validações de entrada
    document.getElementById('cpf').addEventListener('blur', function () {
        let valor = this.value.replace(/\D/g, '');
        if (!validarCPF(valor)) {
            alert("CPF inválido!");
            this.focus();
        } else {
            this.value = formatarCPF(valor);
        }
    });

    document.getElementById('telefone').addEventListener('blur', function () {
        let valor = this.value.replace(/\D/g, '');
        if (!validarTelefone(valor)) {
            alert("Telefone inválido!");
            this.focus();
        } else {
            this.value = formatarTelefone(valor);
        }
    });

    document.getElementById('email')?.addEventListener('blur', function () {
        if (!validarEmail(this.value)) {
            alert("E-mail inválido!");
            this.focus();
        }
    });

    // CEP automático
    document.getElementById('cep').addEventListener('blur', function () {
        const cep = this.value.replace(/\D/g, '');
        if (cep.length === 8) {
            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(response => response.json())
                .then(data => {
                    if (!data.erro) {
                        document.getElementById('endereco').value = data.logradouro;
                        document.getElementById('bairro').value = data.bairro;
                        document.getElementById('cidade').value = data.localidade;
                        document.getElementById('estado').value = data.uf;
                        this.value = cep.replace(/(\d{5})(\d{3})/, "$1-$2");
                    }
                })
                .catch(error => console.error('Erro ao buscar CEP:', error));
        }
    });

    clienteForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const clienteData = {
            nome: document.getElementById('nome').value.trim(),
            cpf: document.getElementById('cpf').value.trim(),
            telefone: document.getElementById('telefone').value.trim(),
            email: document.getElementById('email')?.value.trim(),
            data_nascimento: document.getElementById('dataNasc').value,
            logradouro: document.getElementById('endereco').value.trim(),
            numero: document.getElementById('numero').value.trim(),
            bairro: document.getElementById('bairro').value.trim(),
            cidade: document.getElementById('cidade').value.trim(),
            estado: document.getElementById('estado').value.trim(),
            cep: document.getElementById('cep').value.trim(),
            complemento: document.getElementById('complemento').value.trim(),
            observacoes: document.getElementById('observacoes').value.trim()
            
        };

        if (!clienteData.nome || !clienteData.cpf) {
            alert('Nome e CPF são obrigatórios!');
            return;
        }

        if (!validarCPF(clienteData.cpf)) {
            alert('CPF inválido!');
            return;
        }

        if (clienteData.telefone && !validarTelefone(clienteData.telefone)) {
            alert('Telefone inválido!');
            return;
        }

        if (clienteData.email && !validarEmail(clienteData.email)) {
            alert('E-mail inválido!');
            return;
        }

        fetch('/clientes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clienteData)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw new Error(err.error) });
                }
                return response.json();
            })
            .then(data => {
                alert('Cliente cadastrado com sucesso! ID: ' + data.id);
                clienteForm.reset();
                listarClientes();
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Erro ao cadastrar cliente: ' + error.message);
            });
    });

    listarClientes();
});

// Funções auxiliares
function validarCPF(cpf) {
    if (!cpf || cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let soma = 0, resto;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) return false;
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
    resto = (soma * 10) % 11;
    return resto === parseInt(cpf[10]);
}

function formatarCPF(cpf) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function validarTelefone(telefone) {
    return /^\d{10,11}$/.test(telefone);
}

function formatarTelefone(telefone) {
    return telefone.length === 11
        ? telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
        : telefone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
}

function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function buscarClientes() {
    const nome = document.getElementById('searchNome').value;
    fetch(`/clientes?nome=${encodeURIComponent(nome)}`)
        .then(response => response.json())
        .then(preencherTabela)
        .catch(() => alert('Erro ao buscar clientes'));
}

// function listarClientes() {
//     fetch('/clientes')
//         .then(response => response.json())
//         .then(preencherTabela)
//         .catch(() => alert('Erro ao listar clientes'));
// }

// function preencherTabela(clientes) {
//     const tabela = document.getElementById('tabela-clientes');
//     tabela.innerHTML = '';
//      return;
//     }
//     clientes.forEach(cliente => {
//         const row = document.createElement('tr');
//         row.innerHTML = `
//             <td>${cliente.cli_id}</td>
//             <td>${cliente.cli_nome}</td>
//             <td>${formatarCPF(cliente.cli_cpf)}</td>
//             <td>${formatarTelefone(cliente.cli_telefone) || '-'}</td>
//             <td>${formatarData(cliente.cli_data_nascimento) || '-'}</td>
//             <td>${formatarEndereco(cliente)}</td>
//             <td>
//                 <button onclick="editarCliente(${cliente.cli_id})">Editar</button>
//                 <button onclick="excluirCliente(${cliente.cli_id})">Excluir</button>
//             </td>
//         `;
//         tabela.appendChild(row);
//     });
// }

// function formatarData(data) {
//     return data ? new Date(data).toLocaleDateString('pt-BR') : '-';
// }

// function formatarEndereco(cliente) {
//     if (!cliente.end_log) return '-';
//     return `${cliente.end_log}, ${cliente.end_num} - ${cliente.end_bairro}, ${cliente.end_cid}`;
// }
//   if (!clientes.length) {
//         tabela.innerHTML = '<tr><td colspan="7">Nenhum cliente encontrado</td></tr>';
     