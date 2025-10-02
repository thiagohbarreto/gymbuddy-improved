import { useState } from 'react';
import { Play, CheckCircle, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  message?: string;
  duration?: number;
}

export const TestRunner = () => {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'API Connection', status: 'pending' },
    { name: 'Local Storage', status: 'pending' },
    { name: 'PWA Features', status: 'pending' }
  ]);
  
  const [isRunning, setIsRunning] = useState(false);

  const runTest = async (testName: string): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      switch (testName) {
        case 'API Connection':
          const response = await fetch('http://localhost:3002/health');
          if (!response.ok) throw new Error('API não disponível');
          return {
            name: testName,
            status: 'passed',
            message: 'API respondendo corretamente',
            duration: Date.now() - startTime
          };

        case 'Local Storage':
          localStorage.setItem('test', 'value');
          const value = localStorage.getItem('test');
          localStorage.removeItem('test');
          if (value !== 'value') throw new Error('LocalStorage não funcional');
          return {
            name: testName,
            status: 'passed',
            message: 'LocalStorage funcionando',
            duration: Date.now() - startTime
          };

        case 'PWA Features':
          if (!('serviceWorker' in navigator)) throw new Error('Service Worker não suportado');
          return {
            name: testName,
            status: 'passed',
            message: 'PWA features disponíveis',
            duration: Date.now() - startTime
          };

        default:
          throw new Error('Teste não implementado');
      }
    } catch (error) {
      return {
        name: testName,
        status: 'failed',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        duration: Date.now() - startTime
      };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      
      setTests(prev => prev.map(t => 
        t.name === test.name ? { ...t, status: 'running' } : t
      ));
      
      const result = await runTest(test.name);
      
      setTests(prev => prev.map(t => 
        t.name === test.name ? result : t
      ));
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setIsRunning(false);
    
    const passed = tests.filter(t => t.status === 'passed').length;
    const total = tests.length;
    
    if (passed === total) {
      toast.success(`Todos os ${total} testes passaram!`);
    } else {
      toast.error(`${passed}/${total} testes passaram`);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'failed':
        return <XCircle size={20} className="text-red-500" />;
      case 'running':
        return <Clock size={20} className="text-blue-500 animate-spin" />;
      default:
        return <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />;
    }
  };

  return (
    <div className="glass-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="section-title">Testes do Sistema</h3>
        <button
          onClick={runAllTests}
          disabled={isRunning}
          className="btn-primary flex items-center gap-2"
        >
          <Play size={16} />
          {isRunning ? 'Executando...' : 'Executar Testes'}
        </button>
      </div>

      <div className="space-y-3">
        {tests.map((test) => (
          <div
            key={test.name}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center gap-3">
              {getStatusIcon(test.status)}
              <div>
                <h4 className="font-medium">{test.name}</h4>
                {test.message && (
                  <p className="text-sm text-gray-600">{test.message}</p>
                )}
              </div>
            </div>
            
            {test.duration && (
              <span className="text-sm text-gray-500">
                {test.duration}ms
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};