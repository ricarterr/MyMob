import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Contracts from './pages/Contracts';
import History from './pages/History';
import Automation from './pages/Automation';
import WhatsAppConnect from './pages/WhatsAppConnect';
import Settings from './pages/Settings';
import ManualSendModal from './components/ManualSendModal';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import './App.css';

export default function App() {
  // 1. Estado de Navegação e Layout
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedContractForManual, setSelectedContractForManual] = useState(null);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    const val = localStorage.getItem('mymob_theme');
    return val ? val : 'light';
  });

  // 2. Estados Globais Persistidos no LocalStorage
  const [isWhatsAppConnected, setIsWhatsAppConnected] = useState(() => {
    const val = localStorage.getItem('mymob_wa_connected');
    return val ? JSON.parse(val) : false;
  });

  const [settings, setSettings] = useState(() => {
    const val = localStorage.getItem('mymob_settings');
    if (val) return JSON.parse(val);
    // Configurações padrão iniciais
    return {
      agencyName: 'MyMob Imóveis',
      whatsappNumber: '(11) 99999-8888',
      logoUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100&auto=format&fit=crop&q=60',
      daysBefore: 3,
      daysAfter: 2,
      enableCobrarAntes: true,
      enableCobrarVencimento: true,
      enableCobrarAtraso: true,
      msgDefaultCobrarAntes: 'Olá *{inquilino}*, lembramos que seu aluguel no valor de *{valor}* vence em breve, no dia *{vencimento}*. Segue o link para pagamento: {link}',
      msgDefaultCobrarVencimento: 'Olá *{inquilino}*, seu aluguel no valor de *{valor}* vence hoje (*{vencimento}*). Evite multas pagando pelo link: {link}',
      msgDefaultAtraso: 'Olá *{inquilino}*, identificamos que seu aluguel no valor de *{valor}* com vencimento em *{vencimento}* está em atraso. Regularize agora pelo link: {link}',
      autoTime: '09:00',
    };
  });

  const [rawContracts, setRawContracts] = useState(() => {
    const val = localStorage.getItem('mymob_contracts');
    if (val) return JSON.parse(val);
    
    // Contratos padrão mockados
    return [
      { id: '1', tenantName: 'João da Silva', tenantPhone: '(11) 98765-4321', rentValue: 1800, dueDay: 15 },
      { id: '2', tenantName: 'Maria Oliveira', tenantPhone: '(11) 97654-3210', rentValue: 2500, dueDay: 5 },
      { id: '3', tenantName: 'Carlos Santos', tenantPhone: '(11) 96543-2109', rentValue: 1200, dueDay: 20 },
      { id: '4', tenantName: 'Roberto Souza', tenantPhone: '(11) 95432-1098', rentValue: 3000, dueDay: new Date().getDate() }, // Vencendo Hoje
      { id: '5', tenantName: 'Ana Pereira', tenantPhone: '(11) 94321-0987', rentValue: 2200, dueDay: new Date().getDate() + 2 }, // Vencendo em 2 dias
    ];
  });

  const [logs, setLogs] = useState(() => {
    const val = localStorage.getItem('mymob_logs');
    if (val) return JSON.parse(val);
    
    // Logs de histórico padrão
    const todayStr = new Date().toLocaleDateString('pt-BR');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString('pt-BR');

    return [
      { id: 'log1', tenantName: 'Maria Oliveira', phone: '(11) 97654-3210', message: 'Olá Maria Oliveira, identificamos que seu aluguel no valor de R$ 2.500,00 com vencimento em 05/' + (yesterday.getMonth() + 1) + '/2026 está em atraso. Regularize agora pelo link: https://mymob.com.br/fatura/2', date: yesterdayStr, time: '09:00', status: 'Enviado' },
      { id: 'log2', tenantName: 'João da Silva', phone: '(11) 98765-4321', message: 'Olá João da Silva, lembramos que seu aluguel no valor de R$ 1.800,00 vence em breve, no dia 15/' + (yesterday.getMonth() + 1) + '/2026. Segue o link para pagamento: https://mymob.com.br/fatura/1', date: todayStr, time: '09:02', status: 'Enviado' }
    ];
  });

  // 3. Estados de Notificação/Toast
  const [toastMsg, setToastMsg] = useState(null);
  const [toastType, setToastType] = useState('success');

  // 4. Estados do PWA (Instalação)
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  // Monitora alterações para persistir no LocalStorage
  useEffect(() => {
    localStorage.setItem('mymob_wa_connected', JSON.stringify(isWhatsAppConnected));
  }, [isWhatsAppConnected]);

  useEffect(() => {
    localStorage.setItem('mymob_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('mymob_contracts', JSON.stringify(rawContracts));
  }, [rawContracts]);

  useEffect(() => {
    localStorage.setItem('mymob_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('mymob_theme', theme);
  }, [theme]);

  // Hook para capturar prompt de instalação do PWA
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    
    // Registra o Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('Service Worker registrado!', reg.scope))
        .catch((err) => console.error('Falha ao registrar Service Worker', err));
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`Escolha do usuário sobre instalação: ${outcome}`);
    setDeferredPrompt(null);
    setShowInstallBtn(false);
  };

  // Exibe um toast temporário na tela
  const triggerToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  // 5. Cálculo Dinâmico dos Status dos Contratos baseados no Dia do Vencimento
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const computed = rawContracts.map((c) => {
      // Cria a data de vencimento correspondente ao mês atual
      const dueDate = new Date(currentYear, currentMonth, c.dueDay);
      
      let status = 'em-dia';
      
      if (dueDate.getTime() === today.getTime()) {
        status = 'vencendo'; // vence hoje
      } else if (dueDate < today) {
        status = 'atrasado'; // já passou
      } else {
        // Vencimento futuro: verifica se está dentro da régua de cobrança prévia
        const diffTime = Math.abs(dueDate - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= settings.daysBefore) {
          status = 'vencendo';
        }
      }

      return {
        ...c,
        status,
        dueDate: dueDate.toISOString()
      };
    });

    setContracts(computed);
  }, [rawContracts, settings]);

  // 6. Rotina de Automação de Cobranças (Gatilho "Enviar Cobranças")
  const handleTriggerBilling = () => {
    if (!isWhatsAppConnected) {
      triggerToast('Conecte o WhatsApp na tela de Conexão antes de disparar cobranças!', 'error');
      return;
    }

    const today = new Date();
    const todayStr = today.toLocaleDateString('pt-BR');
    const timeStr = today.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    let sentCount = 0;
    const newLogs = [];

    contracts.forEach((c) => {
      // Evita enviar duas cobranças no mesmo dia para o mesmo inquilino
      const alreadySentToday = logs.some(
        (l) => l.phone === c.tenantPhone && l.date === todayStr
      );
      if (alreadySentToday) return;

      let shouldSend = false;
      let msgTemplate = '';

      const rentFormatted = new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
      }).format(c.rentValue);
      const dateFormatted = new Date(c.dueDate).toLocaleDateString('pt-BR');

      // Verifica regras de gatilho habilitadas
      const dueDateObj = new Date(c.dueDate);
      dueDateObj.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (c.status === 'vencendo') {
        if (dueDateObj.getTime() === today.getTime() && settings.enableCobrarVencimento) {
          shouldSend = true;
          msgTemplate = settings.msgDefaultCobrarVencimento;
        } else if (dueDateObj > today && settings.enableCobrarAntes) {
          shouldSend = true;
          msgTemplate = settings.msgDefaultCobrarAntes;
        }
      } else if (c.status === 'atrasado' && settings.enableCobrarAtraso) {
        shouldSend = true;
        msgTemplate = settings.msgDefaultAtraso;
      }

      if (shouldSend && msgTemplate) {
        const link = `https://mymob.com.br/fatura/${c.id}`;
        const finalMsg = msgTemplate
          .replace(/{inquilino}/g, c.tenantName)
          .replace(/{valor}/g, rentFormatted)
          .replace(/{vencimento}/g, dateFormatted)
          .replace(/{link}/g, link);

        sentCount++;
        newLogs.push({
          id: `auto-${Date.now()}-${c.id}`,
          tenantName: c.tenantName,
          phone: c.tenantPhone,
          message: finalMsg,
          date: todayStr,
          time: timeStr,
          status: 'Enviado'
        });
      }
    });

    if (sentCount > 0) {
      setLogs((prev) => [...newLogs, ...prev]);
      triggerToast(`${sentCount} mensagem(ns) de cobrança enviada(s) com sucesso pelo WhatsApp!`, 'success');
    } else {
      triggerToast('Nenhuma cobrança pendente para envio automático hoje.', 'info');
    }
  };

  // 7. Funções de Ação das Telas
  const handleSaveContract = (contractData) => {
    setRawContracts((prev) => {
      const exists = prev.some((c) => c.id === contractData.id);
      if (exists) {
        return prev.map((c) => (c.id === contractData.id ? contractData : c));
      } else {
        return [contractData, ...prev];
      }
    });
    triggerToast('Contrato salvo com sucesso!');
  };

  const handleDeleteContract = (id) => {
    setRawContracts((prev) => prev.filter((c) => c.id !== id));
    triggerToast('Contrato removido com sucesso!');
  };

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    triggerToast('Configurações salvas!');
  };

  const handleResetDatabase = () => {
    localStorage.removeItem('mymob_wa_connected');
    localStorage.removeItem('mymob_settings');
    localStorage.removeItem('mymob_contracts');
    localStorage.removeItem('mymob_logs');
  };

  const handleClearHistory = () => {
    setLogs([]);
    triggerToast('Histórico limpo com sucesso!');
  };

  // Envio manual registrado vindo do modal
  const handleManualSendSuccess = (contract, msgText) => {
    const today = new Date();
    const todayStr = today.toLocaleDateString('pt-BR');
    const timeStr = today.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const newLog = {
      id: `manual-${Date.now()}`,
      tenantName: contract.tenantName,
      phone: contract.tenantPhone,
      message: msgText,
      date: todayStr,
      time: timeStr,
      status: 'Enviado'
    };

    setLogs((prev) => [newLog, ...prev]);
    triggerToast(`Cobrança para ${contract.tenantName} enviada e registrada no histórico!`);
  };

  const handleOpenManualSend = (contract) => {
    setSelectedContractForManual(contract);
    setIsManualModalOpen(true);
  };

  // 8. Renderização de Páginas Dinâmicas
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard 
            contracts={contracts} 
            logs={logs} 
            onTriggerBilling={handleTriggerBilling} 
            setCurrentPage={setCurrentPage}
            isWhatsAppConnected={isWhatsAppConnected}
          />
        );
      case 'contracts':
        return (
          <Contracts 
            contracts={contracts} 
            onSaveContract={handleSaveContract} 
            onDeleteContract={handleDeleteContract} 
            onTriggerManualSend={handleOpenManualSend}
          />
        );
      case 'history':
        return (
          <History 
            logs={logs} 
            onClearHistory={handleClearHistory} 
          />
        );
      case 'automation':
        return (
          <Automation 
            settings={settings} 
            onSaveSettings={handleSaveSettings} 
          />
        );
      case 'whatsapp':
        return (
          <WhatsAppConnect 
            isWhatsAppConnected={isWhatsAppConnected} 
            setIsWhatsAppConnected={setIsWhatsAppConnected} 
            settings={settings}
            onSaveSettings={handleSaveSettings}
          />
        );
      case 'settings':
        return (
          <Settings 
            settings={settings} 
            onSaveSettings={handleSaveSettings} 
            onResetDatabase={handleResetDatabase}
            theme={theme}
            setTheme={setTheme}
          />
        );
      default:
        return <Dashboard contracts={contracts} logs={logs} onTriggerBilling={handleTriggerBilling} setCurrentPage={setCurrentPage} isWhatsAppConnected={isWhatsAppConnected} />;
    }
  };

  return (
    <div className={`app-layout ${theme}`}>
      {/* Sidebar de Navegação */}
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        showInstallBtn={showInstallBtn}
        handleInstallClick={handleInstallClick}
      />

      <div className="main-wrapper">
        {/* Barra Superior */}
        <Navbar 
          currentPage={currentPage} 
          setSidebarOpen={setSidebarOpen} 
          settings={settings}
          isWhatsAppConnected={isWhatsAppConnected}
        />

        {/* Container da Página Atual */}
        <main className="page-container">
          {renderPage()}
        </main>
      </div>

      {/* Modal de Envio Manual */}
      <ManualSendModal 
        isOpen={isManualModalOpen} 
        onClose={() => setIsManualModalOpen(false)} 
        contract={selectedContractForManual} 
        settings={settings} 
        onSendSuccess={handleManualSendSuccess}
      />

      {/* Banner de Notificações Toast Flutuante */}
      {toastMsg && (
        <div className={`toast-alert animate-fade-in ${toastType}`}>
          {toastType === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{toastMsg}</span>
        </div>
      )}

      <style jsx="true">{`
        .toast-alert {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: #0f172a;
          color: white;
          padding: 12px 20px;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 1100;
          font-size: 13.5px;
          font-weight: 500;
          border: 1px solid #1e293b;
        }

        .toast-alert.error {
          border-color: var(--danger-border);
          background: var(--danger-bg);
          color: var(--danger);
        }

        .toast-alert.info {
          border-color: var(--primary-border);
          background: var(--primary-light);
          color: var(--primary);
        }

        .toast-alert.success {
          border-color: var(--success-border);
          background: var(--success-bg);
          color: #047857;
        }
      `}</style>
    </div>
  );
}
