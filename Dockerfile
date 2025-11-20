# Dockerfile para Frontend (React + Vite)
# Multi-stage build para otimizar tamanho da imagem

# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY vite.config.js ./

# Instalar dependências
RUN npm ci

# Copiar código fonte (excluindo server e node_modules via .dockerignore)
COPY public ./public
COPY src ./src
COPY index.html ./

# Argumento para API URL (build time)
ARG VITE_API_URL=http://localhost:3001/api
ENV VITE_API_URL=$VITE_API_URL

# Build da aplicação
RUN npm run build

# Stage 2: Production (Nginx)
FROM nginx:alpine

# Instalar dependências para script
RUN apk add --no-cache bash

# Copiar arquivos buildados
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar script de entrada
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expor porta 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

# Usar script de entrada para configuração dinâmica
ENTRYPOINT ["/docker-entrypoint.sh"]

