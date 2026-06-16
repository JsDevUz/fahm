import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import GrammarModal from './GrammarModal';
import WordTooltip from './WordTooltip';

export default function ChapterView({ chapter, words, onBack, chapterIndex, totalChapters, onNavigateChapter }) {
  const [modalSentence, setModalSentence] = useState(null);
  const [tooltipState, setTooltipState] = useState({ isVisible: false, x: 0, y: 0, arabic: '', uzbek: '' });

  const norm = (w) => w.replace(/[،؟!.،:؛﴿﴾۝\-\u0651\u064B\u064C\u064D\u0652\u0650\u064E\u064F,'"[\]«»()]/g, '').replace(/\s+/g, ' ').trim();
  
  const lookupWord = (raw) => {
    const n = norm(raw);
    if (!n) return null;
    if (words[n]) return words[n];
    for (const k of Object.keys(words)) {
      if (norm(k) === n) return words[k];
    }
    return null;
  };

  const handleMouseEnter = (e, raw, uz) => {
    const rect = e.target.getBoundingClientRect();
    setTooltipState({
      isVisible: true,
      x: rect.left + rect.width / 2,
      y: rect.top,
      arabic: raw,
      uzbek: uz
    });
  };

  const handleMouseLeave = () => {
    setTooltipState(prev => ({ ...prev, isVisible: false }));
  };

  const renderTokenized = (sentence) => {
    const tokens = sentence.split(/(\s+)/);
    const elements = [];
    let i = 0;
    
    while (i < tokens.length) {
      if (!tokens[i].trim()) {
        elements.push(<span key={`s-${i}`}>{tokens[i]}</span>);
        i++;
        continue;
      }
      
      let matched = false;
      for (let wordCount = 5; wordCount >= 1; wordCount--) {
        let currentTokens = [];
        let peek = i;
        let wordsFound = 0;
        
        while (peek < tokens.length && wordsFound < wordCount) {
          currentTokens.push(tokens[peek]);
          if (tokens[peek].trim()) wordsFound++;
          peek++;
        }
        
        if (wordsFound === wordCount) {
          const phraseRaw = currentTokens.join('');
          const uz = lookupWord(phraseRaw);
          if (uz) {
            elements.push(
              <span 
                key={i}
                className="word-block"
                style={{ cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#fef08a';
                  e.currentTarget.style.color = '#713f12';
                  handleMouseEnter(e, phraseRaw, uz);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'inherit';
                  handleMouseLeave();
                }}
              >
                <span className="arabic-word">{phraseRaw}</span>
                <span className="word-translation-mobile">{uz}</span>
              </span>
            );
            i = peek;
            matched = true;
            break;
          }
        }
      }
      
      if (!matched) {
        const raw = tokens[i];
        elements.push(
          <span 
            key={i}
            className="word-block"
            style={{ cursor: 'pointer', transition: 'background 0.15s' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fef08a';
              e.currentTarget.style.color = '#713f12';
              handleMouseEnter(e, raw, lookupWord(raw));
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'inherit';
              handleMouseLeave();
            }}
          >
            <span className="arabic-word">{raw}</span>
            <span className="word-translation-mobile">{lookupWord(raw) || '...'}</span>
          </span>
        );
        i++;
      }
    }
    return elements;
  };

  return (
    <div className="animate-slide-in" style={{ maxWidth: '760px', margin: '0 auto', paddingBottom: '40px' }}>
      <button 
        className="btn btn-ghost" 
        onClick={onBack}
        style={{ marginBottom: '24px', padding: '8px 16px' }}
      >
        <ArrowLeft size={16} /> Mavzularga qaytish
      </button>

      <WordTooltip {...tooltipState} />
      <GrammarModal 
        isOpen={!!modalSentence} 
        sentence={modalSentence} 
        onClose={() => setModalSentence(null)} 
      />

      <div className="glass" style={{ 
        fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center', 
        padding: '12px', borderRadius: '12px', marginBottom: '32px'
      }}>
        <span style={{ fontWeight: 500 }}>💡 Eslatma:</span> <span className="desktop-eslatma">So'zga sichqoncha olib keling → tarjima &nbsp;&nbsp;•&nbsp;&nbsp; </span>Gapga bosing → grammatik tahlil
      </div>

      <div className="glass-card chapter-card-padding" style={{ marginBottom: '24px' }}>
        <h2 className="arabic-text" style={{ 
          fontSize: '32px', textAlign: 'center', marginBottom: '40px', color: 'var(--accent-primary)',
          borderBottom: '1px solid var(--border-color)', paddingBottom: '24px'
        }}>
          <bdi>{chapter.title}</bdi>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {chapter.sentences.map((s, si) => (
            <div 
              key={si}
              onClick={() => {
                setModalSentence(s);
                handleMouseLeave();
              }}
              className="sentence-card"
              style={{
                borderRadius: '12px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                e.currentTarget.style.backgroundColor = 'var(--accent-light)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
              }}
            >
              <div className="arabic-text sentence-text-container" style={{ color: 'var(--text-primary)' }}>
                {renderTokenized(s.ar)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '24px' }}>
        Sahifa {chapter.page}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
        <button 
          className="btn btn-ghost" 
          disabled={chapterIndex === 0}
          onClick={() => onNavigateChapter(chapterIndex - 1)}
          style={{ flex: 1, padding: '12px' }}
        >
          &larr; Oldingi
        </button>
        <button 
          className="btn btn-primary" 
          disabled={chapterIndex === totalChapters - 1}
          onClick={() => onNavigateChapter(chapterIndex + 1)}
          style={{ flex: 1, padding: '12px' }}
        >
          Keyingi &rarr;
        </button>
      </div>
    </div>
  );
}
