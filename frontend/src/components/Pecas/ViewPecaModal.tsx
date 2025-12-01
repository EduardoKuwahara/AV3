import React from 'react';
import type { Peca } from '../../services/api';

type Props = {
  peca: Peca;
  onClose: () => void;
};

const ViewPecaModal: React.FC<Props> = ({ peca, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Visualizar Peça</h2>
          <button className="close" onClick={onClose}>&times;</button>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <label>Nome</label>
            <div className="value">{peca.nome}</div>
          </div>
          <div className="detail-item">
            <label>Tipo</label>
            <div className="value">{peca.tipo}</div>
          </div>
          <div className="detail-item">
            <label>Fornecedor</label>
            <div className="value">{peca.fornecedor}</div>
          </div>
          <div className="detail-item">
            <label>Status</label>
            <div className="value">{peca.status}</div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
};

export default ViewPecaModal;
