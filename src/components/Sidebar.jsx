import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  History, 
  Cpu, 
  Smartphone, 
  Settings as SettingsIcon, 
  Download,
  X 
} from 'lucide-react';

export default function Sidebar({ 
  currentPage, 
  setCurrentPage, 
  isOpen, 
  setIsOpen, 
  showInstallBtn, 
  handleInstallClick 
}) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'contracts', label: 'Contratos', icon: FileText },
    { id: 'history', label: 'Histórico de Envios', icon: History },
    { id: 'automation', label: 'Automação', icon: Cpu },
    { id: 'whatsapp', label: 'Conexão WhatsApp', icon: Smartphone },
    { id: 'settings', label: 'Configurações', icon: SettingsIcon },
  ];

  const handleNavClick = (pageId) => {
    setCurrentPage(pageId);
    setIsOpen(false); // fecha a sidebar no mobile
  };

  return (
    <>
      {/* Overlay para mobile */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'mobile-open' : ''}`} 
        onClick={() => setIsOpen(false)}
      />

      <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          {/* SVG inline correspondente ao logo do app */}
          <svg className="sidebar-logo-img" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width: '32px', height: '32px'}}>
            <rect width="512" height="512" rx="112" fill="#2563eb"/>
            <path d="M 160 270 L 252 180 L 344 270" stroke="white" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M 190 260 L 190 340 A 10 10 0 0 0 200 350 L 304 350 A 10 10 0 0 0 314 340 L 314 260" stroke="white" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="340" cy="180" r="34" fill="#10b981" stroke="white" strokeWidth="12"/>
          </svg>
          <span className="sidebar-logo-text">MyMob</span>
          <button 
            className="mobile-toggle" 
            style={{marginLeft: 'auto', display: isOpen ? 'block' : 'none'}} 
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`sidebar-link ${currentPage === item.id ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {showInstallBtn && (
          <div className="sidebar-footer">
            <div className="pwa-install-banner">
              <div className="pwa-install-title">Aplicativo Instalável</div>
              <div className="pwa-install-desc">Instale o MyMob no celular para acesso offline rápido.</div>
              <button className="btn btn-primary btn-sm" style={{width: '100%'}} onClick={handleInstallClick}>
                <Download size={14} />
                Instalar App
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
