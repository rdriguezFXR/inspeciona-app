// Serviço de API para comunicação com o backend

// Tentar usar configuração dinâmica primeiro (runtime)
const getApiBaseUrl = () => {
  // 1. Verificar se há configuração global (config.js)
  if (typeof window !== 'undefined' && window.APP_CONFIG?.API_URL) {
    return window.APP_CONFIG.API_URL
  }
  
  // 2. Verificar variável de ambiente (build time)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  // 3. Detectar automaticamente baseado no host
  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    // Se estiver em produção (não localhost), usar o mesmo domínio
    if (host !== 'localhost' && host !== '127.0.0.1') {
      // Tentar usar o mesmo domínio com porta do backend
      // Ou usar proxy reverso via nginx
      return '/api' // Nginx fará proxy reverso
    }
  }
  
  // 4. Fallback para desenvolvimento local
  return 'http://localhost:3001/api'
}

const API_BASE_URL = getApiBaseUrl()

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ erro: 'Erro na requisição' }))
        throw new Error(error.erro || `Erro ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Erro na requisição:', error)
      throw error
    }
  }

  // Veículos
  async listarVeiculos() {
    return this.request('/veiculos')
  }

  async buscarVeiculo(id) {
    return this.request(`/veiculos/${id}`)
  }

  async buscarPorPlaca(placa) {
    try {
      return await this.request(`/veiculos/placa/${placa}`)
    } catch (error) {
      if (error.message.includes('404') || error.message.includes('não inspecionada')) {
        return null
      }
      throw error
    }
  }

  async criarVeiculo(veiculo) {
    return this.request('/veiculos', {
      method: 'POST',
      body: JSON.stringify(veiculo)
    })
  }

  async atualizarVeiculo(id, dados) {
    return this.request(`/veiculos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados)
    })
  }

  async deletarVeiculo(id) {
    return this.request(`/veiculos/${id}`, {
      method: 'DELETE'
    })
  }

  // OpenAI
  async analisarInspecao(veiculo, observacoes, naoConformidades) {
    return this.request('/openai/analisar', {
      method: 'POST',
      body: JSON.stringify({ veiculo, observacoes, naoConformidades })
    })
  }

  async gerarRelatorio(veiculos) {
    return this.request('/openai/relatorio', {
      method: 'POST',
      body: JSON.stringify({ veiculos })
    })
  }

  async obterSugestoes(contexto, tipo) {
    return this.request('/openai/sugestoes', {
      method: 'POST',
      body: JSON.stringify({ contexto, tipo })
    })
  }

  // Health check
  async verificarServidor() {
    try {
      return await this.request('/health')
    } catch (error) {
      return { status: 'erro', mensagem: 'Servidor não disponível' }
    }
  }
}

export const apiService = new ApiService()

