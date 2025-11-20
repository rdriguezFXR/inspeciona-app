# 🔧 Configuração Easypanel - Solução de Problemas

## ⚠️ Problema: Domínio não funciona

### Solução 1: Configurar Backend Separado (Recomendado)

#### 1. Criar Serviço Backend

**No Easypanel:**
1. Crie um **novo serviço** → **Docker**
2. **Nome**: `inspeciona-backend` (ou `inspeciona_samarco_backend`)
3. **Dockerfile**: `Dockerfile.backend`
4. **Porta**: `3001`
5. **Variáveis de Ambiente**:
   ```
   NODE_ENV=production
   PORT=3001
   OPENAI_API_KEY=sua_chave_aqui
   FRONTEND_URL=https://inspeciona.online
   ```
6. **Volume** (importante para persistir banco):
   - Caminho no container: `/app/database`
   - Volume: Crie um volume persistente

#### 2. Criar Serviço Frontend

**No Easypanel:**
1. Crie um **novo serviço** → **Docker**
2. **Nome**: `inspeciona-frontend` (ou `inspeciona_samarco`)
3. **Dockerfile**: `Dockerfile`
4. **Porta**: `80`
5. **Variáveis de Ambiente** (Build Args):
   ```
   VITE_API_URL=https://backend.inspeciona.online/api
   ```
   **OU** se o backend estiver no mesmo Easypanel:
   ```
   VITE_API_URL=http://inspeciona-backend:3001/api
   ```
6. **Domínio**: Configure `https://inspeciona.online`

#### 3. Configurar Nginx (Proxy Reverso)

**Edite o arquivo `nginx.conf`** e ajuste a linha do proxy_pass:

```nginx
location /api {
    # Use o nome do serviço backend do Easypanel
    proxy_pass http://inspeciona-backend:3001/api;
    # ... resto da configuração
}
```

**OU** se o backend estiver em outro domínio:

```nginx
location /api {
    proxy_pass https://backend.inspeciona.online/api;
    # ... resto da configuração
}
```

### Solução 2: Usar Proxy Reverso do Easypanel

Se você tem apenas o frontend no Easypanel e o backend em outro lugar:

1. **Configure o nginx.conf** com a URL do backend:
   ```nginx
   location /api {
       proxy_pass https://seu-backend-url.com/api;
   }
   ```

2. **Rebuild o frontend** com essa configuração

### Solução 3: Backend e Frontend no Mesmo Container (Docker Compose)

Use o `docker-compose.yml` no Easypanel:

1. **Tipo**: Docker Compose
2. **Arquivo**: `docker-compose.yml`
3. **Variáveis**:
   ```
   OPENAI_API_KEY=sua_chave
   VITE_API_URL=http://backend:3001/api
   ```

## 🔍 Verificações

### 1. Verificar se o Backend está rodando

Acesse: `https://seu-backend-url.com/api/health`

Deve retornar:
```json
{
  "status": "ok",
  "timestamp": "...",
  "database": "SQLite",
  "openai": "Configurado"
}
```

### 2. Verificar CORS

O backend agora aceita requisições de qualquer origem. Se precisar restringir, edite `server/server.js`.

### 3. Verificar Console do Navegador

Abra o DevTools (F12) e verifique:
- **Console**: Erros de conexão?
- **Network**: Requisições para `/api` estão falhando?

### 4. Verificar Logs no Easypanel

- **Frontend**: Verifique logs do nginx
- **Backend**: Verifique logs do Node.js

## 🛠️ Troubleshooting

### Erro: "Failed to fetch" ou "Network Error"

**Causa**: Frontend não consegue conectar ao backend

**Solução**:
1. Verifique se o backend está rodando
2. Verifique a URL no `nginx.conf` (proxy_pass)
3. Verifique se o domínio do backend está correto
4. Verifique CORS no backend

### Erro: "404 Not Found" nas rotas da API

**Causa**: Nginx não está fazendo proxy corretamente

**Solução**:
1. Verifique o `nginx.conf`
2. Certifique-se que `proxy_pass` está correto
3. Rebuild o frontend

### Erro: "CORS policy"

**Causa**: Backend não está aceitando requisições do frontend

**Solução**:
1. O código já foi atualizado para aceitar todas as origens
2. Verifique se o backend foi rebuildado
3. Verifique a variável `FRONTEND_URL` no backend

## 📝 Checklist de Deploy

- [ ] Backend criado e rodando
- [ ] Backend acessível em `/api/health`
- [ ] Frontend criado com Dockerfile correto
- [ ] `nginx.conf` configurado com proxy_pass correto
- [ ] Variável `VITE_API_URL` configurada (se necessário)
- [ ] Domínio configurado no Easypanel
- [ ] SSL/HTTPS configurado
- [ ] Volume persistente configurado para banco de dados
- [ ] Testado acesso ao domínio

## 🚀 Comandos Úteis

### Testar Backend Localmente
```bash
curl https://seu-backend-url.com/api/health
```

### Ver Logs
No Easypanel, use o botão de logs ou terminal

### Rebuild
No Easypanel, clique em "Rebuild" após mudanças

