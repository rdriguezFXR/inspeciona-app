# 🌐 Configurar DNS - inspeciona.online

## 📋 Passo a Passo no Hostinger

### 1️⃣ Acessar Gerenciamento do Domínio

1. Acesse sua conta no Hostinger
2. Vá em **"Domínios"** → **"inspeciona.online"**
3. Clique em **"Gerenciar"** ou **"DNS"**

### 2️⃣ Configurar DNS no Hostinger

Você tem duas opções:

#### Opção A: Usar DNS do Easypanel (Recomendado)

1. No Easypanel, vá nas configurações do seu serviço frontend
2. Procure por **"DNS"** ou **"Domínio"**
3. O Easypanel deve fornecer registros DNS como:
   - Tipo: `A` ou `CNAME`
   - Nome: `@` ou `inspeciona.online`
   - Valor: IP ou domínio do Easypanel

4. No Hostinger, edite os registros DNS:
   - **Tipo**: `A` (se for IP) ou `CNAME` (se for domínio)
   - **Nome**: `@` (para o domínio raiz) ou deixe em branco
   - **Valor**: Cole o IP ou domínio fornecido pelo Easypanel
   - **TTL**: `3600` (ou padrão)

#### Opção B: Apontar para IP do Easypanel

Se o Easypanel forneceu um IP:

1. No Hostinger, edite o registro `A`:
   - **Nome**: `@`
   - **Valor**: `IP_DO_EASYPANEL` (ex: `123.45.67.89`)
   - **TTL**: `3600`

### 3️⃣ Aguardar Propagação DNS

- Pode levar de **5 minutos a 48 horas**
- Normalmente leva **15-30 minutos**
- Use ferramentas como `whatsmydns.net` para verificar

### 4️⃣ Configurar SSL/HTTPS no Easypanel

1. No Easypanel, após o DNS propagar
2. Vá nas configurações do domínio
3. Ative **SSL/HTTPS** (geralmente automático com Let's Encrypt)
4. Aguarde a certificação (pode levar alguns minutos)

## 🔍 Verificar Configuração

### Testar DNS

```bash
# No terminal ou cmd
nslookup inspeciona.online

# Ou use online
# https://www.whatsmydns.net/#A/inspeciona.online
```

### Testar Site

1. Aguarde a propagação DNS
2. Acesse: `https://inspeciona.online`
3. Verifique se carrega corretamente

## ⚠️ Problemas Comuns

### DNS não propagou
- Aguarde mais tempo (até 48h)
- Verifique se os registros estão corretos
- Limpe o cache do DNS: `ipconfig /flushdns` (Windows)

### SSL não funciona
- Aguarde alguns minutos após configurar DNS
- Verifique se o domínio está apontando corretamente
- No Easypanel, force a renovação do certificado

### Site não carrega
- Verifique se o serviço está rodando no Easypanel
- Verifique os logs do Easypanel
- Verifique se o domínio está configurado corretamente

## 📞 Precisa de Ajuda?

Se tiver problemas:
1. Verifique os logs no Easypanel
2. Verifique se o DNS propagou (whatsmydns.net)
3. Verifique se o serviço está rodando
4. Verifique se o SSL está ativo

