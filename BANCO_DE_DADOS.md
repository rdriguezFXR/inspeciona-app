# 🗄️ Sistema de Banco de Dados - Inspeciona+ Samarco

## Como Funciona

O sistema agora utiliza **IndexedDB**, um banco de dados NoSQL nativo do navegador, para armazenar todos os dados de forma **persistente e segura**.

## 📍 Onde os Dados Estão Salvos

### 1. **IndexedDB (Banco de Dados Principal)**
- **Nome do Banco**: `InspecionaSamarcoDB`
- **Localização**: Armazenado no navegador (Chrome, Edge, Firefox, etc.)
- **Vantagens**:
  - ✅ Mais robusto que localStorage
  - ✅ Suporta grandes volumes de dados
  - ✅ Não é limpo automaticamente
  - ✅ Estruturado como banco de dados real
  - ✅ Transações seguras

### 2. **localStorage (Backup Automático)**
- **Chaves usadas**:
  - `veiculos_inspecao` (principal)
  - `veiculos_inspecao_backup1` (backup 1)
  - `veiculos_inspecao_backup2` (backup 2)
  - `veiculos_metadata` (metadados)
- **Função**: Backup adicional para garantir que os dados nunca sejam perdidos

### 3. **sessionStorage (Backup Temporário)**
- Backup adicional durante a sessão do navegador

## 🔄 Como Funciona o Salvamento

1. **Ao cadastrar um veículo**:
   - Salva imediatamente no IndexedDB
   - Salva também no localStorage (3 backups)
   - Salva no sessionStorage

2. **Ao editar um veículo**:
   - Atualiza no IndexedDB
   - Atualiza no localStorage

3. **Ao deletar um veículo**:
   - Remove do IndexedDB
   - Remove do localStorage

4. **Salvamento automático**:
   - A cada 30 segundos (se houver mudanças)
   - Sempre que há alterações nos dados

## 🔍 Como Verificar Onde os Dados Estão

1. **Botão ℹ️ na aba "Lista"**:
   - Clique no botão de informação
   - Mostra onde os dados estão salvos
   - Quantidade de veículos em cada local

2. **Console do Navegador (F12)**:
   - Abra o console (F12)
   - Veja logs detalhados de todas as operações
   - Informações sobre IndexedDB e localStorage

## ⚠️ Importante: Segurança dos Dados

### ✅ O que NÃO apaga os dados:
- Fechar o navegador
- Reiniciar o computador
- Atualizar a página (F5)
- Limpar cache (se IndexedDB não for limpo)

### ⚠️ O que PODE apagar os dados:
- **Limpar dados do navegador** (escolha "Limpar tudo" ou "Limpar dados de sites")
- **Modo anônimo/privado** (dados não persistem)
- **Desinstalar o navegador**
- **Formatação do computador**

## 💾 Recomendações para Proteger seus Dados

1. **Faça backup regularmente**:
   - Use o botão "📊 Baixar Excel" na aba "Lista" ou "Dashboard"
   - Baixe a planilha periodicamente
   - Guarde em local seguro (OneDrive, Google Drive, etc.)

2. **Não limpe os dados do navegador**:
   - Evite usar a opção "Limpar dados de sites"
   - Se precisar limpar, faça backup antes

3. **Use sempre o mesmo navegador**:
   - Os dados ficam no navegador específico
   - Se trocar de navegador, faça backup e importe

4. **Verifique periodicamente**:
   - Use o botão ℹ️ para verificar se os dados estão salvos
   - Use o botão 🔄 para recarregar os dados

## 🔧 Migração Automática

O sistema **automaticamente migra** dados antigos do localStorage para o IndexedDB quando:
- Você abre o app pela primeira vez após a atualização
- O IndexedDB está vazio mas há dados no localStorage

## 📊 Estatísticas do Banco

Para ver estatísticas detalhadas:
1. Clique no botão ℹ️ na aba "Lista"
2. Veja informações sobre:
   - Quantidade de veículos no IndexedDB
   - Quantidade de veículos no localStorage
   - Status de cada backup

## 🆘 Em Caso de Problemas

1. **Dados não aparecem**:
   - Clique no botão 🔄 na navegação
   - Verifique o console (F12) para erros
   - Use o botão ℹ️ para verificar onde os dados estão

2. **Dados foram perdidos**:
   - Verifique se há backup no localStorage
   - O sistema tenta recuperar automaticamente
   - Se não funcionar, restaure do Excel (se tiver backup)

3. **Erro ao salvar**:
   - Verifique o espaço do navegador
   - Limpe cache de outros sites (não do Inspeciona+)
   - Reinicie o navegador

## 📝 Notas Técnicas

- **IndexedDB** é suportado por todos os navegadores modernos
- Os dados ficam no **seu computador**, não em servidor
- O banco de dados é **local e privado**
- Não há limite prático de armazenamento (diferente do localStorage que tem ~5-10MB)

---

**Última atualização**: Sistema implementado com IndexedDB + múltiplos backups
**Versão**: 2.0 (Banco de Dados)

