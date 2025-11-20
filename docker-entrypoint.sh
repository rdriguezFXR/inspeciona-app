#!/bin/sh
# Script de entrada para configurar nginx dinamicamente

echo "🚀 Iniciando Nginx..."

# Gerar configuração do nginx baseado em BACKEND_URL
if [ -n "$BACKEND_URL" ]; then
  echo "📡 Configurando backend URL: $BACKEND_URL"
  # Remover trailing slash se houver
  BACKEND_URL=$(echo "$BACKEND_URL" | sed 's|/$||')
  
  # Gerar bloco de configuração do proxy
  API_CONFIG="    location /api {
        resolver 127.0.0.11 valid=10s;
        resolver_timeout 5s;
        set \$backend_url $BACKEND_URL;
        proxy_pass \$backend_url/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503;
        proxy_next_upstream_tries 1;
    }"
  
  # Substituir placeholder no nginx.conf
  sed -i "s|# PLACEHOLDER_API_LOCATION|$API_CONFIG|g" /etc/nginx/conf.d/default.conf
  echo "✅ Nginx configurado com backend: $BACKEND_URL"
else
  echo "⚠️  BACKEND_URL não definida"
  echo "ℹ️  Frontend funcionará, mas /api retornará erro até o backend ser configurado"
  echo "💡 Configure a variável BACKEND_URL com a URL do seu serviço backend"
  
  # Gerar bloco de erro amigável
  API_CONFIG="    location /api {
        return 503 'Backend não configurado. Configure BACKEND_URL no Easypanel.';
        add_header Content-Type text/plain;
    }"
  
  # Substituir placeholder no nginx.conf
  sed -i "s|# PLACEHOLDER_API_LOCATION|$API_CONFIG|g" /etc/nginx/conf.d/default.conf
fi

# Testar configuração do nginx
echo "🔍 Testando configuração do Nginx..."
nginx -t

# Executar nginx
echo "✅ Iniciando Nginx..."
exec nginx -g "daemon off;"

