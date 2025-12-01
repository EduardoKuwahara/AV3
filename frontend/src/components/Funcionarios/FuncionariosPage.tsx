import React, { useEffect, useState } from 'react';
import * as api from '../../services/api';
import type { Funcionario } from '../../services/api';
import HeaderFuncionarios from './HeaderFuncionarios';
import FuncionarioTable from './FuncionarioTable';
import AddFuncionarioModal from './AddFuncionarioModal';
import ViewFuncionarioModal from './ViewFuncionarioModal';
import AssociateFuncionarioModal from './AssociateFuncionarioModal';
import { showConfirm} from '../../utils/dialogs';

const FuncionariosPage: React.FC = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFuncionario, setEditingFuncionario] = useState<Funcionario | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    nome: '',
    telefone: '',
    endereco: '',
    usuario: '',
    senha: '',
    nivelPermissao: 'OPERADOR',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewFuncionario, setViewFuncionario] = useState<Funcionario | null>(null);
  const [showAssociateModal, setShowAssociateModal] = useState(false);
  const [selectedFuncionario, setSelectedFuncionario] = useState<Funcionario | null>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const data = await api.getFuncionarios();
      setFuncionarios(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (editingFuncionario) {
        await api.updateFuncionario(editingFuncionario.id, formData);
        setSuccess('Funcionário atualizado com sucesso!');
      } else {
        await api.createFuncionario(formData);
        setSuccess('Funcionário cadastrado com sucesso!');
      }
      setShowModal(false);
      setEditingFuncionario(null);
      setFormData({ id: '', nome: '', telefone: '', endereco: '', usuario: '', senha: '', nivelPermissao: 'OPERADOR' });
      loadData();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleEdit = (funcionario: Funcionario) => {
    setEditingFuncionario(funcionario);
    setFormData({
      id: funcionario.id,
      nome: funcionario.nome,
      telefone: funcionario.telefone,
      endereco: funcionario.endereco,
      usuario: funcionario.usuario,
      senha: '',
      nivelPermissao: funcionario.nivelPermissao,
    });
    setShowModal(true);
  };

  const handleAssociate = (funcionario: Funcionario) => {
    setSelectedFuncionario(funcionario);
    setShowAssociateModal(true);
  };

  const handleView = (funcionario: Funcionario) => {
    setViewFuncionario(funcionario);
    setShowViewModal(true);
  };

  const handleDelete = async (funcionario: Funcionario) => {
    setError('');
  if (!showConfirm(`Confirma exclusão do funcionário "${funcionario.nome}"?`)) return;
    try {
      await api.deleteFuncionario(funcionario.id);
      setSuccess('Funcionário excluído com sucesso!');
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getPermissaoBadge = (nivel: string) => {
    const nivelMap: { [key: string]: { label: string; class: string } } = {
      'ADMINISTRADOR': { label: 'Administrador', class: 'status-pending' },
      'ENGENHEIRO': { label: 'Engenheiro', class: 'status-maintenance' },
      'OPERADOR': { label: 'Operador', class: 'status-operational' }
    };
    return nivelMap[nivel] || { label: nivel, class: 'status-pending' };
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>Carregando...</div>;

  return (
    <div>
      <HeaderFuncionarios onAdd={() => { setEditingFuncionario(null); setFormData({ id: '', nome: '', telefone: '', endereco: '', usuario: '', senha: '', nivelPermissao: 'OPERADOR' }); setShowModal(true); }} />

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <FuncionarioTable
        funcionarios={funcionarios}
        onEdit={handleEdit}
        onView={handleView}
        onAssociate={handleAssociate}
        onDelete={handleDelete}
        getPermissaoBadge={getPermissaoBadge}
      />

      {showModal && (
        <AddFuncionarioModal
          editingFuncionario={editingFuncionario}
          formData={formData}
          setFormData={setFormData}
          onClose={() => { setShowModal(false); setEditingFuncionario(null); }}
          onSubmit={handleSubmit}
        />
      )}

      {showViewModal && viewFuncionario && (
        <ViewFuncionarioModal
          funcionario={viewFuncionario}
          onClose={() => { setShowViewModal(false); setViewFuncionario(null); }}
        />
      )}

      {showAssociateModal && selectedFuncionario && (
        <AssociateFuncionarioModal
          funcionario={selectedFuncionario}
          onClose={() => { setShowAssociateModal(false); setSelectedFuncionario(null); }}
          onAssociated={() => { setSuccess('Funcionário associado à etapa com sucesso!'); setShowAssociateModal(false); setSelectedFuncionario(null); loadData(); }}
        />
      )}
    </div>
  );
};

export default FuncionariosPage;
