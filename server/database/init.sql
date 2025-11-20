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

