document.addEventListener('DOMContentLoaded', function() {
    // Menu toggle
    const toggleBtn = document.querySelector('.toggle-btn');
    const sidebar = document.getElementById('sidebar');
    
    toggleBtn.addEventListener('click', function() {
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

    clienteForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Coletar dados do formulário
        const clienteData = {
            nome: document.getElementById('nome').value,
            cpf: document.getElementById('cpf').value,
            telefone: document.getElementById('telefone').value,
            data_nascimento: document.getElementById('dataNasc').value,
            endereco: {
                logradouro: document.getElementById('endereco').value,
                numero: document.getElementById('numero').value,
                bairro: document.getElementById('bairro').value,
                cidade: document.getElementById('cidade').value,
                cep: document.getElementById('cep').value
            }
        };

        // Validar campos obrigatórios
        if (!clienteData.nome || !clienteData.cpf) {
            alert('Nome e CPF são obrigatórios!');
            return;
        }

        // Enviar para o servidor
        fetch('/clientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
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

    // Buscar CEP automático
    document.getElementById('cep').addEventListener('blur', function() {
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
                    }
                })
                .catch(error => console.error('Erro ao buscar CEP:', error));
        }
    });

    // Carregar clientes ao abrir a página
    listarClientes();
});

function buscarClientes() {
    const nome = document.getElementById('searchNome').value;
    fetch(`/clientes?nome=${encodeURIComponent(nome)}`)
        .then(response => response.json())
        .then(clientes => {
            preencherTabela(clientes);
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao buscar clientes');
        });
}

function listarClientes() {
    fetch('/clientes')
        .then(response => response.json())
        .then(clientes => {
            preencherTabela(clientes);
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao listar clientes');
        });
}

function preencherTabela(clientes) {
    const tabela = document.getElementById('tabela-clientes');
    tabela.innerHTML = '';
    
    if (clientes.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="7">Nenhum cliente encontrado</td>';
        tabela.appendChild(row);
        return;
    }
    
    clientes.forEach(cliente => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cliente.cli_id}</td>
            <td>${cliente.cli_nome}</td>
            <td>${formatarCPF(cliente.cli_cpf)}</td>
            <td>${formatarTelefone(cliente.cli_telefone) || '-'}</td>
            <td>${formatarData(cliente.cli_data_nascimento) || '-'}</td>
            <td>${formatarEndereco(cliente)}</td>
            <td class="actions">
                <button onclick="editarCliente(${cliente.cli_id})">Editar</button>
                <button onclick="excluirCliente(${cliente.cli_id})">Excluir</button>
            </td>
        `;
        tabela.appendChild(row);
    });
}

function editarCliente(id) {
    fetch(`/clientes/${id}`)
        .then(response => response.json())
        .then(cliente => {
            // Preencher formulário com dados do cliente
            document.getElementById('nome').value = cliente.cli_nome;
            document.getElementById('cpf').value = cliente.cli_cpf;
            document.getElementById('telefone').value = cliente.cli_telefone;
            document.getElementById('dataNasc').value = cliente.cli_data_nascimento;
            
            // Preencher endereço
            if (cliente.end_log) {
                document.getElementById('endereco').value = cliente.end_log;
                document.getElementById('numero').value = cliente.end_num;
                document.getElementById('bairro').value = cliente.end_bairro;
                document.getElementById('cidade').value = cliente.end_cid;
                document.getElementById('cep').value = cliente.end_cep;
            }
            
            // Rolagem para o formulário
            document.getElementById('clienteForm').scrollIntoView();
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao carregar cliente para edição');
        });
}

function excluirCliente(id) {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
        fetch(`/clientes/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.error) });
            }
            return response.json();
        })
        .then(data => {
            alert('Cliente excluído com sucesso!');
            listarClientes();
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao excluir cliente: ' + error.message);
        });
    }
}

// Funções auxiliares para formatação
function formatarCPF(cpf) {
    if (!cpf) return '-';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatarTelefone(telefone) {
    if (!telefone) return '-';
    return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
}

function formatarData(data) {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR');
}

function formatarEndereco(cliente) {
    if (!cliente.end_log) return '-';
    return `${cliente.end_log}, ${cliente.end_num} - ${cliente.end_bairro}, ${cliente.end_cid}`;
}