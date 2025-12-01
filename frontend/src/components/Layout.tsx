import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/aeronaves', label: 'Aeronaves', icon: '✈️' },
    { path: '/pecas', label: 'Peças', icon: '🔧' },
    { path: '/etapas', label: 'Etapas', icon: '📋' },
    { path: '/funcionarios', label: 'Funcionários', icon: '👥' },
    { path: '/testes', label: 'Testes', icon: '🧪' },
    { path: '/relatorios', label: 'Relatórios', icon: '📄' },
  ];

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-left">
          <Link to="/" className="logo-link">
            <span className="logo-text">Aerocode</span>
          </Link>
        </div>
        <div className="header-right">
          <div className="user-profile">
            <div className="profile-avatar">
              {user?.nome.charAt(0).toUpperCase()}
            </div>
            <span className="profile-name">{user?.nome}</span>
          </div>
        </div>
      </header>

      <div className="app-body">
        <aside className="app-sidebar">
          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="sidebar-footer">
            <button onClick={handleLogout} className="logout-button">
              <span className="logout-icon">🚪</span>
              <span>Sair</span>
            </button>
          </div>
        </aside>
        <main className="app-main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

