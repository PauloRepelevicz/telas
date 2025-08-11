const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Configurações
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Conexão com o banco de dados
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
        db.run(`PRAGMA foreign_keys = ON`);
    }
});

// Rotas para Clientes
app.post('/clientes', (req, res) => {
    const { nome, cpf, telefone, data_nascimento, endereco } = req.body;

    if (!nome || !cpf) {
        return res.status(400).json({ error: 'Nome e CPF são obrigatórios.' });
    }

    // Primeiro insere o endereço
    const enderecoQuery = `INSERT INTO endereco 
        (end-_id, end_log, end_num, end_bairro, end_cid, end_cep) 
        VALUES (?, ?, ?, ?, ?)`;
    
    db.run(enderecoQuery, [
        endereco.logradouro,
        endereco.numero,
        endereco.bairro,
        endereco.cidade,
        endereco.cep
    ], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Erro ao cadastrar endereço.' });
        }

        const endId = this.lastID;
        
        // Depois insere o cliente com a referência ao endereço
        const clienteQuery = `INSERT INTO cliente 
            (cli_id, cli_nome, cli_cpf, cli_telefone, cli_data_nascimento, end_id) 
            VALUES (?, ?, ?, ?, ?)`;
        
        db.run(clienteQuery, [
            nome,
            cpf,
            telefone,
            data_nascimento,
            endId
        ], function(err) {
            if (err) {
                // Se der erro no cliente, remove o endereço inserido
                db.run(`DELETE FROM endereco WHERE end_id = ?`, [endId]);
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ error: 'CPF já cadastrado.' });
                }
                return res.status(500).json({ error: 'Erro ao cadastrar cliente.' });
            }
            
            res.status(201).json({ 
                id: this.lastID,
                message: 'Cliente cadastrado com sucesso.'
            });
        });
    });
});

app.get('/clientes', (req, res) => {
    const { nome } = req.query;
    let query = `
        SELECT c.*, e.end_log, e.end_num, e.end_bairro, e.end_cid, e.end_cep 
        FROM cliente c
        LEFT JOIN endereco e ON c.end_id = e.end_id
    `;
    let params = [];

    if (nome) {
        query += ` WHERE c.cli_nome LIKE ?`;
        params.push(`%${nome}%`);
    }

    query += ` ORDER BY c.cli_nome ASC`;

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao buscar clientes.' });
        }
        res.json(rows);
    });
});

app.put('/clientes/:id', (req, res) => {
    const { id } = req.params;
    const { nome, telefone, data_nascimento, endereco } = req.body;

    if (!nome) {
        return res.status(400).json({ error: 'Nome é obrigatório.' });
    }

    // Primeiro atualiza o cliente
    const clienteQuery = `UPDATE cliente SET 
        cli_nome = ?, 
        cli_telefone = ?, 
        cli_data_nascimento = ? 
        WHERE cli_id = ?`;
    
    db.run(clienteQuery, [nome, telefone, data_nascimento, id], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Erro ao atualizar cliente.' });
        }

        // Depois atualiza o endereço
        const enderecoQuery = `UPDATE endereco SET
            end_log = ?,
            end_num = ?,
            end_bairro = ?,
            end_cid = ?,
            end_cep = ?
            WHERE end_id = (
                SELECT end_id FROM cliente WHERE cli_id = ?
            )`;
        
        db.run(enderecoQuery, [
            endereco.logradouro,
            endereco.numero,
            endereco.bairro,
            endereco.cidade,
            endereco.cep,
            id
        ], function(err) {
            if (err) {
                return res.status(500).json({ error: 'Erro ao atualizar endereço.' });
            }
            res.json({ message: 'Cliente e endereço atualizados com sucesso.' });
        });
    });
});

app.delete('/clientes/:id', (req, res) => {
    const { id } = req.params;
    
    // Primeiro obtém o end_id para deletar depois
    db.get(`SELECT end_id FROM cliente WHERE cli_id = ?`, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar cliente.' });
        }
        
        if (!row) {
            return res.status(404).json({ error: 'Cliente não encontrado.' });
        }
        
        const endId = row.end_id;
        
        // Deleta o cliente
        db.run(`DELETE FROM cliente WHERE cli_id = ?`, [id], function(err) {
            if (err) {
                return res.status(500).json({ error: 'Erro ao remover cliente.' });
            }
            
            // Depois deleta o endereço
            db.run(`DELETE FROM endereco WHERE end_id = ?`, [endId], function(err) {
                if (err) {
                    console.error('Erro ao remover endereço:', err);
                }
                res.json({ message: 'Cliente removido com sucesso.' });
            });
        });
    });
});

// Rota para servir a página HTML
app.get('/clientes/html', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'cliente.html'));
});

// Rota raiz
app.get('/', (req, res) => {
    res.send('Sistema de Mercado Maguila - API está rodando!');
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
    console.log(`Acesse: http://localhost:${port}/clientes/html`);
});