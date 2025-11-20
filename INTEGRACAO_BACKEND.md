# 🔌 Guia de Integração - Backend + Banco de Dados + OpenAI

## 📋 Pré-requisitos

1. **Node.js** instalado (versão 18 ou superior)
2. **API Key da OpenAI** (você já tem)
3. **NPM** ou **Yarn**

## 🚀 Passo a Passo

### 1. Instalar Dependências do Backend

```bash
cd server
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na pasta `server/`:

```bash
cd server
cp .env.example .env
```

Edite o arquivo `.env` e adicione sua API Key da OpenAI:

```env
PORT=3001
OPENAI_API_KEY=sua_api_key_da_openai_aqui
DB_PATH=./database/inspeciona.db
```

### 3. Iniciar o Servidor Backend

```bash
cd server
npm run dev
```

O servidor estará rodando em: `http://localhost:3001`

### 4. Configurar o Frontend

Crie um arquivo `.env` na raiz do projeto (mesmo nível do `package.json`):

```env
VITE_API_URL=http://localhost:3001/api
```

### 5. Instalar Dependências do Frontend (se ainda não tiver)

```bash
npm install
```

### 6. Iniciar o Frontend

Em um terminal separado:

```bash
npm run dev
```

## 📊 Estrutura do Banco de Dados

O banco de dados SQLite será criado automaticamente em:
- `server/database/inspeciona.db`

### Tabela: `veiculos`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | TEXT | ID único do veículo |
| nome | TEXT | Nome do responsável |
| empresa | TEXT | Nome da empresa |
| placa | TEXT | Placa do veículo (única) |
| status | TEXT | Verificado/Não Verificado |
| observacoes | TEXT | JSON array de observações |
| naoConformidades | TEXT | Texto de não conformidades |
| ... | ... | Outros campos |

## 🔌 Endpoints da API

### Veículos

- `GET /api/veiculos` - Listar todos os veículos
- `GET /api/veiculos/:id` - Buscar veículo por ID
- `GET /api/veiculos/placa/:placa` - Buscar veículo por placa
- `POST /api/veiculos` - Criar novo veículo
- `PUT /api/veiculos/:id` - Atualizar veículo
- `DELETE /api/veiculos/:id` - Deletar veículo

### OpenAI

- `POST /api/openai/analisar` - Analisar inspeção com IA
- `POST /api/openai/relatorio` - Gerar relatório com IA
- `POST /api/openai/sugestoes` - Obter sugestões com IA

### Health Check

- `GET /api/health` - Verificar status do servidor

## 🤖 Como Usar a Integração OpenAI

### 1. Analisar Inspeção

```javascript
import { apiService } from './services/api'

const analise = await apiService.analisarInspecao(
  veiculo,
  observacoes,
  naoConformidades
)

// Retorna:
// {
//   risco: "Crítico|Alto|Médio|Baixo",
//   falhas: ["falha1", "falha2"],
//   melhorias: ["melhoria1", "melhoria2"]
// }
```

### 2. Gerar Relatório

```javascript
const relatorio = await apiService.gerarRelatorio(veiculos)

// Retorna:
// {
//   relatorio: "Texto do relatório gerado pela IA"
// }
```

### 3. Obter Sugestões

```javascript
const sugestoes = await apiService.obterSugestoes(
  "Contexto da situação",
  "Tipo de sugestão"
)

// Retorna:
// {
//   sugestoes: "Texto com sugestões"
// }
```

## 🔄 Migração de Dados

Se você já tem dados no IndexedDB/localStorage, você pode:

1. Exportar para Excel (usando o botão no app)
2. Ou criar um script de migração (posso ajudar se precisar)

## 🛠️ Troubleshooting

### Erro: "Cannot find module"
- Execute `npm install` na pasta `server/`

### Erro: "OPENAI_API_KEY não configurada"
- Verifique se o arquivo `.env` existe em `server/`
- Verifique se a chave está correta

### Erro: "CORS"
- O backend já está configurado com CORS
- Verifique se o frontend está usando a URL correta

### Banco de dados não cria
- Verifique permissões da pasta `server/database/`
- O banco será criado automaticamente na primeira execução

## 📝 Próximos Passos

1. ✅ Backend criado
2. ✅ Banco de dados configurado
3. ✅ API REST implementada
4. ✅ Integração OpenAI pronta
5. ⏳ Atualizar frontend para usar API (próximo passo)

---

**Nota**: O frontend ainda está usando IndexedDB. Após testar o backend, podemos atualizar o frontend para usar a API.

