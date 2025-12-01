import React from 'react';
import type { Funcionario } from '../../services/api';

type Props = {
  funcionarios: Funcionario[];
  onEdit: (f: Funcionario) => void;
  onView: (f: Funcionario) => void;
  onAssociate: (f: Funcionario) => void;
  onDelete: (f: Funcionario) => void;
  getPermissaoBadge: (nivel: string) => { label: string; class: string };
};

const FuncionarioTable: React.FC<Props> = ({ funcionarios, onEdit, onView, onAssociate, onDelete, getPermissaoBadge }) => {
  return (
    <div className="data-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Telefone</th>
            <th>Endereço</th>
            <th>Usuário</th>
            <th>Nível de Permissão</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {funcionarios.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                Nenhum funcionário cadastrado
              </td>
            </tr>
          ) : (
            funcionarios.map((f) => {
              const permissao = getPermissaoBadge(f.nivelPermissao);
              return (
                <tr key={f.id}>
                  <td>{f.id}</td>
                  <td style={{ fontWeight: 500 }}>{f.nome}</td>
                  <td>{f.telefone}</td>
                  <td>{f.endereco}</td>
                  <td>{f.usuario}</td>
                  <td>
                    <span className={`status-badge ${permissao.class}`}>{permissao.label}</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => onEdit(f)} className="action-btn action-btn-edit" title="Editar">
                        <span className="action-btn-icon">✏️</span>
                      </button>
                      <button onClick={() => onView(f)} className="action-btn action-btn-edit" title="Visualizar">
                        <span className="action-btn-icon">👁️</span>
                      </button>
                      <button onClick={() => onAssociate(f)} className="action-btn action-btn-edit" title="Associar a Etapa">
                        <span className="action-btn-icon">↔️</span>
                      </button>
                      <button onClick={() => onDelete(f)} className="action-btn action-btn-delete" title="Excluir">
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

export default FuncionarioTable;
