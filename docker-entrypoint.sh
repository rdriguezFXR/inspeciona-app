#!/bin/sh
# Script de entrada para configurar nginx dinamicamente

echo "🚀 Iniciando Nginx..."

# Substituir variável de ambiente no nginx.conf se BACKEND_URL estiver definida
if [ -n "$BACKEND_URL" ]; then
  echo "📡 Configurando backend URL: $BACKEND_URL"
  # Remover trailing slash se houver
  BACKEND_URL=$(echo "$BACKEND_URL" | sed 's|/$||')
  # Substituir a linha do proxy_pass
  sed -i "s|proxy_pass http://backend:3001/api;|proxy_pass $BACKEND_URL/api;|g" /etc/nginx/conf.d/default.conf
  echo "✅ Nginx configurado com backend: $BACKEND_URL"
else
  echo "⚠️  BACKEND_URL não definida, usando configuração padrão (http://backend:3001)"
fi

# Testar configuração do nginx
echo "🔍 Testando configuração do Nginx..."
nginx -t

# Executar nginx
echo "✅ Iniciando Nginx..."
exec nginx -g "daemon off;"

