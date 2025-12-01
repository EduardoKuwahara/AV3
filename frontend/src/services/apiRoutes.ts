import * as api from './api';

export const AuthRoutes = {
  /**
   * POST /api/auth/login
   * Autentica um usuário e retorna token JWT
   * Frontend: api.login(usuario, senha)
   */
  login: api.login,

  /**
   * POST /api/auth/logout
   * Encerra sessão do usuário
   * Frontend: api.logout()
   */
  logout: api.logout,

  /**
   * GET /api/auth/me
   * Retorna informações do usuário logado
   * Frontend: api.getCurrentUser()
   */
  getCurrentUser: api.getCurrentUser,
};

export const AeronaveRoutes = {
  /**
   * GET /api/aeronaves
   * Lista todas as aeronaves
   * Frontend: api.getAeronaves()
   */
  getAll: api.getAeronaves,

  /**
   * GET /api/aeronaves/:codigo
   * Busca aeronave específica por código
   * Frontend: api.getAeronave(codigo)
   */
  getByCode: api.getAeronave,

  /**
   * POST /api/aeronaves
   * Cria nova aeronave
   * Frontend: api.createAeronave(data)
   */
  create: api.createAeronave,

  /**
   * PUT /api/aeronaves/:codigo
   * Atualiza aeronave existente
   * Frontend: api.updateAeronave(codigo, data)
   */
  update: api.updateAeronave,

  /**
   * DELETE /api/aeronaves/:codigo
   * Remove aeronave
   * Frontend: api.deleteAeronave(codigo)
   */
  delete: api.deleteAeronave,

  /**
   * POST /api/aeronaves/:codigo/pecas
   * Associa peça à aeronave
   * Frontend: api.associatePecaToAeronave(codigoAeronave, nomePeca)
   */
  associatePeca: api.associatePecaToAeronave,

  /**
   * POST /api/aeronaves/:codigo/etapas
   * Associa etapa à aeronave
   * Frontend: api.associateEtapaToAeronave(codigoAeronave, nomeEtapa)
   */
  associateEtapa: api.associateEtapaToAeronave,

  /**
   * POST /api/aeronaves/:codigo/testes
   * Associa teste à aeronave
   * Frontend: api.associateTesteToAeronave(codigoAeronave, tipoTeste, resultado)
   */
  associateTeste: api.associateTesteToAeronave,

  /**
   * POST /api/aeronaves/:codigo/relatorio
   * Gera relatório específico da aeronave
   * Frontend: api.gerarRelatorio(codigo, cliente, dataEntrega)
   */
  generateReport: api.gerarRelatorio,
};

export const PecaRoutes = {
  /**
   * GET /api/pecas
   * Lista todas as peças
   * Frontend: api.getPecas()
   */
  getAll: api.getPecas,

  /**
   * POST /api/pecas
   * Cria nova peça
   * Frontend: api.createPeca(data)
   */
  create: api.createPeca,

  /**
   * PUT /api/pecas/:nome
   * Atualiza peça existente
   * Frontend: api.updatePeca(nome, data)
   */
  update: api.updatePeca,

  /**
   * DELETE /api/pecas/:nome
   * Remove peça
   * Frontend: api.deletePeca(nome)
   */
  delete: api.deletePeca,
};

export const EtapaRoutes = {
  /**
   * GET /api/etapas
   * Lista todas as etapas
   * Frontend: api.getEtapas()
   */
  getAll: api.getEtapas,

  /**
   * POST /api/etapas
   * Cria nova etapa
   * Frontend: api.createEtapa(data)
   */
  create: api.createEtapa,

  /**
   * PUT /api/etapas/:nome
   * Atualiza etapa existente
   * Frontend: api.updateEtapa(nome, data)
   */
  update: api.updateEtapa,

  /**
   * DELETE /api/etapas/:nome
   * Remove etapa
   * Frontend: api.deleteEtapa(nome)
   */
  delete: api.deleteEtapa,

  /**
   * POST /api/etapas/:nome/funcionarios
   * Associa funcionário à etapa
   * Frontend: api.associateFuncionarioToEtapa(nomeEtapa, idFuncionario)
   */
  associateFuncionario: api.associateFuncionarioToEtapa,
};

export const FuncionarioRoutes = {
  /**
   * GET /api/funcionarios
   * Lista todos os funcionários
   * Frontend: api.getFuncionarios()
   */
  getAll: api.getFuncionarios,

  /**
   * POST /api/funcionarios
   * Cria novo funcionário
   * Frontend: api.createFuncionario(data)
   */
  create: api.createFuncionario,

  /**
   * PUT /api/funcionarios/:id
   * Atualiza funcionário existente
   * Frontend: api.updateFuncionario(id, data)
   */
  update: api.updateFuncionario,

  /**
   * DELETE /api/funcionarios/:id
   * Remove funcionário
   * Frontend: api.deleteFuncionario(id)
   */
  delete: api.deleteFuncionario,
};

export const TesteRoutes = {
  /**
   * GET /api/testes
   * Lista todos os testes
   * Frontend: api.getTestes()
   */
  getAll: api.getTestes,

  /**
   * POST /api/testes
   * Cria novo teste
   * Frontend: api.createTeste(data)
   */
  create: api.createTeste,

  /**
   * PUT /api/testes/:index
   * Atualiza teste existente
   * Frontend: api.updateTeste(index, data)
   */
  update: api.updateTeste,

  /**
   * DELETE /api/testes/:index
   * Remove teste
   * Frontend: api.deleteTeste(index)
   */
  delete: api.deleteTeste,
};

export const RelatorioRoutes = {
  /**
   * GET /api/relatorios
   * Lista todos os relatórios
   * Frontend: api.getRelatorios()
   */
  getAll: api.getRelatorios,

  /**
   * POST /api/relatorios
   * Salva novo relatório
   * Frontend: api.saveRelatorio(relatorio)
   */
  save: api.saveRelatorio,

  /**
   * DELETE /api/relatorios/:id
   * Remove relatório existente
   * Frontend: api.deleteRelatorio(id)
   */
  delete: api.deleteRelatorio,

  /**
   * Gerador genérico de relatórios
   * Frontend: api.gerarRelatorio(codigo, cliente, dataEntrega)
   */
  generate: api.gerarRelatorio,
};

export const AssociacaoRoutes = {
  /**
   * Métodos de listagem de associações
   */
  getAeronavePecas: api.getAeronavePecas,
  getAeronaveEtapas: api.getAeronaveEtapas,
  getEtapaFuncionarios: api.getEtapaFuncionarios,
  getPecaAeronaves: api.getPecaAeronaves,

  /**
   * Métodos de associação
   */
  associatePecaToAeronave: api.associatePecaToAeronave,
  associateEtapaToAeronave: api.associateEtapaToAeronave,
  associateTesteToAeronave: api.associateTesteToAeronave,
  associateFuncionarioToEtapa: api.associateFuncionarioToEtapa,

  /**
   * Métodos de desassociação
   */
  disassociatePecaFromAeronave: api.disassociatePecaFromAeronave,
  disassociateEtapaFromAeronave: api.disassociateEtapaFromAeronave,
  disassociateFuncionarioFromEtapa: api.disassociateFuncionarioFromEtapa,
};

// ========================================================================
// STATUS DAS ROTAS (ATUALIZADO EM 30/11/2025)
// ========================================================================

export const API_STATUS = {
  // ✅ TOTALMENTE IMPLEMENTADAS E FUNCIONAIS
  FULLY_IMPLEMENTED: {
    Auth: ['login', 'logout', 'getCurrentUser'],
    Aeronaves: ['getAll', 'getByCode', 'create', 'update', 'delete', 'associatePeca', 'associateEtapa', 'associateTeste', 'generateReport'],
    Pecas: ['getAll', 'create', 'update', 'delete'],
    Etapas: ['getAll', 'create', 'update', 'delete', 'associateFuncionario'],
    Funcionarios: ['getAll', 'create', 'update', 'delete'],
    Testes: ['getAll', 'create', 'update', 'delete'],
    Relatorios: ['getAll', 'save', 'delete', 'generate'] // ✅ DELETE ADICIONADO EM 30/11/2025
  },

  // ⚠️ EM DESENVOLVIMENTO OU COM LIMITAÇÕES
  IN_DEVELOPMENT: {
    // Nenhuma rota em desenvolvimento no momento
  },

  // ❌ NÃO IMPLEMENTADAS
  NOT_IMPLEMENTED: {
    // Todas as rotas principais estão implementadas
  },

  // 🔧 CORREÇÕES RECENTES
  RECENT_FIXES: [
    '✅ 30/11/2025: Removidas funções duplicadas no api.ts',
    '✅ 30/11/2025: Corrigidas referências no apiRoutes.ts',
    '✅ 30/11/2025: Implementadas funções de associação completas',
    '✅ 30/11/2025: Adicionadas funções de desassociação',
    '✅ 30/11/2025: Implementadas funções de listagem de associações',
    '✅ 30/11/2025: Organizada estrutura de funções de API'
  ]
};

