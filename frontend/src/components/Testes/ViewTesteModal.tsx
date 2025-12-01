import React from 'react';
import type { Teste } from '../../services/api';

type Props = {
  teste: Teste;
  onClose: () => void;
};

const ViewTesteModal: React.FC<Props> = ({ teste, onClose }) => {
  const getResultadoLabel = (resultado: string) => {
    return resultado === 'APROVADO' ? 'Aprovado' : 'Reprovado';
  };

  const getTipoLabel = (tipo: string) => {
    const tipoMap: { [key: string]: string } = {
      'ELETRICO': 'Elétrico',
      'HIDRAULICO': 'Hidráulico', 
      'AERODINAMICO': 'Aerodinâmico'
    };
    return tipoMap[tipo] || tipo;
  };  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Visualizar Teste</h2>
          <button className="close" onClick={onClose}>&times;</button>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <label>Tipo</label>
            <div className="value">{getTipoLabel(teste.tipo)}</div>
          </div>
          <div className="detail-item">
            <label>Resultado</label>
            <div className="value">
              <span className={`status-badge ${
                teste.resultado === 'APROVADO' ? 'status-operational' : 'status-pending'
              }`}>
                {getResultadoLabel(teste.resultado)}
              </span>
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

export default ViewTesteModal;