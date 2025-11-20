import React, { useState, useEffect } from 'react'
import FormularioInspecao from './components/FormularioInspecao'
import ListaVeiculos from './components/ListaVeiculos'
import BuscaPlaca from './components/BuscaPlaca'
import Dashboard from './components/Dashboard'
import { storageManager } from './utils/storageManager'
import { indexedDBManager } from './utils/indexedDBManager'
import './App.css'

function App() {
  const [veiculos, setVeiculos] = useState([])
  const [activeTab, setActiveTab] = useState('cadastro')
  const [statusStorage, setStatusStorage] = useState(null)

  // Carregar veículos do storage ao iniciar
  useEffect(() => {
    const carregarDadosIniciais = async () => {
      try {
        let veiculosCarregados = []
        
        // Tentar carregar do IndexedDB primeiro
        if (indexedDBManager.estaDisponivel()) {
          try {
            veiculosCarregados = await indexedDBManager.carregarTodos()
            console.log(`✅ ${veiculosCarregados.length} veículos carregados do IndexedDB`)
            
            // Se IndexedDB estiver vazio, tentar migrar do localStorage
            if (veiculosCarregados.length === 0) {
              const veiculosLocalStorage = storageManager.carregar()
              if (veiculosLocalStorage.length > 0) {
                console.log(`Migrando ${veiculosLocalStorage.length} veículos do localStorage para IndexedDB`)
                await indexedDBManager.salvarTodos(veiculosLocalStorage)
                veiculosCarregados = veiculosLocalStorage
              }
            }
          } catch (error) {
            console.warn('Erro ao carregar do IndexedDB, usando localStorage:', error)
            veiculosCarregados = storageManager.carregar()
          }
        } else {
          // Fallback para localStorage
          veiculosCarregados = storageManager.carregar()
        }

        if (Array.isArray(veiculosCarregados)) {
          setVeiculos(veiculosCarregados)
          console.log(`✅ ${veiculosCarregados.length} veículos carregados`)
        }
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error)
        const veiculosLocalStorage = storageManager.carregar()
        if (Array.isArray(veiculosLocalStorage)) {
          setVeiculos(veiculosLocalStorage)
        }
      }
    }

    carregarDadosIniciais()

    // Verificar periodicamente se os dados estão salvos
    const intervalo = setInterval(async () => {
      if (veiculos.length > 0) {
        // Salvar no IndexedDB
        if (indexedDBManager.estaDisponivel()) {
          try {
            await indexedDBManager.salvarTodos(veiculos)
          } catch (error) {
            console.warn('Aviso: Problema ao salvar no IndexedDB automaticamente')
          }
        }
        
        // Salvar no localStorage também
        const resultado = storageManager.salvar(veiculos)
        if (!resultado.sucesso) {
          console.warn('Aviso: Problema ao salvar dados automaticamente')
        }
      }
    }, 30000) // A cada 30 segundos

    return () => clearInterval(intervalo)
  }, [])

  // Salvar sempre que veículos mudarem (IndexedDB + localStorage)
  useEffect(() => {
    if (veiculos.length >= 0) {
      const salvarDados = async () => {
        // Salvar no IndexedDB (banco de dados)
        if (indexedDBManager.estaDisponivel()) {
          try {
            await indexedDBManager.salvarTodos(veiculos)
            console.log('✅ Dados salvos no IndexedDB')
          } catch (error) {
            console.error('Erro ao salvar no IndexedDB:', error)
          }
        }

        // Salvar também no localStorage (backup)
        const resultado = storageManager.salvar(veiculos)
        if (resultado.sucesso) {
          const status = storageManager.verificarStatus()
          setStatusStorage(status)
        } else {
          console.error('Erro ao salvar no localStorage:', resultado.erro)
        }
      }

      salvarDados()
    }
  }, [veiculos])

  const adicionarVeiculo = async (novoVeiculo) => {
    const veiculoComId = {
      ...novoVeiculo,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      dataCadastro: new Date().toISOString(),
      observacoes: novoVeiculo.observacoes || []
    }
    const novosVeiculos = [...veiculos, veiculoComId]
    setVeiculos(novosVeiculos)
    
    // Salvar imediatamente no IndexedDB
    if (indexedDBManager.estaDisponivel()) {
      try {
        await indexedDBManager.adicionar(veiculoComId)
        console.log('✅ Veículo adicionado ao IndexedDB')
      } catch (error) {
        console.error('Erro ao adicionar no IndexedDB:', error)
      }
    }
    
    // Salvar também no localStorage (backup)
    const resultado = storageManager.salvar(novosVeiculos)
    if (!resultado.sucesso) {
      alert('⚠️ Erro ao salvar no backup! Dados podem ter sido perdidos.')
    }
  }

  const atualizarVeiculo = async (id, dadosAtualizados) => {
    const novosVeiculos = veiculos.map(v => 
      v.id === id ? { ...v, ...dadosAtualizados } : v
    )
    setVeiculos(novosVeiculos)
    
    // Atualizar no IndexedDB
    if (indexedDBManager.estaDisponivel()) {
      try {
        await indexedDBManager.atualizar(id, dadosAtualizados)
        console.log('✅ Veículo atualizado no IndexedDB')
      } catch (error) {
        console.error('Erro ao atualizar no IndexedDB:', error)
      }
    }
    
    // Salvar também no localStorage (backup)
    storageManager.salvar(novosVeiculos)
  }

  const deletarVeiculo = async (id) => {
    const novosVeiculos = veiculos.filter(v => v.id !== id)
    setVeiculos(novosVeiculos)
    
    // Deletar do IndexedDB
    if (indexedDBManager.estaDisponivel()) {
      try {
        await indexedDBManager.deletar(id)
        console.log('✅ Veículo deletado do IndexedDB')
      } catch (error) {
        console.error('Erro ao deletar do IndexedDB:', error)
      }
    }
    
    // Salvar também no localStorage (backup)
    storageManager.salvar(novosVeiculos)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🔍 Inspeciona+ Samarco</h1>
      </header>

      <nav className="app-nav">
        <button 
          className={activeTab === 'cadastro' ? 'active' : ''}
          onClick={() => setActiveTab('cadastro')}
        >
          Cadastro
        </button>
        <button 
          className={activeTab === 'busca' ? 'active' : ''}
          onClick={() => setActiveTab('busca')}
        >
          Buscar
        </button>
        <button 
          className={activeTab === 'lista' ? 'active' : ''}
          onClick={() => setActiveTab('lista')}
        >
          Lista
        </button>
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'cadastro' && (
          <FormularioInspecao 
            onAdicionar={adicionarVeiculo} 
            veiculos={veiculos}
            onAtualizar={atualizarVeiculo}
          />
        )}
        {activeTab === 'busca' && (
          <BuscaPlaca veiculos={veiculos} />
        )}
        {activeTab === 'lista' && (
          <ListaVeiculos 
            veiculos={veiculos} 
            onAtualizar={atualizarVeiculo}
            onDeletar={deletarVeiculo}
          />
        )}
        {activeTab === 'dashboard' && (
          <Dashboard veiculos={veiculos} />
        )}
      </main>
    </div>
  )
}

export default App

