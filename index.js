Skip to content
Files
Commands
Search
Packager files
Config files
5s
 • 
38 minutes ago
Enable "Accessible Terminal" in Workspace Settings to use a screen reader with the shell.
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
const express = require("express");
                    .json({ message: "Erro ao buscar clientes." });
            }
            res.json(rows); // Retorna os clientes encontrados ou um array vazio
        });
    } else {
        // Se CPF não foi passado, retorna todos os clientes
        const query = `SELECT * FROM clientes`;

        db.all(query, (err, rows) => {
            if (err) {
                console.error(err);
                return res
                    .status(500)
                    .json({ message: "Erro ao buscar clientes." });
            }
            res.json(rows); // Retorna todos os clientes
        });
    }
});

// Atualizar cliente
app.put("/clientes/cpf/:cpf", (req, res) => {
    const { cpf } = req.params;
    const { nome, email, telefone, endereco } = req.body;

    const query = `UPDATE clientes SET nome = ?, email = ?, telefone = ?, endereco = ? WHERE cpf = ?`;
    db.run(query, [nome, email, telefone, endereco, cpf], function (err) {
        if (err) {
            return res.status(500).send("Erro ao atualizar cliente.");
        }
        if (this.changes === 0) {
            return res.status(404).send("Cliente não encontrado.");
        }
        res.send("Cliente atualizado com sucesso.");
    });
});

// Teste para verificar se o servidor está rodando
app.get("/", (req, res) => {
    res.send("Servidor está rodando e tabelas criadas!");
});

// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

