import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import GrammarModal from './GrammarModal';
import WordTooltip from './WordTooltip';
import PracticeView from './PracticeView';

export default function ChapterView({ chapter, words, onBack, chapterIndex, totalChapters, onNavigateChapter }) {
  const [modalSentence, setModalSentence] = useState(null);
  const [tooltipState, setTooltipState] = useState({ isVisible: false, x: 0, y: 0, arabic: '', uzbek: '' });
  const [showPractice, setShowPractice] = useState(false);
  const pageText = chapter.pageLabel || `${chapter.page}-bet`;

  const norm = (w) => w.replace(/[،؟?!*.،:؛﴿﴾۝\-\u0651\u064B\u064C\u064D\u0652\u0650\u064E\u064F,'"`[\]«»()]/g, '').replace(/\s+/g, ' ').trim();

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
          </span>
        );
        i++;
      }
    }
    return elements;
  };

  /* ── PRACTICE VIEW ── */
  if (showPractice) {
    return (
      <div className="animate-slide-in" style={{ maxWidth: '760px', margin: '0 auto', paddingBottom: '40px' }}>
        <PracticeView chapter={chapter} onBack={() => setShowPractice(false)} />
      </div>
    );
  }

  /* ── READING VIEW ── */
  return (
    <div className="animate-slide-in" style={{ maxWidth: '760px', margin: '0 auto', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <button
          className="btn btn-ghost"
          onClick={onBack}
          style={{ padding: '8px 16px' }}
        >
          <ArrowLeft size={16} /> Mavzularga qaytish
        </button>

        <button
          className="btn btn-ghost"
          onClick={() => setShowPractice(true)}
        >
          Mashiq
        </button>
      </div>

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
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '24px'
        }}>
          <h2 className="arabic-text" style={{
            fontSize: '32px',
            marginBottom: chapter.tuz ? '8px' : 0,
            color: 'var(--accent-primary)'
          }}>
            <bdi>{chapter.title}</bdi>
          </h2>
          {chapter.tuz && (
            <div style={{
              color: 'var(--text-secondary)',
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: 1.5
            }}>
              {chapter.tuz}
            </div>
          )}
        </div>

        <div className="arabic-text sentence-text-container" style={{ color: 'var(--text-primary)', direction: 'rtl', textAlign: 'right', lineHeight: '2.5' }}>
          {(Array.isArray(chapter.sentences) ? chapter.sentences : Object.values(chapter.sentences)).map((s, si) => {
            const arText = s.ar || (Array.isArray(s.parts) && typeof s.parts[0] === 'string' ? s.parts.join(' ') : '');
            return (
              <span
                key={`card-${si}`}
                onClick={() => {
                  setModalSentence(s);
                  handleMouseLeave();
                }}
                style={{
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                {renderTokenized(arText)}{' '}
              </span>
            );
          })}
        </div>
      </div>

      <div style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '24px' }}>
        Sahifa {pageText}
      </div>

      {/* Bottom: prev / practice / next */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
        <button
          className="btn btn-ghost"
          disabled={chapterIndex === 0}
          onClick={() => onNavigateChapter(chapterIndex - 1)}
          style={{ flex: 1, padding: '12px' }}
        >
          &larr; Oldingi
        </button>

        <button
          className="btn btn-ghost"
          onClick={() => setShowPractice(true)}
          style={{ padding: '12px 20px' }}
        >
          Mashiq
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
