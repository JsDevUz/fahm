export default function ChapterCard({ chapter, onClick }) {
  const num = chapter.title.split('ـ')[0].trim();
  return (
    <div className="glass-card" onClick={onClick} style={{ padding: '24px', cursor: 'pointer' }}>
      <div className="arabic-text" style={{ fontSize: '40px', color: '#cbd5e1', marginBottom: '12px' }}>
        {num}
      </div>
      <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
        {chapter.tuz}
      </h3>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
        {chapter.sub || ''}
      </p>
      <div style={{ 
        fontSize: '12px', 
        color: 'var(--text-muted)', 
        paddingTop: '16px', 
        borderTop: '1px solid var(--border-color)' 
      }}>
        Sahifa {chapter.page} • {chapter.sentences?.length || 0} gap
      </div>
    </div>
  );
}
