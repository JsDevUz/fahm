import { useState, useCallback, useEffect, useRef } from "react";
import {
  ArrowLeft,
  RotateCcw,
  ChevronRight,
  Check,
  X,
  Layers,
  ListChecks,
  Type,
  AlignLeft,
  ArrowLeftRight,
  Play,
  BookOpen,
  Keyboard,
} from "lucide-react";

/* ── helpers ── */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildCards(chapter, scope) {
  const cards = [];
  const sentences = Array.isArray(chapter.sentences)
    ? chapter.sentences
    : Object.values(chapter.sentences);

  if (scope === "word") {
    sentences.forEach((s) => {
      if (!Array.isArray(s.parts)) return;
      s.parts.forEach((p) => {
        const ar = (p.w || "").trim();
        const uz = (p.uz || "").trim();
        if (ar && uz) cards.push({ ar, uz, hint: p.e || "" });
      });
    });
  } else {
    sentences.forEach((s) => {
      const ar = (s.ar || "").trim();
      const uz = (s.tr || "").trim();
      if (ar && uz) cards.push({ ar, uz, hint: "" });
    });
  }
  return shuffle(cards);
}

function buildOptions(cards, correct, count = 4) {
  const pool = cards.filter((c) => c.uz !== correct.uz);
  const wrong = shuffle(pool).slice(0, count - 1);
  return shuffle([correct, ...wrong]);
}

/* ── Kbd badge ── */
function Kbd({ children }) {
  return (
    <kbd
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "22px",
        height: "22px",
        padding: "0 5px",
        border: "1px solid var(--border-color)",
        borderBottom: "2px solid #cbd5e1",
        borderRadius: "5px",
        background: "var(--bg-tertiary)",
        fontSize: "10px",
        fontWeight: 700,
        fontFamily: "inherit",
        color: "var(--text-secondary)",
        lineHeight: 1,
      }}
    >
      {children}
    </kbd>
  );
}

/* ── Shortcut hint bar ── */
function ShortcutBar({ hints }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        flexWrap: "wrap",
        padding: "8px 12px",
        borderRadius: "8px",
        background: "var(--bg-tertiary)",
        border: "1px solid var(--border-color)",
        marginTop: "16px",
      }}
    >
      <Keyboard size={13} color="var(--text-muted)" style={{ flexShrink: 0 }} />
      <span
        style={{
          fontSize: "11px",
          color: "var(--text-muted)",
          fontWeight: 700,
        }}
      >
        Klaviatura:
      </span>
      {hints.map((h, i) => (
        <span
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontSize: "11px",
            color: "var(--text-muted)",
          }}
        >
          {h.keys.map((k, ki) => (
            <Kbd key={ki}>{k}</Kbd>
          ))}
          <span>{h.label}</span>
        </span>
      ))}
    </div>
  );
}

/* ── shared ── */
function ProgressBar({ current, total }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "24px",
      }}
    >
      <div
        style={{
          flex: 1,
          height: "4px",
          background: "var(--bg-tertiary)",
          borderRadius: "99px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: "99px",
            background: "var(--accent-primary)",
            width: `${(current / total) * 100}%`,
            transition: "width 0.35s ease",
          }}
        />
      </div>
      <span
        style={{
          fontSize: "12px",
          color: "var(--text-muted)",
          minWidth: "48px",
          textAlign: "right",
        }}
      >
        {current + 1} / {total}
      </span>
    </div>
  );
}

function LangLabel({ isArabic, style = {} }) {
  return (
    <span
      style={{
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: "var(--text-muted)",
        ...style,
      }}
    >
      {isArabic ? "Arabcha" : "O'zbekcha"}
    </span>
  );
}

