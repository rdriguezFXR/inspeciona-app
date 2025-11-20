# 🚀 Como Começar - Integração Backend + IA

## ⚡ Início Rápido (5 minutos)

### 1️⃣ Instalar Backend

```bash
cd server
npm install
```

### 2️⃣ Configurar API Key da OpenAI

Crie o arquivo `server/.env`:

```env
PORT=3001
OPENAI_API_KEY=sk-sua-chave-aqui
DB_PATH=./database/inspeciona.db
```

**Onde encontrar sua API Key:**
- Acesse: https://platform.openai.com/api-keys
- Crie uma nova chave ou use uma existente
- Cole no arquivo `.env`

### 3️⃣ Iniciar o Backend

```bash
cd server
npm run dev
```

Você verá:
```
✅ Conectado ao banco de dados SQLite
✅ Tabelas criadas com sucesso
🚀 Servidor rodando em http://localhost:3001
```

### 4️⃣ Configurar Frontend

Crie o arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3001/api
```

### 5️⃣ Iniciar Frontend

Em outro terminal:

```bash
npm run dev
```

## ✅ Testar se está funcionando

1. Acesse: http://localhost:5173 (ou a porta que o Vite mostrar)
2. Vá em "Cadastro"
3. Cadastre um veículo
4. Os dados serão salvos no banco SQLite!

## 🤖 Testar a IA

1. No formulário de cadastro, após preencher os dados
2. Adicione observações ou não conformidades
3. Use o componente de análise com IA (se implementado)
4. Ou faça uma requisição direta:

```javascript
// No console do navegador (F12)
import { apiService } from './services/api'

const veiculo = { placa: 'ABC1234', tipoVeiculo: 'Caminhão', status: 'Verificado', prazoDias: 5 }
const analise = await apiService.analisarInspecao(veiculo, [], '')
console.log(analise)
```

## 📊 Verificar Banco de Dados

O banco SQLite está em: `server/database/inspeciona.db`

Você pode visualizar com:
- **DB Browser for SQLite** (gratuito): https://sqlitebrowser.org/
- Ou qualquer cliente SQLite

## 🔍 Endpoints Disponíveis

Teste no navegador ou Postman:

- **Health Check**: http://localhost:3001/api/health
- **Listar Veículos**: http://localhost:3001/api/veiculos
- **Buscar por Placa**: http://localhost:3001/api/veiculos/placa/ABC1234

## ⚠️ Problemas Comuns

### "Cannot find module"
```bash
cd server
npm install
```

### "OPENAI_API_KEY não configurada"
- Verifique se o arquivo `server/.env` existe
- Verifique se a chave está correta (começa com `sk-`)

### "CORS error"
- O backend já está configurado com CORS
- Verifique se o frontend está usando `http://localhost:3001/api`

### "Servidor não disponível"
- Verifique se o backend está rodando
- Verifique a porta (padrão: 3001)
- Teste: http://localhost:3001/api/health

## 📝 Próximos Passos

1. ✅ Backend funcionando
2. ✅ Banco de dados criado
3. ✅ API Key configurada
4. ⏳ Atualizar frontend para usar API (opcional - pode manter IndexedDB também)

---

**Dica**: Você pode usar tanto IndexedDB (local) quanto a API (banco de dados). O sistema está preparado para ambos!

