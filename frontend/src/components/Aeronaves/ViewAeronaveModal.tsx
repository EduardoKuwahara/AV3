import React from 'react';
import type { Aeronave } from '../../services/api';

type Props = {
  aeronave: Aeronave;
  onClose: () => void;
};

const ViewAeronaveModal: React.FC<Props> = ({ aeronave, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Visualizar Aeronave</h2>
          <button className="close" onClick={onClose}>&times;</button>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <label>Modelo</label>
            <div className="value">{aeronave.modelo}</div>
          </div>

          <div className="detail-item">
            <label>Registro (código)</label>
            <div className="value">{aeronave.codigo}</div>
          </div>

          <div className="detail-item">
            <label>Tipo</label>
            <div className="value">{aeronave.tipo}</div>
          </div>

          <div className="detail-item">
            <label>Capacidade</label>
            <div className="value">{aeronave.capacidade}</div>
          </div>

          <div className="detail-item">
            <label>Alcance (km)</label>
            <div className="value">{aeronave.alcance} km</div>
          </div>
        </div>

        <div className="form-group">
          <div className="section-title">Peças associadas</div>
          {aeronave.pecas.length === 0 ? (
            <div className="muted">Nenhuma peça associada</div>
          ) : (
            <ul className="list-compact">
              {aeronave.pecas.map((p) => (
                <li key={p.nome}><span className="list-item-label">{p.nome}</span> <span className="muted">— {p.tipo}</span></li>
              ))}
            </ul>
          )}
        </div>

        <div className="form-group">
          <div className="section-title">Etapas</div>
          {aeronave.etapas.length === 0 ? (
            <div className="muted">Nenhuma etapa</div>
          ) : (
            <ul className="list-compact">
              {aeronave.etapas.map((e) => (
                <li key={e.nome}><span className="list-item-label">{e.nome}</span> <span className="muted">— {e.status}</span></li>
              ))}
            </ul>
          )}
        </div>

        <div className="form-group">
          <div className="section-title">Testes</div>
          {aeronave.testes.length === 0 ? (
            <div className="muted">Nenhum teste</div>
          ) : (
            <ul className="list-compact">
              {aeronave.testes.map((t, idx) => (
                <li key={idx}><span className="list-item-label">{t.tipo}</span> <span className="muted">— {t.resultado}</span></li>
              ))}
            </ul>
          )}
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
};

export default ViewAeronaveModal;
