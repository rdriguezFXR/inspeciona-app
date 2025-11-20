# ✅ Como Verificar se o Backend Está Rodando

## 🔍 No Easypanel

### 1. Verificar Status do Serviço

1. No Easypanel, abra o serviço **backend**
2. Verifique se está **"Running"** (Verde) ou **"Stopped"** (Vermelho)
3. Se estiver parado, clique em **"Iniciar"** ou **"Deploy"**

### 2. Verificar Logs

1. No serviço backend, clique no ícone de **logs** (📋 ou 📊)
2. Procure por mensagens como:
   ```
   🚀 Servidor rodando em http://localhost:3001
   📊 API disponível em http://localhost:3001/api
   ✅ Conectado ao banco de dados SQLite
   ```
3. Se houver erros, eles aparecerão aqui

### 3. Verificar Terminal

1. No serviço backend, clique no ícone de **terminal** (🖥️)
2. Execute:
   ```bash
   curl http://localhost:3001/api/health
   ```
3. Deve retornar:
   ```json
   {
     "status": "ok",
     "timestamp": "2025-01-20T...",
     "database": "SQLite",
     "openai": "Configurado" ou "Não configurado"
   }
   ```

### 4. Verificar Métricas

No painel do serviço backend, verifique:
- **CPU**: Deve estar acima de 0% se estiver rodando
- **Memória**: Deve estar usando memória
- **I/O da Rede**: Deve mostrar tráfego se houver requisições

## 🌐 Testar de Fora (Se Backend Tiver Domínio)

Se o backend tiver um domínio configurado:

```bash
curl https://backend.inspeciona.online/api/health
```

Ou acesse no navegador:
```
https://backend.inspeciona.online/api/health
```

## 🔧 Problemas Comuns

### Backend não inicia

**Verifique:**
1. Logs para ver erros
2. Variáveis de ambiente configuradas
3. Porta 3001 está exposta
4. Dockerfile está correto

### Backend inicia mas não responde

**Verifique:**
1. Porta está correta (3001)
2. CORS está configurado
3. Banco de dados tem permissões
4. Logs para erros específicos

### Erro de conexão com banco

**Solução:**
1. Verifique se o volume está montado
2. Verifique permissões do diretório `/app/database`
3. Veja os logs para erros específicos

## 📝 Checklist

- [ ] Serviço backend está "Running"
- [ ] Logs mostram "Servidor rodando"
- [ ] `/api/health` retorna `{"status":"ok"}`
- [ ] CPU/Memória mostram uso
- [ ] Sem erros nos logs

