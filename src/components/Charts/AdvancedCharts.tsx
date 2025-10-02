import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useHistorico, useStats } from '../../hooks/useHistorico';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const VolumeChart = () => {
  const { data: historico, isLoading } = useHistorico(30);

  if (isLoading) return <LoadingSpinner size="small" />;

  const volumeData = historico?.reduce((acc: any[], item) => {
    const data = format(new Date(item.data_execucao), 'dd/MM');
    const existing = acc.find(d => d.data === data);
    if (existing) {
      existing.volume += item.volume_total || 0;
    } else {
      acc.push({ data, volume: item.volume_total || 0 });
    }
    return acc;
  }, []) || [];

  return (
    <div className="glass-card">
      <h3 className="section-title">Volume por Dia</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={volumeData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="data" />
          <YAxis />
          <Tooltip formatter={(value) => [`${value}kg`, 'Volume']} />
          <Line type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const FrequencyChart = () => {
  const { data: historico, isLoading } = useHistorico(30);

  if (isLoading) return <LoadingSpinner size="small" />;

  const last30Days = eachDayOfInterval({
    start: subDays(new Date(), 29),
    end: new Date()
  });

  const frequencyData = last30Days.map(day => {
    const dayStr = format(day, 'dd/MM');
    const treinos = historico?.filter(h => 
      format(new Date(h.data_execucao), 'dd/MM') === dayStr
    ).length || 0;
    
    return { data: dayStr, treinos };
  });

  return (
    <div className="glass-card">
      <h3 className="section-title">Frequência (30 dias)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={frequencyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="data" />
          <YAxis />
          <Tooltip formatter={(value) => [`${value}`, 'Treinos']} />
          <Bar dataKey="treinos" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const DivisaoChart = () => {
  const { data: historico, isLoading } = useHistorico(100);

  if (isLoading) return <LoadingSpinner size="small" />;

  const divisaoData = historico?.reduce((acc: any[], item) => {
    const divisao = item.Treino?.divisao || 'Sem divisão';
    const existing = acc.find(d => d.name === divisao);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: divisao, value: 1 });
    }
    return acc;
  }, []) || [];

  return (
    <div className="glass-card">
      <h3 className="section-title">Distribuição por Divisão</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={divisaoData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {divisaoData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const StatsCards = () => {
  const { data: stats, isLoading } = useStats();

  if (isLoading) return <LoadingSpinner size="small" />;

  return (
    <div className="grid cols-4 gap-4 mb-6">
      <div className="stat-card">
        <h3>{stats?.total_treinos || 0}</h3>
        <p>Total de Treinos</p>
      </div>
      <div className="stat-card success">
        <h3>{stats?.streak_atual || 0}</h3>
        <p>Dias Consecutivos</p>
      </div>
      <div className="stat-card warning">
        <h3>{stats?.volume_total ? `${Math.round(stats.volume_total)}kg` : '0kg'}</h3>
        <p>Volume Total</p>
      </div>
      <div className="stat-card danger">
        <h3>{stats?.tempo_total ? `${Math.round(stats.tempo_total / 60)}h` : '0h'}</h3>
        <p>Tempo Total</p>
      </div>
    </div>
  );
};