/* ════════════════════════════════════
   SETTINGS SCREEN
════════════════════════════════════ */
function SettingsScreen({ onStart, onBack }) {
  const [mode, setMode] = useState("flashcard");
  const [scope, setScope] = useState("word");
  const [direction, setDirection] = useState("ar");

  const OptionCard = ({ active, onClick, icon: Icon, label, sub }) => (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: "14px 12px",
        borderRadius: "10px",
        cursor: "pointer",
        border: `1.5px solid ${active ? "var(--accent-primary)" : "var(--border-color)"}`,
        background: active ? "var(--accent-light)" : "var(--bg-secondary)",
        textAlign: "center",
        transition: "all 0.15s",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
      }}
    >
      <Icon
        size={18}
        color={active ? "var(--accent-primary)" : "var(--text-muted)"}
        strokeWidth={active ? 2.2 : 1.8}
      />
      <span
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: active ? "var(--accent-primary)" : "var(--text-primary)",
          lineHeight: 1.2,
        }}
      >
        {label}
      </span>
      {sub && (
        <span
          style={{
            fontSize: "11px",
            color: "var(--text-muted)",
            lineHeight: 1.2,
          }}
        >
          {sub}
        </span>
      )}
    </button>
  );

  const Row = ({ title, children }) => (
    <div style={{ marginBottom: "20px" }}>
      <div
        style={{
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.08em",
          color: "var(--text-muted)",
          textTransform: "uppercase",
          marginBottom: "8px",
        }}
      >
        {title}
      </div>
      <div style={{ display: "flex", gap: "8px" }}>{children}</div>
    </div>
  );

  return (
    <div
      className="animate-slide-in"
      style={{ maxWidth: "460px", margin: "0 auto" }}
    >
      <button
        className="btn btn-ghost"
        onClick={onBack}
        style={{ marginBottom: "24px" }}
      >
        <ArrowLeft size={15} /> Orqaga
      </button>

      <div className="glass-card" style={{ padding: "28px" }}>
        <h2 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "4px" }}>
          Mashiq sozlamalari
        </h2>
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            marginBottom: "24px",
          }}
        >
          Mashiq turini tanlang va boshlang
        </p>

        <Row title="Mashiq turi">
          <OptionCard
            active={mode === "flashcard"}
            onClick={() => setMode("flashcard")}
            icon={Layers}
            label="Flashcard"
            sub="Kartani ag'daring"
          />
          <OptionCard
            active={mode === "test"}
            onClick={() => setMode("test")}
            icon={ListChecks}
            label="Test"
            sub="To'g'ri javob"
          />
        </Row>

        <Row title="Birlik">
          <OptionCard
            active={scope === "word"}
            onClick={() => setScope("word")}
            icon={Type}
            label="Yakka so'z"
          />
          <OptionCard
            active={scope === "sentence"}
            onClick={() => setScope("sentence")}
            icon={AlignLeft}
            label="Butun gap"
          />
        </Row>

        <Row title="Savol ko'rinishi">
          <OptionCard
            active={direction === "ar"}
            onClick={() => setDirection("ar")}
            icon={ArrowLeftRight}
            label="Arabcha"
            sub="O'zbekcha so'raladi"
          />
          <OptionCard
            active={direction === "uz"}
            onClick={() => setDirection("uz")}
            icon={ArrowLeftRight}
            label="O'zbekcha"
            sub="Arabcha so'raladi"
          />
        </Row>

        <button
          className="btn btn-primary"
          onClick={() => onStart({ mode, scope, direction })}
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "14px",
            marginTop: "4px",
          }}
        >
          <Play size={14} /> Boshlash
        </button>

        <ShortcutBar
          hints={
            mode === "flashcard"
              ? [
                  { keys: ["Space"], label: "flashcardni ochish" },
                  { keys: ["→"], label: "keyingi/o'tkazish" },
                  { keys: ["←"], label: "bildim" },
                ]
              : [
                  { keys: ["1", "2", "3", "4"], label: "variant tanlash" },
                  { keys: ["→"], label: "javobdan keyin keyingi" },
                ]
          }
        />
      </div>
    </div>
  );
}

/* ════════════════════════════════════
   RESULT SCREEN (shared)
════════════════════════════════════ */
function ResultScreen({ known, total, answers, onFinish }) {
  const pct = Math.round((known / total) * 100);
  return (
    <div
      className="animate-slide-in"
      style={{ maxWidth: "400px", margin: "0 auto" }}
    >
      <div
        className="glass-card"
        style={{ padding: "32px", textAlign: "center" }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background:
              pct >= 80 ? "#dcfce7" : pct >= 50 ? "#fef9c3" : "#fee2e2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          {pct >= 80 ? (
            <Check size={24} color="#16a34a" />
          ) : pct >= 50 ? (
            <Check size={24} color="#ca8a04" />
          ) : (
            <X size={24} color="#dc2626" />
          )}
        </div>

        <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "20px" }}>
          Natija
        </h2>

        {answers && (
          <div
            style={{
              display: "flex",
              gap: "3px",
              justifyContent: "center",
              marginBottom: "20px",
              flexWrap: "wrap",
            }}
          >
            {answers.map((a, i) => (
              <div
                key={i}
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "3px",
                  background: a.correct ? "#16a34a" : "#e5e7eb",
                }}
              />
            ))}
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: "28px", fontWeight: 800, color: "#16a34a" }}
            >
              {known}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              to'g'ri
            </div>
          </div>
          <div style={{ width: "1px", background: "var(--border-color)" }} />
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "28px",
                fontWeight: 800,
                color: "var(--text-muted)",
              }}
            >
              {total - known}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              xato
            </div>
          </div>
          <div style={{ width: "1px", background: "var(--border-color)" }} />
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "28px",
                fontWeight: 800,
                color: "var(--accent-primary)",
              }}
            >
              {pct}%
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              ball
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="btn btn-ghost"
            onClick={onFinish}
            style={{ flex: 1, padding: "11px" }}
          >
            <RotateCcw size={14} /> Qayta
          </button>
          <button
            className="btn btn-primary"
            onClick={onFinish}
            style={{ flex: 1, padding: "11px" }}
          >
            Tugatish
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════
   FLASHCARD MODE
════════════════════════════════════ */
function FlashcardMode({ cards, direction, onFinish }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [unknown, setUnknown] = useState(0);
  const [done, setDone] = useState(false);

  const card = cards[idx];
  const front = direction === "ar" ? card.ar : card.uz;
  const back = direction === "ar" ? card.uz : card.ar;
  const isFrontArabic = direction === "ar";
  const isBackArabic = direction === "uz";

  const next = useCallback(
    (result) => {
      if (result === "known") setKnown((k) => k + 1);
      else setUnknown((u) => u + 1);
      if (idx + 1 >= cards.length) setDone(true);
      else {
        setIdx((i) => i + 1);
        setFlipped(false);
      }
    },
    [idx, cards.length],
  );

  const skip = useCallback(() => {
    if (flipped) return;
    next("unknown");
  }, [flipped, next]);

  /* keyboard: Space flips the card; arrows move after/without revealing. */
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;
      if (e.code === "Space") {
        e.preventDefault();
        setFlipped((f) => !f);
      }
      if (e.code === "ArrowRight" && !flipped) {
        e.preventDefault();
        skip();
      }
      if (e.code === "ArrowRight" && flipped) {
        e.preventDefault();
        next("unknown");
      }
      if (e.code === "ArrowLeft" && flipped) {
        e.preventDefault();
        next("known");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [flipped, next, skip]);

  if (done) {
    return (
      <ResultScreen
        known={known}
        total={cards.length}
        answers={null}
        onFinish={onFinish}
      />
    );
  }

  return (
    <div
      className="animate-slide-in"
      style={{ maxWidth: "500px", margin: "0 auto" }}
    >
      <ProgressBar current={idx} total={cards.length} />

      {/* Card */}
      <div
        onClick={() => setFlipped((f) => !f)}
        style={{
          minHeight: "200px",
          borderRadius: "14px",
          cursor: "pointer",
          border:
            "1.5px solid " +
            (flipped ? "var(--accent-primary)" : "var(--border-color)"),
          background: flipped ? "#1e3a5f" : "var(--bg-secondary)",
          boxShadow: "var(--shadow-sm)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "28px",
          transition: "background 0.25s, border 0.25s",
          userSelect: "none",
        }}
      >
        {!flipped ? (
          <>
            <LangLabel
              isArabic={isFrontArabic}
              style={{ marginBottom: "14px" }}
            />
            <div
              style={{
                fontFamily: isFrontArabic ? '"Amiri", serif' : "inherit",
                fontSize: isFrontArabic ? "30px" : "18px",
                direction: isFrontArabic ? "rtl" : "ltr",
                textAlign: "center",
                lineHeight: 1.8,
                color: "var(--text-primary)",
                fontWeight: 600,
              }}
            >
              {front}
            </div>
          </>
        ) : (
          <>
            <LangLabel
              isArabic={isBackArabic}
              style={{ marginBottom: "14px", color: "rgba(255,255,255,0.45)" }}
            />
            <div
              style={{
                fontFamily: isBackArabic ? '"Amiri", serif' : "inherit",
                fontSize: isBackArabic ? "30px" : "18px",
                direction: isBackArabic ? "rtl" : "ltr",
                textAlign: "center",
                lineHeight: 1.8,
                color: "#fff",
                fontWeight: 600,
              }}
            >
              {back}
            </div>
            {card.hint && (
              <div
                style={{
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.45)",
                  marginTop: "12px",
                  textAlign: "center",
                  maxWidth: "320px",
                  lineHeight: 1.6,
                }}
              >
                {card.hint}
              </div>
            )}
          </>
        )}
      </div>

      {/* Action buttons */}
      {flipped ? (
        <div
          className="animate-fade-in"
          style={{ display: "flex", gap: "10px", marginTop: "14px" }}
        >
          <button
            onClick={() => next("known")}
            style={{
              flex: 1,
              padding: "13px",
              borderRadius: "10px",
              cursor: "pointer",
              background: "var(--bg-secondary)",
              color: "#16a34a",
              border: "1.5px solid #86efac",
              fontWeight: 600,
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "7px",
              transition: "background 0.15s",
            }}
          >
            <Check size={15} /> Bildim
          </button>
          <button
            onClick={() => next("unknown")}
            style={{
              flex: 1,
              padding: "13px",
              borderRadius: "10px",
              cursor: "pointer",
              background: "var(--bg-secondary)",
              color: "#dc2626",
              border: "1.5px solid #fca5a5",
              fontWeight: 600,
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "7px",
              transition: "background 0.15s",
            }}
          >
            <X size={15} /> Bilmadim
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "14px",
            gap: "10px",
          }}
        >
          <button
            className="btn btn-ghost"
            onClick={onFinish}
            style={{ padding: "9px 14px" }}
          >
            <ArrowLeft size={14} /> Chiqish
          </button>
          <button
            className="btn btn-ghost"
            onClick={skip}
            style={{ padding: "9px 14px" }}
          >
            O'tkazish <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Shortcut hints */}
      <ShortcutBar
        hints={[
          { keys: ["Space"], label: "flashcardni ochish" },
          { keys: ["←"], label: "bildim" },
          { keys: ["→"], label: "bilmadim / o'tkazish" },
        ]}
      />
    </div>
  );
}

