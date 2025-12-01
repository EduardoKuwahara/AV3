import React from 'react';

type Props = {
  onAdd: () => void;
};

const HeaderTestes: React.FC<Props> = ({ onAdd }) => (
  <div className="page-header">
    <h1 className="page-title">Gestão de Testes</h1>
    <button onClick={onAdd} className="add-button">
      <span className="add-button-icon">+</span>
      <span>Adicionar Teste</span>
    </button>
  </div>
);

export default HeaderTestes;
