import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <h2>Aerocode</h2>
        </Link>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/aeronaves">Aeronaves</Link>
          <Link to="/pecas">Peças</Link>
          <Link to="/etapas">Etapas</Link>
          <Link to="/funcionarios">Funcionários</Link>
          <Link to="/testes">Testes</Link>
          <Link to="/relatorios">Relatórios</Link>
        </div>
        <div className="navbar-user">
          <span>Olá, {user?.nome} ({user?.nivelPermissao})</span>
          <button onClick={handleLogout} className="btn btn-secondary">Sair</button>
        </div>
      </div>z
    </nav>
  );
};

export default Sidebar;

