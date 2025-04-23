const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./escalas.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS escalas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      data TEXT,
      horario TEXT,
      leitores TEXT,
      musica TEXT,
      acolhida TEXT,
      coroinhas TEXT,
      ministros TEXT,
      diacono TEXT,
      UNIQUE(data, horario)
    )
  `);
});

db.close();