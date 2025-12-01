import React from 'react';
import Layout from '../components/Layout';
import RelatoriosPage from '../components/Relatorios/RelatoriosPage';
import './SharedStyles.css';

const Relatórios: React.FC = () => {
	return (
		<Layout>
			<RelatoriosPage />
		</Layout>
	);
};

export default Relatórios;
