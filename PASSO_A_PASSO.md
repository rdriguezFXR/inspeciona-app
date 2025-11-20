# 📝 Passo a Passo Completo - Configuração

## 🎯 Objetivo
Configurar o backend com banco de dados SQLite e integração OpenAI.

---

## 📋 PASSO 1: Verificar se o Node.js está instalado

Abra o terminal (PowerShell ou CMD) e digite:

```bash
node --version
```

Se aparecer algo como `v18.x.x` ou superior, está OK! ✅

Se não aparecer nada, instale o Node.js: https://nodejs.org/

---

## 📋 PASSO 2: Instalar Dependências do Backend

1. Abra o terminal
2. Navegue até a pasta do projeto:
```bash
cd "C:\Users\ruan_\OneDrive\Desktop\RDRIGUEZ\Inspeciona+Samarco"
```

3. Entre na pasta `server`:
```bash
cd server
```

4. Instale as dependências:
```bash
npm install
```

**Aguarde até terminar!** Você verá algo como:
```
added 150 packages in 30s
```

---

## 📋 PASSO 3: Criar arquivo .env no Backend

### Opção A: Pelo Terminal (PowerShell)

1. Ainda na pasta `server`, digite:
```bash
New-Item -Path .env -ItemType File
```

2. Abra o arquivo `.env` no editor (VS Code, Notepad++, etc.)

3. Cole este conteúdo:
```env
PORT=3001
OPENAI_API_KEY=sua_chave_openai_aqui
DB_PATH=./database/inspeciona.db
```

4. **IMPORTANTE**: Substitua `sua_chave_openai_aqui` pela sua chave real da OpenAI!

### Opção B: Manualmente

1. Abra a pasta `server` no explorador de arquivos
2. Crie um novo arquivo chamado `.env` (sem extensão!)
3. Abra com o Bloco de Notas ou VS Code
4. Cole o conteúdo acima
5. Salve o arquivo

### 🔑 Como obter a API Key da OpenAI:

1. Acesse: https://platform.openai.com/api-keys
2. Faça login (ou crie uma conta)
3. Clique em "Create new secret key"
4. Dê um nome (ex: "Inspeciona App")
5. Copie a chave (ela começa com `sk-`)
6. **IMPORTANTE**: Guarde bem! Você só verá ela uma vez!

---

## 📋 PASSO 4: Verificar se o arquivo .env foi criado

No terminal, ainda na pasta `server`, digite:

```bash
dir .env
```

Ou no PowerShell:
```bash
Get-Item .env
```

Se aparecer o arquivo, está OK! ✅

---

## 📋 PASSO 5: Iniciar o Backend

Ainda na pasta `server`, digite:

```bash
npm run dev
```

**Você deve ver algo como:**
```
✅ Conectado ao banco de dados SQLite
✅ Tabelas criadas com sucesso
🚀 Servidor rodando em http://localhost:3001
📊 API disponível em http://localhost:3001/api
🔍 Health check: http://localhost:3001/api/health
```

**Se aparecer um erro sobre OPENAI_API_KEY:**
- Verifique se o arquivo `.env` está na pasta `server`
- Verifique se a chave está correta (começa com `sk-`)
- Reinicie o servidor

**Deixe este terminal aberto!** O servidor precisa ficar rodando.

---

## 📋 PASSO 6: Testar se o Backend está funcionando

Abra um novo terminal (deixe o anterior rodando) e digite:

```bash
curl http://localhost:3001/api/health
```

Ou abra no navegador:
```
http://localhost:3001/api/health
```

**Você deve ver:**
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "database": "SQLite",
  "openai": "Configurado"
}
```

Se aparecer isso, está funcionando! ✅

---

## 📋 PASSO 7: Criar arquivo .env no Frontend

### Opção A: Pelo Terminal (PowerShell)

1. Abra um novo terminal
2. Vá para a pasta raiz do projeto:
```bash
cd "C:\Users\ruan_\OneDrive\Desktop\RDRIGUEZ\Inspeciona+Samarco"
```

3. Crie o arquivo `.env`:
```bash
New-Item -Path .env -ItemType File
```

4. Abra o arquivo `.env` no editor

5. Cole este conteúdo:
```env
VITE_API_URL=http://localhost:3001/api
```

6. Salve o arquivo

### Opção B: Manualmente

1. Abra a pasta raiz do projeto no explorador
2. Crie um novo arquivo chamado `.env` (sem extensão!)
3. Abra com o Bloco de Notas ou VS Code
4. Cole: `VITE_API_URL=http://localhost:3001/api`
5. Salve o arquivo

---

## 📋 PASSO 8: Verificar se o arquivo .env do frontend foi criado

No terminal, na pasta raiz, digite:

```bash
dir .env
```

Ou no PowerShell:
```bash
Get-Item .env
```

Se aparecer o arquivo, está OK! ✅

---

## 📋 PASSO 9: Iniciar o Frontend

Ainda na pasta raiz do projeto, digite:

```bash
npm run dev
```

**Você verá algo como:**
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Abra o navegador em:** http://localhost:5173

---

## ✅ Verificação Final

Você deve ter:

1. ✅ Backend rodando em `http://localhost:3001`
2. ✅ Frontend rodando em `http://localhost:5173`
3. ✅ Arquivo `server/.env` com a API Key da OpenAI
4. ✅ Arquivo `.env` na raiz com `VITE_API_URL`

---

## 🎉 Pronto!

Agora você pode:
- Cadastrar veículos (serão salvos no banco SQLite)
- Usar a integração com OpenAI
- Todos os dados ficam no banco de dados local

---

## ⚠️ Problemas Comuns

### Erro: "Cannot find module"
```bash
cd server
npm install
```

### Erro: "OPENAI_API_KEY não configurada"
- Verifique se o arquivo `server/.env` existe
- Verifique se a chave está correta
- Reinicie o servidor

### Erro: "Port 3001 already in use"
- Altere a porta no `server/.env`: `PORT=3002`
- Atualize o `VITE_API_URL` no `.env` da raiz: `VITE_API_URL=http://localhost:3002/api`

### Frontend não conecta ao backend
- Verifique se o backend está rodando
- Verifique se a URL no `.env` está correta
- Reinicie o frontend

---

## 📞 Estrutura Final

```
Inspeciona+Samarco/
├── .env                    ← Criado no PASSO 7
├── server/
│   ├── .env                ← Criado no PASSO 3
│   ├── database/
│   │   └── inspeciona.db   ← Criado automaticamente
│   └── ...
└── src/
    └── ...
```

---

**Dica**: Mantenha os dois terminais abertos:
- Terminal 1: Backend (`npm run dev` na pasta `server`)
- Terminal 2: Frontend (`npm run dev` na pasta raiz)

