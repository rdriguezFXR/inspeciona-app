# ⚡ Solução Rápida - Easypanel

## 🎯 Problema: Domínio não funciona

### Solução Mais Simples (Recomendada)

#### Passo 1: Criar Backend Separado

1. No Easypanel, crie um **novo serviço Docker**
2. **Nome**: `inspeciona-backend`
3. **Dockerfile**: `Dockerfile.backend`
4. **Porta**: `3001`
5. **Variáveis**:
   ```
   OPENAI_API_KEY=sua_chave
   FRONTEND_URL=https://inspeciona.online
   ```

#### Passo 2: Configurar Frontend

1. No Easypanel, edite seu serviço frontend
2. **Variáveis de Ambiente** (Build Args):
   ```
   VITE_API_URL=http://inspeciona-backend:3001/api
   ```
3. **Variáveis de Ambiente** (Runtime):
   ```
   BACKEND_URL=http://inspeciona-backend:3001
   ```
4. **Domínio**: `https://inspeciona.online`

#### Passo 3: Rebuild

1. Clique em **"Rebuild"** no frontend
2. Aguarde o deploy completar

### ✅ Pronto!

Agora o frontend deve funcionar corretamente.

## 🔧 Se ainda não funcionar:

### Verificar Backend

Acesse no terminal do Easypanel ou via curl:
```bash
curl http://inspeciona-backend:3001/api/health
```

Deve retornar: `{"status":"ok",...}`

### Verificar Nginx

No terminal do frontend:
```bash
cat /etc/nginx/conf.d/default.conf | grep proxy_pass
```

Deve mostrar: `proxy_pass http://inspeciona-backend:3001/api;`

### Verificar Logs

No Easypanel, veja os logs do frontend e backend para identificar erros.

## 📞 Ainda com problemas?

1. Verifique se ambos os serviços estão rodando
2. Verifique se o backend está acessível
3. Verifique os logs de erro
4. Verifique o console do navegador (F12)

