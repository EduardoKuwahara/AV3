import React from 'react';
import Layout from '../components/Layout';
import EtapasPage from '../components/Etapas/EtapasPage';
import './SharedStyles.css';


const Etapas: React.FC = () => {
  return (
    <Layout>
      <EtapasPage />
    </Layout>
  );
};

export default Etapas;

