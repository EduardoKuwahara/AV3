import React from 'react';
import type { Aeronave } from '../../services/api';

type Props = {
  aeronaves: Aeronave[];
  selectedCodigo: string;
  setSelectedCodigo: (c: string) => void;
  cliente: string;
  setCliente: (s: string) => void;
  dataEntrega: string;
  setDataEntrega: (s: string) => void;
  onClose: () => void;
  onGenerate: () => void;
};

const GenerateRelatorioModal: React.FC<Props> = ({ aeronaves, selectedCodigo, setSelectedCodigo, cliente, setCliente, dataEntrega, setDataEntrega, onClose, onGenerate }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Gerar Relatório</h2>
          <span className="close" onClick={onClose}>&times;</span>
        </div>

        <div className="form-group">
          <label>Aeronave</label>
          <select value={selectedCodigo} onChange={(e) => setSelectedCodigo(e.target.value)} required>
            <option value="">Selecione uma aeronave</option>
            {aeronaves.map(a => (
              <option key={a.codigo} value={a.codigo}>{a.codigo} - {a.modelo}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Cliente</label>
          <input type="text" value={cliente} onChange={(e) => setCliente(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Data de Entrega</label>
          <input type="text" placeholder="DD-MM-AAAA" value={dataEntrega} onChange={(e) => setDataEntrega(e.target.value)} required />
        </div>

        <div className="modal-actions">
          <button onClick={onClose} className="btn btn-secondary">Cancelar</button>
          <button onClick={onGenerate} className="btn btn-primary">Gerar</button>
        </div>
      </div>
    </div>
  );
};

export default GenerateRelatorioModal;
