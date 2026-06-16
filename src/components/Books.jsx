export default function Books({ books, onOpenBook }) {
  return (
    <div className="animate-fade-in" style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', 
      gap: '24px', 
      maxWidth: '1000px', 
      margin: '0 auto',
      paddingTop: '20px'
    }}>
      {books.map(book => (
        <div 
          key={book.id} 
          className="glass-card" 
          onClick={() => onOpenBook(book)} 
          style={{ padding: '32px 24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
        >
          <div style={{
            width: '80px', height: '110px', background: 'var(--accent-primary)', 
            borderRadius: '8px', marginBottom: '20px', 
            boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{ width: '12px', height: '100%', background: 'rgba(255,255,255,0.2)', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px', alignSelf: 'flex-start' }}></div>
          </div>
          <h2 className="arabic-text" style={{ fontSize: '32px', color: 'var(--text-primary)', marginBottom: '8px' }}>
            {book.titleAr}
          </h2>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '8px' }}>
            {book.titleUz}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            {book.descUz}
          </p>
        </div>
      ))}
    </div>
  );
}
