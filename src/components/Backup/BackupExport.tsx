import { useState } from 'react';
import { Database, FileText } from 'lucide-react';
import { useTreinos } from '../../hooks/useTreinos';
import { useHistorico } from '../../hooks/useHistorico';
import { useAppStore } from '../../store/useAppStore';
import { useDivisoesStore } from '../../store/useDivisoesStore';
import toast from 'react-hot-toast';

export const BackupExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  
  const { data: treinos } = useTreinos();
  const { data: historico } = useHistorico(1000);
  const { user, achievements, stats } = useAppStore();
  const { divisoes } = useDivisoesStore();

  const exportData = async () => {
    setIsExporting(true);
    try {
      const backupData = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        user,
        treinos,
        historico,
        divisoes,
        achievements,
        stats
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gymbuddy-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Backup exportado com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar backup');
    } finally {
      setIsExporting(false);
    }
  };

  const exportCSV = async () => {
    if (!historico?.length) {
      toast.error('Nenhum histórico para exportar');
      return;
    }

    try {
      const csvHeader = 'Data,Treino,Divisão,Tempo (min),Volume (kg),Observações\n';
      const csvData = historico.map(h => [
        new Date(h.data_execucao).toLocaleDateString(),
        h.Treino?.titulo || '',
        h.Treino?.divisao || '',
        h.tempo_total ? Math.round(h.tempo_total / 60) : '',
        h.volume_total || '',
        h.observacoes || ''
      ].join(',')).join('\n');

      const blob = new Blob([csvHeader + csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gymbuddy-historico-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Histórico exportado em CSV!');
    } catch (error) {
      toast.error('Erro ao exportar CSV');
    }
  };

  return (
    <div className="glass-card">
      <h3 className="section-title">Backup e Exportação</h3>
      
      <div className="grid cols-1 md:cols-2 gap-4">
        <div className="card-content">
          <h4 className="mb-3">Exportar Dados</h4>
          <div className="flex flex-col gap-3">
            <button
              onClick={exportData}
              disabled={isExporting}
              className="btn-primary flex items-center gap-2"
            >
              <Database size={20} />
              {isExporting ? 'Exportando...' : 'Backup Completo (JSON)'}
            </button>
            
            <button
              onClick={exportCSV}
              className="btn-secondary flex items-center gap-2"
            >
              <FileText size={20} />
              Histórico (CSV)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};