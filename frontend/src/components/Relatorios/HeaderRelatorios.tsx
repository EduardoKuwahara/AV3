import React from 'react';
import { useAuth } from '../../context/AuthContext';

type Props = {
  onGenerate: () => void;
};

const HeaderRelatorios: React.FC<Props> = ({ onGenerate }) => {
  const { user } = useAuth();

  const canGenerate = !!user && (user.nivelPermissao === 'ADMINISTRADOR' || user.nivelPermissao === 'ENGENHEIRO');

  return (
    <div className="page-header">
      <h1 className="page-title">Relatórios</h1>
      {canGenerate && (
        <button onClick={onGenerate} className="add-button">
          <span className="add-button-icon">📄</span>
          <span>Gerar Relatório</span>
        </button>
      )}
    </div>
  );
};

export default HeaderRelatorios;
