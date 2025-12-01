import React, { useEffect, useState } from 'react';
import type { Relatorio, Aeronave } from '../../services/api';
import * as api from '../../services/api';

type Props = {
  relatorio: Relatorio;
  onClose: () => void;
};

const ViewRelatorioModal: React.FC<Props> = ({ relatorio, onClose }) => {
  const [aeronave, setAeronave] = useState<Aeronave | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAeronaveData = async () => {
      try {
        const aeronaveData = await api.getAeronave(relatorio.aeronaveCodigo);
        setAeronave(aeronaveData);
      } catch (error) {
        console.error('Erro ao carregar dados da aeronave:', error);
      } finally {
        setLoading(false);
      }
    };
    loadAeronaveData();
  }, [relatorio.aeronaveCodigo]);

  const generateReportContent = () => {
    if (!aeronave) return 'Carregando dados da aeronave...';
    
    return `
========================================
RELATÓRIO FINAL DE ENTREGA DE AERONAVE
========================================
Data de Geração: ${new Date().toLocaleDateString('pt-BR')}

--- DADOS DO CLIENTE ---
Cliente: ${relatorio.cliente}
Data de Entrega Prevista: ${relatorio.dataEntrega}

--- DADOS DA AERONAVE ---
Código: ${aeronave.codigo}
Modelo: ${aeronave.modelo}
Tipo: ${aeronave.tipo}
Capacidade: ${aeronave.capacidade} passageiros
Alcance: ${aeronave.alcance} km

--- PEÇAS UTILIZADAS ---
${aeronave.pecas.map(p => `- ${p.nome} (Fornecedor: ${p.fornecedor}, Tipo: ${p.tipo})`).join('\n')}

--- ETAPAS DE PRODUÇÃO REALIZADAS ---
${aeronave.etapas.length === 0 ? 'Nenhuma etapa realizada.' : aeronave.etapas.map(e => {
  const funcs = e.funcionarios && e.funcionarios.length > 0
    ? e.funcionarios.map(f => `      - ${f.id}: ${f.nome} (${f.nivelPermissao})`).join('\n')
    : '      (Nenhum funcionário associado)';
  return `- ${e.nome}\n      Prazo: ${e.prazo}\n      Status: ${e.status}\n      Funcionários:\n${funcs}`;
}).join('\n')}

--- RESULTADOS DOS TESTES ---
${aeronave.testes.map(t => `- Teste ${t.tipo}: ${t.resultado}`).join('\n')}

========================================
    `.trim();
  };

  if (loading) {
    return (
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Visualizar Relatório</h2>
            <button className="close" onClick={onClose}>&times;</button>
          </div>
          <div style={{ padding: 20, textAlign: 'center' }}>
            Carregando dados da aeronave...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal">
      <div className="modal-content" style={{ maxWidth: '800px', width: '90vw' }}>
        <div className="modal-header">
          <h2>Visualizar Relatório</h2>
          <button className="close" onClick={onClose}>&times;</button>
        </div>

        <div style={{ padding: '20px 0' }}>
          <div className="details-grid">
            <div className="detail-item">
              <label>Aeronave</label>
              <div className="value">
                {relatorio.aeronaveCodigo} {aeronave?.modelo ? `- ${aeronave.modelo}` : ''}
              </div>
            </div>
            <div className="detail-item">
              <label>Cliente</label>
              <div className="value">{relatorio.cliente}</div>
            </div>
            <div className="detail-item">
              <label>Data de Entrega</label>
              <div className="value">{relatorio.dataEntrega}</div>
            </div>
            <div className="detail-item">
              <label>Arquivo</label>
              <div className="value">{relatorio.arquivo}</div>
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
              Prévia do Relatório:
            </label>
            <div style={{
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              padding: '15px',
              fontFamily: 'monospace',
              fontSize: '12px',
              lineHeight: '1.4',
              whiteSpace: 'pre-wrap',
              maxHeight: '400px',
              overflow: 'auto'
            }}>
              {relatorio.message || generateReportContent()}
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
};

export default ViewRelatorioModal;