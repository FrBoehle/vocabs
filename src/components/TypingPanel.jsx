export function TypingPanel({ prompt, value, feedback, onChange, onCheck, onNext }) {
  return (
    <section id="typing" className="mode-panel active" role="tabpanel" aria-hidden="true">
      <p className="muted">Tippe die Übersetzung in die Zielsprache.</p>
      <div className="typing-card">
        <p className="typing-prompt">{prompt}</p>
        <label htmlFor="typing-input">Deine Antwort</label>
        <input
          id="typing-input"
          type="text"
          placeholder="z. B. apple"
          autoComplete="off"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <div className="controls-row">
          <button onClick={onCheck}>Prüfen</button>
          <button className="secondary" onClick={onNext}>
            Nächstes Wort
          </button>
        </div>
        <p className={`feedback ${feedback.type}`}>{feedback.message}</p>
      </div>
    </section>
  );
}
