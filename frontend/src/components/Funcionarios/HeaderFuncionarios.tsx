import React from 'react';

type Props = {
  onAdd: () => void;
};

const HeaderFuncionarios: React.FC<Props> = ({ onAdd }) => (
  <div className="page-header">
    <h1 className="page-title">Gestão de Funcionários</h1>
    <button onClick={onAdd} className="add-button">
      <span className="add-button-icon">+</span>
      <span>Adicionar Funcionário</span>
    </button>
  </div>
);

export default HeaderFuncionarios;
