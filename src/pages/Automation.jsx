import React, { useState } from 'react';
import { 
  Bell, 
  Settings2, 
  HelpCircle, 
  Save, 
  Calendar, 
  Clock, 
  MessageSquare,
  Sparkles
} from 'lucide-react';

export default function Automation({ settings, onSaveSettings }) {
  // Estados locais para controlar campos
  const [enableCobrarAntes, setEnableCobrarAntes] = useState(settings.enableCobrarAntes ?? true);
  const [daysBefore, setDaysBefore] = useState(settings.daysBefore ?? 3);
  const [msgDefaultCobrarAntes, setMsgDefaultCobrarAntes] = useState(settings.msgDefaultCobrarAntes ?? '');

  const [enableCobrarVencimento, setEnableCobrarVencimento] = useState(settings.enableCobrarVencimento ?? true);
  const [msgDefaultCobrarVencimento, setMsgDefaultCobrarVencimento] = useState(settings.msgDefaultCobrarVencimento ?? '');

  const [enableCobrarAtraso, setEnableCobrarAtraso] = useState(settings.enableCobrarAtraso ?? true);
  const [daysAfter, setDaysAfter] = useState(settings.daysAfter ?? 2);
  const [msgDefaultAtraso, setMsgDefaultAtraso] = useState(settings.msgDefaultAtraso ?? '');

  const [autoTime, setAutoTime] = useState(settings.autoTime ?? '09:00');
  
  const [activeTab, setActiveTab] = useState('antes'); // tabs para mensagens

  const handleSave = (e) => {
    e.preventDefault();
    const updatedSettings = {
      ...settings,
      enableCobrarAntes,
      daysBefore: parseInt(daysBefore),
      msgDefaultCobrarAntes,
      enableCobrarVencimento,
      msgDefaultCobrarVencimento,
      enableCobrarAtraso,
      daysAfter: parseInt(daysAfter),
      msgDefaultAtraso,
      autoTime,
    };
    onSaveSettings(updatedSettings);
    alert('Configurações de automação salvas com sucesso!');
  };

  return (
    <form onSubmit={handleSave} className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Automação e Réguas de Comunicação</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Configure as datas e os modelos de mensagens disparados pelo sistema.</p>
        </div>
        <button type="submit" className="btn btn-primary">
          <Save size={16} />
          Salvar Regras
        </button>
      </div>

      <div className="automation-grid">
        
        {/* Lado Esquerdo: Réguas e Gatilhos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <Settings2 className="text-primary" size={20} />
              <h4 style={{ fontSize: '15px', fontWeight: 600 }}>Gatilhos de Disparo</h4>
            </div>

            {/* Regra 1: Antes do Vencimento */}
            <div className="trigger-row">
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 600, fontSize: '14px' }}>Cobrar antes do vencimento</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Envia um aviso prévio para preparar o inquilino.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {enableCobrarAntes && (
                  <select 
                    className="form-control" 
                    value={daysBefore} 
                    onChange={(e) => setDaysBefore(e.target.value)}
                    style={{ width: '100px', padding: '6px 10px', height: '34px' }}
                  >
                    <option value="1">1 dia</option>
                    <option value="2">2 dias</option>
                    <option value="3">3 dias</option>
                    <option value="5">5 dias</option>
                    <option value="7">7 dias</option>
                  </select>
                )}
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={enableCobrarAntes} 
                    onChange={(e) => setEnableCobrarAntes(e.target.checked)} 
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            {/* Regra 2: No Vencimento */}
            <div className="trigger-row" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 600, fontSize: '14px' }}>Cobrar no dia do vencimento</span>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Notifica o inquilino na data limite de pagamento.
                </p>
              </div>
              <div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={enableCobrarVencimento} 
                    onChange={(e) => setEnableCobrarVencimento(e.target.checked)} 
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            {/* Regra 3: Após Vencimento (Atraso) */}
            <div className="trigger-row" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 600, fontSize: '14px' }}>Cobrar após atraso</span>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Lembrete de cobrança após constatar inadimplência.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {enableCobrarAtraso && (
                  <select 
                    className="form-control" 
                    value={daysAfter} 
                    onChange={(e) => setDaysAfter(e.target.value)}
                    style={{ width: '100px', padding: '6px 10px', height: '34px' }}
                  >
                    <option value="1">1 dia</option>
                    <option value="2">2 dias</option>
                    <option value="3">3 dias</option>
                    <option value="5">5 dias</option>
                    <option value="10">10 dias</option>
                  </select>
                )}
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={enableCobrarAtraso} 
                    onChange={(e) => setEnableCobrarAtraso(e.target.checked)} 
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Horários Automáticos */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
              <Clock className="text-primary" size={20} />
              <h4 style={{ fontSize: '15px', fontWeight: 600 }}>Horário de Envio Automático</h4>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>Horário preferencial para envio automático das mensagens</span>
              </div>
              <input 
                type="time" 
                className="form-control" 
                value={autoTime} 
                onChange={(e) => setAutoTime(e.target.value)}
                style={{ width: '120px' }} 
              />
            </div>
          </div>

        </div>

        {/* Lado Direito: Editor de Templates */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <MessageSquare className="text-primary" size={20} />
            <h4 style={{ fontSize: '15px', fontWeight: 600 }}>Modelos de Mensagem (WhatsApp)</h4>
          </div>

          {/* Abas para alternar os templates */}
          <div className="msg-tabs">
            <button 
              type="button" 
              className={`msg-tab-btn ${activeTab === 'antes' ? 'active' : ''}`}
              onClick={() => setActiveTab('antes')}
            >
              Pré-vencimento
            </button>
            <button 
              type="button" 
              className={`msg-tab-btn ${activeTab === 'vencimento' ? 'active' : ''}`}
              onClick={() => setActiveTab('vencimento')}
            >
              Vencimento
            </button>
            <button 
              type="button" 
              className={`msg-tab-btn ${activeTab === 'atraso' ? 'active' : ''}`}
              onClick={() => setActiveTab('atraso')}
            >
              Atrasados
            </button>
          </div>

          {/* Área de Textarea */}
          <div className="msg-editor-box">
            {activeTab === 'antes' && (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <textarea 
                  rows={8}
                  className="form-control"
                  value={msgDefaultCobrarAntes}
                  onChange={(e) => setMsgDefaultCobrarAntes(e.target.value)}
                  placeholder="Escreva a mensagem enviada antes do vencimento..."
                  style={{ resize: 'none', fontSize: '13.5px' }}
                />
              </div>
            )}

            {activeTab === 'vencimento' && (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <textarea 
                  rows={8}
                  className="form-control"
                  value={msgDefaultCobrarVencimento}
                  onChange={(e) => setMsgDefaultCobrarVencimento(e.target.value)}
                  placeholder="Escreva a mensagem enviada no dia do vencimento..."
                  style={{ resize: 'none', fontSize: '13.5px' }}
                />
              </div>
            )}

            {activeTab === 'atraso' && (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <textarea 
                  rows={8}
                  className="form-control"
                  value={msgDefaultAtraso}
                  onChange={(e) => setMsgDefaultAtraso(e.target.value)}
                  placeholder="Escreva a mensagem de cobrança de aluguéis em atraso..."
                  style={{ resize: 'none', fontSize: '13.5px' }}
                />
              </div>
            )}
          </div>

          {/* Guia de Variáveis */}
          <div className="variables-guide">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Sparkles size={14} style={{ color: 'var(--primary)' }} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)' }}>Variáveis de Automação</span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Utilize as tags abaixo para personalizar dinamicamente o texto de cada inquilino:
            </p>
            <div className="variables-list">
              <div className="var-item"><code>{`{inquilino}`}</code> <span>Nome do inquilino</span></div>
              <div className="var-item"><code>{`{valor}`}</code> <span>Valor aluguel (R$)</span></div>
              <div className="var-item"><code>{`{vencimento}`}</code> <span>Data de vencimento</span></div>
              <div className="var-item"><code>{`{link}`}</code> <span>Link para boleto/fatura</span></div>
            </div>
          </div>

        </div>

      </div>

      <style jsx="true">{`
        .automation-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 24px;
        }

        @media (max-width: 900px) {
          .automation-grid {
            grid-template-columns: 1fr;
          }
        }

        .trigger-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .msg-tabs {
          display: flex;
          border-bottom: 1px solid var(--border-color);
          gap: 16px;
        }

        .msg-tab-btn {
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          padding: 8px 4px;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-muted);
          cursor: pointer;
          transition: var(--transition);
        }

        .msg-tab-btn:hover, .msg-tab-btn.active {
          color: var(--primary);
          border-bottom-color: var(--primary);
        }

        .variables-guide {
          background: var(--bg-app);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 12px 16px;
        }

        .variables-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .var-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .var-item code {
          font-family: monospace;
          background: #e2e8f0;
          color: #1e293b;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 11px;
          width: fit-content;
        }

        .var-item span {
          font-size: 10px;
          color: var(--text-muted);
        }
      `}</style>

    </form>
  );
}
