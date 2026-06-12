import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MessageSquare, 
  Edit3, 
  Trash2, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  User,
  Phone,
  DollarSign
} from 'lucide-react';

export default function Contracts({ 
  contracts, 
  onSaveContract, 
  onDeleteContract, 
  onTriggerManualSend 
}) {
  // Estados para Busca, Filtro e Paginação
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Estados para Form de Cadastro/Edição
  const [showForm, setShowForm] = useState(false);
  const [editingContract, setEditingContract] = useState(null);
  
  // Campos do Form
  const [tenantName, setTenantName] = useState('');
  const [tenantPhone, setTenantPhone] = useState('');
  const [rentValue, setRentValue] = useState('');
  const [dueDay, setDueDay] = useState('10');

  // Abre form para criar novo contrato
  const handleNewClick = () => {
    setEditingContract(null);
    setTenantName('');
    setTenantPhone('');
    setRentValue('');
    setDueDay('10');
    setShowForm(true);
  };

  // Abre form para editar contrato existente
  const handleEditClick = (contract) => {
    setEditingContract(contract);
    setTenantName(contract.tenantName);
    setTenantPhone(contract.tenantPhone);
    setRentValue(contract.rentValue.toString());
    setDueDay(contract.dueDay.toString());
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingContract(null);
  };

  // Salva ou Edita o Contrato
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tenantName || !tenantPhone || !rentValue || !dueDay) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const savedData = {
      id: editingContract ? editingContract.id : Date.now().toString(),
      tenantName,
      tenantPhone,
      rentValue: parseFloat(rentValue),
      dueDay: parseInt(dueDay),
    };

    onSaveContract(savedData);
    setShowForm(false);
    setEditingContract(null);
  };

  // Filtra e Busca Contratos
  const filteredContracts = contracts.filter((c) => {
    const matchesSearch = c.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.tenantPhone.includes(searchTerm);
    const matchesFilter = statusFilter === 'all' ? true : c.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  // Paginação
  const totalPages = Math.ceil(filteredContracts.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContracts = filteredContracts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(val);
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'em-dia': return 'Em Dia';
      case 'vencendo': return 'Vencendo';
      case 'atrasado': return 'Atrasado';
      default: return status;
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Header da Página */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Total de Contratos ({filteredContracts.length})</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Cadastre e gerencie os inquilinos e seus vencimentos.</p>
        </div>
        {!showForm && (
          <button className="btn btn-primary" onClick={handleNewClick}>
            <Plus size={16} />
            Novo Contrato
          </button>
        )}
      </div>

      {/* Slide-out/Toggle Form Card */}
      {showForm && (
        <div className="card animate-fade-in" style={{ borderColor: 'var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 600 }}>
              {editingContract ? 'Editar Contrato' : 'Cadastrar Novo Contrato'}
            </h4>
            <button className="btn-icon btn-outline btn-sm" onClick={handleCancelForm} style={{border: 'none', background: 'transparent'}}>
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="form-grid">
            {/* Nome */}
            <div className="form-group">
              <label className="form-label" style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                <User size={13} /> Nome do Inquilino
              </label>
              <input 
                type="text" 
                className="form-control" 
                value={tenantName} 
                onChange={(e) => setTenantName(e.target.value)} 
                placeholder="Ex: João da Silva" 
                required 
              />
            </div>

            {/* Telefone */}
            <div className="form-group">
              <label className="form-label" style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                <Phone size={13} /> WhatsApp do Inquilino
              </label>
              <input 
                type="tel" 
                className="form-control" 
                value={tenantPhone} 
                onChange={(e) => setTenantPhone(e.target.value)} 
                placeholder="Ex: (11) 98765-4321" 
                required 
              />
            </div>

            {/* Valor do Aluguel */}
            <div className="form-group">
              <label className="form-label" style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                <DollarSign size={13} /> Valor do Aluguel (R$)
              </label>
              <input 
                type="number" 
                step="0.01" 
                className="form-control" 
                value={rentValue} 
                onChange={(e) => setRentValue(e.target.value)} 
                placeholder="Ex: 1500.00" 
                required 
              />
            </div>

            {/* Dia de Vencimento */}
            <div className="form-group">
              <label className="form-label" style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                <Calendar size={13} /> Dia de Vencimento (Mensal)
              </label>
              <select 
                className="form-control" 
                value={dueDay} 
                onChange={(e) => setDueDay(e.target.value)}
                required
              >
                {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
              <button type="button" className="btn btn-outline" onClick={handleCancelForm}>Cancelar</button>
              <button type="submit" className="btn btn-primary">
                {editingContract ? 'Salvar Alterações' : 'Cadastrar Contrato'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabela de Contratos e Filtros */}
      <div className="card" style={{ padding: '0px', overflow: 'hidden' }}>
        
        {/* Barra de Busca e Filtros */}
        <div className="table-controls">
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Buscar por inquilino ou WhatsApp..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // reinicia paginação
              }}
            />
          </div>

          <div className="filters-wrapper">
            <Filter size={14} style={{ color: 'var(--text-muted)' }} />
            <button 
              className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => { setStatusFilter('all'); setCurrentPage(1); }}
            >
              Todos
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'em-dia' ? 'active' : ''}`}
              onClick={() => { setStatusFilter('em-dia'); setCurrentPage(1); }}
            >
              Em Dia
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'vencendo' ? 'active' : ''}`}
              onClick={() => { setStatusFilter('vencendo'); setCurrentPage(1); }}
            >
              Vencendo
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'atrasado' ? 'active' : ''}`}
              onClick={() => { setStatusFilter('atrasado'); setCurrentPage(1); }}
            >
              Atrasados
            </button>
          </div>
        </div>

        {/* Tabela */}
        <div style={{ overflowX: 'auto' }}>
          <table className="modern-table">
            <thead>
              <tr>
                <th>Inquilino</th>
                <th>Contato</th>
                <th>Aluguel</th>
                <th>Vencimento</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginatedContracts.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    Nenhum contrato encontrado com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                paginatedContracts.map((contract) => {
                  const displayDate = contract.dueDate ? new Date(contract.dueDate).toLocaleDateString('pt-BR') : `Dia ${contract.dueDay}`;
                  
                  return (
                    <tr key={contract.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{contract.tenantName}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>Cód: #{contract.id.substring(0, 6)}</div>
                      </td>
                      <td>{contract.tenantPhone}</td>
                      <td style={{ fontWeight: 500 }}>{formatCurrency(contract.rentValue)}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={13} style={{ color: 'var(--text-light)' }} />
                          {displayDate}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${contract.status}`}>
                          {getStatusLabel(contract.status)}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          {/* Botão de Enviar WhatsApp */}
                          <button 
                            className="btn btn-secondary btn-icon btn-sm" 
                            title="Enviar Cobrança WhatsApp"
                            onClick={() => onTriggerManualSend(contract)}
                          >
                            <MessageSquare size={14} />
                          </button>
                          
                          {/* Botão Editar */}
                          <button 
                            className="btn btn-outline btn-icon btn-sm" 
                            title="Editar Contrato"
                            onClick={() => handleEditClick(contract)}
                          >
                            <Edit3 size={14} />
                          </button>

                          {/* Botão Deletar */}
                          <button 
                            className="btn btn-danger btn-icon btn-sm" 
                            title="Excluir Contrato"
                            onClick={() => {
                              if (confirm(`Deseja realmente excluir o contrato de ${contract.tenantName}?`)) {
                                onDeleteContract(contract.id);
                              }
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="table-pagination">
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Página <strong>{currentPage}</strong> de {totalPages}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="btn btn-outline btn-sm btn-icon" 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                className="btn btn-outline btn-sm btn-icon" 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

      </div>

      <style jsx="true">{`
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        @media (max-width: 640px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }

        .table-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          border-bottom: 1px solid var(--border-color);
          gap: 16px;
          flex-wrap: wrap;
        }

        .search-wrapper {
          position: relative;
          flex: 1;
          min-width: 250px;
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

        .filters-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .filter-btn {
          border: 1px solid var(--border-color);
          background: var(--bg-card);
          padding: 6px 12px;
          font-size: 12.5px;
          font-weight: 500;
          color: var(--text-muted);
          border-radius: 9999px;
          cursor: pointer;
          transition: var(--transition);
        }

        .filter-btn:hover, .filter-btn.active {
          background: var(--primary-light);
          color: var(--primary);
          border-color: var(--primary-border);
        }

        .modern-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 14px;
        }

        .modern-table th {
          background: var(--bg-app);
          padding: 14px 24px;
          font-weight: 600;
          color: var(--text-muted);
          border-bottom: 1px solid var(--border-color);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .modern-table td {
          padding: 16px 24px;
          border-bottom: 1px solid var(--border-color);
          color: var(--text-main);
          vertical-align: middle;
        }

        .modern-table tr:last-child td {
          border-bottom: none;
        }

        .modern-table tr:hover td {
          background: var(--primary-light);
        }

        .table-pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          border-top: 1px solid var(--border-color);
          background: var(--bg-app);
        }

        @media (max-width: 768px) {
          .modern-table th, .modern-table td {
            padding: 12px 14px;
          }
        }
      `}</style>

    </div>
  );
}
