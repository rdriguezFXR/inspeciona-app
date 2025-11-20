// Gerenciador robusto de armazenamento com múltiplas camadas de backup

class StorageManager {
  constructor() {
    this.STORAGE_KEYS = {
      PRIMARY: 'veiculos_inspecao',
      BACKUP1: 'veiculos_inspecao_backup1',
      BACKUP2: 'veiculos_inspecao_backup2',
      METADATA: 'veiculos_metadata'
    }
  }

  // Salvar com múltiplas camadas de backup
  salvar(veiculos) {
    try {
      const dados = {
        veiculos: veiculos,
        timestamp: new Date().toISOString(),
        versao: '2.0'
      }

      // Salvar em localStorage (principal)
      localStorage.setItem(this.STORAGE_KEYS.PRIMARY, JSON.stringify(dados))
      
      // Backup 1 (localStorage)
      const backup1 = localStorage.getItem(this.STORAGE_KEYS.PRIMARY)
      if (backup1) {
        localStorage.setItem(this.STORAGE_KEYS.BACKUP1, backup1)
      }
      
      // Backup 2 (localStorage - rotação)
      const backup2 = localStorage.getItem(this.STORAGE_KEYS.BACKUP1)
      if (backup2) {
        localStorage.setItem(this.STORAGE_KEYS.BACKUP2, backup2)
      }

      // Salvar também em sessionStorage como backup adicional
      try {
        sessionStorage.setItem(this.STORAGE_KEYS.PRIMARY, JSON.stringify(dados))
      } catch (e) {
        console.warn('SessionStorage não disponível:', e)
      }

      // Metadata
      const metadata = {
        ultimaAtualizacao: new Date().toISOString(),
        quantidade: veiculos.length,
        checksum: this.calcularChecksum(veiculos)
      }
      localStorage.setItem(this.STORAGE_KEYS.METADATA, JSON.stringify(metadata))

      return { sucesso: true, quantidade: veiculos.length }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      
      // Tentar salvar em backup mesmo com erro
      try {
        const dados = { veiculos, timestamp: new Date().toISOString() }
        localStorage.setItem(this.STORAGE_KEYS.BACKUP1, JSON.stringify(dados))
      } catch (e) {
        console.error('Erro ao salvar backup:', e)
      }
      
      return { sucesso: false, erro: error.message }
    }
  }

  // Carregar com recuperação automática de backup
  carregar() {
    try {
      // Verificar se há dados na chave antiga e migrar
      const dadosAntigos = localStorage.getItem('veiculos')
      if (dadosAntigos && !localStorage.getItem(this.STORAGE_KEYS.PRIMARY)) {
        try {
          const veiculosAntigos = JSON.parse(dadosAntigos)
          if (Array.isArray(veiculosAntigos) && veiculosAntigos.length > 0) {
            console.log(`Migrando ${veiculosAntigos.length} veículos da chave antiga`)
            this.salvar(veiculosAntigos)
          }
        } catch (e) {
          console.warn('Erro ao migrar dados antigos:', e)
        }
      }

      // Tentar carregar do principal
      let dados = localStorage.getItem(this.STORAGE_KEYS.PRIMARY)
      
      if (!dados) {
        // Tentar backup 1
        dados = localStorage.getItem(this.STORAGE_KEYS.BACKUP1)
        if (dados) {
          console.log('Recuperado do backup 1')
          // Restaurar do backup
          localStorage.setItem(this.STORAGE_KEYS.PRIMARY, dados)
        }
      }

      if (!dados) {
        // Tentar backup 2
        dados = localStorage.getItem(this.STORAGE_KEYS.BACKUP2)
        if (dados) {
          console.log('Recuperado do backup 2')
          localStorage.setItem(this.STORAGE_KEYS.PRIMARY, dados)
        }
      }

      if (!dados) {
        // Tentar sessionStorage
        dados = sessionStorage.getItem(this.STORAGE_KEYS.PRIMARY)
        if (dados) {
          console.log('Recuperado do sessionStorage')
          localStorage.setItem(this.STORAGE_KEYS.PRIMARY, dados)
        }
      }

      if (dados) {
        const parsed = JSON.parse(dados)
        // Extrair array de veículos (pode estar em parsed.veiculos ou ser o próprio parsed se for array)
        let veiculos = []
        if (Array.isArray(parsed)) {
          veiculos = parsed
        } else if (parsed.veiculos && Array.isArray(parsed.veiculos)) {
          veiculos = parsed.veiculos
        } else if (Array.isArray(parsed)) {
          veiculos = parsed
        }
        
        // Validar integridade - ser mais permissivo
        if (veiculos.length > 0) {
          // Se tiver veículos, retornar mesmo que alguns não passem na validação estrita
          // Filtrar apenas os completamente inválidos
          const veiculosValidos = veiculos.filter(v => {
            return v && typeof v === 'object' && (v.placa || v.id)
          })
          
          if (veiculosValidos.length > 0) {
            console.log(`Carregados ${veiculosValidos.length} de ${veiculos.length} veículos válidos`)
            return veiculosValidos
          }
        }
        
        // Se chegou aqui, tentar backup
        if (veiculos.length === 0) {
          return []
        } else {
          console.warn('Alguns dados podem estar corrompidos, tentando recuperar de backup')
          const backup = this.recuperarDeBackup()
          return backup.length > 0 ? backup : veiculos
        }
      }

      return []
    } catch (error) {
      console.error('Erro ao carregar:', error)
      return this.recuperarDeBackup()
    }
  }

