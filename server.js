const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const arquivoDados = path.join(__dirname, 'escalas.json');

// Utilitário para carregar os dados
function carregarDados() {
    if (fs.existsSync(arquivoDados)) {
        const raw = fs.readFileSync(arquivoDados);
        return JSON.parse(raw);
    }
    return {};
}

// Utilitário para salvar os dados
function salvarDados(dados) {
    fs.writeFileSync(arquivoDados, JSON.stringify(dados, null, 2), 'utf8');
}

// Rota para salvar escala
app.post('/salvar-escala', (req, res) => {
    const { chave, dados } = req.body;
    const escalas = carregarDados();

    // Se já existe, mescla com os dados existentes
    if (!escalas[chave]) {
        escalas[chave] = {};
    }

    escalas[chave] = {
        ...escalas[chave],
        ...dados
    };

    salvarDados(escalas);
    res.sendStatus(200);
});

// Rota para retornar as escalas
app.get('/escalas', (req, res) => {
    const dados = carregarDados();
    res.json(dados);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
