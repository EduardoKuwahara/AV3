import React from 'react';

type Props = {
  editingEtapa: any;
  formData: any;
  setFormData: (f: any) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
};

const AddEtapaModal: React.FC<Props> = ({ editingEtapa, formData, setFormData, onClose, onSubmit }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{editingEtapa ? 'Editar Etapa' : 'Nova Etapa'}</h2>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        <form onSubmit={onSubmit} id="etapa-form">
          {!editingEtapa && (
            <div className="form-group">
              <label>Nome</label>
              <input type="text" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} required />
            </div>
          )}
          <div className="form-group">
            <label>Prazo</label>
            <input type="text" value={formData.prazo} onChange={(e) => setFormData({ ...formData, prazo: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} required>
              <option value="PENDENTE">PENDENTE</option>
              <option value="EM_ANDAMENTO">EM_ANDAMENTO</option>
              <option value="CONCLUIDA">CONCLUIDA</option>
            </select>
          </div>
        </form>
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn btn-primary" form="etapa-form">Salvar</button>
        </div>
      </div>
    </div>
  );
};

export default AddEtapaModal;