  // Recuperar de backup
  recuperarDeBackup() {
    const backups = [
      this.STORAGE_KEYS.BACKUP1,
      this.STORAGE_KEYS.BACKUP2
    ]

    for (const key of backups) {
      try {
        const dados = localStorage.getItem(key)
        if (dados) {
          const parsed = JSON.parse(dados)
          let veiculos = []
          if (Array.isArray(parsed)) {
            veiculos = parsed
          } else if (parsed.veiculos && Array.isArray(parsed.veiculos)) {
            veiculos = parsed.veiculos
          }
          
          if (veiculos.length > 0) {
            // Filtrar apenas os válidos mas retornar todos que tiverem placa
            const veiculosValidos = veiculos.filter(v => {
              return v && typeof v === 'object' && (v.placa || v.id)
            })
            
            if (veiculosValidos.length > 0) {
              console.log(`Dados recuperados de ${key}: ${veiculosValidos.length} veículos`)
              // Restaurar no principal
              localStorage.setItem(this.STORAGE_KEYS.PRIMARY, dados)
              return veiculosValidos
            }
          }
        }
      } catch (e) {
        console.warn(`Erro ao recuperar de ${key}:`, e)
        continue
      }
    }

    return []
  }

  // Validar integridade dos dados
  validarDados(veiculos) {
    if (!Array.isArray(veiculos)) return false
    if (veiculos.length === 0) return true // Array vazio é válido
    
    // Verificar se pelo menos 50% dos veículos têm os campos essenciais
    const validos = veiculos.filter(v => {
      return v && 
             typeof v === 'object' && 
             (v.id || v.placa) && 
             v.placa
    })
    
    return validos.length >= veiculos.length * 0.5
  }

  // Calcular checksum simples
  calcularChecksum(veiculos) {
    return veiculos.length.toString() + 
           veiculos.map(v => v.id || '').join('').substring(0, 10)
  }

  // Verificar status do armazenamento
  verificarStatus() {
    const principal = localStorage.getItem(this.STORAGE_KEYS.PRIMARY)
    const backup1 = localStorage.getItem(this.STORAGE_KEYS.BACKUP1)
    const backup2 = localStorage.getItem(this.STORAGE_KEYS.BACKUP2)
    const metadata = localStorage.getItem(this.STORAGE_KEYS.METADATA)

    return {
      principal: !!principal,
      backup1: !!backup1,
      backup2: !!backup2,
      metadata: metadata ? JSON.parse(metadata) : null,
      storageDisponivel: this.verificarEspacoDisponivel()
    }
  }

  // Verificar espaço disponível
  verificarEspacoDisponivel() {
    try {
      const test = 'test'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch (e) {
      return false
    }
  }

  // Limpar todos os dados (cuidado!)
  limparTudo() {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
      sessionStorage.removeItem(key)
    })
  }
}

export const storageManager = new StorageManager()

