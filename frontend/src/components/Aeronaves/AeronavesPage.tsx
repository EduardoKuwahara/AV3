import React, { useEffect, useState } from 'react';
import * as api from '../../services/api';
import type { Aeronave, Peca, Etapa } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import AeronaveTable from './AeronaveTable';
import AddAeronaveModal from './AddAeronaveModal';
import AssociateModal from './AssociateModal';
import ViewAeronaveModal from './ViewAeronaveModal';
import HeaderAeronaves from './HeaderAeronaves';
import { showConfirm } from '../../utils/dialogs';

const AeronavesPage: React.FC = () => {
  const [aeronaves, setAeronaves] = useState<Aeronave[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAeronave, setEditingAeronave] = useState<Aeronave | null>(null);
  const [showAssociarModal, setShowAssociarModal] = useState(false);
  const [selectedAeronave, setSelectedAeronave] = useState<string>('');
  const [formData, setFormData] = useState({ codigo: '', modelo: '', tipo: 'COMERCIAL', capacidade: 0, alcance: 0 });
  const [associarData, setAssociarData] = useState({ tipo: 'peca', valor: '' });
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const { user } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [aeronavesData, pecasData, etapasData] = await Promise.all([api.getAeronaves(), api.getPecas(), api.getEtapas()]);
      setAeronaves(aeronavesData);
      setPecas(pecasData);
      setEtapas(etapasData);
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
      if (editingAeronave) {
        await api.updateAeronave(editingAeronave.codigo, formData);
        setSuccess('Aeronave atualizada com sucesso!');
      } else {
        await api.createAeronave(formData);
        setSuccess('Aeronave cadastrada com sucesso!');
      }
      setShowModal(false);
      setEditingAeronave(null);
      setFormData({ codigo: '', modelo: '', tipo: 'COMERCIAL', capacidade: 0, alcance: 0 });
      loadData();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleAssociar = async () => {
    setError('');
    try {
      if (associarData.tipo === 'peca') {
        await api.associatePecaToAeronave(selectedAeronave, associarData.valor);
      } else if (associarData.tipo === 'etapa') {
        await api.associateEtapaToAeronave(selectedAeronave, associarData.valor);
      } else if (associarData.tipo === 'teste') {
        const [tipoTeste, resultado] = associarData.valor.split('|');
        await api.associateTesteToAeronave(selectedAeronave, tipoTeste, resultado);
      }
      setSuccess('Associação realizada com sucesso!');
      setShowAssociarModal(false);
      loadData();
    } catch (error: any) {
      setError(error.message);
    }
  };



  const handleEdit = (codigo: string) => {
    const aeronave = aeronaves.find(a => a.codigo === codigo);
    if (!aeronave) return;
    setEditingAeronave(aeronave);
    setFormData({ codigo: aeronave.codigo, modelo: aeronave.modelo, tipo: aeronave.tipo, capacidade: aeronave.capacidade, alcance: aeronave.alcance });
    setShowModal(true);
  };

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewAeronave, setViewAeronave] = useState<Aeronave | null>(null);

  const handleView = (codigo: string) => {
    const aeronave = aeronaves.find(a => a.codigo === codigo);
    if (!aeronave) return;
    setViewAeronave(aeronave);
    setShowViewModal(true);
  };

  const handleDelete = async (codigo: string) => {
    setError('');
    const aeronave = aeronaves.find(a => a.codigo === codigo);
    if (!aeronave) return;

    if (!showConfirm(`Confirma exclusão da aeronave "${aeronave.modelo}" (${codigo})?`)) return;

    try {
      await api.deleteAeronave(codigo);
      setSuccess('Aeronave excluída com sucesso!');
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getStatusBadge = (aeronave: Aeronave) => {
    const totalTestes = aeronave.testes.length;
    const testesAprovados = aeronave.testes.filter(t => t.resultado === 'APROVADO').length;
    const etapasConcluidas = aeronave.etapas.filter(e => e.status === 'CONCLUIDA').length;
    const totalEtapas = aeronave.etapas.length;

    if (totalTestes > 0 && testesAprovados === totalTestes && etapasConcluidas === totalEtapas && totalEtapas > 0) {
      return { label: 'Operacional', class: 'status-operational' };
    } else if (totalEtapas > 0 && etapasConcluidas < totalEtapas) {
      return { label: 'Em Manutenção', class: 'status-maintenance' };
    }
    return { label: 'Pendente', class: 'status-pending' };
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>Carregando...</div>;

  return (
    <div>
      <HeaderAeronaves onAdd={() => setShowModal(true)} />

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <AeronaveTable
        aeronaves={aeronaves}
        onEditAssociate={(codigo) => { setSelectedAeronave(codigo); setShowAssociarModal(true); } }
        onView={handleView}
        onDelete={handleDelete}
        user={user}
        getStatusBadge={getStatusBadge}
        onEdit={handleEdit}
      />

      {showModal && (
        <AddAeronaveModal
          formData={formData}
          setFormData={setFormData}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        />
      )}

      {showAssociarModal && (
        <AssociateModal
          associarData={associarData}
          setAssociarData={setAssociarData}
          pecas={pecas}
          etapas={etapas}
          onClose={() => setShowAssociarModal(false)}
          onAssociar={handleAssociar}
        />
      )}

      {showViewModal && viewAeronave && (
        <ViewAeronaveModal aeronave={viewAeronave} onClose={() => { setShowViewModal(false); setViewAeronave(null); }} />
      )}
    </div>
  );
};

export default AeronavesPage;
