import { useState, useEffect } from 'react';
import booksData from './data/books.json';
import Books from './components/Books';
import Reader from './components/Reader';
import ChapterView from './components/ChapterView';
import TopBar from './components/TopBar';

function App() {
  const [currentView, setCurrentView] = useState('books'); 
  const [books] = useState(booksData);
  const [chaptersByBook, setChaptersByBook] = useState({
    qisas: [],
    shifohiyya: []
  });
  const [activeChapterData, setActiveChapterData] = useState(null);
  const [words, setWords] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isChapterLoading, setIsChapterLoading] = useState(false);
  
  const [activeBook, setActiveBook] = useState(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('translate', 'no');
    document.documentElement.classList.add('notranslate');
    document.body.setAttribute('translate', 'no');
    document.body.classList.add('notranslate');
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [qisasMod, shifoMod] = await Promise.all([
          import('./data/qisas/index.json'),
          import('./data/shifohiyya/index.json')
        ]);
        setChaptersByBook({
          qisas: qisasMod.default || qisasMod,
          shifohiyya: shifoMod.default || shifoMod
        });
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (currentView === 'chapter' && activeBook && activeChapterIndex !== null) {
      setIsChapterLoading(true);
      Promise.all([
        import(`./data/${activeBook.id}/${activeChapterIndex}.json`),
        import(`./data/${activeBook.id}/${activeChapterIndex}_words.json`)
      ])
      .then(([chapterMod, wordsMod]) => {
         setActiveChapterData(chapterMod.default || chapterMod);
         setWords(wordsMod.default || wordsMod);
      })
      .catch(console.error)
      .finally(() => setIsChapterLoading(false));
    }
  }, [currentView, activeBook, activeChapterIndex]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '') || '';
      
      if (!hash || hash === '') {
        setCurrentView('books');
        setActiveBook(null);
        setActiveChapterIndex(null);
      } else if (hash.startsWith('reader/')) {
        const bookId = hash.split('/')[1];
        const book = books.find(b => b.id === bookId) || books[0];
        setCurrentView('reader');
        setActiveBook(book);
        setActiveChapterIndex(null);
      } else if (hash.startsWith('chapter/')) {
        const parts = hash.split('/');
        const bookId = parts[1];
        const chIndex = parseInt(parts[2], 10) || 0;
        const book = books.find(b => b.id === bookId) || books[0];
        setCurrentView('chapter');
        setActiveBook(book);
        setActiveChapterIndex(chIndex);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Process initial hash

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [books]);

  const navigateTo = (view, payload = null) => {
    if (view === 'books') {
      window.location.hash = '#/';
    } else if (view === 'reader') {
      const book = payload || activeBook || books[0];
      window.location.hash = `#/reader/${book.id}`;
    } else if (view === 'chapter') {
      const book = activeBook || books[0];
      window.location.hash = `#/chapter/${book.id}/${payload}`;
    }
  };

  const getBookChapters = (bookId) => chaptersByBook[bookId] || [];
  const bookChapters = activeBook ? getBookChapters(activeBook.id) : [];

  return (
    <div className="app-container notranslate" translate="no">
      <TopBar 
        currentView={currentView} 
        activeBook={activeBook}
        activeChapter={activeChapterIndex !== null ? bookChapters[activeChapterIndex] : null}
        onNavigate={navigateTo} 
      />
      <main className="main-content">
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTop: '3px solid var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '16px' }}></div>
            <p>Yuklanmoqda...</p>
          </div>
        ) : (
          <div style={{ height: '100%' }}>
            {currentView === 'books' && (
              <Books books={books} onOpenBook={(book) => navigateTo('reader', book)} />
            )}
            {currentView === 'reader' && activeBook && (
              <Reader 
                chapters={bookChapters} 
                onOpenChapter={(idx) => navigateTo('chapter', idx)} 
                onBack={() => navigateTo('books')}
              />
            )}
            {currentView === 'chapter' && activeChapterIndex !== null && (
              isChapterLoading || !activeChapterData ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
                  <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTop: '3px solid var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '16px' }}></div>
                  <p>Mavzu yuklanmoqda...</p>
                </div>
              ) : (
                <ChapterView 
                  chapter={activeChapterData} 
                  words={words} 
                  onBack={() => navigateTo('reader')}
                  chapterIndex={activeChapterIndex}
                  totalChapters={bookChapters.length}
                  onNavigateChapter={(idx) => navigateTo('chapter', idx)}
                />
              )
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
