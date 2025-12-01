import React from 'react';
import type { Etapa } from '../../services/api';

type Props = {
  etapa: Etapa;
  onClose: () => void;
};

const ViewEtapaModal: React.FC<Props> = ({ etapa, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Visualizar Etapa</h2>
          <button className="close" onClick={onClose}>&times;</button>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <label>Nome</label>
            <div className="value">{etapa.nome}</div>
          </div>
          <div className="detail-item">
            <label>Prazo</label>
            <div className="value">{etapa.prazo}</div>
          </div>
          <div className="detail-item">
            <label>Status</label>
            <div className="value">{etapa.status}</div>
          </div>
          <div className="detail-item">
            <label>Funcionários Associados</label>
            <div className="value">
              {etapa.funcionarios.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {etapa.funcionarios.map((func, index) => (
                    <li key={index}>{func.nome}</li>
                  ))}
                </ul>
              ) : (
                'Nenhum funcionário associado'
              )}
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

export default ViewEtapaModal;