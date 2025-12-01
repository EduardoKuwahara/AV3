import React, { useEffect, useState } from 'react';
import * as api from '../../services/api';
import type { Etapa, Funcionario } from '../../services/api';
import HeaderEtapas from './HeaderEtapas';
import EtapaTable from './EtapaTable';
import AddEtapaModal from './AddEtapaModal';
import ViewEtapaModal from './ViewEtapaModal';
import AssociateEtapaModal from './AssociateEtapaModal';
import { showConfirm } from '../../utils/dialogs';

const EtapasPage: React.FC = () => {
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEtapa, setEditingEtapa] = useState<Etapa | null>(null);
  const [formData, setFormData] = useState({ nome: '', prazo: '', status: 'PENDENTE' });
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewEtapa, setViewEtapa] = useState<Etapa | null>(null);
  const [showAssociateModal, setShowAssociateModal] = useState(false);
  const [etapaToAssociate, setEtapaToAssociate] = useState<Etapa | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const data = await api.getEtapas();
      setEtapas(data);
      
      const funcionariosData = await api.getFuncionarios();
      setFuncionarios(funcionariosData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (editingEtapa) {
        await api.updateEtapa(editingEtapa.nome, formData);
        setSuccess('Etapa atualizada com sucesso!');
      } else {
        await api.createEtapa(formData);
        setSuccess('Etapa criada com sucesso!');
      }
      setShowModal(false);
      setEditingEtapa(null);
      setFormData({ nome: '', prazo: '', status: 'PENDENTE' });
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (etapa: Etapa) => {
    setEditingEtapa(etapa);
    setFormData({ nome: etapa.nome, prazo: etapa.prazo, status: etapa.status });
    setShowModal(true);
  };

  const handleAssociate = (etapa: Etapa) => {
    setEtapaToAssociate(etapa);
    setShowAssociateModal(true);
  };

  const handleAssociateToFuncionario = async (nomeEtapa: string, nomeFuncionario: string) => {
    setError('');
    try {
      const funcionario = funcionarios.find(f => f.nome === nomeFuncionario);
      if (!funcionario) {
        setError('Funcionário não encontrado');
        return;
      }
      
      await api.associateFuncionarioToEtapa(nomeEtapa, funcionario.id);
      setSuccess('Etapa associada ao funcionário com sucesso!');
      setShowAssociateModal(false);
      setEtapaToAssociate(null);
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (etapa: Etapa) => {
    setError('');
    if (!showConfirm(`Confirma exclusão da etapa "${etapa.nome}"?`)) return;
    try {
      await api.deleteEtapa(etapa.nome);
      setSuccess('Etapa excluída com sucesso!');
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleView = (etapa: Etapa) => {
    setViewEtapa(etapa);
    setShowViewModal(true);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; class: string } } = {
      'PENDENTE': { label: 'Pendente', class: 'status-pending' },
      'EM_ANDAMENTO': { label: 'Em Andamento', class: 'status-maintenance' },
      'CONCLUIDA': { label: 'Concluída', class: 'status-ready' }
    };
    return statusMap[status] || { label: status, class: 'status-pending' };
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>Carregando...</div>;

  return (
    <div>
      <HeaderEtapas onAdd={() => { setEditingEtapa(null); setFormData({ nome: '', prazo: '', status: 'PENDENTE' }); setShowModal(true); }} />

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <EtapaTable
        etapas={etapas}
        onEdit={handleEdit}
        onView={handleView}
        onAssociate={handleAssociate}
        onDelete={handleDelete}
        getStatusBadge={getStatusBadge}
      />

      {showModal && (
        <AddEtapaModal
          editingEtapa={editingEtapa}
          formData={formData}
          setFormData={setFormData}
          onClose={() => { setShowModal(false); setEditingEtapa(null); }}
          onSubmit={handleSubmit}
        />
      )}

      {showViewModal && viewEtapa && (
        <ViewEtapaModal
          etapa={viewEtapa}
          onClose={() => { setShowViewModal(false); setViewEtapa(null); }}
        />
      )}

      {showAssociateModal && etapaToAssociate && (
        <AssociateEtapaModal
          etapa={etapaToAssociate}
          funcionarios={funcionarios}
          onClose={() => { setShowAssociateModal(false); setEtapaToAssociate(null); }}
          onAssociate={handleAssociateToFuncionario}
        />
      )}
    </div>
  );
};

export default EtapasPage;
