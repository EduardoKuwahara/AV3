import React, { useEffect, useState } from 'react';
import * as api from '../../services/api';
import FeatureCard from './FeatureCard';
import HeaderDashboard from './HeaderHome';
import './../../pages/Home.css';

const HomePage: React.FC = () => {
  const [stats, setStats] = useState({ aeronaves: 0, pecas: 0, etapas: 0, funcionarios: 0, testes: 0, relatorios: 0 });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [aeronaves, pecas, etapas, funcionarios, testes, relatorios] = await Promise.all([
          api.getAeronaves(), api.getPecas(), api.getEtapas(), api.getFuncionarios(), api.getTestes(), api.getRelatorios()
        ]);
        setStats({
          aeronaves: aeronaves.length,
          pecas: pecas.length,
          etapas: etapas.length,
          funcionarios: funcionarios.length,
          testes: testes.length,
          relatorios: relatorios.length,
        });
      } catch (err) {
        console.error('Erro ao carregar estatísticas:', err);
      }
    };
    loadStats();
  }, []);

  return (
    <div>
      <HeaderDashboard />
      <div className="dashboard-grid">
        <FeatureCard icon="✈️" title="Aeronaves" desc="Gerencie aeronaves cadastradas e seus detalhes." count={stats.aeronaves} link="/aeronaves" />
        <FeatureCard icon="🔧" title="Peças" desc="Controle de inventário de peças e fornecedores." count={stats.pecas} link="/pecas" />
        <FeatureCard icon="📋" title="Etapas" desc="Gestão de etapas do processo." count={stats.etapas} link="/etapas" />
        <FeatureCard icon="👥" title="Funcionários" desc="Agendamentos e histórico de manutenção." count={stats.funcionarios} link="/funcionarios" />
        <FeatureCard icon="🧪" title="Testes" desc="Acompanhe testes realizados nas aeronaves." count={stats.testes} link="/testes" />
        <FeatureCard icon="📄" title="Relatórios" desc="Relatórios de produção e entregas." count={stats.relatorios} link="/relatorios" />
      </div>
    </div>
  );
};

export default HomePage;
