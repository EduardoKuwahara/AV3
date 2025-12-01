import React, { useEffect, useState } from 'react';
import * as api from '../../services/api';
import type { Peca } from '../../services/api';
import HeaderPecas from './HeaderPecas';
import PecaTable from './PecaTable';
import ViewPecaModal from './ViewPecaModal';
import AddPecaModal from './AddPecaModal';
import AssociatePecaModal from './AssociatePecaModal';
import type { Aeronave } from '../../services/api';
import { showConfirm } from '../../utils/dialogs';

const PecasPage: React.FC = () => {
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPeca, setEditingPeca] = useState<Peca | null>(null);
  const [formData, setFormData] = useState({ nome: '', tipo: 'NACIONAL', fornecedor: '', status: 'EM_PRODUCAO' });
  const [showAssociateModal, setShowAssociateModal] = useState(false);
  const [aeronaves, setAeronaves] = useState<Aeronave[]>([]);
  const [pecaToAssociate, setPecaToAssociate] = useState<Peca | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewPeca, setViewPeca] = useState<Peca | null>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const data = await api.getPecas();
      setPecas(data);
  
      const as = await api.getAeronaves();
      setAeronaves(as);
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
      if (editingPeca) {
        await api.updatePeca(editingPeca.nome, formData);
        setSuccess('Peça atualizada com sucesso!');
      } else {
        await api.createPeca(formData);
        setSuccess('Peça cadastrada com sucesso!');
      }
      setShowModal(false);
      setEditingPeca(null);
      setFormData({ nome: '', tipo: 'NACIONAL', fornecedor: '', status: 'EM_PRODUCAO' });
      loadData();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleEdit = (peca: Peca) => {
    setEditingPeca(peca);
    setFormData({ nome: peca.nome, tipo: peca.tipo, fornecedor: peca.fornecedor, status: peca.status });
    setShowModal(true);
  };

  const handleAssociate = async (peca: Peca) => {
    setPecaToAssociate(peca);
    setShowAssociateModal(true);
  };

  const handleAssociateToAeronave = async (codigo: string) => {
    if (!pecaToAssociate) return;
    setError('');
    try {
      await api.associatePecaToAeronave(codigo, pecaToAssociate.nome);
      setSuccess('Peça associada à aeronave com sucesso!');
      setShowAssociateModal(false);
      setPecaToAssociate(null);
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (peca: Peca) => {
    setError('');
    if (!showConfirm(`Confirma exclusão da peça "${peca.nome}"?`)) return;
    try {
      await api.deletePeca(peca.nome);
      setSuccess('Peça excluída com sucesso!');
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleView = (peca: Peca) => {
    setViewPeca(peca);
    setShowViewModal(true);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; class: string } } = {
      'EM_PRODUCAO': { label: 'Em Produção', class: 'status-in-production' },
      'EM_TRANSPORTE': { label: 'Em Transporte', class: 'status-maintenance' },
      'PRONTA': { label: 'Pronta', class: 'status-ready' }
    };
    return statusMap[status] || { label: status, class: 'status-pending' };
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>Carregando...</div>;

  return (
    <div>
      <HeaderPecas onAdd={() => { setEditingPeca(null); setFormData({ nome: '', tipo: 'NACIONAL', fornecedor: '', status: 'EM_PRODUCAO' }); setShowModal(true); }} />

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

  <PecaTable pecas={pecas} onEdit={handleEdit} onAssociate={handleAssociate} onDelete={handleDelete} onView={handleView} getStatusBadge={getStatusBadge} />

      {showModal && (
        <AddPecaModal
          editingPeca={editingPeca}
          formData={formData}
          setFormData={setFormData}
          onClose={() => { setShowModal(false); setEditingPeca(null); }}
          onSubmit={handleSubmit}
        />
      )}

      {showAssociateModal && pecaToAssociate && (
        <AssociatePecaModal
          peca={pecaToAssociate}
          aeronaves={aeronaves}
          onClose={() => { setShowAssociateModal(false); setPecaToAssociate(null); }}
          onAssociate={handleAssociateToAeronave}
        />
      )}
      {showViewModal && viewPeca && (
        <ViewPecaModal peca={viewPeca} onClose={() => { setShowViewModal(false); setViewPeca(null); }} />
      )}
    </div>
  );
};

export default PecasPage;
