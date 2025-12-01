import React, { useEffect, useState } from 'react';
import type { Teste, Aeronave } from '../../services/api';
import * as api from '../../services/api';

type Props = {
  teste: Teste;
  onClose: () => void;
  onAssociate: (codigoAeronave: string, tipoTeste: string, resultado: string) => void;
};

const AssociateTesteModal: React.FC<Props> = ({ teste, onClose, onAssociate }) => {
  const [aeronaves, setAeronaves] = useState<Aeronave[]>([]);
  const [selectedAeronave, setSelectedAeronave] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAeronaves = async () => {
      try {
        const data = await api.getAeronaves();
        setAeronaves(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar aeronaves');
        setLoading(false);
      }
    };
    loadAeronaves();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAeronave) {
      onAssociate(selectedAeronave, teste.tipo, teste.resultado);
    }
  };

  const getTipoLabel = (tipo: string) => {
    const tipoMap: { [key: string]: string } = {
      'ELETRICO': 'Elétrico',
      'HIDRAULICO': 'Hidráulico', 
      'AERODINAMICO': 'Aerodinâmico'
    };
    return tipoMap[tipo] || tipo;
  };

  if (loading) {
    return (
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Associar Teste à Aeronave</h2>
            <button className="close" onClick={onClose}>&times;</button>
          </div>
          <div style={{ padding: 20, textAlign: 'center' }}>
            Carregando aeronaves...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Associar Teste à Aeronave</h2>
          <button className="close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Teste</label>
              <input 
                type="text" 
                value={`${getTipoLabel(teste.tipo)} - ${teste.resultado === 'APROVADO' ? 'Aprovado' : 'Reprovado'}`} 
                disabled 
                className="input-disabled" 
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Aeronave</label>
              <select 
                value={selectedAeronave} 
                onChange={(e) => setSelectedAeronave(e.target.value)}
                required
              >
                <option value="">Selecione uma aeronave...</option>
                {aeronaves.map((aeronave) => (
                  <option key={aeronave.codigo} value={aeronave.codigo}>
                    {aeronave.codigo} - {aeronave.modelo}
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

          {aeronaves.length === 0 && (
            <div style={{ 
              padding: 12, 
              backgroundColor: '#fef3cd', 
              borderLeft: '4px solid #ffc107', 
              marginBottom: 16 
            }}>
              Não há aeronaves disponíveis para associação.
            </div>
          )}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!selectedAeronave || aeronaves.length === 0}
            >
              Associar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssociateTesteModal;