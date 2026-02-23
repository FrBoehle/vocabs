export function QuizPanel({ quiz, onAnswer, onNext }) {
  return (
    <section id="quiz" className="mode-panel active" role="tabpanel" aria-hidden="true">
      <p className="muted">Wähle die richtige Übersetzung. 5 schnelle Fragen.</p>
      <div className="quiz-card">
        <p className="typing-prompt">{quiz.question}</p>
        <div className="quiz-options">
          {quiz.options.map((option) => (
            <button
              key={option.value}
              className={`quiz-option secondary ${option.state}`}
              onClick={() => onAnswer(option.value)}
              disabled={quiz.locked}
            >
              {option.value}
            </button>
          ))}
        </div>
        <p className={`feedback ${quiz.feedback.type}`}>{quiz.feedback.message}</p>
        <div className="controls-row">
          <button className="secondary" onClick={onNext}>
            Nächste Frage
          </button>
          <span className="muted">Punkte: {quiz.score} · Runde {quiz.round}/5</span>
        </div>
      </div>
    </section>
  );
}
