# Inspeciona+ Samarco

Sistema PWA (Progressive Web App) para inspeção de veículos desenvolvido em React.

## Funcionalidades

- ✅ Cadastro de inspeções de veículos com todos os campos solicitados
- ✅ Busca por placa (mostra se foi inspecionado ou não)
- ✅ Cálculo automático de prazo de inspeção
- ✅ Filtro por status (Verificado/Não Verificado)
- ✅ Dashboard com gráficos de riscos, falhas e melhorias
- ✅ Exportação de dados para planilha Excel (.xlsx)
- ✅ PWA configurado para instalação em dispositivos móveis

## Instalação

```bash
npm install
```

## Executar em desenvolvimento

```bash
npm run dev
```

## Build para produção

```bash
npm run build
```

## Estrutura do Projeto

```
├── src/
│   ├── components/
│   │   ├── FormularioInspecao.jsx    # Formulário de cadastro
│   │   ├── ListaVeiculos.jsx         # Lista e filtros
│   │   ├── BuscaPlaca.jsx            # Busca por placa
│   │   └── Dashboard.jsx             # Dashboard e gráficos
│   ├── App.jsx                       # Componente principal
│   └── main.jsx                      # Entry point
├── public/                           # Arquivos estáticos
└── package.json
```

## Campos do Formulário

### Primeira Coluna
- Nome
- Empresa
- Data

### Segunda Coluna
- Unidade (Ubu ou Germano)
- Departamento Contratada Responsável

### Campos Adicionais
- Tipo do Veículo
- Placa
- Ano Modelo
- Nome do Motorista
- Prazo de Inspeção (dias)
- Status (Verificado/Não Verificado)

## Exportação de Dados

O dashboard permite exportar todos os dados para uma planilha Excel contendo:
- Todos os dados cadastrados
- Classificação de riscos (Crítico, Alto, Médio)
- Identificação de falhas
- Sugestões de melhorias
- Resumo estatístico

## Tecnologias

- React 18
- Vite
- Recharts (gráficos)
- XLSX (exportação Excel)
- Vite PWA Plugin

## Como Usar

1. **Cadastrar Inspeção**: Preencha todos os campos do formulário e clique em "Cadastrar Inspeção"
2. **Buscar por Placa**: Digite a placa no campo de busca para verificar se o veículo foi inspecionado
3. **Listar Veículos**: Veja todos os veículos cadastrados e filtre por status
4. **Dashboard**: Visualize gráficos e estatísticas de riscos, falhas e melhorias
5. **Exportar Planilha**: Clique em "Exportar Planilha" no dashboard para gerar arquivo Excel com todos os dados

## Notas

- Os dados são salvos no localStorage do navegador
- O cálculo de prazo é feito automaticamente baseado na data e número de dias informados
- A planilha exportada inclui classificação de riscos e sugestões de melhorias

# inspeciona-app
