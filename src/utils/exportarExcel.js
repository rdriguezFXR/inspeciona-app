import * as XLSX from 'xlsx'
import { storageManager } from './storageManager'
import { indexedDBManager } from './indexedDBManager'

export const exportarPlanilhaInspecoes = async (veiculos) => {
  // Carregar todos os veículos diretamente do IndexedDB primeiro, depois localStorage
  let todosVeiculos = veiculos
  
  try {
    // Tentar IndexedDB primeiro
    if (indexedDBManager.estaDisponivel()) {
      try {
        const veiculosIndexedDB = await indexedDBManager.carregarTodos()
        if (veiculosIndexedDB.length > 0) {
          todosVeiculos = veiculosIndexedDB
          console.log(`Exportando ${todosVeiculos.length} veículos do IndexedDB`)
        }
      } catch (error) {
        console.warn('Erro ao carregar do IndexedDB:', error)
      }
    }
    
    // Se IndexedDB não tiver dados, tentar localStorage
    if (todosVeiculos.length === 0 || todosVeiculos.length < veiculos.length) {
      const veiculosDoStorage = storageManager.carregar()
      if (Array.isArray(veiculosDoStorage) && veiculosDoStorage.length > 0) {
        if (veiculosDoStorage.length > todosVeiculos.length) {
          todosVeiculos = veiculosDoStorage
          console.log(`Exportando ${todosVeiculos.length} veículos do localStorage`)
        }
      }
    }
  } catch (error) {
    console.warn('Erro ao carregar do storage, usando veículos passados:', error)
  }

  if (todosVeiculos.length === 0) {
    alert('Não há dados para exportar!')
    return
  }

  // Filtrar apenas veículos válidos (com placa e dados básicos)
  const veiculosValidos = todosVeiculos.filter(v => {
    return v && 
           typeof v === 'object' && 
           v.placa && 
           v.placa.trim() !== ''
  })

  if (veiculosValidos.length === 0) {
    alert('Não há veículos válidos para exportar!')
    return
  }

  console.log(`Exportando ${veiculosValidos.length} de ${todosVeiculos.length} veículos válidos`)

  const calcularDiasRestantes = (dataVencimento) => {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const vencimento = new Date(dataVencimento)
    vencimento.setHours(0, 0, 0, 0)
    return Math.ceil((vencimento - hoje) / (1000 * 60 * 60 * 24))
  }

  // Preparar dados para exportação
  const dadosExportacao = veiculosValidos.map(veiculo => {
    let diasRestantes = 0
    try {
      if (veiculo.dataVencimento) {
        diasRestantes = calcularDiasRestantes(veiculo.dataVencimento)
      }
    } catch (error) {
      console.warn('Erro ao calcular dias restantes para veículo:', veiculo.placa, error)
      diasRestantes = 0
    }

    let risco = 'Baixo'
    let falha = 'Não'
    let melhoria = 'N/A'

    // Classificar risco
    if (diasRestantes < 0) {
      risco = 'Crítico'
      falha = 'Sim - Vencido'
      melhoria = 'Urgente: Renovar inspeção imediatamente'
    } else if (diasRestantes <= 5) {
      risco = 'Alto'
      falha = 'Potencial'
      melhoria = 'Atenção: Renovar inspeção em breve'
    } else if (veiculo.status === 'Não Verificado') {
      risco = 'Médio'
      falha = 'Sim - Não verificado'
      melhoria = 'Realizar verificação do veículo'
    }

    // Validar e formatar data de cadastro
    let dataCadastroFormatada = ''
    try {
      if (veiculo.dataCadastro) {
        dataCadastroFormatada = new Date(veiculo.dataCadastro).toLocaleDateString('pt-BR')
      } else {
        dataCadastroFormatada = 'N/A'
      }
    } catch (e) {
      dataCadastroFormatada = 'N/A'
    }

    // Validar e formatar data de vencimento
    let dataVencimentoFormatada = ''
    try {
      if (veiculo.dataVencimento) {
        dataVencimentoFormatada = new Date(veiculo.dataVencimento).toLocaleDateString('pt-BR')
      } else {
        dataVencimentoFormatada = 'N/A'
      }
    } catch (e) {
      dataVencimentoFormatada = 'N/A'
    }

    return {
      'Nome': veiculo.nome || '',
      'Empresa': veiculo.empresa || '',
      'Data Cadastro': dataCadastroFormatada,
      'Unidade': veiculo.unidade || '',
      'Departamento': veiculo.departamento || '',
      'Tipo Veículo': veiculo.tipoVeiculo || '',
      'Placa': veiculo.placa || '',
      'Ano': veiculo.ano || veiculo.anoModelo || '',
      'Modelo': veiculo.modelo || '',
      'Motorista': veiculo.nomeMotorista || '',
      'Status': veiculo.status || 'Não Verificado',
      'Data Vencimento': dataVencimentoFormatada,
      'Dias Restantes': diasRestantes,
      'Prazo (dias)': veiculo.prazoDias || 0,
      'Nível de Risco': risco,
      'Falha Identificada': falha,
      'Melhoria Sugerida': melhoria,
      'Observações': (veiculo.observacoes || []).map(obs => obs.texto).join(' | ') || 'Nenhuma',
      'Não Conformidades': veiculo.naoConformidades || 'Nenhuma'
    }
  })

  // Criar workbook
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(dadosExportacao)

  // Ajustar largura das colunas
  const colWidths = [
    { wch: 15 }, { wch: 20 }, { wch: 12 }, { wch: 12 },
    { wch: 25 }, { wch: 15 }, { wch: 10 }, { wch: 10 },
    { wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 12 },
    { wch: 10 }, { wch: 15 }, { wch: 20 }, { wch: 30 }, { wch: 40 }, { wch: 40 }
  ]
  ws['!cols'] = colWidths

  XLSX.utils.book_append_sheet(wb, ws, 'Inspeções')

  // Adicionar planilha de resumo
  const verificados = veiculosValidos.filter(v => v.status === 'Verificado').length
  const naoVerificados = veiculosValidos.filter(v => v.status === 'Não Verificado').length
  const vencidos = veiculosValidos.filter(v => {
    try {
      return calcularDiasRestantes(v.dataVencimento) < 0
    } catch {
      return false
    }
  }).length
  const emAtencao = veiculosValidos.filter(v => {
    try {
      const dias = calcularDiasRestantes(v.dataVencimento)
      return dias <= 5 && dias >= 0
    } catch {
      return false
    }
  }).length
  const ok = veiculosValidos.filter(v => {
    try {
      const dias = calcularDiasRestantes(v.dataVencimento)
      return dias > 5
    } catch {
      return false
    }
  }).length

  const resumo = [
    { 'Métrica': 'Total de Veículos', 'Valor': veiculosValidos.length },
    { 'Métrica': 'Verificados', 'Valor': verificados },
    { 'Métrica': 'Não Verificados', 'Valor': naoVerificados },
    { 'Métrica': 'Vencidos', 'Valor': vencidos },
    { 'Métrica': 'Em Atenção (≤5 dias)', 'Valor': emAtencao },
    { 'Métrica': 'OK', 'Valor': ok }
  ]
  const wsResumo = XLSX.utils.json_to_sheet(resumo)
  XLSX.utils.book_append_sheet(wb, wsResumo, 'Resumo')

  // Exportar
  const nomeArquivo = `Inspecoes_Samarco_${new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(wb, nomeArquivo)
  
  alert(`Planilha "${nomeArquivo}" baixada com sucesso!\nTotal de ${veiculosValidos.length} veículos exportados.`)
}

