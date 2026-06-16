import { createPortal } from 'react-dom';

export default function WordTooltip({ isVisible, x, y, arabic, uzbek }) {
  if (!isVisible) return null;
  
  const tooltipContent = (
    <div 
      className="glass word-tooltip"
      style={{
        position: 'fixed',
        left: x + 'px',
        top: (y - 8) + 'px',
        transform: 'translate(-50%, -100%)',
        zIndex: 9999,
        padding: '12px 16px',
        borderRadius: '12px',
        pointerEvents: 'none',
        textAlign: 'center',
        minWidth: '120px'
      }}
    >
      <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)' }}>
        {uzbek || '—'}
      </div>
      <div className="arabic-text" style={{ fontSize: '16px', color: 'var(--text-secondary)', marginTop: '4px' }}>
        {arabic}
      </div>
    </div>
  );

  // Render tooltip directly in body to avoid position: fixed issues with CSS transforms
  return createPortal(tooltipContent, document.body);
}
