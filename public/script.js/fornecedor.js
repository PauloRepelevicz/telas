async function cadastrarForn(event) {
  event.preventDefault();
  const fornecedor = {
      nome: document.getElementById("nomeforn").value,
      cnpj: document.getElementById("cnpjforn").value,
      telefone: document.getElementById("telefoneforn").value,
      email: document.getElementById("emailforn").value,
      logradouro: document.getElementById("enderecoforn").value,
      numero: document.getElementById("numeroforn").value,
      bairro: document.getElementById("bairroforn").value,
      cidade: document.getElementById("cidadeforn").value,
      estado: document.getElementById("estadoforn").value,
      cep: document.getElementById("cepforn").value,
      complemento: document.getElementById("complementoforn").value,
      observacoes: document.getElementById("observacoesforn").value
  };
  try {
      const response = await fetch("/fornecedor", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(fornecedor),
      });
      const result = await response.json();
      if (response.ok) {
          alert("Fornecedor cadastrado com sucesso!");
          document.getElementById("FornecedorForm").reset();
      } else {
          alert(`Erro: ${result.message}`);
      }
  } catch (err) {
      console.error("Erro na solicitação:", err);
      //alert("Erro ao cadastrar fornecedor.fornecedor.js");
  }
}

// ----------------- LISTAR FORNECEDOR -----------------
async function listarFornecedor() {
  const cnpj = document.getElementById("cnpjforn").value.trim();
  let url = "/fornecedor";

  if (cnpj) url += `?cnpj=${cnpj}`;

  try {
      const response = await fetch(url);
      const fornecedor = await response.json();

      const tabela = document.getElementById("tabela-fornecedores");
      tabela.innerHTML = "";

      if (fornecedor.length === 0) {
          tabela.innerHTML =
              '<tr><td colspan="6">Nenhum fornecedor encontrado.</td></tr>';
      } else {
          fornecedor.forEach((fornecedor) => {
              const linha = document.createElement("tr");
              linha.innerHTML = `
                  <td>${fornecedor.forn_id}</td>
                  <td>${fornecedor.forn_nome}</td>
                  <td>${fornecedor.forn_cnpj}</td>
                  <td>${fornecedor.forn_email}</td>
                  <td>${formatarTelefone(fornecedor.forn_telefone || "")}</td>
                  <td>${formatarCEP(fornecedor.forn_cep || "")}</td>
                  <td><button class="btn-update" onclick="editarFornecedores('${fornecedor.forn_cnpj}')">Editar</button></td>
              `; 
              tabela.appendChild(linha);
          });
      }
  } catch (error) {
      console.error("Erro ao listar fornecedores:", error);
  }
}

// ----------------- EDITAR FORNECEDOR --------------------

async function editarFornecedores(cnpj) {
    try {
        const response = await fetch(`/fornecedor?cnpj=${cnpj}`);
        const fornecedores = await response.json();

        if (fornecedores.length === 0) {
            alert("Fornecedores não encontrado!");
            return;
        }

        const fornecedor = fornecedores[0];

        // Preenche os campos do formulário
        document.getElementById("nomeforn").value = fornecedor.forn_nome || "";
        document.getElementById("cnpjforn").value = fornecedor.forn_cnpj || "";
        document.getElementById("telefoneforn").value =
            fornecedor.forn_telefone || "";
        document.getElementById("emailforn").value =
            fornecedor.forn_email || "";
        document.getElementById("enderecoforn").value =
            fornecedor.func_logradouro || "";
        document.getElementById("numeroforn").value =
            fornecedor.forn_numero || "";
        document.getElementById("bairroforn").value =
            fornecedor.forn_bairro || "";
        document.getElementById("cidadeforn").value =
            fornecedor.forn_cidade || "";
        document.getElementById("estadoforn").value =
            fornecedor.forn_estado || "";
        document.getElementById("cepforn").value = fornecedor.forn_cep || "";
        document.getElementById("complementoforn").value =
            fornecedor.forn_complemento || "";
        document.getElementById("observacoesforn").value =
            fornecedor.forn_observacoes || "";

        // Rola a página para o formulário
        document.getElementById("FornecedorForm").scrollIntoView();
    } catch (error) {
        console.error("Erro ao carregar dados do fornecedor:", error);
        alert("Erro ao carregar dados do fornecedor.");
    }
}

// ----------------- ATUALIZAR FORNECEDOR -----------------
async function atualizarFornecedor() {
    alert("dj marciano o mais brabo(estou no fornecedor.js)");
    const cnpj = document.getElementById("cnpjforn").value;

    const fornecedorAtualizado = { 
      nome: document.getElementById("nomeforn").value,
      telefone: document.getElementById("telefoneforn").value,
      email: document.getElementById("emailforn").value,
      logradouro: document.getElementById("enderecoforn").value,
      numero: document.getElementById("numeroforn").value,
      bairro: document.getElementById("bairroforn").value,
      cidade: document.getElementById("cidadeforn").value,
      estado: document.getElementById("estadoforn").value,
      cep: document.getElementById("cepforn").value,
      complemento: document.getElementById("complementoforn").value,
      observacoes: document.getElementById("observacoesforn").value
  };

  try {
      const response = await fetch(`/fornecedor/cnpj/${cnpj}`, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(fornecedorAtualizado),
      });

      if (response.ok) {
          alert("Fornecedor atualizado com sucesso!");
      } else {
          const errorMessage = await response.text();
          alert("Erro ao atualizar fornecedor: " + errorMessage);
      }
  } catch (error) {
      console.error("Erro ao atualizar fornecedor:", error);
      alert("Erro ao atualizar fornecedor.1111");
  }
}

async function limpaForn() {
  document.getElementById("nomeforn").value = "";
  document.getElementById("cnpjforn").value = "";
  document.getElementById("emailforn").value = "";
  document.getElementById("telefoneforn").value = "";
  document.getElementById("enderecoforn").value = "";
}

// ----------------- FORMATAÇÕES -----------------

// CEP
function formatarCEP(cepforn) {
  return cepforn
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 9);
}
document.getElementById("cepforn").addEventListener("input", async (e) => {
  e.target.value = formatarCEP(e.target.value);

  const cep = e.target.value.replace(/\D/g, "");
  if (cep.length === 8) {
      try {
          const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
          const data = await response.json();
          if (!data.erro) {
              document.getElementById("enderecoforn").value = data.logradouro || "";
              document.getElementById("bairroforn").value = data.bairro || "";
              document.getElementById("cidadeforn").value = data.localidade || "";
              document.getElementById("estadoforn").value = data.uf || "";
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
document.getElementById("telefoneforn").addEventListener("input", (e) => {
  e.target.value = formatarTelefone(e.target.value);
});
