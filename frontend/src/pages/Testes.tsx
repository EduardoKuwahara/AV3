import React from 'react';
import Layout from '../components/Layout';
import TestesPage from '../components/Testes/TestesPage';
import './SharedStyles.css';

const Testes: React.FC = () => {
  return (
    <Layout>
      <TestesPage />
    </Layout>
  );
};

export default Testes;

