import React from 'react';
import Layout from '../components/Layout';
import FuncionariosPage from '../components/Funcionarios/FuncionariosPage';
import './SharedStyles.css';


const Funcionarios: React.FC = () => {
  return (
    <Layout>
      <FuncionariosPage />
    </Layout>
  );
};

export default Funcionarios;

