import React, { useState } from 'react'
import './BuscaPlaca.css'

function BuscaPlaca({ veiculos }) {
  const [placaBusca, setPlacaBusca] = useState('')
  const [resultado, setResultado] = useState(null)

  const buscarPlaca = () => {
    if (!placaBusca.trim()) {
      setResultado(null)
      return
    }

    const placaNormalizada = placaBusca.toUpperCase().trim()
    const veiculoEncontrado = veiculos.find(
      v => v.placa.toUpperCase() === placaNormalizada
    )

    if (veiculoEncontrado) {
      setResultado({
        encontrado: true,
        veiculo: veiculoEncontrado
      })
    } else {
      setResultado({
        encontrado: false,
        placa: placaNormalizada
      })
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      buscarPlaca()
    }
  }

  const calcularDiasRestantes = (dataVencimento) => {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const vencimento = new Date(dataVencimento)
    vencimento.setHours(0, 0, 0, 0)
    return Math.ceil((vencimento - hoje) / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="busca-container">
      <h2>Buscar Veículo por Placa</h2>
      <div className="busca-box">
        <input
          type="text"
          value={placaBusca}
          onChange={(e) => setPlacaBusca(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Digite a placa do veículo"
          maxLength="7"
          style={{ textTransform: 'uppercase' }}
        />
        <button onClick={buscarPlaca} className="btn-buscar">
          Buscar
        </button>
      </div>

      {resultado && (
        <div className={`resultado ${resultado.encontrado ? 'encontrado' : 'nao-encontrado'}`}>
          {resultado.encontrado ? (
            <>
              <div className="status-ok">
                <span className="icon">✓</span>
                <strong>Veículo Encontrado!</strong>
              </div>
              <div className="detalhes-veiculo">
                <div className="detalhe-item">
                  <span className="label">Placa:</span>
                  <span className="value">{resultado.veiculo.placa}</span>
                </div>
                <div className="detalhe-item">
                  <span className="label">Tipo:</span>
                  <span className="value">{resultado.veiculo.tipoVeiculo}</span>
                </div>
                <div className="detalhe-item">
                  <span className="label">Motorista:</span>
                  <span className="value">{resultado.veiculo.nomeMotorista}</span>
                </div>
                <div className="detalhe-item">
                  <span className="label">Status:</span>
                  <span className={`value status ${resultado.veiculo.status === 'Verificado' ? 'verificado' : 'nao-verificado'}`}>
                    {resultado.veiculo.status}
                  </span>
                </div>
                <div className="detalhe-item">
                  <span className="label">Unidade:</span>
                  <span className="value">{resultado.veiculo.unidade}</span>
                </div>
                <div className="detalhe-item">
                  <span className="label">Dias Restantes:</span>
                  <span className={`value ${calcularDiasRestantes(resultado.veiculo.dataVencimento) < 0 ? 'vencido' : calcularDiasRestantes(resultado.veiculo.dataVencimento) <= 5 ? 'atencao' : 'ok'}`}>
                    {calcularDiasRestantes(resultado.veiculo.dataVencimento)} dias
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="status-nao-encontrado">
              <span className="icon">✗</span>
              <strong>Placa não inspecionada</strong>
              <p>Placa: {resultado.placa}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default BuscaPlaca

