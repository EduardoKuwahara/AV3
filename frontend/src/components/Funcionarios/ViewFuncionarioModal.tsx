import React from 'react';
import type { Funcionario } from '../../services/api';

type Props = {
  funcionario: Funcionario;
  onClose: () => void;
};

const ViewFuncionarioModal: React.FC<Props> = ({ funcionario, onClose }) => {
  const getPermissaoLabel = (nivel: string) => {
    const nivelMap: { [key: string]: string } = {
      'ADMINISTRADOR': 'Administrador',
      'ENGENHEIRO': 'Engenheiro',
      'OPERADOR': 'Operador'
    };
    return nivelMap[nivel] || nivel;
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Visualizar Funcionário</h2>
          <button className="close" onClick={onClose}>&times;</button>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <label>ID</label>
            <div className="value">{funcionario.id}</div>
          </div>
          <div className="detail-item">
            <label>Nome</label>
            <div className="value">{funcionario.nome}</div>
          </div>
          <div className="detail-item">
            <label>Telefone</label>
            <div className="value">{funcionario.telefone}</div>
          </div>
          <div className="detail-item">
            <label>Endereço</label>
            <div className="value">{funcionario.endereco}</div>
          </div>
          <div className="detail-item">
            <label>Usuário</label>
            <div className="value">{funcionario.usuario}</div>
          </div>
          <div className="detail-item">
            <label>Nível de Permissão</label>
            <div className="value">{getPermissaoLabel(funcionario.nivelPermissao)}</div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
};

export default ViewFuncionarioModal;