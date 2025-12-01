import React, { useEffect, useState } from 'react';
import * as api from '../../services/api';
import type { Aeronave, Relatorio } from '../../services/api';
import HeaderRelatorios from './HeaderRelatorios';
import RelatorioTable from './RelatorioTable';
import GenerateRelatorioModal from './GenerateRelatorioModal';
import ViewRelatorioModal from './ViewRelatorioModal';
import EditRelatorioModal from './EditRelatorioModal';
import { showConfirm } from '../../utils/dialogs';


const RelatoriosPage: React.FC = () => {
  const [aeronaves, setAeronaves] = useState<Aeronave[]>([]);
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCodigo, setSelectedCodigo] = useState('');
  const [cliente, setCliente] = useState('');
  const [dataEntrega, setDataEntrega] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewRelatorio, setViewRelatorio] = useState<Relatorio | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRelatorio, setEditRelatorio] = useState<Relatorio | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const a = await api.getAeronaves();
      setAeronaves(a);

      try {
        const stored = await api.getRelatorios();
        setRelatorios(stored);
      } catch (relError) {
        if (a.length > 0) {
          const sampleA = a.find(x => x.codigo === 'AV001');
          if (sampleA) {
            const sample: Relatorio = {
              aeronaveCodigo: 'AV001',
              aeronaveModelo: sampleA.modelo,
              cliente: 'Cliente Exemplo',
              dataEntrega: '2025-11-28',
              arquivo: 'relatorio_AV001.txt',
              message: 'RELATÓRIO FINAL DE ENTREGA DE AERONAVE (protótipo)'
            };
            setRelatorios([sample]);
          }
        }
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setError('');
    try {
      if (!selectedCodigo || !cliente || !dataEntrega) {
        setError('Preencha todos os campos');
        return;
      }
      const res = await api.gerarRelatorio(selectedCodigo, cliente, dataEntrega);
      const aeronave = aeronaves.find(a => a.codigo === selectedCodigo);
      
      // Criar objeto do relatório com o ID retornado pelo backend
      const item: Relatorio = {
        id: res.id,
        aeronaveCodigo: selectedCodigo,
        aeronaveModelo: aeronave?.modelo,
        tipo: aeronave?.tipo,
        capacidade: aeronave?.capacidade,
        alcance: aeronave?.alcance,
        cliente,
        dataEntrega,
        arquivo: res.arquivo,
        message: res.conteudo,
        pecas: aeronave?.pecas || [],
        etapas: aeronave?.etapas || [],
        testes: aeronave?.testes || []
      };
      
      setRelatorios(prev => [item, ...prev]);
      setSuccess('Relatório gerado e salvo com sucesso!');
      setShowModal(false);
      setCliente('');
      setDataEntrega('');
      setSelectedCodigo('');
      loadData(); // Recarregar dados atualizados
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleView = (relatorio: Relatorio) => {
    setViewRelatorio(relatorio);
    setShowViewModal(true);
  };

  const handleEdit = (relatorio: Relatorio) => {
    setEditRelatorio(relatorio);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (updatedRelatorio: Relatorio) => {
    try {
      setRelatorios(prev => 
        prev.map(r => 
          r.aeronaveCodigo === updatedRelatorio.aeronaveCodigo ? updatedRelatorio : r
        )
      );
      setSuccess('Relatório atualizado com sucesso!');
      setShowEditModal(false);
      setEditRelatorio(null);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleDelete = async (relatorio: Relatorio) => {
    setError('');
    if (!showConfirm(`Confirma exclusão do relatório "${relatorio.arquivo}"?`)) return;
    try {
      if (relatorio.id) {
        await api.deleteRelatorio(String(relatorio.id));
        setSuccess('Relatório excluído com sucesso!');
        
        setRelatorios(prev => prev.filter(r => String(r.id) !== String(relatorio.id)));
      } else {
        setError('Erro: Relatório sem ID válido para exclusão');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir relatório');
    }
  };

  const handleDownload = async (item: Relatorio) => {
    try {
      if (item.id) {
        // Usar a nova API de download
        await api.downloadRelatorio(item.id);
        setSuccess('Download realizado com sucesso!');
      } else {
        // Fallback para relatórios sem ID (gerados localmente)
        const content = item.message || 'Conteúdo do relatório não disponível';
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = item.arquivo || `relatorio.txt`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }
    } catch (error: any) {
      console.error('Erro ao fazer download do relatório:', error);
      setError('Erro ao fazer download: ' + error.message);
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>Carregando...</div>;

  return (
    <div>
      <HeaderRelatorios onGenerate={() => setShowModal(true)} />

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <RelatorioTable 
        relatorios={relatorios} 
        onView={handleView}
        onEdit={handleEdit}
        onDownload={handleDownload}
        onDelete={handleDelete}
      />

      {showModal && (
        <GenerateRelatorioModal
          aeronaves={aeronaves}
          selectedCodigo={selectedCodigo}
          setSelectedCodigo={setSelectedCodigo}
          cliente={cliente}
          setCliente={setCliente}
          dataEntrega={dataEntrega}
          setDataEntrega={setDataEntrega}
          onClose={() => setShowModal(false)}
          onGenerate={handleGenerate}
        />
      )}

      {showViewModal && viewRelatorio && (
        <ViewRelatorioModal
          relatorio={viewRelatorio}
          onClose={() => { setShowViewModal(false); setViewRelatorio(null); }}
        />
      )}

      {showEditModal && editRelatorio && (
        <EditRelatorioModal
          relatorio={editRelatorio}
          onClose={() => { setShowEditModal(false); setEditRelatorio(null); }}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default RelatoriosPage;
