# 📋 Instruções Completas - Passo a Passo

## 🎯 O que você precisa fazer

### ✅ PASSO 1: Executar o Script de Configuração

Abra o PowerShell na pasta do projeto e execute:

```powershell
.\configurar.ps1
```

Isso criará automaticamente os arquivos `.env` necessários!

---

### ✅ PASSO 2: Editar server/.env

1. Abra o arquivo `server\.env` no editor (VS Code, Notepad++, etc.)

2. Você verá:
```env
PORT=3001
OPENAI_API_KEY=sua_chave_openai_aqui
DB_PATH=./database/inspeciona.db
```

3. **SUBSTITUA** `sua_chave_openai_aqui` pela sua chave real da OpenAI

4. **Como obter a API Key:**
   - Acesse: https://platform.openai.com/api-keys
   - Faça login
   - Clique em "Create new secret key"
   - Copie a chave (começa com `sk-`)
   - Cole no arquivo `.env`

5. Salve o arquivo

---

### ✅ PASSO 3: Instalar Dependências do Backend

Abra o terminal e execute:

```bash
cd server
npm install
```

Aguarde terminar (pode demorar alguns minutos na primeira vez).

---

### ✅ PASSO 4: Iniciar o Backend

Ainda na pasta `server`, execute:

```bash
npm run dev
```

**Você deve ver:**
```
✅ Conectado ao banco de dados SQLite
✅ Tabelas criadas com sucesso
🚀 Servidor rodando em http://localhost:3001
```

**DEIXE ESTE TERMINAL ABERTO!** O servidor precisa ficar rodando.

---

### ✅ PASSO 5: Verificar se o Backend está funcionando

Abra o navegador e acesse:

```
http://localhost:3001/api/health
```

**Você deve ver:**
```json
{
  "status": "ok",
  "timestamp": "...",
  "database": "SQLite",
  "openai": "Configurado"
}
```

Se aparecer isso, está funcionando! ✅

---

### ✅ PASSO 6: Iniciar o Frontend

Abra **OUTRO TERMINAL** (deixe o backend rodando) e execute:

```bash
npm run dev
```

**Você verá:**
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
```

**Abra o navegador em:** http://localhost:5173

---

## ✅ Verificação Final

Você deve ter:

1. ✅ **Backend rodando** em `http://localhost:3001`
2. ✅ **Frontend rodando** em `http://localhost:5173`
3. ✅ **Arquivo `server/.env`** com sua API Key da OpenAI
4. ✅ **Arquivo `.env`** na raiz (já configurado)

---

## 🎉 Pronto!

Agora você pode:
- ✅ Cadastrar veículos (serão salvos no banco SQLite)
- ✅ Usar a integração com OpenAI
- ✅ Todos os dados ficam no banco de dados local

---

## ⚠️ Problemas Comuns

### ❌ Erro: "Cannot find module"
**Solução:**
```bash
cd server
npm install
```

### ❌ Erro: "OPENAI_API_KEY não configurada"
**Solução:**
- Verifique se o arquivo `server/.env` existe
- Verifique se a chave está correta (começa com `sk-`)
- Reinicie o servidor

### ❌ Erro: "Port 3001 already in use"
**Solução:**
1. Altere no `server/.env`: `PORT=3002`
2. Altere no `.env` da raiz: `VITE_API_URL=http://localhost:3002/api`
3. Reinicie ambos

### ❌ Frontend não conecta ao backend
**Solução:**
- Verifique se o backend está rodando
- Verifique se a URL no `.env` está correta
- Reinicie o frontend

---

## 📁 Estrutura dos Arquivos

```
Inspeciona+Samarco/
├── .env                          ← Criado automaticamente (OK!)
├── server/
│   ├── .env                      ← ⚠️ EDITE E ADICIONE SUA API KEY!
│   ├── database/
│   │   └── inspeciona.db         ← Criado automaticamente quando iniciar
│   └── ...
└── src/
    └── ...
```

---

## 🚀 Comandos Rápidos

### Iniciar tudo de uma vez (2 terminais):

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

---

## 📞 Resumo

1. ✅ Execute `.\configurar.ps1`
2. ✅ Edite `server/.env` e adicione sua API Key
3. ✅ Execute `cd server && npm install`
4. ✅ Execute `cd server && npm run dev` (Terminal 1)
5. ✅ Execute `npm run dev` (Terminal 2)
6. ✅ Acesse http://localhost:5173

**Pronto!** 🎉

