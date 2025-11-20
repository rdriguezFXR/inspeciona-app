import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import veiculosRoutes from './routes/veiculos.js'
import openaiRoutes from './routes/openai.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Logs de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Rotas
app.use('/api/veiculos', veiculosRoutes)
app.use('/api/openai', openaiRoutes)

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: 'SQLite',
    openai: process.env.OPENAI_API_KEY ? 'Configurado' : 'Não configurado'
  })
})

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err)
  res.status(500).json({ erro: 'Erro interno do servidor' })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
  console.log(`📊 API disponível em http://localhost:${PORT}/api`)
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`)
  
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  OPENAI_API_KEY não configurada! Configure no arquivo .env')
  }
})

export default app

