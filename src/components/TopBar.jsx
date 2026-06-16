import { BookOpen, ChevronRight } from 'lucide-react';

export default function TopBar({ currentView, activeBook, activeChapter, onNavigate }) {
  return (
    <header className="topbar glass">
      <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <BookOpen size={24} style={{ color: 'var(--accent-primary)' }} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="arabic-text" style={{ fontSize: '18px', lineHeight: '1.2', color: 'var(--text-primary)' }}>مكتبة</span>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Kutubxona</span>
        </div>
      </div>
      
      <div className="nav" style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0, flex: 1, justifyContent: 'flex-end' }}>
        <div className="crumb" style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden', whiteSpace: 'nowrap', minWidth: 0 }}>
          
          {currentView !== 'books' ? (
            <span 
              onClick={() => onNavigate('books')} 
              style={{ cursor: 'pointer', color: 'var(--accent-primary)' }}
            >
              Kitoblar
            </span>
          ) : (
            <span style={{ color: 'var(--text-primary)' }}>Kitoblar</span>
          )}

          {['reader', 'chapter'].includes(currentView) && activeBook && (
            <>
              <ChevronRight size={14} style={{ color: '#ccc', flexShrink: 0 }} />
              {currentView !== 'reader' ? (
                <span 
                  onClick={() => onNavigate('reader')}
                  style={{ cursor: 'pointer', color: 'var(--accent-primary)', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}
                >
                  {activeBook.titleUz}
                </span>
              ) : (
                <span style={{ color: 'var(--text-primary)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
                  {activeBook.titleUz}
                </span>
              )}
            </>
          )}

          {currentView === 'chapter' && activeChapter && (
            <>
              <ChevronRight size={14} style={{ color: '#ccc', flexShrink: 0 }} />
              <span style={{ color: 'var(--text-primary)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>{activeChapter.tuz}</span>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
