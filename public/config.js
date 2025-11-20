// Configuração dinâmica da API
// Este arquivo será carregado antes do app React
window.APP_CONFIG = {
  API_URL: window.location.origin.includes('localhost') 
    ? 'http://localhost:3001/api'
    : '/api' // Usar proxy reverso do nginx
}

