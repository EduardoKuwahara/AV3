import React from 'react';
import type { Teste } from '../../services/api';

type Props = {
  testes: Teste[];
  onEdit: (index: number, t: Teste) => void;
  onView: (index: number, t: Teste) => void;
  onAssociate: (index: number, t: Teste) => void;
  onDelete: (index: number) => void;
  getResultadoBadge: (resultado: string) => { label: string; class: string };
};

const TesteTable: React.FC<Props> = ({ testes, onEdit, onView, onAssociate, onDelete, getResultadoBadge }) => {
  return (
    <div className="data-table">
      <table>
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Resultado</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {testes.length === 0 ? (
            <tr>
              <td colSpan={3} style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                Nenhum teste cadastrado
              </td>
            </tr>
          ) : (
            testes.map((t, index) => {
              const resultado = getResultadoBadge(t.resultado);
              return (
                <tr key={index}>
                  <td style={{ fontWeight: 500 }}>{t.tipo}</td>
                  <td>
                    <span className={`status-badge ${resultado.class}`}>{resultado.label}</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => onEdit(index, t)} className="action-btn action-btn-edit" title="Editar">
                        <span className="action-btn-icon">✏️</span>
                      </button>
                      <button onClick={() => onView(index, t)} className="action-btn action-btn-edit" title="Visualizar">
                        <span className="action-btn-icon">👁️</span>
                      </button>
                      <button onClick={() => onAssociate(index, t)} className="action-btn action-btn-edit" title="Associar a Aeronave">
                        <span className="action-btn-icon">↔️</span>
                      </button>
                      <button onClick={() => onDelete(index)} className="action-btn action-btn-delete" title="Excluir">
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

export default TesteTable;
