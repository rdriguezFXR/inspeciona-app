# 📋 Instruções Completas - Easypanel

## 🎯 Configuração Passo a Passo

### 1️⃣ Criar Serviço Backend

1. No Easypanel, clique em **"+ Serviço"**
2. Escolha **"Docker"**
3. Configure:
   - **Nome**: `inspeciona-backend`
   - **Dockerfile**: `Dockerfile.backend`
   - **Porta**: `3001`
   - **Variáveis de Ambiente**:
     ```
     NODE_ENV=production
     PORT=3001
     OPENAI_API_KEY=sua_chave_openai_aqui
     FRONTEND_URL=https://inspeciona.online
     ```
   - **Volume** (opcional, mas recomendado):
     - Caminho: `/app/database`
     - Tipo: Volume persistente
4. Clique em **"Implantar"**

### 2️⃣ Criar Serviço Frontend

1. No Easypanel, clique em **"+ Serviço"**
2. Escolha **"Docker"**
3. Configure:
   - **Nome**: `inspeciona-frontend`
   - **Dockerfile**: `Dockerfile`
   - **Porta**: `80`
   - **Variáveis de Ambiente** (Runtime):
     ```
     BACKEND_URL=http://inspeciona-backend:3001
     ```
   - **Build Args** (se o Easypanel suportar):
     ```
     VITE_API_URL=http://inspeciona-backend:3001/api
     ```
4. **Domínio**: Adicione `https://inspeciona.online`
5. Clique em **"Implantar"**

### 3️⃣ Verificar Nome do Serviço Backend

**IMPORTANTE**: O nome do serviço backend no Easypanel deve corresponder ao usado no `BACKEND_URL`.

- Se o serviço se chama `inspeciona-backend`, use: `http://inspeciona-backend:3001`
- Se o serviço se chama `inspeciona_samarco_backend`, use: `http://inspeciona_samarco_backend:3001`
- O nome é sempre em minúsculas e sem espaços

### 4️⃣ Testar

1. Aguarde o deploy completar
2. Acesse: `https://inspeciona.online`
3. Abra o console do navegador (F12)
4. Verifique se não há erros de conexão

## 🔧 Se Não Funcionar

### Verificar Backend

No terminal do backend (Easypanel):
```bash
curl http://localhost:3001/api/health
```

Deve retornar: `{"status":"ok",...}`

### Verificar Frontend

No terminal do frontend (Easypanel):
```bash
cat /etc/nginx/conf.d/default.conf | grep proxy_pass
```

Deve mostrar a URL do backend configurada.

### Verificar Variável BACKEND_URL

No terminal do frontend:
```bash
echo $BACKEND_URL
```

Deve mostrar: `http://inspeciona-backend:3001` (ou o nome do seu serviço)

### Verificar Logs

1. No Easypanel, abra os logs do frontend
2. Procure por mensagens como:
   - `✅ Nginx configurado com backend: ...`
   - Erros de conexão

## 📝 Checklist Final

- [ ] Backend criado e rodando
- [ ] Backend acessível em `/api/health`
- [ ] Frontend criado com Dockerfile correto
- [ ] Variável `BACKEND_URL` configurada no frontend
- [ ] Domínio configurado
- [ ] SSL/HTTPS ativo
- [ ] Testado acesso ao domínio
- [ ] Console do navegador sem erros

## 🚨 Problemas Comuns

### "Failed to fetch" no console

**Solução**: Verifique se o `BACKEND_URL` está correto e se o backend está rodando.

### "502 Bad Gateway"

**Solução**: O nginx não consegue conectar ao backend. Verifique:
1. Nome do serviço backend está correto
2. Backend está rodando
3. Porta do backend está correta (3001)

### Página carrega mas API não funciona

**Solução**: 
1. Verifique o `nginx.conf` no container
2. Verifique se o proxy_pass está correto
3. Rebuild o frontend

## 💡 Dica

Se você mudar o nome do serviço backend, atualize a variável `BACKEND_URL` no frontend e faça rebuild.

