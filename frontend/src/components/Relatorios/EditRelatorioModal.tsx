import React, { useState } from 'react';
import type { Relatorio } from '../../services/api';

type Props = {
  relatorio: Relatorio;
  onClose: () => void;
  onSave: (updatedRelatorio: Relatorio) => void;
};

const EditRelatorioModal: React.FC<Props> = ({ relatorio, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    cliente: relatorio.cliente,
    dataEntrega: relatorio.dataEntrega,
    arquivo: relatorio.arquivo || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedRelatorio: Relatorio = {
      ...relatorio,
      cliente: formData.cliente,
      dataEntrega: formData.dataEntrega,
      arquivo: formData.arquivo
    };

    onSave(updatedRelatorio);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Editar Relatório</h2>
          <button className="close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} id="relatorio-form">
          <div className="form-row">
            <div className="form-group">
              <label>Aeronave</label>
              <input 
                type="text" 
                value={`${relatorio.aeronaveCodigo} ${relatorio.aeronaveModelo ? `- ${relatorio.aeronaveModelo}` : ''}`} 
                disabled 
                className="input-disabled" 
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Cliente *</label>
              <input
                type="text"
                value={formData.cliente}
                onChange={(e) => handleChange('cliente', e.target.value)}
                required
                placeholder="Nome do cliente"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Data de Entrega *</label>
              <input
                type="date"
                value={formData.dataEntrega}
                onChange={(e) => handleChange('dataEntrega', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Nome do Arquivo</label>
              <input
                type="text"
                value={formData.arquivo}
                onChange={(e) => handleChange('arquivo', e.target.value)}
                placeholder="relatorio_codigo.txt"
              />
            </div>
          </div>
        </form>
        <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" form="relatorio-form">
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRelatorioModal;