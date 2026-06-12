import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  Phone, 
  Image as ImageIcon, 
  Save, 
  HelpCircle, 
  Trash2,
  Lock,
  ExternalLink,
  Sun,
  Moon
} from 'lucide-react';

export default function Settings({ settings, onSaveSettings, onResetDatabase, theme, setTheme }) {
  const [agencyName, setAgencyName] = useState(settings.agencyName ?? 'MyMob Imóveis');
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber ?? '(11) 99999-8888');
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl ?? 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3');

  // Opções de logos pré-definidos para teste rápido de branding
  const sampleLogos = [
    { name: 'Corporativo Clássico', url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100&auto=format&fit=crop&q=60' },
    { name: 'Moderno Azul', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=60' },
    { name: 'Minimalista Elegante', url: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=100&auto=format&fit=crop&q=60' }
  ];

  const handleSave = (e) => {
    e.preventDefault();
    if (!agencyName || !whatsappNumber) {
      alert('Nome da Imobiliária e número do WhatsApp são obrigatórios.');
      return;
    }

    const updatedSettings = {
      ...settings,
      agencyName,
      whatsappNumber,
      logoUrl
    };

    onSaveSettings(updatedSettings);
    alert('Configurações da empresa salvas com sucesso!');
  };

  const handleReset = () => {
    if (confirm('ATENÇÃO: Isso irá redefinir todos os dados, contratos cadastrados e históricos de volta para a simulação padrão. Deseja continuar?')) {
      onResetDatabase();
      alert('Banco de dados redefinido com sucesso!');
      window.location.reload();
    }
  };

  return (
    <form onSubmit={handleSave} className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Informações Gerais</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Defina o perfil da imobiliária e as identidades visuais do sistema.</p>
        </div>
        <button type="submit" className="btn btn-primary">
          <Save size={16} />
          Salvar Alterações
        </button>
      </div>

      <div className="settings-grid">
        
        {/* Lado Esquerdo: Perfil da Imobiliária */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <Building2 className="text-primary" size={20} />
            <h4 style={{ fontSize: '15px', fontWeight: 600 }}>Perfil Institucional</h4>
          </div>

          {/* Nome da Imobiliária */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              Nome da Imobiliária
            </label>
            <input 
              type="text" 
              className="form-control" 
              value={agencyName} 
              onChange={(e) => setAgencyName(e.target.value)} 
              placeholder="Ex: MyMob Imobiliária Ltda"
              required 
            />
          </div>

          {/* Telefone / WhatsApp de Suporte */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              WhatsApp do Remetente
            </label>
            <input 
              type="text" 
              className="form-control" 
              value={whatsappNumber} 
              onChange={(e) => setWhatsappNumber(e.target.value)} 
              placeholder="Ex: (11) 99999-8888"
              required 
            />
          </div>

          {/* URL da Logo */}
          <div className="form-group" style={{ marginBottom: '8px' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              URL da Logomarca (PNG/JPG)
            </label>
            <input 
              type="url" 
              className="form-control" 
              value={logoUrl} 
              onChange={(e) => setLogoUrl(e.target.value)} 
              placeholder="Cole o link da sua logomarca"
            />
          </div>

          {/* Selecionar Logos de Amostra */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>
              Ou escolha uma imagem corporativa padrão:
            </span>
            <div className="sample-logos-container">
              {sampleLogos.map((logo, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => setLogoUrl(logo.url)}
                  className={`sample-logo-btn ${logoUrl === logo.url ? 'active' : ''}`}
                >
                  <img src={logo.url} alt={logo.name} className="sample-logo-img" />
                  <span className="sample-logo-name text-truncate">{logo.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lado Direito: Informações da Conta & Redefinição */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Tema do Sistema */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <Sun className="text-primary" size={20} />
              <h4 style={{ fontSize: '15px', fontWeight: 600 }}>Tema do Sistema</h4>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                type="button"
                className={`theme-select-btn ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setTheme('light')}
              >
                <Sun size={20} />
                <span>Claro</span>
              </button>
              <button
                type="button"
                className={`theme-select-btn ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setTheme('dark')}
              >
                <Moon size={20} />
                <span>Escuro</span>
              </button>
            </div>
          </div>

          {/* Informações da Licença */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <Lock className="text-primary" size={20} />
              <h4 style={{ fontSize: '15px', fontWeight: 600 }}>Plano e Licença</h4>
            </div>

            <div className="license-info-box">
              <div className="license-status-row">
                <span className="license-status-label">Status do Plano</span>
                <span className="badge em-dia" style={{ fontSize: '11px' }}>MyMob - Ativo</span>
              </div>
              <div className="license-status-row">
                <span className="license-status-label">Cobranças Automáticas</span>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>Ilimitadas</span>
              </div>
              <div className="license-status-row">
                <span className="license-status-label">Renovação</span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>12 / Dez / 2026</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--primary)', cursor: 'pointer', fontWeight: 500, marginTop: '4px' }}>
              Gerenciar assinatura <ExternalLink size={12} />
            </div>
          </div>

          {/* Redefinição de Banco de Dados */}
          <div className="card" style={{ borderColor: 'var(--danger-border)', background: 'var(--danger-bg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <Trash2 className="text-danger" size={20} />
              <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--danger)' }}>Área de Perigo</h4>
            </div>
            
            <p style={{ fontSize: '12.5px', color: '#7f1d1d', lineHeight: '1.4', marginBottom: '16px' }}>
              Deseja redefinir todo o sistema? Essa ação apagará todos os novos contratos e logs adicionados, voltando a base de dados para o estado de demonstração original.
            </p>
            
            <button type="button" className="btn btn-danger" style={{ width: '100%' }} onClick={handleReset}>
              Redefinir Banco de Dados
            </button>
          </div>

        </div>

      </div>

      <style jsx="true">{`
        .settings-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 24px;
        }

        @media (max-width: 900px) {
          .settings-grid {
            grid-template-columns: 1fr;
          }
        }

        .sample-logos-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .sample-logo-btn {
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          background: var(--bg-card);
          padding: 8px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          transition: var(--transition);
        }

        .sample-logo-btn:hover, .sample-logo-btn.active {
          border-color: var(--primary);
          background: var(--primary-light);
        }

        .sample-logo-img {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid var(--border-color);
        }

        .sample-logo-name {
          font-size: 10px;
          font-weight: 500;
          color: var(--text-muted);
          width: 100%;
          text-align: center;
        }

        .license-info-box {
          background: var(--bg-app);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .license-status-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .license-status-label {
          font-size: 13px;
          color: var(--text-muted);
        }

        .theme-select-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          background: var(--bg-card);
          color: var(--text-muted);
          font-weight: 600;
          font-size: 13.5px;
          cursor: pointer;
          transition: var(--transition);
        }

        .theme-select-btn:hover {
          border-color: var(--text-muted);
          color: var(--text-main);
        }

        .theme-select-btn.active {
          border-color: var(--primary);
          background: var(--primary-light);
          color: var(--primary);
        }
      `}</style>

    </form>
  );
}
