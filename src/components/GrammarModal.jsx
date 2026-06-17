import { createPortal } from 'react-dom';

export default function GrammarModal({ isOpen, onClose, sentence }) {
  if (!isOpen || !sentence) return null;

  const modalContent = (
    <div 
      className="modal-backdrop"
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}
      onClick={onClose}
    >
      <div 
        className="glass-card animate-modal"
        style={{
          width: '100%', maxWidth: '640px', maxHeight: '85vh',
          display: 'flex', flexDirection: 'column',
          background: '#fff'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header" style={{ 
          borderBottom: '1px solid var(--border-color)',
          display: 'flex', alignItems: 'flex-start', gap: '16px'
        }}>
          <div className="arabic-text" style={{ fontSize: '26px', flex: 1, color: 'var(--text-primary)' }}>
            {sentence.ar || (Array.isArray(sentence.parts) && typeof sentence.parts[0] === 'string' ? sentence.parts.join(' ') : '')}
          </div>
          <button className="icon-btn" onClick={onClose} style={{ flexShrink: 0 }}>✕</button>
        </div>
        
        <div className="modal-body" style={{ overflowY: 'auto' }}>
          {sentence.fahm ? (
            <div style={{ 
              whiteSpace: 'pre-wrap', 
              lineHeight: 1.8, 
              fontSize: '15px', 
              color: 'var(--text-primary)'
            }}>
              {sentence.fahm}
            </div>
          ) : (
            <>
              <div className="modal-tr-box" style={{ 
                background: 'var(--bg-primary)', borderRadius: '12px', marginBottom: '24px' 
              }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.5px', marginBottom: '8px' }}>TARJIMA</div>
                <div style={{ fontSize: '15px', color: 'var(--text-primary)', lineHeight: 1.6 }}>{sentence.tr || '—'}</div>
              </div>
              
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.5px', marginBottom: '12px' }}>
                GRAMMATIK TAHLIL
              </div>
              
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', fontSize: '12px', color: 'var(--text-secondary)', padding: '12px', borderBottom: '1px solid var(--border-color)' }}>So'z</th>
                    <th style={{ textAlign: 'left', fontSize: '12px', color: 'var(--text-secondary)', padding: '12px', borderBottom: '1px solid var(--border-color)' }}>Vazifa</th>
                    <th style={{ textAlign: 'left', fontSize: '12px', color: 'var(--text-secondary)', padding: '12px', borderBottom: '1px solid var(--border-color)' }}>Izoh</th>
                  </tr>
                </thead>
                <tbody>
                  {(sentence.parts || []).map((p, i) => (
                    <tr key={i}>
                      <td className="arabic-text" style={{ padding: '12px', borderBottom: '1px solid var(--bg-primary)', fontSize: '22px', whiteSpace: 'nowrap' }}>
                        {p.w}
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid var(--bg-primary)' }}>
                        <span className={`tag tag-${p.rc || 'tb'}`}>{p.r}</span>
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid var(--bg-primary)', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {p.e || ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
