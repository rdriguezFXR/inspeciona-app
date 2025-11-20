# 🐳 Docker - Inspeciona+ Samarco

## Estrutura de Arquivos Docker

- `Dockerfile` - Frontend (React + Vite + Nginx)
- `Dockerfile.backend` - Backend (Node.js + Express)
- `docker-compose.yml` - Orquestração completa
- `nginx.conf` - Configuração do Nginx para SPA
- `.dockerignore` - Arquivos ignorados no build

## Build Local

### Frontend
```bash
docker build -t inspeciona-frontend .
```

### Backend
```bash
docker build -f Dockerfile.backend -t inspeciona-backend .
```

### Docker Compose (Recomendado)
```bash
docker-compose up --build
```

## Variáveis de Ambiente

### Backend
Crie um arquivo `.env` na raiz do projeto:
```env
PORT=3001
OPENAI_API_KEY=sua_chave_aqui
NODE_ENV=production
```

### Frontend
Configure no Easypanel ou crie `.env`:
```env
VITE_API_URL=http://localhost:3001/api
```

## Portas

- Frontend: `80` (HTTP)
- Backend: `3001` (API)

## Volumes

O banco de dados SQLite é salvo em `server/database/database/inspeciona.db`

Para persistir os dados, monte um volume:
```yaml
volumes:
  - ./server/database:/app/database
```

## Deploy no Easypanel

Veja o arquivo `EASYPANEL.md` para instruções detalhadas.

