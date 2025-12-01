import React from 'react';
import type { Etapa } from '../../services/api';

type Props = {
  etapas: Etapa[];
  onEdit: (etapa: Etapa) => void;
  onView: (etapa: Etapa) => void;
  onAssociate: (etapa: Etapa) => void;
  onDelete: (etapa: Etapa) => void;
  getStatusBadge: (status: string) => { label: string; class: string };
};

const EtapaTable: React.FC<Props> = ({ etapas, onEdit, onView, onAssociate, onDelete, getStatusBadge }) => {
  return (
    <div className="data-table">
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Prazo</th>
            <th>Status</th>
            <th>Funcionários</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {etapas.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                Nenhuma etapa cadastrada
              </td>
            </tr>
          ) : (
            etapas.map((e) => {
              const status = getStatusBadge(e.status);
              return (
                <tr key={e.nome}>
                  <td style={{ fontWeight: 500 }}>{e.nome}</td>
                  <td>{e.prazo}</td>
                  <td>
                    <span className={`status-badge ${status.class}`}>{status.label}</span>
                  </td>
                  <td>{e.funcionarios.length}</td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => onEdit(e)} className="action-btn action-btn-edit" title="Editar">
                        <span className="action-btn-icon">✏️</span>
                      </button>
                      <button onClick={() => onView(e)} className="action-btn action-btn-edit" title="Visualizar">
                        <span className="action-btn-icon">👁️</span>
                      </button>
                      <button onClick={() => onAssociate(e)} className="action-btn action-btn-edit" title="Associar a Funcionário">
                        <span className="action-btn-icon">↔️</span>
                      </button>
                      <button onClick={() => onDelete(e)} className="action-btn action-btn-delete" title="Excluir">
                        <span className="action-btn-icon">🗑️</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EtapaTable;
