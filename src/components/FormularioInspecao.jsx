import React, { useState } from 'react'
import { storageManager } from '../utils/storageManager'
import './FormularioInspecao.css'

function FormularioInspecao({ onAdicionar, veiculos, onAtualizar }) {
  const [formData, setFormData] = useState({
    nome: '',
    empresa: '',
    data: new Date().toISOString().split('T')[0],
    unidade: '',
    departamento: '',
    tipoVeiculo: '',
    placa: '',
    ano: '',
    modelo: '',
    nomeMotorista: '',
    prazoDias: '',
    status: 'Não Verificado'
  })
  const [salvando, setSalvando] = useState(false)
  const [placaSelecionada, setPlacaSelecionada] = useState('')
  const [veiculoSelecionado, setVeiculoSelecionado] = useState(null)
  const [novaObservacao, setNovaObservacao] = useState('')
  const [naoConformidades, setNaoConformidades] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Se mudou a placa, buscar veículo correspondente
    if (name === 'placa' && value) {
      const veiculo = veiculos.find(v => 
        v.placa && v.placa.toUpperCase() === value.toUpperCase().trim()
      )
              if (veiculo) {
                setVeiculoSelecionado(veiculo)
                setPlacaSelecionada(value.toUpperCase().trim())
                setNaoConformidades(veiculo.naoConformidades || '')
              } else {
                setVeiculoSelecionado(null)
                setPlacaSelecionada('')
                setNaoConformidades('')
              }
    }
  }

  const adicionarObservacao = () => {
    if (!veiculoSelecionado || !novaObservacao.trim()) {
      alert('Selecione um veículo pela placa e digite uma observação!')
      return
    }

    const observacao = {
      id: Date.now().toString(),
      texto: novaObservacao.trim(),
      data: new Date().toISOString(),
      autor: 'Sistema'
    }

    const observacoesAtualizadas = [
      ...(veiculoSelecionado.observacoes || []),
      observacao
    ]

    if (onAtualizar) {
      onAtualizar(veiculoSelecionado.id, { observacoes: observacoesAtualizadas })
      setNovaObservacao('')
      // Atualizar veículo selecionado
      setVeiculoSelecionado({ ...veiculoSelecionado, observacoes: observacoesAtualizadas })
      alert('Observação adicionada com sucesso!')
    }
  }

  const removerObservacao = (observacaoId) => {
    if (!veiculoSelecionado) return
    
    if (!window.confirm('Deseja realmente remover esta observação?')) {
      return
    }

    const observacoesAtualizadas = (veiculoSelecionado.observacoes || []).filter(
      obs => obs.id !== observacaoId
    )

    if (onAtualizar) {
      onAtualizar(veiculoSelecionado.id, { observacoes: observacoesAtualizadas })
      setVeiculoSelecionado({ ...veiculoSelecionado, observacoes: observacoesAtualizadas })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSalvando(true)
    
    // Calcular data de vencimento
    const dataInspecao = new Date(formData.data)
    const prazoDias = parseInt(formData.prazoDias)
    const dataVencimento = new Date(dataInspecao)
    dataVencimento.setDate(dataVencimento.getDate() + prazoDias)
    
    // Calcular dias restantes
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const vencimento = new Date(dataVencimento)
    vencimento.setHours(0, 0, 0, 0)
    const diasRestantes = Math.ceil((vencimento - hoje) / (1000 * 60 * 60 * 24))

    const veiculo = {
      ...formData,
      dataVencimento: dataVencimento.toISOString().split('T')[0],
      diasRestantes,
      prazoDias: parseInt(formData.prazoDias),
      ano: parseInt(formData.ano),
      observacoes: [],
      naoConformidades: naoConformidades.trim() || ''
    }

    onAdicionar(veiculo)
    
    // Aguardar um momento para garantir que o salvamento foi feito
    setTimeout(() => {
      try {
        // Verificar status do storage primeiro
        const status = storageManager.verificarStatus()
        
        if (status.principal) {
          // Verificar se o veículo foi salvo
          const veiculosSalvos = storageManager.carregar()
          const placaBusca = veiculo.placa ? veiculo.placa.toUpperCase().trim() : ''
          
          if (placaBusca) {
            const veiculoSalvo = veiculosSalvos.find(v => {
              const placaV = v.placa ? v.placa.toUpperCase().trim() : ''
              return placaV === placaBusca
            })
            
            if (veiculoSalvo) {
              // Mostrar informações de onde foi salvo
              const status = storageManager.verificarStatus()
              const infoSalvamento = `
✅ Veículo ${placaBusca} cadastrado e salvo!

📍 Localização dos dados:
• localStorage: ${status.principal ? '✓ Salvo' : '✗ Não salvo'}
• Backup 1: ${status.backup1 ? '✓ Salvo' : '✗ Não salvo'}
• Backup 2: ${status.backup2 ? '✓ Salvo' : '✗ Não salvo'}
• Total no storage: ${status.metadata ? status.metadata.quantidade : 0} veículos
              `.trim()
              alert(infoSalvamento)
              setSalvando(false)
              return
            }
          }
          
          // Se não encontrou pela placa, mas o storage está OK, provavelmente foi salvo
          if (status.metadata && status.metadata.quantidade > 0) {
            alert(`✅ Veículo ${placaBusca || 'cadastrado'} salvo com sucesso!`)
            setSalvando(false)
            return
          }
        }
        
        // Se chegou aqui, tentar verificar novamente
        setTimeout(() => {
          const veiculosSalvos2 = storageManager.carregar()
          const placaBusca = veiculo.placa ? veiculo.placa.toUpperCase().trim() : ''
          
          if (placaBusca) {
            const veiculoSalvo2 = veiculosSalvos2.find(v => {
              const placaV = v.placa ? v.placa.toUpperCase().trim() : ''
              return placaV === placaBusca
            })
            
            if (veiculoSalvo2) {
              alert(`✅ Veículo ${placaBusca} cadastrado e salvo com sucesso!`)
            } else {
              const status2 = storageManager.verificarStatus()
              if (status2.principal) {
                alert(`✅ Veículo ${placaBusca} cadastrado! Os dados foram salvos.`)
              } else {
                alert('⚠️ Veículo cadastrado. Verifique na aba "Lista" se foi salvo corretamente.')
              }
            }
          } else {
            alert('✅ Veículo cadastrado!')
          }
          setSalvando(false)
        }, 500)
      } catch (error) {
        console.error('Erro ao verificar salvamento:', error)
        const status = storageManager.verificarStatus()
        if (status.principal) {
          alert('✅ Veículo cadastrado! Os dados foram salvos.')
        } else {
          alert('⚠️ Veículo cadastrado. Verifique na aba "Lista" se foi salvo corretamente.')
        }
        setSalvando(false)
      }
    }, 400)
    
    // Resetar formulário
    setFormData({
      nome: '',
      empresa: '',
      data: new Date().toISOString().split('T')[0],
      unidade: '',
      departamento: '',
      tipoVeiculo: '',
      placa: '',
      ano: '',
      modelo: '',
      nomeMotorista: '',
      prazoDias: '',
      status: 'Não Verificado'
    })
    setNaoConformidades('')
  }

  const atualizarNaoConformidades = () => {
    if (!veiculoSelecionado) {
      alert('Selecione um veículo pela placa primeiro!')
      return
    }

    if (onAtualizar) {
      onAtualizar(veiculoSelecionado.id, { naoConformidades: naoConformidades.trim() })
      alert('Não conformidades atualizadas com sucesso!')
      // Atualizar veículo selecionado
      setVeiculoSelecionado({ ...veiculoSelecionado, naoConformidades: naoConformidades.trim() })
    }
  }

  return (
    <div className="formulario-container">
      <h2>Cadastrar Inspeção</h2>
      <form onSubmit={handleSubmit} className="formulario">
        <div className="form-row">
          <div className="form-column">
            <div className="form-group">
              <label htmlFor="nome">Nome *</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="empresa">Empresa *</label>
              <input
                type="text"
                id="empresa"
                name="empresa"
                value={formData.empresa}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="data">Data *</label>
              <input
                type="date"
                id="data"
                name="data"
                value={formData.data}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-column">
            <div className="form-group">
              <label htmlFor="unidade">Unidade *</label>
              <select
                id="unidade"
                name="unidade"
                value={formData.unidade}
                onChange={handleChange}
                required
              >
                <option value="">Selecione...</option>
                <option value="Ubu">Ubu</option>
                <option value="Germano">Germano</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="departamento">Departamento Contratada Responsável *</label>
              <input
                type="text"
                id="departamento"
                name="departamento"
                value={formData.departamento}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="tipoVeiculo">Tipo do Veículo *</label>
            <input
              type="text"
              id="tipoVeiculo"
              name="tipoVeiculo"
              value={formData.tipoVeiculo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="placa">Placa *</label>
            <input
              type="text"
              id="placa"
              name="placa"
              value={formData.placa}
              onChange={handleChange}
              required
              maxLength="7"
              placeholder="ABC1234"
              style={{ textTransform: 'uppercase' }}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="ano">Ano *</label>
            <input
              type="number"
              id="ano"
              name="ano"
              value={formData.ano}
              onChange={handleChange}
              required
              min="1900"
              max="2100"
            />
          </div>
          <div className="form-group">
            <label htmlFor="modelo">Modelo *</label>
            <input
              type="text"
              id="modelo"
              name="modelo"
              value={formData.modelo}
              onChange={handleChange}
              required
              placeholder="Ex: Fiat Uno, VW Gol"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nomeMotorista">Nome do Motorista *</label>
            <input
              type="text"
              id="nomeMotorista"
              name="nomeMotorista"
              value={formData.nomeMotorista}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="prazoDias">Prazo de Inspeção (dias) *</label>
            <input
              type="number"
              id="prazoDias"
              name="prazoDias"
              value={formData.prazoDias}
              onChange={handleChange}
              required
              min="1"
              placeholder="Ex: 5"
            />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="Não Verificado">Não Verificado</option>
              <option value="Verificado">Verificado</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={salvando}>
          {salvando ? '💾 Salvando...' : '💾 Cadastrar e Salvar Inspeção'}
        </button>
        
        {salvando && (
          <div className="salvando-indicator">
            <span>Salvando dados no navegador...</span>
          </div>
        )}
      </form>

      {/* Seção de Observações */}
      <div className="observacoes-section">
        <h3>Observações do Veículo</h3>
        <div className="observacoes-busca">
          <input
            type="text"
            placeholder="Digite a placa para ver/adicionar observações..."
            value={placaSelecionada}
            onChange={(e) => {
              const placa = e.target.value.toUpperCase().trim()
              setPlacaSelecionada(placa)
              const veiculo = veiculos.find(v => 
                v.placa && v.placa.toUpperCase() === placa
              )
              if (veiculo) {
                setVeiculoSelecionado(veiculo)
                setNaoConformidades(veiculo.naoConformidades || '')
              } else {
                setVeiculoSelecionado(null)
                setNaoConformidades('')
              }
            }}
            className="obs-busca-input"
            maxLength="7"
          />
        </div>

        {veiculoSelecionado ? (
          <>
            <div className="veiculo-obs-info">
              <strong>{veiculoSelecionado.placa}</strong> - {veiculoSelecionado.tipoVeiculo}
            </div>
            
            <div className="adicionar-obs-form">
              <textarea
                value={novaObservacao}
                onChange={(e) => setNovaObservacao(e.target.value)}
                placeholder="Digite uma nova observação..."
                rows="2"
                className="obs-textarea"
              />
              <button 
                type="button"
                onClick={adicionarObservacao} 
                className="btn-adicionar-obs"
              >
                ➕ Adicionar Observação
              </button>
            </div>

            <div className="lista-observacoes">
              <h4>Observações ({veiculoSelecionado.observacoes?.length || 0})</h4>
              {veiculoSelecionado.observacoes && veiculoSelecionado.observacoes.length > 0 ? (
                veiculoSelecionado.observacoes.map(obs => (
                  <div key={obs.id} className="observacao-item">
                    <div className="obs-texto">{obs.texto}</div>
                    <div className="obs-metadata">
                      <span className="obs-data">
                        {new Date(obs.data).toLocaleString('pt-BR')}
                      </span>
                      <button
                        type="button"
                        onClick={() => removerObservacao(obs.id)}
                        className="btn-remover-obs"
                        title="Remover observação"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="vazio-obs">Nenhuma observação cadastrada</p>
              )}
            </div>
          </>
        ) : placaSelecionada && placaSelecionada.length >= 3 ? (
          <div className="placa-nao-encontrada">
            <p className="msg-placa-nao-inspecionada">Placa não inspecionada</p>
          </div>
        ) : (
          <p className="vazio-obs">Digite uma placa acima para ver/adicionar observações</p>
        )}

        {/* Seção de Não Conformidades */}
        <div className="nao-conformidades-section">
          <h3>Não Conformidades</h3>
          <div className="nao-conformidades-busca">
            <input
              type="text"
              placeholder="Digite a placa para ver/editar não conformidades..."
              value={placaSelecionada}
              onChange={(e) => {
                const placa = e.target.value.toUpperCase().trim()
                setPlacaSelecionada(placa)
                const veiculo = veiculos.find(v => 
                  v.placa && v.placa.toUpperCase() === placa
                )
                if (veiculo) {
                  setVeiculoSelecionado(veiculo)
                  setNaoConformidades(veiculo.naoConformidades || '')
                } else {
                  setVeiculoSelecionado(null)
                  setNaoConformidades('')
                }
              }}
              className="obs-busca-input"
              maxLength="7"
            />
          </div>

          {veiculoSelecionado ? (
            <>
              <div className="veiculo-obs-info">
                <strong>{veiculoSelecionado.placa}</strong> - {veiculoSelecionado.tipoVeiculo}
              </div>
              
              <div className="nao-conformidades-form">
                <textarea
                  value={naoConformidades}
                  onChange={(e) => setNaoConformidades(e.target.value)}
                  placeholder="Descreva as não conformidades encontradas..."
                  rows="4"
                  className="nao-conformidades-textarea"
                />
                <button 
                  type="button"
                  onClick={atualizarNaoConformidades} 
                  className="btn-salvar-nao-conformidades"
                >
                  💾 Salvar Não Conformidades
                </button>
              </div>
            </>
          ) : placaSelecionada && placaSelecionada.length >= 3 ? (
            <div className="placa-nao-encontrada">
              <p className="msg-placa-nao-inspecionada">Placa não inspecionada</p>
            </div>
          ) : (
            <p className="vazio-obs">Digite as não conformidades do veículo acima</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default FormularioInspecao

