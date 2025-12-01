import React from 'react';
import type { Funcionario } from '../../services/api';

type Props = {
  editingFuncionario: Funcionario | null;
  formData: any;
  setFormData: (f: any) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
};

const AddFuncionarioModal: React.FC<Props> = ({ editingFuncionario, formData, setFormData, onClose, onSubmit }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{editingFuncionario ? 'Editar Funcionário' : 'Novo Funcionário'}</h2>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        <form onSubmit={onSubmit} id="funcionario-form">
          {!editingFuncionario && (
            <div className="form-group">
              <label>ID</label>
              <input type="text" value={formData.id} onChange={(e) => setFormData({ ...formData, id: e.target.value })} required />
            </div>
          )}
          <div className="form-group">
            <label>Nome</label>
            <input type="text" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Telefone</label>
            <input type="text" value={formData.telefone} onChange={(e) => setFormData({ ...formData, telefone: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Endereço</label>
            <input type="text" value={formData.endereco} onChange={(e) => setFormData({ ...formData, endereco: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Usuário</label>
            <input type="text" value={formData.usuario} onChange={(e) => setFormData({ ...formData, usuario: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Senha {editingFuncionario && '(deixe em branco para manter)'}</label>
            <input type="password" value={formData.senha} onChange={(e) => setFormData({ ...formData, senha: e.target.value })} required={!editingFuncionario} />
          </div>
          <div className="form-group">
            <label>Nível de Permissão</label>
            <select value={formData.nivelPermissao} onChange={(e) => setFormData({ ...formData, nivelPermissao: e.target.value })} required>
              <option value="ADMINISTRADOR">ADMINISTRADOR</option>
              <option value="ENGENHEIRO">ENGENHEIRO</option>
              <option value="OPERADOR">OPERADOR</option>
            </select>
          </div>
        </form>
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn btn-primary" form="funcionario-form">Salvar</button>
        </div>
      </div>
    </div>
  );
};

export default AddFuncionarioModal;
