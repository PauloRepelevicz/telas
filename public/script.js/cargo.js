async function cadastrarCargo(event) {
    event.preventDefault();

    const cargo = {
        nome: document.getElementById("nomecargo").value,
        salario: document.getElementById("salariocargo").value,
        descricao: document.getElementById("descricaocargo").value,
        observacoes: document.getElementById("observacoescargo").value
    };
    try {
        const response = await fetch("/cargo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(cargo),
        });

        const result = await response.json();
        if (response.ok) {
            alert("Cargo cadastrado com sucesso!");
            document.getElementById("cargoForm").reset();
        } else {
            alert(`Erro: ${result.message}`);
        }
    } catch (err) {
        console.error("Erro na solicitação:", err);
        alert("Erro ao cadastrar cargoAAAAAAAAAAAAAAAAAAAAAA(mesmo erro).");
    }
}


// ----------------- LISTAR CARGO -----------------
async function listarCargos() {
    const nome = document.getElementById("nomecargo").value.trim();
    let url = "/cargo";
    if (nome) url += `?nome=${nome}`;

    try {
        const response = await fetch(url);
        const cargo = await response.json();

        const tabela = document.getElementById("tabela-cargos");
        tabela.innerHTML = "";

        if (cargo.length === 0) {
            tabela.innerHTML =
                '<tr><td colspan="6">Nenhum cargo encontrado.</td></tr>';
        } else {
            cargo.forEach((cargo) => {
                const linha = document.createElement("tr");
                linha.innerHTML = `
                  <td>${cargo.car_id}</td>
                  <td>${cargo.car_nome}</td>
                  <td>${cargo.car_salario}</td>
                  <td><button onclick="editarCargos('${cargo.car_nome}')">Editar</button></td>
              `;
                tabela.appendChild(linha);
            });
        }
    } catch (error) {
        console.error("Erro ao listar cargo:", error);
    }
}

///////////////////////////// EDITAR FUNCIONÁRIO /////////////////////////////
async function editarCargos(nome) {
    try {
        const response = await fetch(`/cargo?nome=${nome}`);
        const cargos = await response.json();

        if (cargos.length === 0) {
            alert("Cargo não encontrado!");
            return;
        }

        const cargo = cargos[0];

        // Preenche os campos do formulário
        document.getElementById("nomecargo").value = cargo.car_nome || "";
        document.getElementById("salariocargo").value = cargo.car_salario || "";
        document.getElementById("descricaocargo").value = cargo.car_descricao || "";
        document.getElementById("observacoescargo").value = cargo.car_observacoes || "";
        
        // Rola a página para o formulário
        document.getElementById("cargoForm").scrollIntoView();
    } catch (error) {
        console.error("Erro ao carregar dados do cargos:", error);
        alert("Erro ao carregar dados do cargo.");
    }
}

// ----------------- ATUALIZAR CARGO -----------------
async function atualizarCargo() {
    const nome = document.getElementById("nomecargo").value;

    const cargoAtualizado = {
        nome: document.getElementById("nomecargo").value,
        salario: document.getElementById("salariocargo").value,
        descricao: document.getElementById("descricaocargo").value,
        observacoes: document.getElementById("observacoescargo").value
    };

    try {
        const response = await fetch(`/cargo/nome/${nome}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(cargoAtualizado),
        });

        if (response.ok) {
            alert("Cargo atualizado com sucesso!");
        } else {
            const errorMessage = await response.text();
            alert("Erro ao atualizar cargo: " + errorMessage);
        }
    } catch (error) {
        console.error("Erro ao atualizar cargo:", error);
        alert("Erro ao atualizar cargo.");
    }
}

async function limpaCargo() {
    document.getElementById("nomecargo").value = "";
    document.getElementById("salariocargo").value = "";
    document.getElementById("descricaocargo").value = "";
    document.getElementById("observacoescargo").value = "";
}
