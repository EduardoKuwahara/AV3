import React, { useState } from 'react';
import type { Etapa, Funcionario } from '../../services/api';

type Props = {
  etapa: Etapa;
  funcionarios: Funcionario[];
  onClose: () => void;
  onAssociate: (nomeEtapa: string, nomeFuncionario: string) => void;
};

const AssociateEtapaModal: React.FC<Props> = ({ etapa, funcionarios, onClose, onAssociate }) => {
  const [selectedFuncionario, setSelectedFuncionario] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFuncionario) {
      onAssociate(etapa.nome, selectedFuncionario);
    }
  };

  const availableFuncionarios = funcionarios.filter(func => 
    !etapa.funcionarios.some(etapaFunc => etapaFunc.nome === func.nome)
  );

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Associar Funcionário à Etapa</h2>
          <button className="close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Etapa</label>
              <input type="text" value={etapa.nome} disabled className="input-disabled" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Funcionário</label>
              <select 
                value={selectedFuncionario} 
                onChange={(e) => setSelectedFuncionario(e.target.value)}
                required
              >
                <option value="">Selecione um funcionário...</option>
                {availableFuncionarios.map((func) => (
                  <option key={func.nome} value={func.nome}>
                    {func.nome} - {func.nivelPermissao}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {availableFuncionarios.length === 0 && (
            <div style={{ 
              padding: 12, 
              backgroundColor: '#fef3cd', 
              borderLeft: '4px solid #ffc107', 
              marginBottom: 16 
            }}>
              Todos os funcionários já estão associados a esta etapa ou não há funcionários disponíveis.
            </div>
          )}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!selectedFuncionario || availableFuncionarios.length === 0}
            >
              Associar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssociateEtapaModal;