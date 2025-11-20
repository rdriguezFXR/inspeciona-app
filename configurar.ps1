# Script de Configuração Automática
# Execute: .\configurar.ps1

Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  CONFIGURAÇÃO AUTOMÁTICA - Inspeciona+ Samarco" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Criar server/.env
$serverEnvPath = "server\.env"
if (-not (Test-Path $serverEnvPath)) {
    $serverEnvContent = @"
PORT=3001
OPENAI_API_KEY=sua_chave_openai_aqui
DB_PATH=./database/inspeciona.db
"@
    $serverEnvContent | Out-File -FilePath $serverEnvPath -Encoding utf8
    Write-Host "✅ Arquivo server/.env criado!" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Arquivo server/.env já existe." -ForegroundColor Yellow
}

# Criar .env na raiz
$rootEnvPath = ".env"
if (-not (Test-Path $rootEnvPath)) {
    $rootEnvContent = "VITE_API_URL=http://localhost:3001/api"
    $rootEnvContent | Out-File -FilePath $rootEnvPath -Encoding utf8
    Write-Host "✅ Arquivo .env criado na raiz!" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Arquivo .env já existe na raiz." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  PRÓXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. EDITE server/.env e adicione sua API Key da OpenAI" -ForegroundColor White
Write-Host "   - Abra: server\.env" -ForegroundColor Gray
Write-Host "   - Substitua: sua_chave_openai_aqui" -ForegroundColor Gray
Write-Host "   - Obtenha em: https://platform.openai.com/api-keys" -ForegroundColor Gray
Write-Host ""
Write-Host "2. INSTALE AS DEPENDÊNCIAS DO BACKEND:" -ForegroundColor White
Write-Host "   cd server" -ForegroundColor Green
Write-Host "   npm install" -ForegroundColor Green
Write-Host ""
Write-Host "3. INICIE O BACKEND:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Green
Write-Host ""
Write-Host "4. EM OUTRO TERMINAL, INICIE O FRONTEND:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Green
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan

