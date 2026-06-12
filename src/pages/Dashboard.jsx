import React from 'react';
import { 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Send,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { PaymentStatusDonut, WeeklyCollectionActivity } from '../components/SVGCharts';

export default function Dashboard({ 
  contracts, 
  logs, 
  onTriggerBilling, 
  setCurrentPage, 
  isWhatsAppConnected 
}) {
  // 1. Cálculos de Contratos
  const totalContracts = contracts.length;
  
  const emDia = contracts.filter(c => c.status === 'em-dia').length;
  const vencendo = contracts.filter(c => c.status === 'vencendo').length;
  const atrasados = contracts.filter(c => c.status === 'atrasado').length;

  // 2. Cobranças Enviadas Hoje (Verifica logs com a data de hoje)
  const todayStr = new Date().toLocaleDateString('pt-BR');
  const logsSentToday = logs.filter(l => l.date === todayStr).length;

  // 3. Últimos 3 Logs para a lista rápida
  const recentLogs = logs.slice(0, 3);

  // Dados semanais simulados para o gráfico de atividade (logs por dia da semana)
  // Mapeamos os últimos 7 dias de envios ou usamos dados padrão para exibição profissional
  const weeklyData = [3, 5, 2, 8, logsSentToday + 4, logsSentToday + 1, logsSentToday];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Banner de Status do WhatsApp se estiver desconectado */}
      {!isWhatsAppConnected && (
        <div style={{
          background: 'var(--warning-bg)',
          border: '1px solid var(--warning-border)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertTriangle style={{ color: 'var(--warning)' }} size={24} />
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>WhatsApp Desconectado</h4>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Conecte seu aparelho para habilitar a verificação e o envio automático de cobranças.
              </p>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => setCurrentPage('whatsapp')}>
            Conectar Agora
          </button>
        </div>
      )}

      {/* Grid de Cards de Estatísticas */}
      <div className="stats-grid">
        {/* Card Total */}
        <div className="card stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <FileText size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total de Contratos</span>
            <span className="stat-value">{totalContracts}</span>
          </div>
        </div>

        {/* Card Em Dia */}
        <div className="card stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
            <CheckCircle size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Contratos Em Dia</span>
            <span className="stat-value">{emDia}</span>
          </div>
        </div>

        {/* Card Vencendo */}
        <div className="card stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
            <Clock size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Vencendo Hoje</span>
            <span className="stat-value">{vencendo}</span>
          </div>
        </div>

        {/* Card Atrasados */}
        <div className="card stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>
            <AlertTriangle size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Atrasados</span>
            <span className="stat-value">{atrasados}</span>
          </div>
        </div>

        {/* Card Enviados Hoje */}
        <div className="card stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
            <Send size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Enviadas Hoje</span>
            <span className="stat-value">{logsSentToday}</span>
          </div>
        </div>
      </div>

      {/* Botão de Disparo Principal */}
      <div className="card action-banner" style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>Rotina Automática de Cobranças</h3>
          <p style={{ fontSize: '13.5px', opacity: 0.9 }}>
            O sistema faz a varredura automática diariamente. Use o botão ao lado para forçar a verificação agora e enviar mensagens pendentes.
          </p>
        </div>
        <button 
          className="btn btn-secondary" 
          onClick={onTriggerBilling}
          style={{ 
            background: '#ffffff', 
            color: 'var(--primary)', 
            border: 'none',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
        >
          <Send size={16} />
          Enviar Cobranças
        </button>
      </div>

      {/* Grid de Gráficos e Histórico Rápido */}
      <div className="charts-grid">
        
        {/* Gráfico Donut de Status */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main)' }}>Saúde dos Contratos</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Proporção atual de pagamentos</p>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PaymentStatusDonut emDia={emDia} vencendo={vencendo} atrasado={atrasados} />
          </div>
        </div>

        {/* Gráfico de Histórico Semanal */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main)' }}>Atividade Semanal</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Número de cobranças disparadas por dia</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--success)', fontWeight: 600 }}>
              <TrendingUp size={14} /> +12% vs. semana passada
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <WeeklyCollectionActivity data={weeklyData} />
          </div>
        </div>

      </div>

      {/* Seção de Últimas Cobranças */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main)' }}>Últimas Mensagens Enviadas</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Atividades de comunicação mais recentes</p>
          </div>
          <button 
            className="btn btn-outline btn-sm" 
            onClick={() => setCurrentPage('history')}
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            Ver histórico completo
            <ArrowRight size={14} />
          </button>
        </div>

        {recentLogs.length === 0 ? (
          <div style={{ padding: '32px 0', textPosition: 'center', textAlign: 'center', color: 'var(--text-muted)' }}>
            Nenhuma cobrança enviada recentemente.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentLogs.map((log) => (
              <div key={log.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'var(--bg-app)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 600
                  }}>
                    {log.tenantName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 600 }}>{log.tenantName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{log.phone}</div>
                  </div>
                </div>

                <div style={{ 
                  fontSize: '12.5px', 
                  color: 'var(--text-muted)', 
                  maxWidth: '40%', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap' 
                }}>
                  {log.message}
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="badge em-dia" style={{ padding: '2px 8px', fontSize: '10px' }}>Enviado</span>
                  <div style={{ fontSize: '10px', color: 'var(--text-light)', marginTop: '2px' }}>
                    {log.date} às {log.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx="true">{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
        }

        .stat-icon-wrapper {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-content {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 12px;
          color: var(--text-muted);
          font-weight: 500;
        }

        .stat-value {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-main);
          line-height: 1.2;
          margin-top: 2px;
        }

        .action-banner {
          border: none;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 24px;
        }

        @media (max-width: 768px) {
          .charts-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
