import React, { useState } from 'react'
import { apiService } from '../services/api'
import './AnaliseIA.css'

function AnaliseIA({ veiculo, observacoes, naoConformidades }) {
  const [analise, setAnalise] = useState(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)

  const analisarComIA = async () => {
    if (!veiculo) {
      setErro('Selecione um veículo primeiro')
      return
    }

    setCarregando(true)
    setErro(null)
    setAnalise(null)

    try {
      const resultado = await apiService.analisarInspecao(
        veiculo,
        observacoes || [],
        naoConformidades || ''
      )
      setAnalise(resultado)
    } catch (error) {
      console.error('Erro ao analisar:', error)
      setErro(error.message || 'Erro ao analisar com IA. Verifique se o servidor está rodando.')
    } finally {
      setCarregando(false)
    }
  }

  const getRiscoColor = (risco) => {
    switch (risco?.toLowerCase()) {
      case 'crítico':
      case 'critico':
        return '#ff4444'
      case 'alto':
        return '#ff8800'
      case 'médio':
      case 'medio':
        return '#ffbb00'
      case 'baixo':
        return '#00aa00'
      default:
        return '#666'
    }
  }

  return (
    <div className="analise-ia-container">
      <h3>🤖 Análise com Inteligência Artificial</h3>
      
      <button 
        onClick={analisarComIA} 
        disabled={carregando || !veiculo}
        className="btn-analisar-ia"
      >
        {carregando ? '⏳ Analisando...' : '🔍 Analisar com IA'}
      </button>

      {erro && (
        <div className="erro-ia">
          ⚠️ {erro}
        </div>
      )}

      {analise && (
        <div className="resultado-analise">
          <div className="risco-card" style={{ borderColor: getRiscoColor(analise.risco) }}>
            <h4>Nível de Risco</h4>
            <span className="risco-badge" style={{ backgroundColor: getRiscoColor(analise.risco) }}>
              {analise.risco}
            </span>
          </div>

          {analise.falhas && analise.falhas.length > 0 && (
            <div className="falhas-card">
              <h4>⚠️ Falhas Identificadas</h4>
              <ul>
                {analise.falhas.map((falha, index) => (
                  <li key={index}>{falha}</li>
                ))}
              </ul>
            </div>
          )}

          {analise.melhorias && analise.melhorias.length > 0 && (
            <div className="melhorias-card">
              <h4>💡 Sugestões de Melhorias</h4>
              <ul>
                {analise.melhorias.map((melhoria, index) => (
                  <li key={index}>{melhoria}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AnaliseIA

