import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Smartphone, 
  RefreshCw, 
  Loader2, 
  Laptop,
  HelpCircle 
} from 'lucide-react';

export default function WhatsAppConnect({ 
  isWhatsAppConnected, 
  setIsWhatsAppConnected, 
  settings, 
  onSaveSettings 
}) {
  const [connecting, setConnecting] = useState(false);
  const [qrCodeExpired, setQrCodeExpired] = useState(false);
  const [countdown, setCountdown] = useState(60);

  // Temporizador para simular expiração do QR Code se desconectado
  useEffect(() => {
    let timer;
    if (!isWhatsAppConnected && !connecting && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setQrCodeExpired(true);
    }
    return () => clearInterval(timer);
  }, [isWhatsAppConnected, connecting, countdown]);

  const handleSimulateScan = () => {
    setConnecting(true);
    setQrCodeExpired(false);
    
    // Simula a leitura e autenticação de rede de 3 segundos
    setTimeout(() => {
      setConnecting(false);
      setIsWhatsAppConnected(true);
      // Salva nas configurações o número conectado padrão se estiver vazio
      if (!settings.whatsappNumber) {
        onSaveSettings({
          ...settings,
          whatsappNumber: '(11) 99999-8888'
        });
      }
    }, 3000);
  };

  const handleDisconnect = () => {
    if (confirm('Deseja realmente desconectar o WhatsApp do sistema? As automações automáticas serão interrompidas.')) {
      setIsWhatsAppConnected(false);
      setCountdown(60);
      setQrCodeExpired(false);
    }
  };

  const handleRefreshQr = () => {
    setCountdown(60);
    setQrCodeExpired(false);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Header */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Integração do Aparelho</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Conecte o seu celular via WhatsApp Web para que o sistema possa realizar os envios automaticamente.
        </p>
      </div>

      <div className="connect-grid">
        
        {/* Lado Esquerdo: Área do QR Code / Status */}
        <div className="card text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', minHeight: '400px' }}>
          {isWhatsAppConnected ? (
            // Interface de Status Conectado
            <div className="connected-state animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div className="success-icon-bg">
                <CheckCircle2 size={48} className="success-icon" />
              </div>
              <div>
                <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--success)' }}>WhatsApp Conectado</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  O sistema está pronto para enviar cobranças automáticas.
                </p>
              </div>

              {/* Informações da Sessão */}
              <div className="session-details">
                <div className="detail-row">
                  <Smartphone size={16} />
                  <span>Número Conectado: <strong>{settings.whatsappNumber || '(11) 99999-8888'}</strong></span>
                </div>
                <div className="detail-row">
                  <Laptop size={16} />
                  <span>Sessão: <strong>MyMob Server (Chrome/Windows)</strong></span>
                </div>
                <div className="detail-row">
                  <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />
                  <span>Status do Serviço: <strong style={{ color: 'var(--success)' }}>Ativo e Operando</strong></span>
                </div>
              </div>

              <button className="btn btn-danger" onClick={handleDisconnect} style={{ marginTop: '12px' }}>
                Desconectar Aparelho
              </button>
            </div>
          ) : (
            // Interface de QR Code / Conexão Pendente
            <div className="disconnected-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              
              {connecting ? (
                // Animação de Carregamento da Conexão
                <div className="connecting-loader animate-fade-in" style={{ padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <Loader2 size={48} className="animate-spin text-primary" />
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 600 }}>Autenticando Sessão...</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Por favor, aguarde enquanto validamos o token do dispositivo.
                    </p>
                  </div>
                </div>
              ) : qrCodeExpired ? (
                // QR Code Expirado
                <div className="qr-expired animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '32px 0' }}>
                  <div className="expired-box">
                    <RefreshCw size={24} style={{ color: 'var(--text-muted)' }} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 600 }}>O QR Code expirou</h4>
                    <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '240px', margin: '4px auto 0 auto' }}>
                      Por motivos de segurança, o código de conexão expira a cada 1 minuto.
                    </p>
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={handleRefreshQr}>
                    Gerar Novo QR Code
                  </button>
                </div>
              ) : (
                // QR Code Disponível para Leitura
                <div className="qr-active animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%' }}>
                  
                  {/* Bloco do QR Code Simulado com Scanner Laser */}
                  <div className="qr-code-wrapper">
                    {/* SVG do QR Code Mockado */}
                    <svg viewBox="0 0 200 200" width="180" height="180">
                      {/* Quadrados de Canto (Padrão QR Code) */}
                      <rect x="10" y="10" width="40" height="40" stroke="#0f172a" strokeWidth="8" fill="none" />
                      <rect x="20" y="20" width="20" height="20" fill="#0f172a" />

                      <rect x="150" y="10" width="40" height="40" stroke="#0f172a" strokeWidth="8" fill="none" />
                      <rect x="160" y="20" width="20" height="20" fill="#0f172a" />

                      <rect x="10" y="150" width="40" height="40" stroke="#0f172a" strokeWidth="8" fill="none" />
                      <rect x="20" y="160" width="20" height="20" fill="#0f172a" />
                      
                      {/* Pontos aleatórios no meio (simulando dados) */}
                      <path d="M 60 20 h 20 v 10 h -20 z M 90 10 h 10 v 30 h -10 z M 110 30 h 20 v 10 h -20 z M 60 50 h 40 v 10 h -40 z M 110 50 h 10 v 20 h -10 z" fill="#3b82f6" />
                      <path d="M 10 60 h 20 v 20 h -20 z M 40 70 h 30 v 10 h -30 z M 90 80 h 20 v 20 h -20 z M 130 70 h 10 v 40 h -10 z M 160 60 h 20 v 30 h -20 z" fill="#0f172a" />
                      <path d="M 60 100 h 20 v 20 h -20 z M 90 120 h 30 v 10 h -30 z M 10 130 h 30 v 10 h -30 z M 140 120 h 40 v 20 h -40 z" fill="#0f172a" />
                      <path d="M 60 150 h 10 v 40 h -10 z M 80 170 h 30 v 10 h -30 z M 120 150 h 20 v 20 h -20 z M 150 160 h 10 v 30 h -10 z" fill="#3b82f6" />

                      {/* Logo Central (MyMob) */}
                      <rect x="85" y="85" width="30" height="30" rx="6" fill="#2563eb" />
                      <path d="M 92 102 L 97 97 L 108 102" stroke="white" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    
                    {/* Linha do Scanner de Laser Verde */}
                    <div className="laser-scanner" />
                  </div>

                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
                    O código expira em <strong style={{ color: 'var(--primary)' }}>{countdown}s</strong>
                  </span>

                  {/* Ação para simular o escaneamento na tela */}
                  <button className="btn btn-primary" onClick={handleSimulateScan} style={{ width: '100%', maxWidth: '240px' }}>
                    Simular Escaneamento
                  </button>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Lado Direito: Instruções */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <HelpCircle className="text-primary" size={20} />
            <h4 style={{ fontSize: '15px', fontWeight: 600 }}>Como Conectar seu Aparelho</h4>
          </div>

          <div className="steps-list">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-desc">
                <span className="step-title">Abra o WhatsApp</span>
                <p>Abra o WhatsApp no seu smartphone Android ou iPhone.</p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-desc">
                <span className="step-title">Acesse as Configurações</span>
                <p>Toque em <strong>Menu (três pontinhos)</strong> no Android ou <strong>Configurações</strong> no iOS e selecione <strong>Dispositivos Conectados</strong>.</p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-desc">
                <span className="step-title">Conecte um Dispositivo</span>
                <p>Clique no botão <strong>Conectar um Dispositivo</strong>. Se necessário, autentique com biometria ou senha.</p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">4</div>
              <div className="step-desc">
                <span className="step-title">Aponte a Câmera</span>
                <p>Aponte a câmera do seu celular para o QR Code gerado ao lado para autenticar instantaneamente.</p>
              </div>
            </div>
          </div>

          {/* Dica importante */}
          <div style={{
            background: 'var(--primary-light)',
            border: '1px solid var(--primary-light-hover)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            display: 'flex',
            gap: '10px',
            alignItems: 'flex-start',
            marginTop: '8px'
          }}>
            <AlertCircle size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              <strong>Dica de Uso:</strong> Mantenha seu celular conectado à internet para garantir a entrega imediata das mensagens de cobrança agendadas.
            </p>
          </div>
        </div>

      </div>

      <style jsx="true">{`
        .connect-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 24px;
        }

        @media (max-width: 768px) {
          .connect-grid {
            grid-template-columns: 1fr;
          }
        }

        .success-icon-bg {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: var(--success-bg);
          border: 1px solid var(--success-border);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .success-icon {
          color: var(--success);
        }

        .session-details {
          width: 100%;
          max-width: 340px;
          background: var(--bg-app);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          text-align: left;
          font-size: 13px;
        }

        .detail-row {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--text-main);
        }

        .detail-row svg {
          color: var(--text-muted);
          flex-shrink: 0;
        }

        /* Animação QR Code */
        .qr-code-wrapper {
          position: relative;
          background: white;
          padding: 12px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-sm);
          width: 204px;
          height: 204px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        @keyframes scan {
          0% { top: 0px; }
          50% { top: 195px; }
          100% { top: 0px; }
        }

        .laser-scanner {
          position: absolute;
          left: 0;
          right: 0;
          height: 3px;
          background: #10b981;
          box-shadow: 0 0 10px #10b981, 0 0 20px #10b981;
          animation: scan 3s infinite linear;
          pointer-events: none;
        }

        .expired-box {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: var(--bg-app);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-color);
        }

        /* Lista de Passos */
        .steps-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .step-item {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .step-number {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 13px;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .step-desc {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .step-title {
          font-weight: 600;
          font-size: 13.5px;
          color: var(--text-main);
        }

        .step-desc p {
          font-size: 12px;
          color: var(--text-muted);
          line-height: 1.4;
        }
      `}</style>

    </div>
  );
}
