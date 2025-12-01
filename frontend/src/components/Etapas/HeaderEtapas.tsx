import React from 'react';

type Props = {
  onAdd: () => void;
};

const HeaderEtapas: React.FC<Props> = ({ onAdd }) => (
  <div className="page-header">
    <h1 className="page-title">Gestão de Etapas</h1>
    <button onClick={onAdd} className="add-button">
      <span className="add-button-icon">+</span>
      <span>Adicionar Etapa</span>
    </button>
  </div>
);

export default HeaderEtapas;
