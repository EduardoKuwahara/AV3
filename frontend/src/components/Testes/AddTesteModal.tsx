import React from 'react';

type Props = {
  editingIndex: number | null;
  formData: any;
  setFormData: (f: any) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
};

const AddTesteModal: React.FC<Props> = ({ editingIndex, formData, setFormData, onClose, onSubmit }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{editingIndex !== null ? 'Editar Teste' : 'Novo Teste'}</h2>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        <form onSubmit={onSubmit} id="teste-form">
          <div className="form-group">
            <label>Tipo</label>
            <select value={formData.tipo} onChange={(e) => setFormData({ ...formData, tipo: e.target.value })} required>
              <option value="ELETRICO">ELETRICO</option>
              <option value="HIDRAULICO">HIDRAULICO</option>
              <option value="AERODINAMICO">AERODINAMICO</option>
            </select>
          </div>
          <div className="form-group">
            <label>Resultado</label>
            <select value={formData.resultado} onChange={(e) => setFormData({ ...formData, resultado: e.target.value })} required>
              <option value="APROVADO">APROVADO</option>
              <option value="REPROVADO">REPROVADO</option>
            </select>
          </div>
        </form>
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn btn-primary" form="teste-form">Salvar</button>
        </div>
      </div>
    </div>
  );
};

export default AddTesteModal;
