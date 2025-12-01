import React from 'react';
import type { Relatorio } from '../../services/api';

type Props = {
  relatorios: Relatorio[];
  onView: (relatorio: Relatorio) => void;
  onEdit: (relatorio: Relatorio) => void;
  onDownload: (relatorio: Relatorio) => void;
  onDelete: (relatorio: Relatorio) => void;
};

const RelatorioTable: React.FC<Props> = ({ relatorios, onView, onEdit, onDownload, onDelete }) => {
  return (
    <div className="data-table">
      <table>
        <thead>
          <tr>
            <th>Aeronave</th>
            <th>Cliente</th>
            <th>Data Entrega</th>
            <th>Arquivo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {relatorios.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                Nenhum relatório gerado
              </td>
            </tr>
          ) : (
            relatorios.map((r, i) => (
              <tr key={`${r.aeronaveCodigo}-${i}`}>
                <td style={{ fontWeight: 500 }}>{r.aeronaveCodigo} {r.aeronaveModelo ? `- ${r.aeronaveModelo}` : ''}</td>
                <td>{r.cliente}</td>
                <td>{r.dataEntrega}</td>
                <td>{r.arquivo}</td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => onEdit(r)} className="action-btn action-btn-edit" title="Editar">
                      <span className="action-btn-icon">✏️</span>
                    </button>
                    <button onClick={() => onView(r)} className="action-btn action-btn-edit" title="Visualizar">
                      <span className="action-btn-icon">👁️</span>
                    </button>
                    <button onClick={() => onDownload(r)} className="action-btn action-btn-edit" title="Baixar">
                      <span className="action-btn-icon">⬇️</span>
                    </button>
                    <button onClick={() => onDelete(r)} className="action-btn action-btn-delete" title="Excluir">
                      <span className="action-btn-icon">🗑️</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RelatorioTable;