/* ════════════════════════════════════
   TEST MODE
════════════════════════════════════ */
function TestMode({ cards, direction, onFinish }) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [done, setDone] = useState(false);
  const [options, setOptions] = useState([]);
  const [highlighted, setHighlighted] = useState(null); // keyboard hover index
  const advanceTimerRef = useRef(null);

  const card = cards[idx];
  const question = direction === "ar" ? card.ar : card.uz;
  const isQuestionArabic = direction === "ar";
  const isAnswerArabic = direction === "uz";

  useEffect(() => {
    setOptions(buildOptions(cards, card, 4));
    setSelected(null);
    setHighlighted(null);
  }, [idx, cards]);

  useEffect(
    () => () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    },
    [],
  );

  const advance = useCallback(() => {
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    if (idx + 1 >= cards.length) setDone(true);
    else setIdx((i) => i + 1);
  }, [idx, cards.length]);

  const pick = useCallback(
    (opt) => {
      if (selected !== null) return;
      const isCorrect = opt.uz === card.uz && opt.ar === card.ar;
      setSelected(opt);
      if (isCorrect) setScore((s) => s + 1);
      setAnswers((a) => [...a, { correct: isCorrect }]);
      advanceTimerRef.current = setTimeout(advance, 800);
    },
    [selected, card, advance],
  );

  const skipToNext = useCallback(() => {
    if (selected === null) return; // must answer first
    advance();
  }, [selected, advance]);

  /* keyboard: 1-4 pick an option; ArrowRight advances after answering. */
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;
      const numMap = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3 };
      if (numMap[e.code] !== undefined) {
        const i = numMap[e.code];
        if (options[i]) {
          setHighlighted(i);
          pick(options[i]);
        }
      }
      if (e.code === "ArrowRight") {
        e.preventDefault();
        skipToNext();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [options, pick, skipToNext]);

  if (done) {
    return (
      <ResultScreen
        known={score}
        total={cards.length}
        answers={answers}
        onFinish={onFinish}
      />
    );
  }

  return (
    <div
      className="animate-slide-in"
      style={{ maxWidth: "500px", margin: "0 auto" }}
    >
      {/* Segmented progress */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", gap: "2px", flex: 1 }}>
          {cards.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: "4px",
                borderRadius: "99px",
                background:
                  i < idx
                    ? answers[i]?.correct
                      ? "#16a34a"
                      : "#e5e7eb"
                    : i === idx
                      ? "var(--accent-primary)"
                      : "var(--bg-tertiary)",
                transition: "background 0.3s",
              }}
            />
          ))}
        </div>
        <span
          style={{
            fontSize: "12px",
            color: "var(--text-muted)",
            minWidth: "44px",
            textAlign: "right",
          }}
        >
          {idx + 1}/{cards.length}
        </span>
      </div>

      {/* Question */}
      <div
        style={{
          borderRadius: "14px",
          padding: "28px",
          textAlign: "center",
          background: "var(--bg-secondary)",
          border: "1.5px solid var(--border-color)",
          marginBottom: "16px",
          minHeight: "120px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <LangLabel
          isArabic={isQuestionArabic}
          style={{ marginBottom: "10px" }}
        />
        <div
          style={{
            fontFamily: isQuestionArabic ? '"Amiri", serif' : "inherit",
            fontSize: isQuestionArabic ? "28px" : "17px",
            direction: isQuestionArabic ? "rtl" : "ltr",
            color: "var(--text-primary)",
            fontWeight: 600,
            lineHeight: 1.8,
          }}
        >
          {question}
        </div>
      </div>

      {/* Options */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}
      >
        {options.map((opt, oi) => {
          const optVal = direction === "ar" ? opt.uz : opt.ar;
          const isCorrect = opt.uz === card.uz && opt.ar === card.ar;
          const isSelected =
            selected && selected.uz === opt.uz && selected.ar === opt.ar;
          const isHighlighted = highlighted === oi;

          let border =
            isHighlighted && !selected
              ? "var(--accent-primary)"
              : "var(--border-color)";
          let color = "var(--text-primary)";
          let bg =
            isHighlighted && !selected
              ? "var(--accent-light)"
              : "var(--bg-secondary)";
          if (selected) {
            if (isCorrect) {
              border = "#86efac";
              color = "#15803d";
              bg = "#f0fdf4";
            } else if (isSelected) {
              border = "#fca5a5";
              color = "#b91c1c";
              bg = "#fef2f2";
            } else {
              border = "var(--border-color)";
              bg = "var(--bg-secondary)";
              color = "var(--text-muted)";
            }
          }

          return (
            <button
              key={oi}
              onClick={() => pick(opt)}
              style={{
                padding: "13px 10px",
                borderRadius: "10px",
                cursor: selected ? "default" : "pointer",
                background: bg,
                border: `1.5px solid ${border}`,
                color,
                fontFamily: isAnswerArabic ? '"Amiri", serif' : "inherit",
                fontSize: isAnswerArabic ? "20px" : "13px",
                direction: isAnswerArabic ? "rtl" : "ltr",
                textAlign: "center",
                lineHeight: 1.6,
                transition: "background 0.2s, border 0.2s, color 0.2s",
                fontWeight: 500,
                position: "relative",
              }}
            >
              {/* number badge */}
              {!selected && (
                <span
                  style={{
                    position: "absolute",
                    top: "6px",
                    left: "8px",
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "var(--text-muted)",
                    lineHeight: 1,
                  }}
                >
                  {oi + 1}
                </span>
              )}
              {optVal}
            </button>
          );
        })}
      </div>

      {/* Skip after answer */}
      {selected && (
        <div
          className="animate-fade-in"
          style={{ marginTop: "10px", textAlign: "right" }}
        >
          <button
            className="btn btn-ghost"
            onClick={skipToNext}
            style={{ padding: "8px 14px", fontSize: "13px" }}
          >
            Keyingi <ChevronRight size={14} />
          </button>
        </div>
      )}

      <button
        className="btn btn-ghost"
        onClick={onFinish}
        style={{ marginTop: "10px", width: "100%", padding: "9px" }}
      >
        <ArrowLeft size={14} /> Chiqish
      </button>

      {/* Shortcut hints */}
      <ShortcutBar
        hints={[
          { keys: ["1"], label: "1-variant" },
          { keys: ["2"], label: "2-variant" },
          { keys: ["3"], label: "3-variant" },
          { keys: ["4"], label: "4-variant" },
          { keys: ["→"], label: "javobdan keyin keyingi" },
        ]}
      />
    </div>
  );
}

