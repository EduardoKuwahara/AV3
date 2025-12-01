import React from 'react';
import Layout from '../components/Layout';
import PecasPage from '../components/Pecas/PecasPage';
import './SharedStyles.css';


const Pecas: React.FC = () => {
  return (
    <Layout>
      <PecasPage />
    </Layout>
  );
};

export default Pecas;

