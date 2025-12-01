import React, { useEffect } from 'react';
import type { Peca, Etapa } from '../../services/api';

type Props = {
  associarData: any;
  setAssociarData: (a: any) => void;
  pecas: Peca[];
  etapas: Etapa[];
  onClose: () => void;
  onAssociar: () => void;
};

const AssociateModal: React.FC<Props> = ({ associarData, setAssociarData, pecas, etapas, onClose, onAssociar }) => {
  const { tipo, valor } = associarData;

  useEffect(() => {
    if (tipo === 'peca' && pecas.length > 0 && !valor) {
      setAssociarData((prev: any) => ({ ...prev, valor: pecas[0].nome }));
    }
    if (tipo === 'etapa' && etapas.length > 0 && !valor) {
      setAssociarData((prev: any) => ({ ...prev, valor: etapas[0].nome }));
    }

  }, [tipo, valor, pecas, etapas, setAssociarData]);
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Associar a Aeronave</h2>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        <div className="form-group">
          <label>Tipo de Associação</label>
          <select value={associarData.tipo} onChange={(e) => setAssociarData({ ...associarData, tipo: e.target.value, valor: '' })}>
            <option value="peca">Peça</option>
            <option value="etapa">Etapa</option>
            <option value="teste">Teste</option>
          </select>
        </div>
        <div className="form-group">
          <label>
            {associarData.tipo === 'peca' && 'Peça'}
            {associarData.tipo === 'etapa' && 'Etapa'}
            {associarData.tipo === 'teste' && 'Teste (Tipo|Resultado)'}
          </label>
          {associarData.tipo === 'peca' && (
            <select value={associarData.valor} onChange={(e) => setAssociarData({ ...associarData, valor: e.target.value })} required>
              <option value="">Selecione uma peça</option>
              {pecas.map((p) => <option key={p.nome} value={p.nome}>{p.nome}</option>)}
            </select>
          )}
          {associarData.tipo === 'etapa' && (
            <select value={associarData.valor} onChange={(e) => setAssociarData({ ...associarData, valor: e.target.value })} required>
              <option value="">Selecione uma etapa</option>
              {etapas.map((e) => <option key={e.nome} value={e.nome}>{e.nome}</option>)}
            </select>
          )}
          {associarData.tipo === 'teste' && (
            <select value={associarData.valor} onChange={(e) => setAssociarData({ ...associarData, valor: e.target.value })} required>
              <option value="">Selecione um teste</option>
              <option value="ELETRICO|APROVADO">ELETRICO - APROVADO</option>
              <option value="ELETRICO|REPROVADO">ELETRICO - REPROVADO</option>
              <option value="HIDRAULICO|APROVADO">HIDRAULICO - APROVADO</option>
              <option value="HIDRAULICO|REPROVADO">HIDRAULICO - REPROVADO</option>
              <option value="AERODINAMICO|APROVADO">AERODINAMICO - APROVADO</option>
              <option value="AERODINAMICO|REPROVADO">AERODINAMICO - REPROVADO</option>
            </select>
          )}
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button onClick={onAssociar} className="btn btn-primary" disabled={!associarData.valor}>Associar</button>
        </div>
      </div>
    </div>
  );
};

export default AssociateModal;
