const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api';

export interface User {
  id: string;
  nome: string;
  nivelPermissao: string;
}

export interface Peca {
  nome: string;
  tipo: string;
  fornecedor: string;
  status: string;
}

export interface Funcionario {
  id: string;
  nome: string;
  telefone: string;
  endereco: string;
  usuario: string;
  nivelPermissao: string;
}

export interface Etapa {
  nome: string;
  prazo: string;
  status: string;
  funcionarios: Funcionario[];
}

export interface Teste {
  tipo: string;
  resultado: string;
}

export interface Aeronave {
  codigo: string;
  modelo: string;
  tipo: string;
  capacidade: number;
  alcance: number;
  pecas: Peca[];
  etapas: Etapa[];
  testes: Teste[];
}

export interface RegisterResponse {
  id: string;
  nome: string;
  telefone: string;
  endereco: string;
  usuario: string;
  nivelPermissao: string;
  message: string;
}

export interface LoginResponse {
  token: string;
  usuario: User;
}

export interface RelatorioResponse {
  id: number;
  cliente: string;
  dataEntrega: string;
  arquivo: string;
  conteudo: string;
  aeronave: string;
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || 'Erro ao processar requisição');
  }
  return response.json();
}

export async function login(usuario: string, senha: string): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, senha }),
  });
  return handleResponse<LoginResponse>(response);
}

export async function register(data: { 
  nome: string; 
  telefone: string; 
  endereco: string; 
  usuario: string; 
  senha: string; 
}): Promise<RegisterResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse<RegisterResponse>(response);
}

export async function logout(): Promise<void> {
  await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
}

export async function getCurrentUser(): Promise<User> {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<User>(response);
}

