async function cadastrarCliente(event) {
    event.preventDefault();

    const cliente = {
        nome: document.getElementById("nome").value,
        cpf: document.getElementById("cpf").value,
        telefone: document.getElementById("telefone").value,
        email: document.getElementById("email").value,
        data_nascimento: document.getElementById("dataNasc").value,
        logradouro: document.getElementById("endereco").value,
        numero: document.getElementById("numero").value,
        bairro: document.getElementById("bairro").value,
        cidade: document.getElementById("cidade").value,
        estado: document.getElementById("estado").value,
        cep: document.getElementById("cep").value,
        complemento: document.getElementById("complemento").value,
        observacoes: document.getElementById("observacoes").value,
    };
    try {
        const response = await fetch("/clientes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(cliente),
        });

        const result = await response.json();
        if (response.ok) {
            alert("Cliente cadastrado com sucesso!");
            document.getElementById("clienteForm").reset();
        } else {
            alert(`Erro: ${result.message}`);
        }
    } catch (err) {
        console.error("Erro na solicitação:", err);
        alert("Erro ao cadastrar cliente.");
    }
}

// ----------------- LISTAR CLIENTES -----------------
async function listarClientes() {
    const cpf = document.getElementById("cpf").value.trim();
    let url = "/clientes";
    if (cpf) url += `?cpf=${cpf}`;

    try {
        const response = await fetch(url);
        const clientes = await response.json();

        const tabela = document.getElementById("tabela-clientes");
        tabela.innerHTML = "";

        if (clientes.length === 0) {
            tabela.innerHTML =
                '<tr><td colspan="6">Nenhum cliente encontrado.</td></tr>';
        } else {
            clientes.forEach((clientes) => {
                const linha = document.createElement("tr");
                linha.innerHTML = `
                    <td>${clientes.cli_id}</td>
                    <td>${clientes.cli_nome}</td>
                    <td>${formatarCPF(clientes.cli_cpf)}</td>
                    <td>${clientes.cli_email}</td>
                    <td>${formatarTelefone(clientes.cli_telefone || "")}</td>
                    <td>${formatarCEP(clientes.cli_cep || "")}</td>
                    <td><button onclick="editarCliente('${clientes.cli_cpf}')">Editar</button></td>
                `;
                tabela.appendChild(linha);
            });
        }
    } catch (error) {
        console.error("Erro ao listar clientes:", error);
    }
}

// ----------------- ATUALIZAR CLIENTE -----------------
async function atualizarCliente() {
    const cpf = document.getElementById("cpf").value;

    const clienteAtualizado = {
        nome: document.getElementById("nome").value,
        telefone: document.getElementById("telefone").value,
        email: document.getElementById("email").value,
        data_nascimento: document.getElementById("dataNasc").value,
        logradouro: document.getElementById("endereco").value,
        numero: document.getElementById("numero").value,
        bairro: document.getElementById("bairro").value,
        cidade: document.getElementById("cidade").value,
        estado: document.getElementById("estado").value,
        cep: document.getElementById("cep").value,
        complemento: document.getElementById("complemento").value,
        observacoes: document.getElementById("observacoes").value,
    };

    try {
        const response = await fetch(`/clientes/cpf/${cpf}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(clienteAtualizado),
        });

        if (response.ok) {
            alert("Cliente atualizado com sucesso!");
        } else {
            const errorMessage = await response.text();
            alert("Erro ao atualizar cliente: " + errorMessage);
        }
    } catch (error) {
        console.error("Erro ao atualizar cliente:", error);
        alert("Erro ao atualizar cliente.");
    }
}

async function limpaCliente() {
    document.getElementById("nome").value = "";
    document.getElementById("cpf").value = "";
    document.getElementById("email").value = "";
    document.getElementById("telefone").value = "";
    document.getElementById("endereco").value = "";
}


///////////////////////////// EDITAR CLIENTE /////////////////////////////
async function editarCliente(cpf) {
    try {
        const response = await fetch(`/clientes?cpf=${cpf}`);
        const cliente = await response.json();

        if (cliente.length === 0) {
            alert("Cliente não encontrado!");
            return;
        }

        const clientes = cliente[0];

        // Preenche os campos do formulário
        document.getElementById("nome").value = 
            clientes.cli_nome || "";
        document.getElementById("cpf").value = 
            clientes.cli_cpf || "";
        document.getElementById("dataNasc").value =
            clientes.cli_data_nascimento || "";
        document.getElementById("email").value =
            clientes.cli_email || "";
        document.getElementById("telefone").value =
            clientes.cli_telefone || "";
        document.getElementById("cep").value = 
            clientes.cli_cep || "";
        document.getElementById("endereco").value =
            clientes.cli_logradouro || "";
        document.getElementById("numero").value =
            clientes.cli_numero || "";
        document.getElementById("complemento").value =
            clientes.cli_complemento || "";
        document.getElementById("bairro").value =
            clientes.cli_bairro || "";
        document.getElementById("cidade").value =
            clientes.cli_cidade || "";
        document.getElementById("estado").value =
            clientes.cli_estado || "";
        document.getElementById("observacoes").value =
            clientes.cli_observacoes || "";

        // Rola a página para o formulário
        document.getElementById("clienteForm").scrollIntoView();
    } catch (error) {
        console.error("Erro ao carregar dados do cliente:", error);
        alert("Erro ao carregar dados do cliente.");
    }
}

// ----------------- FORMATAÇÕES -----------------

// CPF
function formatarCPF(cpf) {
    return cpf
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}
document.getElementById("cpf").addEventListener("input", (e) => {
    e.target.value = formatarCPF(e.target.value);
});

// CEP
function formatarCEP(cep) {
    return cep
        .replace(/\D/g, "")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .slice(0, 9);
}
document.getElementById("cep").addEventListener("input", async (e) => {
    e.target.value = formatarCEP(e.target.value);

    const cep = e.target.value.replace(/\D/g, "");
    if (cep.length === 8) {
        try {
            const response = await fetch(
                `https://viacep.com.br/ws/${cep}/json/`,
            );
            const data = await response.json();
            if (!data.erro) {
                document.getElementById("endereco").value =
                    data.logradouro || "";
                document.getElementById("bairro").value = data.bairro || "";
                document.getElementById("cidade").value = data.localidade || "";
                document.getElementById("estado").value = data.uf || "";
            }
        } catch (err) {
            console.error("Erro ao buscar CEP:", err);
        }
    }
});

// TELEFONE
function formatarTelefone(tel) {
    tel = tel.replace(/\D/g, "");
    if (tel.length <= 10) {
        return tel.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else {
        return tel.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    }
}
document.getElementById("telefone").addEventListener("input", (e) => {
    e.target.value = formatarTelefone(e.target.value);
});

// VALIDAR DATA DE NASCIMENTO
document.getElementById("dataNasc").addEventListener("change", (e) => {
    const dataNasc = new Date(e.target.value);
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNasc.getFullYear();
    const mes = hoje.getMonth() - dataNasc.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < dataNasc.getDate())) {
        idade--;
    }

    if (idade < 18) {
        alert("O cliente deve ter pelo menos 18 anos.");
        e.target.value = "";
    }
});
