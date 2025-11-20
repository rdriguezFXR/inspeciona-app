// Utilitário para debug do storage
import { storageManager } from './storageManager'
import { indexedDBManager } from './indexedDBManager'

export const mostrarInfoStorage = async () => {
  const status = storageManager.verificarStatus()
  
  console.log('=== INFORMAÇÕES DO STORAGE ===')
  console.log('')
  console.log('🗄️ INDEXEDDB (Banco de Dados):')
  const indexedDBDisponivel = indexedDBManager.estaDisponivel()
  console.log('- Disponível:', indexedDBDisponivel ? '✅ Sim' : '❌ Não')
  
  let veiculosIndexedDB = []
  if (indexedDBDisponivel) {
    try {
      veiculosIndexedDB = await indexedDBManager.carregarTodos()
      console.log(`- Veículos no IndexedDB: ${veiculosIndexedDB.length}`)
      const stats = await indexedDBManager.obterEstatisticas()
      console.log(`  • Verificados: ${stats.verificados}`)
      console.log(`  • Não verificados: ${stats.naoVerificados}`)
    } catch (error) {
      console.log('- Erro ao carregar IndexedDB:', error.message)
    }
  }
  
  console.log('')
  console.log('💾 LOCALSTORAGE (Backup):')
  console.log('Chave Principal:', 'veiculos_inspecao')
  console.log('Chave Backup 1:', 'veiculos_inspecao_backup1')
  console.log('Chave Backup 2:', 'veiculos_inspecao_backup2')
  console.log('Chave Metadata:', 'veiculos_metadata')
  console.log('')
  console.log('Status localStorage:')
  console.log('- Principal salvo:', status.principal ? '✅' : '❌')
  console.log('- Backup 1 salvo:', status.backup1 ? '✅' : '❌')
  console.log('- Backup 2 salvo:', status.backup2 ? '✅' : '❌')
  console.log('- Metadata:', status.metadata ? '✅' : '❌')
  console.log('')
  
  // Verificar localStorage diretamente
  const primary = localStorage.getItem('veiculos_inspecao')
  const backup1 = localStorage.getItem('veiculos_inspecao_backup1')
  const backup2 = localStorage.getItem('veiculos_inspecao_backup2')
  
  if (primary) {
    try {
      const dados = JSON.parse(primary)
      const veiculos = Array.isArray(dados.veiculos) ? dados.veiculos : dados
      console.log(`Principal: ${Array.isArray(veiculos) ? veiculos.length : 'N/A'} veículos`)
    } catch (e) {
      console.log('Principal: Erro ao parsear')
    }
  }
  
  if (backup1) {
    try {
      const dados = JSON.parse(backup1)
      const veiculos = Array.isArray(dados.veiculos) ? dados.veiculos : dados
      console.log(`Backup 1: ${Array.isArray(veiculos) ? veiculos.length : 'N/A'} veículos`)
    } catch (e) {
      console.log('Backup 1: Erro ao parsear')
    }
  }
  
  if (backup2) {
    try {
      const dados = JSON.parse(backup2)
      const veiculos = Array.isArray(dados.veiculos) ? dados.veiculos : dados
      console.log(`Backup 2: ${Array.isArray(veiculos) ? veiculos.length : 'N/A'} veículos`)
    } catch (e) {
      console.log('Backup 2: Erro ao parsear')
    }
  }
  
  // Carregar todos os veículos (prioridade IndexedDB)
  let todosVeiculos = []
  if (indexedDBDisponivel && veiculosIndexedDB.length > 0) {
    todosVeiculos = veiculosIndexedDB
    console.log('')
    console.log('📊 FONTE PRINCIPAL: IndexedDB')
  } else {
    todosVeiculos = storageManager.carregar()
    console.log('')
    console.log('📊 FONTE PRINCIPAL: localStorage')
  }
  
  console.log(`Total carregado: ${todosVeiculos.length} veículos`)
  console.log('Placas:', todosVeiculos.map(v => v.placa || 'Sem placa'))
  console.log('==============================')
  
  return {
    status,
    indexedDB: {
      disponivel: indexedDBDisponivel,
      total: veiculosIndexedDB.length
    },
    total: todosVeiculos.length,
    veiculos: todosVeiculos
  }
}

