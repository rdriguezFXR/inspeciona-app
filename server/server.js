import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import veiculosRoutes from './routes/veiculos.js'
import openaiRoutes from './routes/openai.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Configuração CORS - permitir requisições do frontend
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requisições sem origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true)
    
    // Lista de origens permitidas
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:5173',
      'http://localhost:80',
      'https://inspeciona.online',
      /^https:\/\/.*\.easypanel\.host$/,
      /^https:\/\/.*\.onrender\.com$/,
      /^https:\/\/.*\.vercel\.app$/
    ].filter(Boolean)
    
    // Verificar se a origem está permitida
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return origin === allowed
      }
      if (allowed instanceof RegExp) {
        return allowed.test(origin)
      }
      return false
    })
    
    if (isAllowed || !origin) {
      callback(null, true)
    } else {
      // Em produção, aceitar todas as origens (ajuste conforme necessário)
      callback(null, true)
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

// Middlewares
app.use(cors(corsOptions))
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