export async function getAeronaves(): Promise<Aeronave[]> {
  const response = await fetch(`${API_URL}/aeronaves`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<Aeronave[]>(response);
}

export async function getAeronave(codigo: string): Promise<Aeronave> {
  const response = await fetch(`${API_URL}/aeronaves/${codigo}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<Aeronave>(response);
}

export async function createAeronave(data: any): Promise<Aeronave> {
  const response = await fetch(`${API_URL}/aeronaves`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Aeronave>(response);
}

export async function updateAeronave(codigo: string, data: any): Promise<Aeronave> {
  const response = await fetch(`${API_URL}/aeronaves/${codigo}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Aeronave>(response);
}




export async function getPecas(): Promise<Peca[]> {
  const response = await fetch(`${API_URL}/pecas`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<Peca[]>(response);
}

export async function createPeca(data: any): Promise<Peca> {
  const response = await fetch(`${API_URL}/pecas`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Peca>(response);
}

export async function updatePeca(nome: string, data: any): Promise<Peca> {
  const response = await fetch(`${API_URL}/pecas/${nome}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Peca>(response);
}

export async function getEtapas(): Promise<Etapa[]> {
  const response = await fetch(`${API_URL}/etapas`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<Etapa[]>(response);
}

export async function createEtapa(data: any): Promise<Etapa> {
  const response = await fetch(`${API_URL}/etapas`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Etapa>(response);
}

export async function updateEtapa(nome: string, data: any): Promise<Etapa> {
  const response = await fetch(`${API_URL}/etapas/${nome}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Etapa>(response);
}




export async function getFuncionarios(): Promise<Funcionario[]> {
  const response = await fetch(`${API_URL}/funcionarios`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<Funcionario[]>(response);
}

export async function createFuncionario(data: any): Promise<Funcionario> {
  const response = await fetch(`${API_URL}/funcionarios`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Funcionario>(response);
}

export async function updateFuncionario(id: string, data: any): Promise<Funcionario> {
  const response = await fetch(`${API_URL}/funcionarios/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Funcionario>(response);
}

export async function getTestes(): Promise<Teste[]> {
  const response = await fetch(`${API_URL}/testes`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<Teste[]>(response);
}

export async function createTeste(data: any): Promise<Teste> {
  const response = await fetch(`${API_URL}/testes`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Teste>(response);
}

export async function updateTeste(index: number, data: any): Promise<Teste> {
  const response = await fetch(`${API_URL}/testes/${index}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Teste>(response);
}


export async function deleteAeronave(codigo: string): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/aeronaves/${codigo}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse<{ message: string }>(response);
}

export async function deleteEtapa(nome: string): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/etapas/${nome}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse<{ message: string }>(response);
}

export async function deletePeca(nome: string): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/pecas/${nome}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse<{ message: string }>(response);
}

export async function deleteFuncionario(id: string): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/funcionarios/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse<{ message: string }>(response);
}

export async function deleteTeste(index: number): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/testes/${index}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse<{ message: string }>(response);
}


export interface Relatorio {
  id?: number;
  aeronaveId?: string;
  aeronaveCodigo: string;
  aeronaveModelo?: string;
  tipo?: string;
  capacidade?: number;
  alcance?: number;
  cliente: string;
  dataEntrega: string;
  dataGeracao?: string;
  arquivo?: string;
  message?: string;
  pecas?: Peca[];
  etapas?: Etapa[];
  testes?: Teste[];
}

export async function getRelatorios(): Promise<Relatorio[]> {
  const response = await fetch(`${API_URL}/relatorios`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<Relatorio[]>(response);
}

export async function saveRelatorio(relatorio: Relatorio): Promise<Relatorio> {
  const response = await fetch(`${API_URL}/relatorios`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(relatorio),
  });
  return handleResponse<Relatorio>(response);
}

export async function deleteRelatorio(id: string): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/relatorios/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  
  return handleResponse<{ message: string }>(response);
}




// ==================== MÉTODOS DE ASSOCIAÇÃO ====================

// Listar peças de uma aeronave
export async function getAeronavePecas(codigoAeronave: string): Promise<{aeronave: string, pecas: Peca[]}> {
  const response = await fetch(`${API_URL}/aeronaves/${encodeURIComponent(codigoAeronave)}/pecas`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<{aeronave: string, pecas: Peca[]}>(response);
}

// Listar etapas de uma aeronave
export async function getAeronaveEtapas(codigoAeronave: string): Promise<{aeronave: string, etapas: Etapa[]}> {
  const response = await fetch(`${API_URL}/aeronaves/${encodeURIComponent(codigoAeronave)}/etapas`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<{aeronave: string, etapas: Etapa[]}>(response);
}

// Listar funcionários de uma etapa
export async function getEtapaFuncionarios(nomeEtapa: string): Promise<{etapa: string, funcionarios: Funcionario[]}> {
  const response = await fetch(`${API_URL}/etapas/${encodeURIComponent(nomeEtapa)}/funcionarios`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<{etapa: string, funcionarios: Funcionario[]}>(response);
}

// Listar aeronaves que usam uma peça
export async function getPecaAeronaves(nomePeca: string): Promise<{peca: string, aeronaves: Aeronave[]}> {
  const response = await fetch(`${API_URL}/pecas/${encodeURIComponent(nomePeca)}/aeronaves`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<{peca: string, aeronaves: Aeronave[]}>(response);
}

// Associar peça à aeronave
export async function associatePecaToAeronave(codigoAeronave: string, nomePeca: string): Promise<{message: string}> {
  const response = await fetch(`${API_URL}/aeronaves/${encodeURIComponent(codigoAeronave)}/pecas/${encodeURIComponent(nomePeca)}`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  return handleResponse<{message: string}>(response);
}

// Associar etapa à aeronave
export async function associateEtapaToAeronave(codigoAeronave: string, nomeEtapa: string): Promise<{message: string}> {
  const response = await fetch(`${API_URL}/aeronaves/${encodeURIComponent(codigoAeronave)}/etapas/${encodeURIComponent(nomeEtapa)}`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  return handleResponse<{message: string}>(response);
}

// Associar funcionário à etapa
export async function associateFuncionarioToEtapa(nomeEtapa: string, idFuncionario: string): Promise<{message: string}> {
  const response = await fetch(`${API_URL}/etapas/${encodeURIComponent(nomeEtapa)}/funcionarios/${encodeURIComponent(idFuncionario)}`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  return handleResponse<{message: string}>(response);
}

// Associar teste à aeronave
export async function associateTesteToAeronave(codigoAeronave: string, tipoTeste: string, resultado: string): Promise<Aeronave> {
  const response = await fetch(`${API_URL}/aeronaves/${codigoAeronave}/testes`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ tipoTeste, resultado }),
  });
  return handleResponse<Aeronave>(response);
}

// Gerar relatório de aeronave
export async function gerarRelatorio(codigo: string, cliente: string, dataEntrega: string): Promise<RelatorioResponse> {
  const response = await fetch(`${API_URL}/aeronaves/${codigo}/relatorio`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ cliente, dataEntrega }),
  });
  return handleResponse<RelatorioResponse>(response);
}

// Download de relatório
export async function downloadRelatorio(relatorioId: number): Promise<void> {
  const response = await fetch(`${API_URL}/relatorios/${relatorioId}/download`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    throw new Error('Erro ao baixar relatório');
  }
  
  // Obter nome do arquivo do header
  const contentDisposition = response.headers.get('Content-Disposition');
  let filename = `relatorio_${relatorioId}.txt`;
  if (contentDisposition) {
    const matches = contentDisposition.match(/filename="([^"]*)"/) || contentDisposition.match(/filename=([^;]*)/);
    if (matches && matches[1]) {
      filename = matches[1];
    }
  }
  
  // Criar blob e trigger download
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}



// Desassociar peça da aeronave
export async function disassociatePecaFromAeronave(codigoAeronave: string, nomePeca: string): Promise<{message: string}> {
  const response = await fetch(`${API_URL}/aeronaves/${codigoAeronave}/pecas/${encodeURIComponent(nomePeca)}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse<{message: string}>(response);
}

// Desassociar etapa da aeronave
export async function disassociateEtapaFromAeronave(codigoAeronave: string, nomeEtapa: string): Promise<{message: string}> {
  const response = await fetch(`${API_URL}/aeronaves/${codigoAeronave}/etapas/${encodeURIComponent(nomeEtapa)}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse<{message: string}>(response);
}

// Desassociar funcionário da etapa
export async function disassociateFuncionarioFromEtapa(nomeEtapa: string, idFuncionario: string): Promise<{message: string}> {
  const response = await fetch(`${API_URL}/etapas/${encodeURIComponent(nomeEtapa)}/funcionarios/${idFuncionario}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse<{message: string}>(response);
}

// ==================== UTILIDADES E VALIDAÇÕES ====================

// Verificar se uma rota existe antes de chamar
export async function checkEndpointHealth(endpoint: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'OPTIONS',
      headers: getAuthHeaders(),
    });
    return response.ok;
  } catch {
    return false;
  }
}

// Buscar informações de depuração da API
export async function getApiInfo(): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/info`, {
      headers: getAuthHeaders(),
    });
    if (response.ok) {
      return await response.json();
    }
  } catch {
    // Endpoint pode não existir
  }
  return { message: 'API Info não disponível' };
}

