import { useMemo, useState } from "react";
import { CelebrationLayer } from "./components/CelebrationLayer";
import { DictionaryPanel } from "./components/DictionaryPanel";
import { FlashcardsPanel } from "./components/FlashcardsPanel";
import { QuizPanel } from "./components/QuizPanel";
import { TypingPanel } from "./components/TypingPanel";
import { vocabEntries } from "./data/vocabEntries";
import { useLocalStorageNumber } from "./hooks/useLocalStorageNumber";

const allTopics = ["Alle", ...new Set(vocabEntries.map((entry) => entry.topic))];

function randomFrom(entries) {
  return entries[Math.floor(Math.random() * entries.length)];
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function makeBurst() {
  const colors = ["#80ffd4", "#4ce2b2", "#ffd166", "#c3a6ff", "#8be9ff"];
  return Array.from({ length: 18 }).map((_, index) => ({
    id: `${Date.now()}-${index}-${Math.random()}`,
    left: Math.random() * 100,
    top: 28 + Math.random() * 22,
    delay: Math.random() * 130,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
}

export default function App() {
  const [mode, setMode] = useState("flashcards");
  const [topic, setTopic] = useState("Alle");
  const [cardIndex, setCardIndex] = useState(0);
  const [cardVisualMode, setCardVisualMode] = useState("text");
  const [isFlipped, setIsFlipped] = useState(false);
  const [streak, setStreak] = useState(0);
  const [highscore, setHighscore] = useLocalStorageNumber("vocab-vista-highscore", 0);
  const [flashcardAnim, setFlashcardAnim] = useState("");
  const [streakAnim, setStreakAnim] = useState(false);
  const [bursts, setBursts] = useState([]);

  const filteredEntries = useMemo(
    () => (topic === "Alle" ? vocabEntries : vocabEntries.filter((entry) => entry.topic === topic)),
    [topic]
  );

  const normalizedCardIndex = ((cardIndex % filteredEntries.length) + filteredEntries.length) % filteredEntries.length;
  const activeCard = filteredEntries[normalizedCardIndex];

  const [typingEntry, setTypingEntry] = useState(() => randomFrom(vocabEntries));
  const [typingInput, setTypingInput] = useState("");
  const [typingFeedback, setTypingFeedback] = useState({ type: "", message: "" });

  const [quizState, setQuizState] = useState(() => ({
    round: 1,
    score: 0,
    locked: false,
    entry: randomFrom(vocabEntries),
    options: [],
    feedback: { type: "", message: "" },
  }));

  const triggerCelebration = () => {
    const burst = makeBurst();
    setBursts((current) => [...current, ...burst]);
    window.setTimeout(() => {
      setBursts((current) => current.filter((item) => !burst.some((node) => node.id === item.id)));
    }, 1000);
  };

  const refreshCard = (nextIndex) => {
    setCardIndex(nextIndex);
    setIsFlipped(false);
  };

  const animateFlashcard = (animName) => {
    setFlashcardAnim(animName);
    window.setTimeout(() => setFlashcardAnim(""), 430);
  };

  const animateStreak = () => {
    setStreakAnim(true);
    window.setTimeout(() => setStreakAnim(false), 430);
  };

  const applyTopicChange = (nextTopic) => {
    setTopic(nextTopic);
    setCardIndex(0);
    setIsFlipped(false);

    const nextEntries = nextTopic === "Alle" ? vocabEntries : vocabEntries.filter((entry) => entry.topic === nextTopic);
    const nextTyping = randomFrom(nextEntries);
    setTypingEntry(nextTyping);
    setTypingInput("");
    setTypingFeedback({ type: "", message: "" });

    const quizEntry = randomFrom(nextEntries);
    const wrong = shuffle(nextEntries.filter((entry) => entry.target !== quizEntry.target))
      .slice(0, 3)
      .map((entry) => ({ value: entry.target, state: "" }));

    setQuizState({
      round: 1,
      score: 0,
      locked: false,
      entry: quizEntry,
      options: shuffle([{ value: quizEntry.target, state: "" }, ...wrong]),
      feedback: { type: "", message: "" },
    });
  };

  const resetTyping = () => {
    const next = randomFrom(filteredEntries);
    setTypingEntry(next);
    setTypingInput("");
    setTypingFeedback({ type: "", message: "" });
  };

  const checkTyping = () => {
    const isCorrect = typingInput.trim().toLowerCase() === typingEntry.target.toLowerCase();
    setTypingFeedback({
      type: isCorrect ? "ok" : "wrong",
      message: isCorrect ? "Stark! Genau richtig." : `Fast! Richtig ist: ${typingEntry.target}`,
    });
    if (isCorrect) triggerCelebration();
  };

  const nextQuizRound = (reset = false) => {
    const nextRound = reset ? 1 : Math.min(quizState.round + 1, 5);
    const quizEntry = randomFrom(filteredEntries);
    const wrong = shuffle(filteredEntries.filter((entry) => entry.target !== quizEntry.target))
      .slice(0, 3)
      .map((entry) => ({ value: entry.target, state: "" }));

    setQuizState((current) => ({
      round: nextRound,
      score: reset ? 0 : current.score,
      locked: false,
      entry: quizEntry,
      options: shuffle([{ value: quizEntry.target, state: "" }, ...wrong]),
      feedback: { type: "", message: "" },
    }));
  };

  const answerQuiz = (selectedValue) => {
    if (quizState.locked) return;

    const isCorrect = selectedValue === quizState.entry.target;
    const nextOptions = quizState.options.map((option) => {
      if (option.value === quizState.entry.target) return { ...option, state: "is-correct" };
      if (!isCorrect && option.value === selectedValue) return { ...option, state: "is-wrong" };
      return option;
    });

    setQuizState((current) => ({
      ...current,
      score: isCorrect ? current.score + 1 : current.score,
      locked: true,
      options: nextOptions,
      feedback: {
        type: isCorrect ? "ok" : "wrong",
        message: isCorrect ? "Richtig! Stark gemacht ✨" : `Nicht ganz. Korrekt: ${current.entry.target}`,
      },
    }));

    if (isCorrect) triggerCelebration();
  };

  return (
    <>
      <CelebrationLayer bursts={bursts} />
      <div className="app-shell">
        <header className="hero">
          <p className="badge">Vocab Vista</p>
          <h1>Dein visuelles Wörterbuch zum Sprachenlernen</h1>
          <p>
            Trainiere neue Wörter mit Karteikarten, Schreibmodus und einem schnellen Quiz. Wechsle flexibel zwischen
            Text und Bildansicht, um dir Vokabeln schneller zu merken.
          </p>
        </header>

        <main className="layout">
          <DictionaryPanel
            topics={allTopics}
            selectedTopic={topic}
            onTopicChange={applyTopicChange}
            entries={filteredEntries}
          />

          <section className="panel learn">
            <div className="learn-header">
              <h2>Lernmodi</h2>
              <div className="mode-switch" role="tablist" aria-label="Lernmethoden">
                {[
                  ["flashcards", "Karteikarten"],
                  ["typing", "Schreibtraining"],
                  ["quiz", "Schnell-Quiz"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    className={`mode-btn ${mode === value ? "active" : ""}`}
                    data-mode={value}
                    role="tab"
                    aria-selected={String(mode === value)}
                    onClick={() => setMode(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {mode === "flashcards" && activeCard ? (
              <FlashcardsPanel
                entry={activeCard}
                index={normalizedCardIndex}
                total={filteredEntries.length}
                visualMode={cardVisualMode}
                isFlipped={isFlipped}
                streak={streak}
                highscore={highscore}
                flashcardAnim={flashcardAnim}
                streakAnim={streakAnim}
                onFlip={() => setIsFlipped((current) => !current)}
                onPrev={() => refreshCard(cardIndex - 1)}
                onNext={() => refreshCard(cardIndex + 1)}
                onToggleVisual={() => {
                  setCardVisualMode((current) => (current === "text" ? "image" : "text"));
                  setIsFlipped(false);
                }}
                onKnown={() => {
                  if (!isFlipped) return;
                  triggerCelebration();
                  animateFlashcard("correct-hit");
                  setStreak((currentStreak) => {
                    const next = currentStreak + 1;
                    if (next > highscore) setHighscore(next);
                    return next;
                  });
                  animateStreak();
                  refreshCard(cardIndex + 1);
                }}
                onUnknown={() => {
                  if (!isFlipped) return;
                  animateFlashcard("wrong-hit");
                  setStreak(0);
                  animateStreak();
                  refreshCard(cardIndex + 1);
                }}
              />
            ) : null}

            {mode === "typing" ? (
              <TypingPanel
                prompt={`${typingEntry.source} (${typingEntry.sourceLang}) → ? (${typingEntry.targetLang})`}
                value={typingInput}
                feedback={typingFeedback}
                onChange={setTypingInput}
                onCheck={checkTyping}
                onNext={resetTyping}
              />
            ) : null}

            {mode === "quiz" ? (
              <QuizPanel
                quiz={{
                  question: `Was bedeutet „${quizState.entry.source}“?`,
                  options: quizState.options,
                  feedback: quizState.feedback,
                  score: quizState.score,
                  round: quizState.round,
                  locked: quizState.locked,
                }}
                onAnswer={answerQuiz}
                onNext={() => (quizState.round >= 5 ? nextQuizRound(true) : nextQuizRound(false))}
              />
            ) : null}
          </section>
        </main>
      </div>
    </>
  );
}
