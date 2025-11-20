import express from 'express'
import db from '../database/db.js'

const router = express.Router()

// GET - Listar todos os veículos
router.get('/', async (req, res) => {
  try {
    const veiculos = await db.all('SELECT * FROM veiculos ORDER BY createdAt DESC')
    
    // Converter observacoes de string JSON para array
    const veiculosFormatados = veiculos.map(veiculo => ({
      ...veiculo,
      observacoes: veiculo.observacoes ? JSON.parse(veiculo.observacoes) : []
    }))
    
    res.json(veiculosFormatados)
  } catch (error) {
    console.error('Erro ao buscar veículos:', error)
    res.status(500).json({ erro: 'Erro ao buscar veículos' })
  }
})

// GET - Buscar veículo por ID
router.get('/:id', async (req, res) => {
  try {
    const veiculo = await db.get('SELECT * FROM veiculos WHERE id = ?', [req.params.id])
    
    if (!veiculo) {
      return res.status(404).json({ erro: 'Veículo não encontrado' })
    }
    
    veiculo.observacoes = veiculo.observacoes ? JSON.parse(veiculo.observacoes) : []
    
    res.json(veiculo)
  } catch (error) {
    console.error('Erro ao buscar veículo:', error)
    res.status(500).json({ erro: 'Erro ao buscar veículo' })
  }
})

// GET - Buscar veículo por placa
router.get('/placa/:placa', async (req, res) => {
  try {
    const veiculo = await db.get('SELECT * FROM veiculos WHERE placa = ?', [req.params.placa.toUpperCase()])
    
    if (!veiculo) {
      return res.status(404).json({ erro: 'Placa não inspecionada' })
    }
    
    veiculo.observacoes = veiculo.observacoes ? JSON.parse(veiculo.observacoes) : []
    
    res.json(veiculo)
  } catch (error) {
    console.error('Erro ao buscar veículo por placa:', error)
    res.status(500).json({ erro: 'Erro ao buscar veículo' })
  }
})

// POST - Criar novo veículo
router.post('/', async (req, res) => {
  try {
    const {
      id,
      nome,
      empresa,
      data,
      unidade,
      departamento,
      tipoVeiculo,
      placa,
      ano,
      modelo,
      nomeMotorista,
      status,
      prazoDias,
      dataVencimento,
      observacoes,
      naoConformidades,
      dataCadastro
    } = req.body

    // Validar campos obrigatórios
    if (!nome || !empresa || !placa || !nomeMotorista) {
      return res.status(400).json({ erro: 'Campos obrigatórios faltando' })
    }

    const observacoesJson = JSON.stringify(observacoes || [])

    await db.run(
      `INSERT INTO veiculos (
        id, nome, empresa, data, unidade, departamento, tipoVeiculo,
        placa, ano, modelo, nomeMotorista, status, prazoDias,
        dataVencimento, observacoes, naoConformidades, dataCadastro
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        nome,
        empresa,
        data,
        unidade,
        departamento,
        tipoVeiculo,
        placa.toUpperCase(),
        ano,
        modelo,
        nomeMotorista,
        status || 'Não Verificado',
        prazoDias,
        dataVencimento,
        observacoesJson,
        naoConformidades || null,
        dataCadastro || new Date().toISOString()
      ]
    )

    const novoVeiculo = await db.get('SELECT * FROM veiculos WHERE id = ?', [id])
    novoVeiculo.observacoes = novoVeiculo.observacoes ? JSON.parse(novoVeiculo.observacoes) : []

    res.status(201).json(novoVeiculo)
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ erro: 'Placa já cadastrada' })
    }
    console.error('Erro ao criar veículo:', error)
    res.status(500).json({ erro: 'Erro ao criar veículo' })
  }
})

// PUT - Atualizar veículo
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const dadosAtualizados = req.body

    // Verificar se veículo existe
    const veiculoExistente = await db.get('SELECT * FROM veiculos WHERE id = ?', [id])
    if (!veiculoExistente) {
      return res.status(404).json({ erro: 'Veículo não encontrado' })
    }

    // Preparar campos para atualização
    const campos = []
    const valores = []

    Object.keys(dadosAtualizados).forEach(key => {
      if (key !== 'id' && key !== 'createdAt') {
        campos.push(`${key} = ?`)
        if (key === 'observacoes' && Array.isArray(dadosAtualizados[key])) {
          valores.push(JSON.stringify(dadosAtualizados[key]))
        } else if (key === 'placa') {
          valores.push(dadosAtualizados[key].toUpperCase())
        } else {
          valores.push(dadosAtualizados[key])
        }
      }
    })

    campos.push('updatedAt = ?')
    valores.push(new Date().toISOString())
    valores.push(id)

    const sql = `UPDATE veiculos SET ${campos.join(', ')} WHERE id = ?`
    
    await db.run(sql, valores)

    const veiculoAtualizado = await db.get('SELECT * FROM veiculos WHERE id = ?', [id])
    veiculoAtualizado.observacoes = veiculoAtualizado.observacoes 
      ? JSON.parse(veiculoAtualizado.observacoes) 
      : []

    res.json(veiculoAtualizado)
  } catch (error) {
    console.error('Erro ao atualizar veículo:', error)
    res.status(500).json({ erro: 'Erro ao atualizar veículo' })
  }
})

// DELETE - Deletar veículo
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const veiculo = await db.get('SELECT * FROM veiculos WHERE id = ?', [id])
    if (!veiculo) {
      return res.status(404).json({ erro: 'Veículo não encontrado' })
    }

    await db.run('DELETE FROM veiculos WHERE id = ?', [id])

    res.json({ mensagem: 'Veículo deletado com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar veículo:', error)
    res.status(500).json({ erro: 'Erro ao deletar veículo' })
  }
})

export default router

