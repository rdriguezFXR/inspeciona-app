import express from 'express'
import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

// Inicializar OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// POST - Analisar inspeção com IA
router.post('/analisar', async (req, res) => {
  try {
    const { veiculo, observacoes, naoConformidades } = req.body

    if (!veiculo) {
      return res.status(400).json({ erro: 'Dados do veículo são obrigatórios' })
    }

    // Construir prompt para análise
    const prompt = `
Analise a inspeção do veículo abaixo e forneça:
1. Nível de risco (Crítico, Alto, Médio, Baixo)
2. Principais falhas identificadas
3. Sugestões de melhorias prioritárias

Dados do Veículo:
- Placa: ${veiculo.placa}
- Tipo: ${veiculo.tipoVeiculo}
- Status: ${veiculo.status}
- Prazo restante: ${veiculo.prazoDias} dias
${observacoes && observacoes.length > 0 ? `- Observações: ${observacoes.map(o => o.texto).join(', ')}` : ''}
${naoConformidades ? `- Não Conformidades: ${naoConformidades}` : ''}

Responda em formato JSON:
{
  "risco": "Crítico|Alto|Médio|Baixo",
  "falhas": ["falha1", "falha2"],
  "melhorias": ["melhoria1", "melhoria2"]
}
`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em segurança veicular e inspeções. Analise os dados e forneça respostas objetivas em JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    })

    const resposta = completion.choices[0].message.content
    
    // Tentar parsear JSON da resposta
    let analise
    try {
      // Extrair JSON da resposta (pode ter texto antes/depois)
      const jsonMatch = resposta.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analise = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('JSON não encontrado na resposta')
      }
    } catch (parseError) {
      // Se não conseguir parsear, criar resposta estruturada
      analise = {
        risco: "Médio",
        falhas: ["Não foi possível analisar automaticamente"],
        melhorias: [resposta]
      }
    }

    res.json(analise)
  } catch (error) {
    console.error('Erro ao analisar com OpenAI:', error)
    
    if (error.response) {
      res.status(error.response.status).json({ 
        erro: 'Erro na API OpenAI', 
        detalhes: error.response.data 
      })
    } else {
      res.status(500).json({ 
        erro: 'Erro ao processar análise com IA',
        detalhes: error.message 
      })
    }
  }
})

// POST - Gerar relatório com IA
router.post('/relatorio', async (req, res) => {
  try {
    const { veiculos } = req.body

    if (!veiculos || !Array.isArray(veiculos)) {
      return res.status(400).json({ erro: 'Lista de veículos é obrigatória' })
    }

    const total = veiculos.length
    const verificados = veiculos.filter(v => v.status === 'Verificado').length
    const naoVerificados = total - verificados

    const prompt = `
Gere um relatório executivo sobre as inspeções de veículos com base nos dados abaixo:

Total de veículos: ${total}
Verificados: ${verificados}
Não verificados: ${naoVerificados}

Forneça:
1. Resumo executivo (2-3 parágrafos)
2. Principais riscos identificados
3. Recomendações prioritárias
4. Próximos passos sugeridos

Formato: Texto estruturado e profissional.
`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Você é um consultor especializado em gestão de frotas e segurança veicular. Gere relatórios profissionais e objetivos."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })

    const relatorio = completion.choices[0].message.content

    res.json({ relatorio })
  } catch (error) {
    console.error('Erro ao gerar relatório com OpenAI:', error)
    res.status(500).json({ 
      erro: 'Erro ao gerar relatório com IA',
      detalhes: error.message 
    })
  }
})

// POST - Sugerir melhorias com IA
router.post('/sugestoes', async (req, res) => {
  try {
    const { contexto, tipo } = req.body

    const prompt = `
Com base no contexto abaixo, sugira melhorias práticas e acionáveis:

Contexto: ${contexto || 'Sistema de inspeção de veículos'}
Tipo de sugestão: ${tipo || 'Geral'}

Forneça 5 sugestões práticas e priorizadas.
`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em melhoria contínua e gestão de processos. Forneça sugestões práticas e acionáveis."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 500
    })

    const sugestoes = completion.choices[0].message.content

    res.json({ sugestoes })
  } catch (error) {
    console.error('Erro ao gerar sugestões com OpenAI:', error)
    res.status(500).json({ 
      erro: 'Erro ao gerar sugestões com IA',
      detalhes: error.message 
    })
  }
})

export default router

