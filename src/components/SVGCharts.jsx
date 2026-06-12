import React from 'react';

// 1. Donut Chart para Status de Pagamento
export function PaymentStatusDonut({ emDia, vencendo, atrasado }) {
  const total = emDia + vencendo + atrasado;
  
  // Se não houver contratos, assume dados padrão para exibição elegante
  const displayEmDia = total === 0 ? 5 : emDia;
  const displayVencendo = total === 0 ? 2 : vencendo;
  const displayAtrasado = total === 0 ? 1 : atrasado;
  const displayTotal = displayEmDia + displayVencendo + displayAtrasado;

  const pctEmDia = (displayEmDia / displayTotal) * 100;
  const pctVencendo = (displayVencendo / displayTotal) * 100;
  const pctAtrasado = (displayAtrasado / displayTotal) * 100;

  // Parâmetros do SVG do Donut
  const radius = 60;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius; // 376.99

  // Cálculo dos offsets acumulados
  const offsetEmDia = circumference;
  const offsetVencendo = circumference - (circumference * pctEmDia) / 100;
  const offsetAtrasado = offsetVencendo - (circumference * pctVencendo) / 100;

  const strokeEmDia = (pctEmDia / 100) * circumference;
  const strokeVencendo = (pctVencendo / 100) * circumference;
  const strokeAtrasado = (pctAtrasado / 100) * circumference;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', width: '150px', height: '150px' }}>
        <svg viewBox="0 0 160 160" width="150" height="150" style={{ transform: 'rotate(-90deg)' }}>
          {/* Fundo cinza */}
          <circle cx="80" cy="80" r={radius} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} />
          
          {/* Segmento Em Dia */}
          {displayEmDia > 0 && (
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="var(--success)"
              strokeWidth={strokeWidth}
              strokeDasharray={`${strokeEmDia} ${circumference - strokeEmDia}`}
              strokeDashoffset={0}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.5s ease' }}
            />
          )}

          {/* Segmento Vencendo */}
          {displayVencendo > 0 && (
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="var(--warning)"
              strokeWidth={strokeWidth}
              strokeDasharray={`${strokeVencendo} ${circumference - strokeVencendo}`}
              strokeDashoffset={-strokeEmDia}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.5s ease' }}
            />
          )}

          {/* Segmento Atrasado */}
          {displayAtrasado > 0 && (
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="var(--danger)"
              strokeWidth={strokeWidth}
              strokeDasharray={`${strokeAtrasado} ${circumference - strokeAtrasado}`}
              strokeDashoffset={-(strokeEmDia + strokeVencendo)}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.5s ease' }}
            />
          )}
        </svg>

        {/* Texto central */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none'
        }}>
          <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)' }}>{total}</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Contratos</span>
        </div>
      </div>

      {/* Legenda */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: '130px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--success)' }} />
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Em dia</span>
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600 }}>{emDia}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifycontent: 'space-between', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--warning)' }} />
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Vencendo</span>
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600 }}>{vencendo}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifycontent: 'space-between', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--danger)' }} />
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Atrasados</span>
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600 }}>{atrasado}</span>
        </div>
      </div>
    </div>
  );
}

// 2. Area Chart para Atividade Semanal de Envios
export function WeeklyCollectionActivity({ data = [2, 5, 8, 4, 12, 6, 9] }) {
  // Rótulos dos dias da semana
  const labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  
  // Parâmetros do SVG do gráfico de área
  const width = 500;
  const height = 150;
  const padding = 20;
  
  const maxVal = Math.max(...data, 10); // Valor máximo com fallback para 10
  
  // Mapeamento dos pontos
  const points = data.map((val, index) => {
    const x = padding + (index * (width - 2 * padding)) / (data.length - 1);
    const y = height - padding - (val * (height - 2 * padding)) / maxVal;
    return { x, y, val };
  });

  // String do path para a linha
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  // String do path para a área fechada
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div style={{ width: '100%' }}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Linhas de Grade de Fundo */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3" />
        <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#f1f5f9" strokeWidth="1" />
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#f1f5f9" strokeWidth="1" />

        {/* Caminho da Área */}
        <path d={areaPath} fill="url(#areaGrad)" />

        {/* Caminho da Linha */}
        <path d={linePath} fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Pontos de Dados */}
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r="4"
              fill="#ffffff"
              stroke="var(--primary)"
              strokeWidth="3"
            />
            {/* Rótulo de Valor Flutuante */}
            <text
              x={p.x}
              y={p.y - 10}
              textAnchor="middle"
              fontSize="10"
              fontWeight="600"
              fill="var(--text-main)"
            >
              {p.val}
            </text>
            {/* Rótulo do Dia da Semana */}
            <text
              x={p.x}
              y={height - 4}
              textAnchor="middle"
              fontSize="10"
              fontWeight="500"
              fill="var(--text-light)"
            >
              {labels[i]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
