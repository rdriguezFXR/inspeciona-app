# 🚀 Deploy no Easypanel - Inspeciona+ Samarco

## Configuração no Easypanel

### Opção 1: Frontend e Backend Separados (Recomendado)

#### Frontend (React)
1. **Criar novo App** → **Docker**
2. **Nome**: `inspeciona-frontend`
3. **Dockerfile**: `Dockerfile`
4. **Porta**: `80`
5. **Variáveis de Ambiente**:
   ```
   VITE_API_URL=https://seu-backend-url.com/api
   ```
6. **Build Context**: Raiz do projeto

#### Backend (Node.js)
1. **Criar novo App** → **Docker**
2. **Nome**: `inspeciona-backend`
3. **Dockerfile**: `Dockerfile.backend`
4. **Porta**: `3001`
5. **Variáveis de Ambiente**:
   ```
   NODE_ENV=production
   PORT=3001
   OPENAI_API_KEY=sua_chave_openai_aqui
   ```
6. **Volumes** (opcional, para persistir banco de dados):
   ```
   /app/database → Volume persistente
   ```
7. **Build Context**: Raiz do projeto

### Opção 2: Docker Compose (Tudo em um)

1. **Criar novo App** → **Docker Compose**
2. **Arquivo**: `docker-compose.yml`
3. **Variáveis de Ambiente**:
   ```
   OPENAI_API_KEY=sua_chave_openai_aqui
   ```
4. **Portas Expostas**:
   - Frontend: `80`
   - Backend: `3001`

## Variáveis de Ambiente Necessárias

### Backend
- `OPENAI_API_KEY` (obrigatória para funcionalidades de IA)
- `PORT` (opcional, padrão: 3001)
- `NODE_ENV` (opcional, padrão: production)

### Frontend
- `VITE_API_URL` (URL completa do backend, ex: `https://backend.seudominio.com/api`)

## URLs de Acesso

Após o deploy:
- **Frontend**: `https://frontend.seudominio.com`
- **Backend**: `https://backend.seudominio.com`

## Configuração de Domínio

1. No Easypanel, configure os domínios para cada serviço
2. Atualize a variável `VITE_API_URL` no frontend com a URL do backend
3. Reinicie o frontend após atualizar a variável

## Troubleshooting

### Backend não conecta
- Verifique se a porta 3001 está exposta
- Verifique se o banco de dados tem permissões de escrita
- Verifique os logs no Easypanel

### Frontend não carrega
- Verifique se `VITE_API_URL` está configurada corretamente
- Verifique se o build foi concluído com sucesso
- Verifique os logs do nginx

### Banco de dados não persiste
- Configure um volume persistente em `/app/database` no backend
- Verifique as permissões do volume

## Build Local (Teste)

```bash
# Frontend
docker build -t inspeciona-frontend .

# Backend
docker build -f Dockerfile.backend -t inspeciona-backend .

# Docker Compose
docker-compose up --build
```