// ========================================================================
// UTILITÁRIOS
// ========================================================================

export const UtilityRoutes = {
  /**
   * Verifica saúde de um endpoint
   * Frontend: api.checkEndpointHealth(endpoint)
   */
  checkHealth: api.checkEndpointHealth,

  /**
   * Busca informações da API
   * Frontend: api.getApiInfo()
   */
  getApiInfo: api.getApiInfo,
};

// ========================================================================
// EXEMPLOS DE USO
// ========================================================================

export const Examples = {
  async demonstrateFullWorkflow() {
    try {
      // 1. Autenticação
      const loginResult = await AuthRoutes.login('admin', 'admin123');
      console.log('Login:', loginResult);

      // 2. Criar aeronave
      const aeronave = await AeronaveRoutes.create({
        codigo: 'AV999',
        modelo: 'Teste Integration',
        tipo: 'COMERCIAL',
        capacidade: 10,
        alcance: 5000
      });
      console.log('Aeronave criada:', aeronave);

      // 3. Criar peça
      const peca = await PecaRoutes.create({
        nome: 'Motor Teste',
        tipo: 'MOTOR',
        fornecedor: 'Fornecedor Teste'
      });
      console.log('Peça criada:', peca);

      // 4. Associar peça à aeronave
      const aeronaveComPeca = await AeronaveRoutes.associatePeca('AV999', 'Motor Teste');
      console.log('Peça associada:', aeronaveComPeca);

      const relatorio = await AeronaveRoutes.generateReport('AV999', 'Cliente Teste', '2025-12-31');
      console.log('Relatório gerado:', relatorio);

      const relatorioSalvo = await RelatorioRoutes.save({
        aeronaveCodigo: 'AV999',
        cliente: 'Cliente Teste',
        dataEntrega: '2025-12-31',
        arquivo: 'relatorio_teste.txt',
        message: 'Relatório de teste'
      });
      console.log('Relatório salvo:', relatorioSalvo);

      // 7. Listar relatórios
      const relatorios = await RelatorioRoutes.getAll();
      console.log('Relatórios listados:', relatorios.length);

      // 8. Excluir relatório (exemplo - use ID real)
      if (relatorioSalvo.id) {
        const deleteResult = await RelatorioRoutes.delete(relatorioSalvo.id.toString());
        console.log('Relatório excluído:', deleteResult);
      }

      return {
        success: true,
        message: 'Workflow completo executado com sucesso!'
      };
    } catch (error) {
      console.error('Erro no workflow:', error);
      return {
        success: false,
        error: error
      };
    }
  },

  async demonstrateReportManagement() {
    try {
            const allReports = await RelatorioRoutes.getAll();
      console.log(`Total de relatórios: ${allReports.length}`);

      const newReport = await RelatorioRoutes.generate('AV001', 'Cliente Exemplo', '2025-12-31');
      console.log('Novo relatório gerado:', newReport);

      const customReport = await RelatorioRoutes.save({
        aeronaveCodigo: 'AV001',
        cliente: 'Cliente Premium',
        dataEntrega: '2025-12-25',
        arquivo: 'relatorio_premium.txt',
        message: 'Relatório personalizado para cliente premium'
      });
      console.log('Relatório customizado salvo:', customReport);

      if (customReport.id && confirm('Excluir relatório de teste?')) {
        const deleteResult = await RelatorioRoutes.delete(customReport.id.toString());
        console.log('Relatório excluído:', deleteResult);
      }

      return {
        success: true,
        message: 'Gerenciamento de relatórios demonstrado com sucesso!'
      };
    } catch (error) {
      console.error('Erro no gerenciamento de relatórios:', error);
      return {
        success: false,
        error: error
      };
    }
  }
};

// ========================================================================
// EXPORTAÇÃO CONSOLIDADA
// ========================================================================

export const API_INTEGRATION = {
  Auth: AuthRoutes,
  Aeronaves: AeronaveRoutes,
  Pecas: PecaRoutes,
  Etapas: EtapaRoutes,
  Funcionarios: FuncionarioRoutes,
  Testes: TesteRoutes,
  Relatorios: RelatorioRoutes,
  Associations: AssociacaoRoutes,
  Utilities: UtilityRoutes,
  Examples: Examples,
};

export default API_INTEGRATION;