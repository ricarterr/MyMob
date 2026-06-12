import React, { useState } from 'react';
import { 
  Search, 
  Trash2, 
  Check, 
  Smartphone, 
  Calendar,
  Clock,
  AlertCircle
} from 'lucide-react';

export default function History({ logs, onClearHistory }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtra logs com base na busca
  const filteredLogs = logs.filter((log) => {
    return (
      log.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.phone.includes(searchTerm) ||
      log.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Registro Geral de Envios ({filteredLogs.length})</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Histórico completo de cobranças disparadas pelo WhatsApp.</p>
        </div>
        {logs.length > 0 && (
          <button 
            className="btn btn-danger btn-sm"
            onClick={() => {
              if (confirm('Deseja realmente limpar todo o histórico de cobranças? Esta ação não pode ser desfeita.')) {
                onClearHistory();
              }
            }}
          >
            <Trash2 size={14} />
            Limpar Histórico
          </button>
        )}
      </div>

      {/* Caixa de Busca */}
      <div className="card" style={{ padding: '16px 24px' }}>
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar por inquilino, telefone ou conteúdo da mensagem..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Linha do Tempo (Timeline) */}
      <div className="card" style={{ padding: '32px 24px' }}>
        
        {filteredLogs.length === 0 ? (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '40px 0', 
            color: 'var(--text-light)',
            gap: '8px'
          }}>
            <AlertCircle size={36} />
            <span>Nenhum log de cobrança encontrado.</span>
          </div>
        ) : (
          <div className="timeline-container">
            {filteredLogs.map((log, index) => (
              <div className="timeline-item" key={log.id}>
                {/* Indicador de linha vertical no CSS */}
                
                {/* Ícone ou Marcador na Linha */}
                <div className="timeline-marker">
                  <div className="marker-circle">
                    <Check size={12} />
                  </div>
                </div>

                {/* Bloco de Conteúdo */}
                <div className="timeline-content">
                  {/* Cabeçalho do Bloco */}
                  <div className="timeline-item-header">
                    <div>
                      <span className="tenant-name">{log.tenantName}</span>
                      <span className="phone-number">
                        <Smartphone size={11} style={{ marginRight: '2px' }} />
                        {log.phone}
                      </span>
                    </div>

                    <div className="time-badges">
                      <span className="badge em-dia" style={{ padding: '2px 8px', fontSize: '10px' }}>
                        Enviado
                      </span>
                      <span className="timestamp">
                        <Calendar size={11} style={{ marginRight: '2px' }} />
                        {log.date}
                        <Clock size={11} style={{ marginLeft: '8px', marginRight: '2px' }} />
                        {log.time}
                      </span>
                    </div>
                  </div>

                  {/* Corpo da Mensagem Enviada */}
                  <div className="message-bubble">
                    <p>{log.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      <style jsx="true">{`
        .search-wrapper {
          position: relative;
          width: 100%;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-light);
        }

        .search-wrapper input {
          width: 100%;
          padding: 10px 14px 10px 38px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          background: var(--bg-card);
          color: var(--text-main);
          outline: none;
          font-size: 14px;
          transition: var(--transition);
        }

        .search-wrapper input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        /* Timeline Estilos */
        .timeline-container {
          position: relative;
          padding-left: 32px;
          border-left: 2px solid var(--border-color);
          margin-left: 12px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .timeline-item {
          position: relative;
        }

        .timeline-marker {
          position: absolute;
          left: -43px; /* alinha com a borda esquerda do container */
          top: 4px;
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .marker-circle {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--success);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid var(--bg-card);
          box-shadow: 0 0 0 1px var(--border-color);
        }

        .timeline-content {
          background: var(--bg-app);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 16px 20px;
          transition: var(--transition);
        }

        .timeline-content:hover {
          border-color: var(--text-light);
        }

        .timeline-item-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 10px;
        }

        .tenant-name {
          font-weight: 600;
          font-size: 14px;
          color: var(--text-main);
          margin-right: 12px;
        }

        .phone-number {
          font-size: 12px;
          color: var(--text-muted);
          display: inline-flex;
          align-items: center;
        }

        .time-badges {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .timestamp {
          font-size: 11px;
          color: var(--text-light);
          display: inline-flex;
          align-items: center;
        }

        .message-bubble {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 12px 16px;
          font-size: 13px;
          line-height: 1.5;
          color: var(--text-main);
          white-space: pre-wrap;
          font-family: inherit;
        }
      `}</style>

    </div>
  );
}
