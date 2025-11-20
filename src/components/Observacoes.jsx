import React, { useState } from 'react'
import './Observacoes.css'

function Observacoes({ veiculos, onAtualizar }) {
  const [veiculoSelecionado, setVeiculoSelecionado] = useState(null)
  const [novaObservacao, setNovaObservacao] = useState('')
  const [filtroPlaca, setFiltroPlaca] = useState('')

  const veiculosFiltrados = veiculos.filter(v => 
    filtroPlaca === '' || v.placa.toUpperCase().includes(filtroPlaca.toUpperCase())
  )

  const adicionarObservacao = () => {
    if (!veiculoSelecionado || !novaObservacao.trim()) {
      alert('Selecione um veículo e digite uma observação!')
      return
    }

    const observacao = {
      id: Date.now().toString(),
      texto: novaObservacao.trim(),
      data: new Date().toISOString(),
      autor: 'Sistema' // Pode ser expandido para incluir usuário
    }

    const veiculo = veiculos.find(v => v.id === veiculoSelecionado)
    if (!veiculo) return

    const observacoesAtualizadas = [
      ...(veiculo.observacoes || []),
      observacao
    ]

    onAtualizar(veiculoSelecionado, { observacoes: observacoesAtualizadas })
    setNovaObservacao('')
    alert('Observação adicionada com sucesso!')
  }

  const removerObservacao = (veiculoId, observacaoId) => {
    if (!window.confirm('Deseja realmente remover esta observação?')) {
      return
    }

    const veiculo = veiculos.find(v => v.id === veiculoId)
    if (!veiculo) return

    const observacoesAtualizadas = (veiculo.observacoes || []).filter(
      obs => obs.id !== observacaoId
    )

    onAtualizar(veiculoId, { observacoes: observacoesAtualizadas })
  }

  const veiculoAtual = veiculos.find(v => v.id === veiculoSelecionado)

  return (
    <div className="observacoes-container">
      <h2>Observações dos Veículos</h2>

      <div className="observacoes-filtro">
        <input
          type="text"
          placeholder="🔍 Buscar por placa..."
          value={filtroPlaca}
          onChange={(e) => setFiltroPlaca(e.target.value)}
          className="filtro-input"
        />
      </div>

      <div className="observacoes-layout">
        <div className="veiculos-lista">
          <h3>Veículos ({veiculosFiltrados.length})</h3>
          {veiculosFiltrados.length === 0 ? (
            <p className="vazio">Nenhum veículo encontrado</p>
          ) : (
            <div className="lista-veiculos">
              {veiculosFiltrados.map(veiculo => (
                <div
                  key={veiculo.id}
                  className={`veiculo-item ${veiculoSelecionado === veiculo.id ? 'selecionado' : ''}`}
                  onClick={() => setVeiculoSelecionado(veiculo.id)}
                >
                  <div className="veiculo-placa">{veiculo.placa}</div>
                  <div className="veiculo-info">
                    <span>{veiculo.tipoVeiculo}</span>
                    <span className="obs-count">
                      {(veiculo.observacoes || []).length} obs.
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="observacoes-painel">
          {veiculoAtual ? (
            <>
              <div className="veiculo-header-obs">
                <h3>Observações - {veiculoAtual.placa}</h3>
                <div className="veiculo-detalhes">
                  <span>{veiculoAtual.tipoVeiculo} | {veiculoAtual.modelo} {veiculoAtual.ano}</span>
                </div>
              </div>

              <div className="adicionar-obs">
                <textarea
                  value={novaObservacao}
                  onChange={(e) => setNovaObservacao(e.target.value)}
                  placeholder="Digite uma nova observação..."
                  rows="3"
                  className="obs-textarea"
                />
                <button onClick={adicionarObservacao} className="btn-adicionar-obs">
                  ➕ Adicionar Observação
                </button>
              </div>

              <div className="lista-observacoes">
                <h4>Observações ({veiculoAtual.observacoes?.length || 0})</h4>
                {veiculoAtual.observacoes && veiculoAtual.observacoes.length > 0 ? (
                  veiculoAtual.observacoes.map(obs => (
                    <div key={obs.id} className="observacao-item">
                      <div className="obs-texto">{obs.texto}</div>
                      <div className="obs-metadata">
                        <span className="obs-data">
                          {new Date(obs.data).toLocaleString('pt-BR')}
                        </span>
                        <button
                          onClick={() => removerObservacao(veiculoAtual.id, obs.id)}
                          className="btn-remover-obs"
                          title="Remover observação"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="vazio">Nenhuma observação cadastrada</p>
                )}
              </div>
            </>
          ) : (
            <div className="selecione-veiculo">
              <p>👈 Selecione um veículo à esquerda para ver/adicionar observações</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Observacoes

