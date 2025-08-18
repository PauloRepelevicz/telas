const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const port = process.env.PORT || 3000;

// Serve os arquivos estáticos da pasta "public"
app.use(express.static("public"));

// Configura o body-parser para ler JSON
app.use(bodyParser.json());

// Conexão com o banco de dados SQLite
const db = new sqlite3.Database("./database.db", (err) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err.message);
    } else {
        console.log("Conectado ao banco de dados SQLite.");
    }
});

// Criação das tabelas
db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS clientes(
        cli_id INTEGER PRIMARY KEY AUTOINCREMENT,
        cli_nome VARCHAR(100) NOT NULL,
        cli_cpf VARCHAR(14) NOT NULL UNIQUE,
        cli_telefone VARCHAR(15),
        cli_data_nascimento DATE,
        cli_email TEXT NOT NULL,	
        cli_logradouro TEXT,
        cli_numero INTEGER,
        cli_bairro TEXT,
        cli_cidade TEXT,
        cli_estado TEXT,
        cli_cep VARCHAR(10),
        cli_complemento TEXT,
        cli_observacoes TEXT
        )
    `);

    console.log("Tabelas criadas com sucesso.");
});

///////////////////////////// Rotas para Clientes /////////////////////////////
///////////////////////////// Rotas para Clientes /////////////////////////////
///////////////////////////// Rotas para Clientes /////////////////////////////

// Cadastrar cliente
app.post("/clientes", (req, res) => {
    console.log("Recebendo requisição de cadastro de cliente");
    const {
        nome,
        cpf,
        telefone,
        email,
        data_nascimento,
        logradouro,
        numero,
        bairro,
        cidade,
        estado,
        cep,
        complemento,
        observacoes,
    } = req.body;

    if (!nome || !cpf) {
        return res.status(400).send("Nome e CPF são obrigatórios.");
    }

    const query = `INSERT INTO clientes (cli_nome, cli_cpf, cli_telefone, cli_data_nascimento, cli_email, cli_logradouro, cli_numero, cli_bairro, cli_cidade, cli_estado, cli_cep, cli_complemento, cli_observacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(
        query,
        [
            nome,
            cpf,
            telefone,
            data_nascimento,
            email,
            logradouro,
            numero,
            bairro,
            cidade,
            estado,
            cep,
            complemento,
            observacoes,
        ],

        function (err) {
            if (err) {
                return res.status(500).send("Erro ao cadastrar cliente.1");
            }
            res.status(201).json({
                id: this.lastID,
                message: "Cliente cadastrado com sucesso.",
            });
        },
    );
});
// Listar clientes
// Endpoint para listar todos os clientes ou buscar por CPF
app.get("/clientes", (req, res) => {
    const cpf = req.query.cpf || ""; // Recebe o CPF da query string (se houver)
    if (cpf) {
        // Se CPF foi passado, busca clientes que possuam esse CPF ou parte dele
        const query = `SELECT * FROM clientes WHERE cli_cpf LIKE ?`;

        db.all(query, [`%${cpf}%`], (err, rows) => {
            if (err) {
                console.error(err);
                return res
                    .status(500)
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

    const query = `UPDATE clientes SET cli_nome = ?, cli_email = ?, cli_telefone = ?, cli_endereco = ? WHERE cli_cpf = ?`;
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
