import React from 'react';

type Props = {
  onAdd: () => void;
};

const HeaderAeronaves: React.FC<Props> = ({ onAdd }) => (
  <div className="page-header">
    <h1 className="page-title">Gestão de Aeronaves</h1>
    <button onClick={onAdd} className="add-button">
      <span className="add-button-icon">+</span>
      <span>Adicionar Aeronave</span>
    </button>
  </div>
);

export default HeaderAeronaves;
