export function DictionaryPanel({ topics, selectedTopic, onTopicChange, entries }) {
  return (
    <section className="panel">
      <h2>Wörterbuch</h2>
      <p className="muted">Wähle einen Bereich und starte danach eine Lernmethode.</p>

      <div className="toolbar">
        <label htmlFor="topic-filter">Thema</label>
        <select id="topic-filter" value={selectedTopic} onChange={(event) => onTopicChange(event.target.value)}>
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </div>

      <ul className="dictionary-list" aria-live="polite">
        {entries.map((entry) => (
          <li key={`${entry.topic}-${entry.source}`}>
            <strong>{entry.source}</strong> ({entry.sourceLang}) → {entry.target} ({entry.targetLang})
            <span className="muted"> · {entry.topic}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
