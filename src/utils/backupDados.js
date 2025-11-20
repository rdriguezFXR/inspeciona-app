// Função para fazer backup dos dados
export const fazerBackup = (veiculos) => {
  try {
    const dadosBackup = {
      veiculos: veiculos,
      dataBackup: new Date().toISOString(),
      versao: '1.0'
    }
    
    const dadosJSON = JSON.stringify(dadosBackup, null, 2)
    const blob = new Blob([dadosJSON], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `backup_inspecoes_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    return true
  } catch (error) {
    console.error('Erro ao fazer backup:', error)
    return false
  }
}

// Função para verificar se os dados estão salvos
export const verificarDadosSalvos = () => {
  try {
    const veiculosSalvos = localStorage.getItem('veiculos')
    if (veiculosSalvos) {
      const veiculos = JSON.parse(veiculosSalvos)
      return {
        salvo: true,
        quantidade: veiculos.length,
        ultimaAtualizacao: localStorage.getItem('veiculos_ultima_atualizacao')
      }
    }
    return { salvo: false, quantidade: 0 }
  } catch (error) {
    return { salvo: false, quantidade: 0, erro: error.message }
  }
}

