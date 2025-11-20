# 🚀 Backend - Inspeciona+ Samarco

Backend Node.js com Express, SQLite e integração OpenAI.

## 📦 Instalação

```bash
npm install
```

## ⚙️ Configuração

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Edite o `.env` e adicione sua API Key da OpenAI:
```env
PORT=3001
OPENAI_API_KEY=sua_api_key_aqui
DB_PATH=./database/inspeciona.db
```

## 🏃 Executar

### Desenvolvimento (com watch)
```bash
npm run dev
```

### Produção
```bash
npm start
```

## 📊 Banco de Dados

O banco SQLite será criado automaticamente em `database/inspeciona.db` na primeira execução.

## 🔌 Endpoints

- `GET /api/health` - Status do servidor
- `GET /api/veiculos` - Listar veículos
- `POST /api/veiculos` - Criar veículo
- `PUT /api/veiculos/:id` - Atualizar veículo
- `DELETE /api/veiculos/:id` - Deletar veículo
- `GET /api/veiculos/placa/:placa` - Buscar por placa
- `POST /api/openai/analisar` - Analisar inspeção
- `POST /api/openai/relatorio` - Gerar relatório
- `POST /api/openai/sugestoes` - Obter sugestões

## 📝 Logs

O servidor mostra logs de todas as requisições no console.

