
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Banco de dados
const dbFile = './escalas.db';
const db = new sqlite3.Database(dbFile);

// Criação da tabela
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS escalas (
        data TEXT,
        horario TEXT,
        leitores TEXT,
        musica TEXT,
        acolhida TEXT,
        coroinhas TEXT,
        ministros TEXT,
        diacono TEXT,
        PRIMARY KEY (data, horario)
    )`);
});

app.post('/cadastrar', (req, res) => {
    const { data, horario, leitores, musica, acolhida, coroinhas, ministros, diacono } = req.body;

    db.get("SELECT * FROM escalas WHERE data = ? AND horario = ?", [data, horario], (err, row) => {
        if (err) return res.status(500).send("Erro ao acessar o banco de dados.");

        if (row) {
            const updatedFields = {
                leitores: leitores || row.leitores,
                musica: musica || row.musica,
                acolhida: acolhida || row.acolhida,
                coroinhas: coroinhas || row.coroinhas,
                ministros: ministros || row.ministros,
                diacono: diacono || row.diacono,
            };

            db.run(`UPDATE escalas SET leitores=?, musica=?, acolhida=?, coroinhas=?, ministros=?, diacono=? 
                    WHERE data=? AND horario=?`,
                [updatedFields.leitores, updatedFields.musica, updatedFields.acolhida,
                 updatedFields.coroinhas, updatedFields.ministros, updatedFields.diacono, data, horario],
                (err) => {
                    if (err) return res.status(500).send("Erro ao atualizar escala.");
                    res.redirect('/cadastro.html');
                }
            );
        } else {
            db.run(`INSERT INTO escalas (data, horario, leitores, musica, acolhida, coroinhas, ministros, diacono) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [data, horario, leitores, musica, acolhida, coroinhas, ministros, diacono],
                (err) => {
                    if (err) return res.status(500).send("Erro ao cadastrar escala.");
                    res.redirect('/cadastro.html');
                }
            );
        }
    });
});

app.get('/escalas', (req, res) => {
    db.all("SELECT * FROM escalas", [], (err, rows) => {
        if (err) return res.status(500).send("Erro ao recuperar escalas.");
        const escalas = {};
        rows.forEach(row => {
            const key = `${row.data} - ${row.horario}`;
            escalas[key] = {
                leitores: row.leitores,
                musica: row.musica,
                acolhida: row.acolhida,
                coroinhas: row.coroinhas,
                ministros: row.ministros,
                diacono: row.diacono
            };
        });
        res.json(escalas);
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
