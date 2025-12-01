import React from 'react';

type Props = {
  onAdd: () => void;
};

const HeaderPecas: React.FC<Props> = ({ onAdd }) => (
  <div className="page-header">
    <h1 className="page-title">Gestão de Peças</h1>
    <button onClick={onAdd} className="add-button">
      <span className="add-button-icon">+</span>
      <span>Adicionar Peça</span>
    </button>
  </div>
);

export default HeaderPecas;
