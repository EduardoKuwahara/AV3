import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../../services/api';
import './LoginPage.css';

const RegisterPage: React.FC = () => {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!nome.trim()) {
      setError('Nome completo é obrigatório.');
      return;
    }
    
    if (!telefone.trim()) {
      setError('Telefone é obrigatório.');
      return;
    }
    
    if (!endereco.trim()) {
      setError('Endereço é obrigatório.');
      return;
    }
    
    if (!usuario.trim()) {
      setError('Nome de usuário é obrigatório.');
      return;
    }
    
    if (senha.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres.');
      return;
    }
    
    if (senha !== confirmSenha) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    
    try {
      const dadosRegistro = {
        nome,
        telefone,
        endereco,
        usuario,
        senha
      };
      
      console.log('🔍 Frontend - Enviando dados:', dadosRegistro);
      
      const response = await api.register(dadosRegistro);
      
      // O endpoint de registro retorna uma estrutura diferente
      // Redireciona para login após registro bem-sucedido
      navigate('/login', { state: { message: 'Conta criada com sucesso! Faça login para continuar.' } });
    } catch (error: any) {
      setError(error.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-outer">
      <div className="login-card">
        <div className="brand">
          <h1>Aerocode</h1>
          <p className="brand-sub">Crie sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>Nome Completo</label>
            <div className="input-with-icon">
              <span className="icon">👤</span>
              <input
                type="text"
                placeholder="Seu nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Telefone</label>
            <div className="input-with-icon">
              <span className="icon">📞</span>
              <input
                type="tel"
                placeholder="(11) 99999-9999"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Endereço</label>
            <div className="input-with-icon">
              <span className="icon">🏠</span>
              <input
                type="text"
                placeholder="Rua, número, bairro, cidade"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Nome de Usuário</label>
            <div className="input-with-icon">
              <span className="icon">👥</span>
              <input
                type="text"
                placeholder="usuario123"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
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

          <div className="input-group">
            <label>Confirmar Senha</label>
            <div className="input-with-icon">
              <span className="icon">🔒</span>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmSenha}
                onChange={(e) => setConfirmSenha(e.target.value)}
                required
              />
            </div>
          </div>
          {error && <div className="error">{error}</div>}

          <button type="submit" className="btn-primary big" disabled={loading}>{loading ? 'Criando...' : 'Criar Conta'}</button>

          <div className="footer-note">Já tem uma conta? <a href="/login">Faça login</a></div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
