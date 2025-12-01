import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Aeronaves from './pages/Aeronaves';
import Pecas from './pages/Pecas';
import Etapas from './pages/Etapas';
import Funcionarios from './pages/Funcionarios';
import Testes from './pages/Testes';
import './App.css';
import './index.css';
import Relatorios from './pages/Relatórios';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/aeronaves"
              element={
                <PrivateRoute>
                  <Aeronaves />
                </PrivateRoute>
              }
            />
            <Route
              path="/pecas"
              element={
                <PrivateRoute>
                  <Pecas />
                </PrivateRoute>
              }
            />
            <Route
              path="/etapas"
              element={
                <PrivateRoute>
                  <Etapas />
                </PrivateRoute>
              }
            />
            <Route
              path="/funcionarios"
              element={
                <PrivateRoute>
                  <Funcionarios />
                </PrivateRoute>
              }
            />
            <Route
              path="/testes"
              element={
                <PrivateRoute>
                  <Testes />
                </PrivateRoute>
              }
            />
            <Route
              path="/relatorios"
              element={
                <PrivateRoute>
                  <Relatorios />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

