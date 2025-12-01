import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(usuario, senha);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-outer">
      <div className="login-card">
        <div className="brand">
          <h1>Aerocode</h1>
          <p className="brand-sub">Gestão e Manutenção de Aviões</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>Login</label>
            <div className="input-with-icon">
              <span className="icon">✉️</span>
              <input
                type="text"
                placeholder="Login"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="input-group">
            <label>Senha</label>
            <div className="input-with-icon">
              <span className="icon">🔒</span>
              <input
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <div className="error">{error}</div>}

          <button type="submit" className="btn-primary big" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <div className="footer-note">Não tem uma conta? <a href="/register">Criar agora</a></div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
