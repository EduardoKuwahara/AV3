import React from 'react';

type Props = {
  formData: any;
  setFormData: (f: any) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isEditing?: boolean;
};

const AddAeronaveModal: React.FC<Props> = ({ formData, setFormData, onClose, onSubmit }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{formData && formData.codigo ? 'Editar Aeronave' : 'Nova Aeronave'}</h2>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        <form onSubmit={onSubmit} id="aeronave-form">
          <div className="form-group">
            <label>Código</label>
            <input type="text" value={formData.codigo} onChange={(e) => setFormData({ ...formData, codigo: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Modelo</label>
            <input type="text" value={formData.modelo} onChange={(e) => setFormData({ ...formData, modelo: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Tipo</label>
            <select value={formData.tipo} onChange={(e) => setFormData({ ...formData, tipo: e.target.value })} required>
              <option value="COMERCIAL">COMERCIAL</option>
              <option value="MILITAR">MILITAR</option>
            </select>
          </div>
          <div className="form-group">
            <label>Capacidade</label>
            <input type="number" value={formData.capacidade} onChange={(e) => setFormData({ ...formData, capacidade: parseInt(e.target.value || '0') })} required min={0} />
          </div>
          <div className="form-group">
            <label>Alcance (km)</label>
            <input type="number" value={formData.alcance} onChange={(e) => setFormData({ ...formData, alcance: parseInt(e.target.value || '0') })} required min={0} />
          </div>
        </form>
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn btn-primary" form="aeronave-form">Salvar</button>
        </div>
      </div>
    </div>
  );
};

export default AddAeronaveModal;
