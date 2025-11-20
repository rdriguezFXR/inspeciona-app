import sqlite3 from 'sqlite3'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Criar diretório database se não existir
const dbDir = path.join(__dirname, 'database')
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const dbPath = path.join(dbDir, 'inspeciona.db')

// Abrir conexão com o banco
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err)
  } else {
    console.log('✅ Conectado ao banco de dados SQLite')
    initDatabase()
  }
})

// Inicializar banco de dados
function initDatabase() {
  const initSQL = `
    -- Tabela de veículos
    CREATE TABLE IF NOT EXISTS veiculos (
        id TEXT PRIMARY KEY,
        nome TEXT NOT NULL,
        empresa TEXT NOT NULL,
        data TEXT NOT NULL,
        unidade TEXT NOT NULL,
        departamento TEXT NOT NULL,
        tipoVeiculo TEXT NOT NULL,
        placa TEXT NOT NULL UNIQUE,
        ano TEXT,
        modelo TEXT,
        nomeMotorista TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Não Verificado',
        prazoDias INTEGER NOT NULL,
        dataVencimento TEXT NOT NULL,
        observacoes TEXT DEFAULT '[]',
        naoConformidades TEXT,
        dataCadastro TEXT NOT NULL,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Índices para melhor performance
    CREATE INDEX IF NOT EXISTS idx_placa ON veiculos(placa);
    CREATE INDEX IF NOT EXISTS idx_status ON veiculos(status);
    CREATE INDEX IF NOT EXISTS idx_dataVencimento ON veiculos(dataVencimento);
  `

  db.exec(initSQL, (err) => {
    if (err) {
      console.error('Erro ao inicializar banco de dados:', err)
    } else {
      console.log('✅ Tabelas criadas com sucesso')
    }
  })
}

// Promisificar métodos do banco
db.run = promisify(db.run.bind(db))
db.get = promisify(db.get.bind(db))
db.all = promisify(db.all.bind(db))

export default db

