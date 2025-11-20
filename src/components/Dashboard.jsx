import React, { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { exportarPlanilhaInspecoes } from '../utils/exportarExcel'
import './Dashboard.css'

function Dashboard({ veiculos }) {
  const calcularDiasRestantes = (dataVencimento) => {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const vencimento = new Date(dataVencimento)
    vencimento.setHours(0, 0, 0, 0)
    return Math.ceil((vencimento - hoje) / (1000 * 60 * 60 * 24))
  }

  const estatisticas = useMemo(() => {
    if (veiculos.length === 0) {
      return {
        total: 0,
        verificados: 0,
        naoVerificados: 0,
        vencidos: 0,
        emAtencao: 0,
        ok: 0,
        porUnidade: {},
        porStatus: [],
        porPrazo: []
      }
    }

    const stats = {
      total: veiculos.length,
      verificados: 0,
      naoVerificados: 0,
      vencidos: 0,
      emAtencao: 0,
      ok: 0,
      porUnidade: {},
      porStatus: [],
      porPrazo: []
    }

    veiculos.forEach(veiculo => {
      // Status
      if (veiculo.status === 'Verificado') {
        stats.verificados++
      } else {
        stats.naoVerificados++
      }

      // Prazo
      const diasRestantes = calcularDiasRestantes(veiculo.dataVencimento)
      if (diasRestantes < 0) {
        stats.vencidos++
      } else if (diasRestantes <= 5) {
        stats.emAtencao++
      } else {
        stats.ok++
      }

      // Por unidade
      if (!stats.porUnidade[veiculo.unidade]) {
        stats.porUnidade[veiculo.unidade] = { verificados: 0, naoVerificados: 0 }
      }
      if (veiculo.status === 'Verificado') {
        stats.porUnidade[veiculo.unidade].verificados++
      } else {
        stats.porUnidade[veiculo.unidade].naoVerificados++
      }
    })

    // Dados para gráficos
    stats.porStatus = [
      { name: 'Verificado', value: stats.verificados, cor: '#4caf50' },
      { name: 'Não Verificado', value: stats.naoVerificados, cor: '#f44336' }
    ]

    stats.porPrazo = [
      { name: 'Vencidos', value: stats.vencidos, cor: '#f44336' },
      { name: 'Em Atenção (≤5 dias)', value: stats.emAtencao, cor: '#ff9800' },
      { name: 'OK', value: stats.ok, cor: '#4caf50' }
    ]

    return stats
  }, [veiculos])

  const dadosUnidade = useMemo(() => {
    return Object.entries(estatisticas.porUnidade).map(([unidade, dados]) => ({
      unidade,
      verificados: dados.verificados,
      naoVerificados: dados.naoVerificados
    }))
  }, [estatisticas.porUnidade])


  const COLORS = ['#4caf50', '#f44336', '#ff9800', '#2196F3']

  if (veiculos.length === 0) {
    return (
      <div className="dashboard-container">
        <h2>Dashboard de Riscos e Análises</h2>
        <p className="vazio">Não há dados para exibir. Cadastre veículos para ver as estatísticas.</p>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard de Riscos e Análises</h2>
        <button onClick={async () => await exportarPlanilhaInspecoes(veiculos)} className="btn-exportar">
          📊 Exportar Planilha
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{estatisticas.total}</div>
          <div className="stat-label">Total de Veículos</div>
        </div>
        <div className="stat-card verde">
          <div className="stat-value">{estatisticas.verificados}</div>
          <div className="stat-label">Verificados</div>
        </div>
        <div className="stat-card vermelho">
          <div className="stat-value">{estatisticas.naoVerificados}</div>
          <div className="stat-label">Não Verificados</div>
        </div>
        <div className="stat-card vermelho">
          <div className="stat-value">{estatisticas.vencidos}</div>
          <div className="stat-label">Vencidos</div>
        </div>
        <div className="stat-card laranja">
          <div className="stat-value">{estatisticas.emAtencao}</div>
          <div className="stat-label">Em Atenção (≤5 dias)</div>
        </div>
        <div className="stat-card verde">
          <div className="stat-value">{estatisticas.ok}</div>
          <div className="stat-label">OK</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Status de Verificação</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={estatisticas.porStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {estatisticas.porStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.cor} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Situação por Prazo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={estatisticas.porPrazo}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {estatisticas.porPrazo.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.cor} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {dadosUnidade.length > 0 && (
        <div className="chart-card">
          <h3>Status por Unidade</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosUnidade}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="unidade" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="verificados" fill="#4caf50" name="Verificados" />
              <Bar dataKey="naoVerificados" fill="#f44336" name="Não Verificados" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="riscos-section">
        <h3>Análise de Riscos e Falhas</h3>
        <div className="riscos-grid">
          <div className="risco-card critico">
            <h4>Crítico</h4>
            <div className="risco-value">{estatisticas.vencidos}</div>
            <p>Veículos com inspeção vencida</p>
            <p className="risco-acao">Ação: Renovar imediatamente</p>
          </div>
          <div className="risco-card alto">
            <h4>Alto</h4>
            <div className="risco-value">{estatisticas.emAtencao}</div>
            <p>Veículos com prazo ≤ 5 dias</p>
            <p className="risco-acao">Ação: Planejar renovação</p>
          </div>
          <div className="risco-card medio">
            <h4>Médio</h4>
            <div className="risco-value">{estatisticas.naoVerificados}</div>
            <p>Veículos não verificados</p>
            <p className="risco-acao">Ação: Realizar verificação</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

