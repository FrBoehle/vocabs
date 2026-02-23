function CardContent({ entry, side, visualMode }) {
  if (visualMode === "image") {
    return (
      <>
        <img src={entry.image} alt={entry.source} />
        <p className="caption">{side === "source" ? entry.source : entry.target}</p>
      </>
    );
  }

  return <p className="term">{side === "source" ? entry.source : entry.target}</p>;
}

export function FlashcardsPanel({
  entry,
  index,
  total,
  visualMode,
  isFlipped,
  streak,
  highscore,
  flashcardAnim,
  streakAnim,
  onFlip,
  onPrev,
  onNext,
  onToggleVisual,
  onKnown,
  onUnknown,
}) {
  const canRate = isFlipped;

  return (
    <section id="flashcards" className="mode-panel active" role="tabpanel">
      <div className="controls-row">
        <button className="secondary" onClick={onPrev}>
          ← Zurück
        </button>
        <button onClick={onFlip}>Karte umdrehen</button>
        <button className="secondary" onClick={onNext}>
          Weiter →
        </button>
      </div>

      <div className="controls-row">
        <span className="muted">Karte {index + 1} von {total} · {entry.topic}</span>
        <button className="secondary" onClick={onToggleVisual}>
          {visualMode === "text" ? "Text/Bild wechseln" : "Bild/Text wechseln"}
        </button>
      </div>

      <div className="streak-bar">
        <span className={`streak-pill ${streakAnim ? "streak-pop" : ""}`}>Aktuelle Streak: {streak}</span>
        <span className={`streak-pill ${streakAnim ? "streak-pop" : ""}`}>Highscore: {highscore}</span>
        <span className="muted">
          {canRate ? "Hast du die Lösung gewusst? Wähle eine Bewertung." : "Drehe die Karte auf die Lösungsseite und bewerte dich."}
        </span>
      </div>

      <div
        className={`flashcard ${isFlipped ? "is-flipped" : ""} ${flashcardAnim}`}
        tabIndex={0}
        onClick={onFlip}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onFlip();
          }
        }}
        aria-label="Karteikarte, Enter zum Umdrehen"
      >
        <div className="flashcard-inner">
          <article className="flashcard-face flashcard-front">
            <p className="face-label">Vorderseite</p>
            <div className="face-content">
              <CardContent entry={entry} side="source" visualMode={visualMode} />
            </div>
          </article>
          <article className="flashcard-face flashcard-back">
            <p className="face-label">Rückseite</p>
            <div className="face-content">
              <CardContent entry={entry} side="target" visualMode={visualMode} />
            </div>
          </article>
        </div>
      </div>

      <div className="controls-row">
        <button className="success" onClick={onKnown} disabled={!canRate}>
          ✅ Wusste ich
        </button>
        <button className="danger" onClick={onUnknown} disabled={!canRate}>
          ❌ Wusste ich nicht
        </button>
      </div>
    </section>
  );
}