/* ════════════════════════════════════
   MAIN EXPORT
════════════════════════════════════ */
export default function PracticeView({ chapter, onBack }) {
  const [phase, setPhase] = useState("settings");
  const [config, setConfig] = useState(null);
  const [cards, setCards] = useState([]);

  const handleStart = useCallback(
    (cfg) => {
      const built = buildCards(chapter, cfg.scope);
      if (built.length === 0) return;
      setCards(built);
      setConfig(cfg);
      setPhase("playing");
    },
    [chapter],
  );

  const handleFinish = useCallback(() => {
    setPhase("settings");
    setCards([]);
    setConfig(null);
  }, []);

  return (
    <div style={{ maxWidth: "760px", margin: "0 auto", paddingBottom: "40px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "24px",
          paddingBottom: "16px",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <BookOpen size={15} color="var(--text-muted)" />
        <span
          style={{
            fontSize: "13px",
            color: "var(--text-muted)",
            fontWeight: 500,
          }}
        >
          Mashiq — {chapter.tuz || chapter.title}
        </span>
      </div>

      {phase === "settings" && (
        <SettingsScreen onStart={handleStart} onBack={onBack} />
      )}

      {phase === "playing" &&
        config &&
        (config.mode === "flashcard" ? (
          <FlashcardMode
            cards={cards}
            direction={config.direction}
            onFinish={handleFinish}
          />
        ) : (
          <TestMode
            cards={cards}
            direction={config.direction}
            onFinish={handleFinish}
          />
        ))}
    </div>
  );
}
