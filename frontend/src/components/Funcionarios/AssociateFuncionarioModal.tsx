import React, { useEffect, useState } from 'react';
import type { Funcionario, Etapa } from '../../services/api';
import * as api from '../../services/api';

type Props = {
  funcionario: Funcionario;
  onClose: () => void;
  onAssociated: () => void; 
};

const AssociateFuncionarioModal: React.FC<Props> = ({ funcionario, onClose, onAssociated }) => {
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [selectedEtapa, setSelectedEtapa] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEtapas = async () => {
      try {
        const data = await api.getEtapas();
        setEtapas(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar etapas');
        setLoading(false);
      }
    };
    loadEtapas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEtapa) return;
    
    setError('');
    try {
      await api.associateFuncionarioToEtapa(selectedEtapa, funcionario.id);
      onAssociated();
    } catch (err: any) {
      setError(err.message || 'Erro ao associar funcionário à etapa');
    }
  };

  // Etapas disponíveis (que não têm este funcionário já associado)
  const availableEtapas = etapas.filter(etapa => 
    !etapa.funcionarios.some(func => func.id === funcionario.id)
  );

  if (loading) {
    return (
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Associar Funcionário à Etapa</h2>
            <button className="close" onClick={onClose}>&times;</button>
          </div>
          <div style={{ padding: 20, textAlign: 'center' }}>
            Carregando etapas...
          </div>
        </div>
      </div>
    );
  }

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
              <label>Funcionário</label>
              <input type="text" value={funcionario.nome} disabled className="input-disabled" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Etapa</label>
              <select 
                value={selectedEtapa} 
                onChange={(e) => setSelectedEtapa(e.target.value)}
                required
              >
                <option value="">Selecione uma etapa...</option>
                {availableEtapas.map((etapa) => (
                  <option key={etapa.nome} value={etapa.nome}>
                    {etapa.nome} - {etapa.status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: 16 }}>
              {error}
            </div>
          )}

          {availableEtapas.length === 0 && (
            <div style={{ 
              padding: 12, 
              backgroundColor: '#fef3cd', 
              borderLeft: '4px solid #ffc107', 
              marginBottom: 16 
            }}>
              Este funcionário já está associado a todas as etapas disponíveis ou não há etapas cadastradas.
            </div>
          )}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!selectedEtapa || availableEtapas.length === 0}
            >
              Associar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssociateFuncionarioModal;
 
