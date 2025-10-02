import { useState, useEffect } from 'react';
import { Bell, BellOff, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

export const PushNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      setIsEnabled(localStorage.getItem('notifications-enabled') === 'true');
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('Notificações não suportadas neste navegador');
      return;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    
    if (result === 'granted') {
      setIsEnabled(true);
      localStorage.setItem('notifications-enabled', 'true');
      toast.success('Notificações ativadas!');
      
      new Notification('Gym Buddy', {
        body: 'Notificações ativadas com sucesso!',
        icon: '/icon-gymbuddy.png'
      });
    } else {
      toast.error('Permissão negada para notificações');
    }
  };

  const toggleNotifications = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    localStorage.setItem('notifications-enabled', newState.toString());
    
    if (newState) {
      toast.success('Notificações ativadas');
    } else {
      toast.success('Notificações desativadas');
    }
  };

  return (
    <div className="glass-card">
      <h3 className="section-title">Notificações Push</h3>
      
      <div className="card-content">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {isEnabled ? <Bell size={20} /> : <BellOff size={20} />}
            <div>
              <h4>Lembretes de Treino</h4>
              <p className="text-sm text-gray-600">
                Receba notificações para não perder seus treinos
              </p>
            </div>
          </div>
          
          {permission === 'granted' ? (
            <button
              onClick={toggleNotifications}
              className={`btn-small ${isEnabled ? 'primary' : 'secondary'}`}
            >
              {isEnabled ? 'Ativado' : 'Desativado'}
            </button>
          ) : (
            <button
              onClick={requestPermission}
              className="btn-small primary"
            >
              Ativar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};