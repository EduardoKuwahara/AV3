    import React from 'react';
    import type { Aeronave } from '../../services/api';

type Props = {
  aeronaves: Aeronave[];
  onEditAssociate?: (codigo: string) => void;
  onEdit?: (codigo: string) => void;
  onView?: (codigo: string) => void;
  onDelete?: (codigo: string) => void;
  user?: any;
  getStatusBadge: (a: Aeronave) => { label: string; class: string };
};    const AeronaveTable: React.FC<Props> = ({ aeronaves, onEditAssociate, onEdit, onView, onDelete, user, getStatusBadge }) => {
    return (
        <div className="data-table">
        <table>
            <thead>
            <tr>
                <th>Modelo</th>
                <th>Registro</th>
                <th>Fabricante</th>
                <th>Capacidade</th>
                <th>Alcance</th>
                <th>Status</th>
                <th>Ações</th>
            </tr>
            </thead>
            <tbody>
            {aeronaves.length === 0 ? (
                <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                    Nenhuma aeronave cadastrada
                </td>
                </tr>
            ) : (
                aeronaves.map((a) => {
                const status = getStatusBadge(a);
                return (
                    <tr key={a.codigo}>
                    <td style={{ fontWeight: 500 }}>{a.modelo}</td>
                    <td>{a.codigo}</td>
                    <td>{a.tipo === 'COMERCIAL' ? 'Embraer' : 'Defense Systems'}</td>
                    <td>{a.capacidade}</td>
                    <td>{a.alcance} km</td>
                    <td>
                        <span className={`status-badge ${status.class}`}>{status.label}</span>
                    </td>
                    <td>
                        <div className="action-buttons">
                        <button
                            onClick={() => onEdit && onEdit(a.codigo)}
                            className="action-btn action-btn-edit"
                            title="Editar Aeronave"
                        >
                            <span className="action-btn-icon">✏️</span>
                        </button>

                        <button
                            onClick={() => onView && onView(a.codigo)}
                            className="action-btn action-btn-edit"
                            title="Visualizar Aeronave"
                        >
                            <span className="action-btn-icon">👁️</span>
                        </button>

                        <button
                            onClick={() => onEditAssociate && onEditAssociate(a.codigo)}
                            className="action-btn action-btn-edit"
                            title="Associar"
                        >
                            <span className="action-btn-icon">↔️</span>
                        </button>

                        <button
                          onClick={() => onDelete && onDelete(a.codigo)}
                          className="action-btn action-btn-delete"
                          title="Excluir Aeronave"
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

    export default AeronaveTable;
