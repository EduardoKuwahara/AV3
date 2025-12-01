import React from 'react';
import type { Peca } from '../../services/api';

type Props = {
  pecas: Peca[];
  onEdit?: (p: Peca) => void;
  onAssociate?: (p: Peca) => void;
  onDelete?: (p: Peca) => void;
  onView?: (p: Peca) => void;
  getStatusBadge: (status: string) => { label: string; class: string };
};

const PecaTable: React.FC<Props> = ({ pecas, onEdit, onAssociate, onDelete, onView, getStatusBadge }) => {
  return (
    <div className="data-table">
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Fornecedor</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pecas.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                Nenhuma peça cadastrada
              </td>
            </tr>
          ) : (
            pecas.map((p) => {
              const status = getStatusBadge(p.status);
              return (
                <tr key={p.nome}>
                  <td style={{ fontWeight: 500 }}>{p.nome}</td>
                  <td>{p.tipo}</td>
                  <td>{p.fornecedor}</td>
                  <td>
                    <span className={`status-badge ${status.class}`}>{status.label}</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => onEdit && onEdit(p)}
                        className="action-btn action-btn-edit"
                        title="Editar"
                        aria-label={`Editar ${p.nome}`}
                      >
                        <span className="action-btn-icon">✏️</span>
                      </button>

<button
                        onClick={() => onView && onView(p)}
                        className="action-btn action-btn-edit"
                        title="Visualizar"
                        aria-label={`Visualizar ${p.nome}`}
                      >
                        <span className="action-btn-icon">👁️</span>
                      </button>

                      <button
                        onClick={() => onAssociate && onAssociate(p)}
                        className="action-btn action-btn-edit"
                        title="Associar a Aeronave"
                        aria-label={`Associar ${p.nome}`}
                      >
                        <span className="action-btn-icon">↔️</span>
                      </button>

                      <button
                        onClick={() => onDelete && onDelete(p)}
                        className="action-btn action-btn-delete"
                        title="Excluir"
                        aria-label={`Excluir ${p.nome}`}
                      >
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

export default PecaTable;
