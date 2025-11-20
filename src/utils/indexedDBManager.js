// Gerenciador de IndexedDB para armazenamento robusto e persistente

class IndexedDBManager {
  constructor() {
    this.dbName = 'InspecionaSamarcoDB'
    this.version = 1
    this.storeName = 'veiculos'
    this.db = null
  }

  // Abrir conexão com o banco
  async abrirDB() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        resolve(this.db)
        return
      }

      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => {
        console.error('Erro ao abrir IndexedDB:', request.error)
        reject(request.error)
      }

      request.onsuccess = () => {
        this.db = request.result
        console.log('✅ IndexedDB aberto com sucesso')
        resolve(this.db)
      }

      request.onupgradeneeded = (event) => {
        const db = event.target.result
        
        // Criar object store se não existir
        if (!db.objectStoreNames.contains(this.storeName)) {
          const objectStore = db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: false })
          objectStore.createIndex('placa', 'placa', { unique: false })
          objectStore.createIndex('dataCadastro', 'dataCadastro', { unique: false })
          console.log('✅ Object store criado')
        }
      }
    })
  }

  // Salvar todos os veículos
  async salvarTodos(veiculos) {
    try {
      const db = await this.abrirDB()
      const transaction = db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)

      // Limpar todos os dados antigos
      await store.clear()

      // Adicionar todos os veículos
      const promises = veiculos.map(veiculo => {
        return new Promise((resolve, reject) => {
          const request = store.add(veiculo)
          request.onsuccess = () => resolve()
          request.onerror = () => reject(request.error)
        })
      })

      await Promise.all(promises)
      
      console.log(`✅ ${veiculos.length} veículos salvos no IndexedDB`)
      return { sucesso: true, quantidade: veiculos.length }
    } catch (error) {
      console.error('Erro ao salvar no IndexedDB:', error)
      return { sucesso: false, erro: error.message }
    }
  }

  // Adicionar um veículo
  async adicionar(veiculo) {
    try {
      const db = await this.abrirDB()
      const transaction = db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)

      return new Promise((resolve, reject) => {
        const request = store.add(veiculo)
        request.onsuccess = () => {
          console.log('✅ Veículo adicionado ao IndexedDB')
          resolve({ sucesso: true })
        }
        request.onerror = () => {
          console.error('Erro ao adicionar:', request.error)
          reject({ sucesso: false, erro: request.error })
        }
      })
    } catch (error) {
      console.error('Erro ao adicionar no IndexedDB:', error)
      return { sucesso: false, erro: error.message }
    }
  }

  // Atualizar um veículo
  async atualizar(id, dadosAtualizados) {
    try {
      const db = await this.abrirDB()
      const transaction = db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)

      // Buscar veículo existente
      const veiculo = await new Promise((resolve, reject) => {
        const request = store.get(id)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })

      if (!veiculo) {
        return { sucesso: false, erro: 'Veículo não encontrado' }
      }

      // Atualizar
      const veiculoAtualizado = { ...veiculo, ...dadosAtualizados }
      
      return new Promise((resolve, reject) => {
        const request = store.put(veiculoAtualizado)
        request.onsuccess = () => {
          console.log('✅ Veículo atualizado no IndexedDB')
          resolve({ sucesso: true })
        }
        request.onerror = () => {
          console.error('Erro ao atualizar:', request.error)
          reject({ sucesso: false, erro: request.error })
        }
      })
    } catch (error) {
      console.error('Erro ao atualizar no IndexedDB:', error)
      return { sucesso: false, erro: error.message }
    }
  }

  // Deletar um veículo
  async deletar(id) {
    try {
      const db = await this.abrirDB()
      const transaction = db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)

      return new Promise((resolve, reject) => {
        const request = store.delete(id)
        request.onsuccess = () => {
          console.log('✅ Veículo deletado do IndexedDB')
          resolve({ sucesso: true })
        }
        request.onerror = () => {
          console.error('Erro ao deletar:', request.error)
          reject({ sucesso: false, erro: request.error })
        }
      })
    } catch (error) {
      console.error('Erro ao deletar do IndexedDB:', error)
      return { sucesso: false, erro: error.message }
    }
  }

  // Carregar todos os veículos
  async carregarTodos() {
    try {
      const db = await this.abrirDB()
      const transaction = db.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)

      return new Promise((resolve, reject) => {
        const request = store.getAll()
        request.onsuccess = () => {
          const veiculos = request.result || []
          console.log(`✅ ${veiculos.length} veículos carregados do IndexedDB`)
          resolve(veiculos)
        }
        request.onerror = () => {
          console.error('Erro ao carregar:', request.error)
          reject([])
        }
      })
    } catch (error) {
      console.error('Erro ao carregar do IndexedDB:', error)
      return []
    }
  }

  // Buscar por placa
  async buscarPorPlaca(placa) {
    try {
      const db = await this.abrirDB()
      const transaction = db.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const index = store.index('placa')

      return new Promise((resolve, reject) => {
        const request = index.getAll(placa.toUpperCase())
        request.onsuccess = () => {
          resolve(request.result || [])
        }
        request.onerror = () => {
          reject([])
        }
      })
    } catch (error) {
      console.error('Erro ao buscar por placa:', error)
      return []
    }
  }

  // Verificar se IndexedDB está disponível
  static estaDisponivel() {
    return 'indexedDB' in window
  }

  // Estatísticas do banco
  async obterEstatisticas() {
    try {
      const veiculos = await this.carregarTodos()
      return {
        total: veiculos.length,
        verificados: veiculos.filter(v => v.status === 'Verificado').length,
        naoVerificados: veiculos.filter(v => v.status === 'Não Verificado').length
      }
    } catch (error) {
      return { total: 0, verificados: 0, naoVerificados: 0 }
    }
  }
}

export const indexedDBManager = new IndexedDBManager()

