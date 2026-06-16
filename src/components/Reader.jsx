import ChapterCard from './ChapterCard';
import { ArrowLeft } from 'lucide-react';

export default function Reader({ chapters, onOpenChapter, onBack }) {
  if (!chapters || chapters.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>📖</div>
        <div style={{ fontSize: '14px' }}>Hali boblar yo'q.</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <button 
        className="btn btn-ghost animate-fade-in" 
        onClick={onBack}
        style={{ marginBottom: '24px', padding: '8px 16px' }}
      >
        <ArrowLeft size={16} /> Kitoblarga qaytish
      </button>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))', 
        gap: '24px' 
      }}>
        {chapters.map((ch, idx) => (
          <ChapterCard key={idx} chapter={ch} onClick={() => onOpenChapter(idx)} />
        ))}
      </div>
    </div>
  );
}
