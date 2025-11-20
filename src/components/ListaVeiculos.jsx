import React, { useState, useMemo } from 'react'
import { exportarPlanilhaInspecoes } from '../utils/exportarExcel'
import { storageManager } from '../utils/storageManager'
import { mostrarInfoStorage } from '../utils/debugStorage'
import './ListaVeiculos.css'

function ListaVeiculos({ veiculos, onAtualizar, onDeletar }) {
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [busca, setBusca] = useState('')
  const [veiculoEditando, setVeiculoEditando] = useState(null)
  const [formEdit, setFormEdit] = useState({})

  const veiculosFiltrados = useMemo(() => {
    let filtrados = veiculos

    // Filtro por status
    if (filtroStatus !== 'todos') {
      filtrados = filtrados.filter(v => v.status === filtroStatus)
    }

    // Filtro por busca
    if (busca.trim()) {
      const buscaLower = busca.toLowerCase().trim()
      filtrados = filtrados.filter(v => {
        return (
          (v.placa && v.placa.toLowerCase().includes(buscaLower)) ||
          (v.tipoVeiculo && v.tipoVeiculo.toLowerCase().includes(buscaLower)) ||
          (v.nomeMotorista && v.nomeMotorista.toLowerCase().includes(buscaLower)) ||
          (v.empresa && v.empresa.toLowerCase().includes(buscaLower)) ||
          (v.unidade && v.unidade.toLowerCase().includes(buscaLower)) ||
          (v.modelo && v.modelo.toLowerCase().includes(buscaLower))
        )
      })
    }

    return filtrados
  }, [veiculos, filtroStatus, busca])

  const calcularDiasRestantes = (dataVencimento) => {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const vencimento = new Date(dataVencimento)
    vencimento.setHours(0, 0, 0, 0)
    return Math.ceil((vencimento - hoje) / (1000 * 60 * 60 * 24))
  }

  const toggleStatus = (veiculo) => {
    const novoStatus = veiculo.status === 'Verificado' ? 'Não Verificado' : 'Verificado'
    onAtualizar(veiculo.id, { status: novoStatus })
  }

  const abrirEdicao = (veiculo) => {
    setFormEdit({
      nome: veiculo.nome || '',
      empresa: veiculo.empresa || '',
      data: veiculo.data ? veiculo.data.split('T')[0] : new Date().toISOString().split('T')[0],
      unidade: veiculo.unidade || '',
      departamento: veiculo.departamento || '',
      tipoVeiculo: veiculo.tipoVeiculo || '',
      placa: veiculo.placa || '',
      ano: veiculo.ano || veiculo.anoModelo || '',
      modelo: veiculo.modelo || '',
      nomeMotorista: veiculo.nomeMotorista || '',
      prazoDias: veiculo.prazoDias || '',
      status: veiculo.status || 'Não Verificado'
    })
    setVeiculoEditando(veiculo.id)
  }

  const fecharEdicao = () => {
    setVeiculoEditando(null)
    setFormEdit({})
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setFormEdit(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const salvarEdicao = () => {
    if (!veiculoEditando) return

    // Recalcular data de vencimento e dias restantes
    const dataInspecao = new Date(formEdit.data)
    const prazoDias = parseInt(formEdit.prazoDias)
    const dataVencimento = new Date(dataInspecao)
    dataVencimento.setDate(dataVencimento.getDate() + prazoDias)
    
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const vencimento = new Date(dataVencimento)
    vencimento.setHours(0, 0, 0, 0)
    const diasRestantes = Math.ceil((vencimento - hoje) / (1000 * 60 * 60 * 24))

    const dadosAtualizados = {
      ...formEdit,
      dataVencimento: dataVencimento.toISOString().split('T')[0],
      diasRestantes,
      prazoDias: parseInt(formEdit.prazoDias),
      ano: parseInt(formEdit.ano)
    }

    onAtualizar(veiculoEditando, dadosAtualizados)
    fecharEdicao()
    alert('Veículo atualizado com sucesso!')
  }

  if (veiculos.length === 0) {
    return (
      <div className="lista-container">
        <h2>Veículos Cadastrados</h2>
        <p className="vazio">Nenhum veículo cadastrado ainda.</p>
      </div>
    )
  }

  return (
    <div className="lista-container">
      <div className="lista-header">
        <h2>Veículos Cadastrados</h2>
        <div className="lista-header-buttons">
          <button 
            onClick={async () => {
              const info = await mostrarInfoStorage()
              const mensagem = `
📊 INFORMAÇÕES DO STORAGE

🗄️ INDEXEDDB (Banco de Dados):
• Disponível: ${info.indexedDB.disponivel ? '✓ Sim' : '✗ Não'}
• Veículos: ${info.indexedDB.total}

💾 LOCALSTORAGE (Backup):
• Principal: ${info.status.principal ? '✓' : '✗'}
• Backup 1: ${info.status.backup1 ? '✓' : '✗'}
• Backup 2: ${info.status.backup2 ? '✓' : '✗'}

📦 Quantidade:
• No banco de dados: ${info.total} veículos
• No estado atual: ${veiculos.length} veículos

💾 Chaves usadas:
• IndexedDB: InspecionaSamarcoDB
• localStorage: veiculos_inspecao (principal)
• localStorage: veiculos_inspecao_backup1
• localStorage: veiculos_inspecao_backup2

Verifique o console (F12) para mais detalhes.
              `.trim()
              alert(mensagem)
            }}
            className="btn-info"
            title="Verificar onde os dados estão salvos"
          >
            ℹ️
          </button>
          <button 
            onClick={async () => await exportarPlanilhaInspecoes(veiculos)} 
            className="btn-exportar-excel"
            title="Baixar todos os dados em Excel"
          >
            <span>📊</span> Baixar Excel
          </button>
        </div>
      </div>
      <div className="busca-container-lista">
        <input
          type="text"
          placeholder="🔍 Buscar por placa, motorista, tipo, empresa..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="busca-input-lista"
        />
      </div>

      <div className="filtro-controls">
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="filtro-select"
        >
          <option value="todos">Todos os Status</option>
          <option value="Verificado">Verificado</option>
          <option value="Não Verificado">Não Verificado</option>
        </select>
        <span className="contador">
          {veiculosFiltrados.length} de {veiculos.length} veículos
        </span>
      </div>

      <div className="veiculos-grid">
        {veiculosFiltrados.map(veiculo => {
          const diasRestantes = calcularDiasRestantes(veiculo.dataVencimento)
          const isVencido = diasRestantes < 0
          const isAtencao = diasRestantes <= 5 && diasRestantes >= 0

          return (
            <div key={veiculo.id} className="veiculo-card">
              <div className="veiculo-header">
                <h3>{veiculo.placa}</h3>
                <button
                  className={`status-badge ${veiculo.status === 'Verificado' ? 'verificado' : 'nao-verificado'}`}
                  onClick={() => toggleStatus(veiculo)}
                >
                  {veiculo.status}
                </button>
              </div>

              {veiculoEditando === veiculo.id ? (
                <div className="form-edicao">
                  <div className="form-row-edit">
                    <div className="form-group-edit">
                      <label>Nome *</label>
                      <input
                        type="text"
                        name="nome"
                        value={formEdit.nome}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="form-group-edit">
                      <label>Empresa *</label>
                      <input
                        type="text"
                        name="empresa"
                        value={formEdit.empresa}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row-edit">
                    <div className="form-group-edit">
                      <label>Data *</label>
                      <input
                        type="date"
                        name="data"
                        value={formEdit.data}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="form-group-edit">
                      <label>Unidade *</label>
                      <select
                        name="unidade"
                        value={formEdit.unidade}
                        onChange={handleEditChange}
                        required
                      >
                        <option value="">Selecione...</option>
                        <option value="Ubu">Ubu</option>
                        <option value="Germano">Germano</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group-edit">
                    <label>Departamento *</label>
                    <input
                      type="text"
                      name="departamento"
                      value={formEdit.departamento}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="form-row-edit">
                    <div className="form-group-edit">
                      <label>Tipo Veículo *</label>
                      <input
                        type="text"
                        name="tipoVeiculo"
                        value={formEdit.tipoVeiculo}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="form-group-edit">
                      <label>Placa *</label>
                      <input
                        type="text"
                        name="placa"
                        value={formEdit.placa}
                        onChange={handleEditChange}
                        required
                        maxLength="7"
                        style={{ textTransform: 'uppercase' }}
                      />
                    </div>
                  </div>
                  <div className="form-row-edit">
                    <div className="form-group-edit">
                      <label>Ano *</label>
                      <input
                        type="number"
                        name="ano"
                        value={formEdit.ano}
                        onChange={handleEditChange}
                        required
                        min="1900"
                        max="2100"
                      />
                    </div>
                    <div className="form-group-edit">
                      <label>Modelo *</label>
                      <input
                        type="text"
                        name="modelo"
                        value={formEdit.modelo}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row-edit">
                    <div className="form-group-edit">
                      <label>Motorista *</label>
                      <input
                        type="text"
                        name="nomeMotorista"
                        value={formEdit.nomeMotorista}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="form-group-edit">
                      <label>Prazo (dias) *</label>
                      <input
                        type="number"
                        name="prazoDias"
                        value={formEdit.prazoDias}
                        onChange={handleEditChange}
                        required
                        min="1"
                      />
                    </div>
                  </div>
                  <div className="form-group-edit">
                    <label>Status *</label>
                    <select
                      name="status"
                      value={formEdit.status}
                      onChange={handleEditChange}
                      required
                    >
                      <option value="Não Verificado">Não Verificado</option>
                      <option value="Verificado">Verificado</option>
                    </select>
                  </div>
                  <div className="botoes-edicao">
                    <button onClick={salvarEdicao} className="btn-salvar">
                      Salvar
                    </button>
                    <button onClick={fecharEdicao} className="btn-cancelar">
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="veiculo-info">
                    <div className="info-item">
                      <span className="info-label">Tipo:</span>
                      <span className="info-value">{veiculo.tipoVeiculo}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Motorista:</span>
                      <span className="info-value">{veiculo.nomeMotorista}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Unidade:</span>
                      <span className="info-value">{veiculo.unidade}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Empresa:</span>
                      <span className="info-value">{veiculo.empresa}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Dias Restantes:</span>
                      <span className={`info-value ${isVencido ? 'vencido' : isAtencao ? 'atencao' : 'ok'}`}>
                        {diasRestantes} dias
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Vencimento:</span>
                      <span className="info-value">
                        {new Date(veiculo.dataVencimento).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  <div className="botoes-card">
                    <button
                      className="btn-editar"
                      onClick={() => abrirEdicao(veiculo)}
                    >
                      <span>✏️</span> Editar
                    </button>
                    <button
                      className="btn-deletar"
                      onClick={() => {
                        if (window.confirm('Deseja realmente deletar este veículo?')) {
                          onDeletar(veiculo.id)
                        }
                      }}
                    >
                      <span>🗑️</span> Deletar
                    </button>
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ListaVeiculos

