import React, { useEffect, useState } from 'react';
import * as api from '../../services/api';
import type { Teste } from '../../services/api';
import HeaderTestes from './HeaderTestes';
import TesteTable from './TesteTable';
import AddTesteModal from './AddTesteModal';
import ViewTesteModal from './ViewTesteModal';
import AssociateTesteModal from './AssociateTesteModal';
import { showConfirm } from '../../utils/dialogs';

const TestesPage: React.FC = () => {
  const [testes, setTestes] = useState<Teste[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({ tipo: 'ELETRICO', resultado: 'APROVADO' });
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewTeste, setViewTeste] = useState<Teste | null>(null);
  const [showAssociateModal, setShowAssociateModal] = useState(false);
  const [testeToAssociate, setTesteToAssociate] = useState<Teste | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const data = await api.getTestes();
      setTestes(data);
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
      if (editingIndex !== null) {
        await api.updateTeste(editingIndex, formData);
        setSuccess('Teste atualizado com sucesso!');
      } else {
        await api.createTeste(formData);
        setSuccess('Teste cadastrado com sucesso!');
      }
      setShowModal(false);
      setEditingIndex(null);
      setFormData({ tipo: 'ELETRICO', resultado: 'APROVADO' });
      loadData();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleEdit = (index: number, teste: Teste) => {
    setEditingIndex(index);
    setFormData({ tipo: teste.tipo, resultado: teste.resultado });
    setShowModal(true);
  };

  const handleView = (index: number, teste: Teste) => {
    setViewTeste(teste);
    setShowViewModal(true);
  };

  const handleAssociate = (index: number, teste: Teste) => {
    setTesteToAssociate(teste);
    setShowAssociateModal(true);
  };

  const handleAssociateToAeronave = async (codigoAeronave: string, tipoTeste: string, resultado: string) => {
    setError('');
    try {
      await api.associateTesteToAeronave(codigoAeronave, tipoTeste, resultado);
      setSuccess('Teste associado à aeronave com sucesso!');
      setShowAssociateModal(false);
      setTesteToAssociate(null);
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (index: number) => {
    setError('');
    if (!showConfirm('Confirma exclusão deste teste?')) return;
    try {
      await api.deleteTeste(index);
      setSuccess('Teste excluído com sucesso!');
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getResultadoBadge = (resultado: string) => {
    return resultado === 'APROVADO'
      ? { label: 'Aprovado', class: 'status-operational' }
      : { label: 'Reprovado', class: 'status-pending' };
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>Carregando...</div>;

  return (
    <div>
      <HeaderTestes onAdd={() => { setEditingIndex(null); setFormData({ tipo: 'ELETRICO', resultado: 'APROVADO' }); setShowModal(true); }} />

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

  <TesteTable 
    testes={testes} 
    onEdit={handleEdit} 
    onView={handleView}
    onAssociate={handleAssociate}
    onDelete={handleDelete} 
    getResultadoBadge={getResultadoBadge} 
  />

      {showModal && (
        <AddTesteModal
          editingIndex={editingIndex}
          formData={formData}
          setFormData={setFormData}
          onClose={() => { setShowModal(false); setEditingIndex(null); }}
          onSubmit={handleSubmit}
        />
      )}

      {showViewModal && viewTeste && (
        <ViewTesteModal
          teste={viewTeste}
          onClose={() => { setShowViewModal(false); setViewTeste(null); }}
        />
      )}

      {showAssociateModal && testeToAssociate && (
        <AssociateTesteModal
          teste={testeToAssociate}
          onClose={() => { setShowAssociateModal(false); setTesteToAssociate(null); }}
          onAssociate={handleAssociateToAeronave}
        />
      )}
    </div>
  );
};

export default TestesPage;
