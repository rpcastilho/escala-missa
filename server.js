const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DATA_FILE = path.join(__dirname, 'escala.json');

app.post('/salvar-escala', (req, res) => {
    const { chave, dados } = req.body;
    let escalas = {};

    if (fs.existsSync(DATA_FILE)) {
        escalas = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }

    escalas[chave] = dados;

    fs.writeFileSync(DATA_FILE, JSON.stringify(escalas, null, 2), 'utf8');
    res.sendStatus(200);
});

app.get('/consultar-escalas', (req, res) => {
    if (fs.existsSync(DATA_FILE)) {
        const escalas = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        res.json(escalas);
    } else {
        res.json({});
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});