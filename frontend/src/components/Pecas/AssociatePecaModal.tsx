import React, { useEffect, useState } from 'react';
import type { Peca } from '../../services/api';
import type { Aeronave } from '../../services/api';

type Props = {
  peca: Peca;
  aeronaves: Aeronave[];
  onClose: () => void;
  onAssociate: (codigo: string) => void;
};

const AssociatePecaModal: React.FC<Props> = ({ peca, aeronaves, onClose, onAssociate }) => {
  const [selectedCodigo, setSelectedCodigo] = useState<string>('');

  useEffect(() => {
    if (!selectedCodigo && aeronaves.length > 0) setSelectedCodigo(aeronaves[0].codigo);
  }, [aeronaves, selectedCodigo]);

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Associar peça "{peca.nome}" a Aeronave</h2>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        <div className="form-group">
          <label>Selecione a Aeronave</label>
          <select value={selectedCodigo} onChange={(e) => setSelectedCodigo(e.target.value)}>
            {aeronaves.map(a => (
              <option key={a.codigo} value={a.codigo}>{a.codigo} - {a.modelo}</option>
            ))}
          </select>
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={() => onAssociate(selectedCodigo)} disabled={!selectedCodigo}>Associar</button>
        </div>
      </div>
    </div>
  );
};

export default AssociatePecaModal;
