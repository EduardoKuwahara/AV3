import React from 'react';
import Layout from '../components/Layout';
import AeronavesPage from '../components/Aeronaves/AeronavesPage';
import './SharedStyles.css';


const Aeronaves: React.FC = () => {
  return (
    <Layout>
      <AeronavesPage />
    </Layout>
  );
};

export default Aeronaves;

