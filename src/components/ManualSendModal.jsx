import React, { useState, useEffect } from 'react';
import { X, Send, Link as LinkIcon, MessageSquare, AlertCircle } from 'lucide-react';

export default function ManualSendModal({ 
  isOpen, 
  onClose, 
  contract, 
  settings, 
  onSendSuccess 
}) {
  const [message, setMessage] = useState('');
  const [link, setLink] = useState('');

  // Atualiza a mensagem formatada quando o modal abre ou o contrato muda
  useEffect(() => {
    if (contract) {
      // Cria um link de boleto mockado
      const invoiceLink = `https://mymob.com.br/fatura/${contract.id}`;
      setLink(invoiceLink);

      // Substitui as variáveis no template padrão de cobrança rápida
      let tempMsg = settings.msgDefaultCobrarVencimento || 
        'Olá *{inquilino}*, lembramos que seu aluguel no valor de *{valor}* vence em *{vencimento}*. Segue o link para pagamento: {link}';
      
      // Se o status for atrasado, usa o template de atraso se disponível
      if (contract.status === 'atrasado') {
        tempMsg = settings.msgDefaultAtraso || 
          'Olá *{inquilino}*, identificamos que seu aluguel no valor de *{valor}* vencido em *{vencimento}* ainda não foi pago. Segue o link para pagamento: {link}';
      }

      const formattedVal = new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
      }).format(contract.rentValue);

      const formattedDate = contract.dueDate ? new Date(contract.dueDate).toLocaleDateString('pt-BR') : '';

      const finalMsg = tempMsg
        .replace(/{inquilino}/g, contract.tenantName)
        .replace(/{valor}/g, formattedVal)
        .replace(/{vencimento}/g, formattedDate)
        .replace(/{link}/g, invoiceLink);

      setMessage(finalMsg);
    }
  }, [contract, settings]);

  if (!isOpen || !contract) return null;

  const handleSend = () => {
    // Formata o número de telefone (remove caracteres não numéricos)
    const rawPhone = contract.tenantPhone.replace(/\D/g, '');
    // Garante que tem o código do país (55 para Brasil se tiver 10/11 dígitos)
    const formattedPhone = rawPhone.length <= 11 ? `55${rawPhone}` : rawPhone;
    
    // Abre a URL do WhatsApp em nova aba
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // Avisa o componente pai que o envio manual foi realizado para salvar no histórico
    onSendSuccess(contract, message);
    onClose();
  };

  const formattedValue = new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(contract.rentValue);

  return (
    <div className="modal-backdrop">
      <div className="modal-container animate-fade-in">
        
        {/* Header do Modal */}
        <div className="modal-header">
          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <MessageSquare className="text-primary" size={20} />
            <h3 className="modal-title">Preparar Cobrança Manual</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="modal-body">
          {/* Informações Rápidas do Inquilino */}
          <div className="tenant-summary-box">
            <div className="summary-item">
              <span className="summary-label">Inquilino</span>
              <span className="summary-value">{contract.tenantName}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Telefone</span>
              <span className="summary-value">{contract.tenantPhone}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Valor Aluguel</span>
              <span className="summary-value">{formattedValue}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Vencimento</span>
              <span className="summary-value">
                {contract.dueDate ? new Date(contract.dueDate).toLocaleDateString('pt-BR') : ''}
              </span>
            </div>
          </div>

          {/* Campo do Link de Boleto */}
          <div className="form-group" style={{marginTop: '16px'}}>
            <label className="form-label" style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
              <LinkIcon size={14} /> Link da Fatura / Boleto
            </label>
            <div style={{display: 'flex', gap: '8px'}}>
              <input 
                type="text" 
                className="form-control" 
                value={link} 
                onChange={(e) => setLink(e.target.value)} 
                placeholder="Link do boleto ou Pix" 
              />
            </div>
          </div>

          {/* Editor de Mensagem */}
          <div className="form-group">
            <label className="form-label">Editar Mensagem de Cobrança</label>
            <textarea 
              rows={4} 
              className="form-control" 
              value={message} 
              onChange={(e) => setMessage(e.target.value)}
              style={{resize: 'none', fontSize: '13px'}}
            />
          </div>

          {/* Preview no Estilo WhatsApp */}
          <div className="whatsapp-preview-container">
            <div className="whatsapp-preview-header">
              <div className="wa-avatar">WA</div>
              <div>
                <div className="wa-name">{contract.tenantName}</div>
                <div className="wa-status">online</div>
              </div>
            </div>
            <div className="whatsapp-preview-chat">
              <div className="wa-bubble">
                <div style={{whiteSpace: 'pre-wrap'}}>{message}</div>
                <span className="wa-time">
                  {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>

          {/* Nota */}
          <div className="alert-box-info">
            <AlertCircle size={16} style={{color: 'var(--primary)', flexShrink: 0}} />
            <span style={{fontSize: '12px', color: 'var(--text-muted)'}}>
              Ao clicar em enviar, você será direcionado para o WhatsApp Web ou aplicativo com a mensagem pronta. O sistema registrará o log de envio imediatamente.
            </span>
          </div>
        </div>

        {/* Footer do Modal */}
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSend}>
            <Send size={16} />
            Enviar via WhatsApp
          </button>
        </div>

      </div>

      <style jsx="true">{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 16px;
        }

        .modal-container {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          width: 100%;
          max-width: 540px;
          display: flex;
          flex-direction: column;
          max-height: 90vh;
        }

        .modal-header {
          padding: 16px 24px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .modal-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-main);
        }

        .modal-close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          border-radius: var(--radius-sm);
        }

        .modal-close-btn:hover {
          background: var(--bg-app);
          color: var(--text-main);
        }

        .modal-body {
          padding: 24px;
          overflow-y: auto;
        }

        .tenant-summary-box {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          padding: 12px;
          background: var(--bg-app);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
        }

        .summary-item {
          display: flex;
          flex-direction: column;
        }

        .summary-label {
          font-size: 11px;
          color: var(--text-muted);
          font-weight: 500;
        }

        .summary-value {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-main);
        }

        .whatsapp-preview-container {
          margin-top: 16px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }

        .whatsapp-preview-header {
          background: #075e54;
          color: white;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .wa-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #128c7e;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 600;
        }

        .wa-name {
          font-size: 13px;
          font-weight: 600;
        }

        .wa-status {
          font-size: 10px;
          color: #d1f4e6;
        }

        .whatsapp-preview-chat {
          background-color: #efeae2;
          background-image: radial-gradient(rgba(0,0,0,0.08) 15%, transparent 15%);
          background-size: 12px 12px;
          padding: 16px;
          min-height: 120px;
          max-height: 200px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .wa-bubble {
          background: #ffffff;
          padding: 8px 12px;
          border-radius: 8px 8px 8px 0;
          font-size: 12.5px;
          line-height: 1.4;
          max-width: 90%;
          position: relative;
          box-shadow: 0 1px 0.5px rgba(0,0,0,0.13);
        }

        .wa-time {
          display: block;
          text-align: right;
          font-size: 9px;
          color: var(--text-light);
          margin-top: 4px;
        }

        .alert-box-info {
          display: flex;
          gap: 8px;
          padding: 10px 14px;
          background: var(--primary-light);
          border: 1px solid var(--primary-light-hover);
          border-radius: var(--radius-md);
          margin-top: 16px;
          align-items: flex-start;
        }

        .modal-footer {
          padding: 16px 24px;
          border-top: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
        }
      `}</style>
    </div>
  );
}
