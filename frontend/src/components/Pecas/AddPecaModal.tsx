import React from 'react';
import type { Peca } from '../../services/api';

type Props = {
  editingPeca: Peca | null;
  formData: any;
  setFormData: (f: any) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
};

const AddPecaModal: React.FC<Props> = ({ editingPeca, formData, setFormData, onClose, onSubmit }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{editingPeca ? 'Editar Peça' : 'Nova Peça'}</h2>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        <form onSubmit={onSubmit} id="peca-form">
          {!editingPeca && (
            <div className="form-group">
              <label>Nome</label>
              <input type="text" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} required />
            </div>
          )}
          <div className="form-group">
            <label>Tipo</label>
            <select value={formData.tipo} onChange={(e) => setFormData({ ...formData, tipo: e.target.value })} required>
              <option value="NACIONAL">NACIONAL</option>
              <option value="IMPORTADA">IMPORTADA</option>
            </select>
          </div>
          <div className="form-group">
            <label>Fornecedor</label>
            <input type="text" value={formData.fornecedor} onChange={(e) => setFormData({ ...formData, fornecedor: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} required>
              <option value="EM_PRODUCAO">EM_PRODUCAO</option>
              <option value="EM_TRANSPORTE">EM_TRANSPORTE</option>
              <option value="PRONTA">PRONTA</option>
            </select>
          </div>
        </form>
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn btn-primary" form="peca-form">Salvar</button>
        </div>
      </div>
    </div>
  );
};

export default AddPecaModal;
