import React from 'react';
import { Menu } from 'lucide-react';

export default function Navbar({ 
  currentPage, 
  setSidebarOpen, 
  settings, 
  isWhatsAppConnected 
}) {
  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard': return 'Visão Geral';
      case 'contracts': return 'Gestão de Contratos';
      case 'history': return 'Histórico de Cobranças';
      case 'automation': return 'Regras de Automação';
      case 'whatsapp': return 'Conexão WhatsApp';
      case 'settings': return 'Configurações do Sistema';
      default: return 'MyMob';
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="mobile-toggle" onClick={() => setSidebarOpen(true)}>
          <Menu size={24} />
        </button>
        <h2 className="navbar-title">{getPageTitle()}</h2>
      </div>

      <div className="navbar-right">
        {/* Badge de Conectividade WhatsApp */}
        <div className="conn-status-badge">
          <span className={`conn-dot ${isWhatsAppConnected ? 'connected' : 'disconnected'}`} />
          <span style={{fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)'}}>
            {isWhatsAppConnected ? 'WhatsApp Conectado' : 'WhatsApp Desconectado'}
          </span>
        </div>

        {/* Perfil da Imobiliária */}
        <div className="agency-profile-nav">
          <img 
            src={settings.logoUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'} 
            alt="Logo Imobiliária" 
            className="agency-logo-nav" 
            onError={(e) => {
              // fallback em caso de erro na URL
              e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3';
            }}
          />
          <div className="agency-info-nav">
            <span className="agency-name-nav text-truncate" style={{maxWidth: '120px'}}>
              {settings.agencyName || 'Minha Imobiliária'}
            </span>
            <span className="agency-role-nav">Administrador</span>
          </div>
        </div>
      </div>
    </header>
  );
}
