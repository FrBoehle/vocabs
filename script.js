const entries = [
  {
    topic: "Alltag",
    source: "Apfel",
    target: "apple",
    sourceLang: "DE",
    targetLang: "EN",
    image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=500&q=80",
  },
  {
    topic: "Alltag",
    source: "Buch",
    target: "book",
    sourceLang: "DE",
    targetLang: "EN",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80",
  },
  {
    topic: "Reisen",
    source: "Bahnhof",
    target: "station",
    sourceLang: "DE",
    targetLang: "EN",
    image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=500&q=80",
  },
  {
    topic: "Reisen",
    source: "Koffer",
    target: "suitcase",
    sourceLang: "DE",
    targetLang: "EN",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=500&q=80",
  },
  {
    topic: "Essen",
    source: "Brot",
    target: "bread",
    sourceLang: "DE",
    targetLang: "EN",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80",
  },
  {
    topic: "Essen",
    source: "Wasser",
    target: "water",
    sourceLang: "DE",
    targetLang: "EN",
    image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=500&q=80",
  },
  {
    topic: "Tiere",
    source: "Katze",
    target: "cat",
    sourceLang: "DE",
    targetLang: "EN",
    image: "https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=500&q=80",
  },
  {
    topic: "Tiere",
    source: "Vogel",
    target: "bird",
    sourceLang: "DE",
    targetLang: "EN",
    image: "https://images.unsplash.com/photo-1486365227551-f3f90034a57c?auto=format&fit=crop&w=500&q=80",
  },
];

const state = {
  topic: "Alle",
  mode: "flashcards",
  cardIndex: 0,
  cardVisualMode: "text",
  typingEntry: null,
  quizEntry: null,
  quizScore: 0,
  quizRound: 0,
  streak: 0,
  highscore: 0,
};

const refs = {
  languageFilter: document.querySelector("#language-filter"),
  dictionaryList: document.querySelector("#dictionary-list"),
  modeButtons: document.querySelectorAll(".mode-btn"),
  modePanels: document.querySelectorAll(".mode-panel"),
  flashcard: document.querySelector("#flashcard"),
  cardCounter: document.querySelector("#card-counter"),
  frontContent: document.querySelector("#card-front-content"),
  backContent: document.querySelector("#card-back-content"),
  prevCard: document.querySelector("#prev-card"),
  nextCard: document.querySelector("#next-card"),
  flipCard: document.querySelector("#flip-card"),
  toggleCardView: document.querySelector("#toggle-card-view"),
  streakCurrent: document.querySelector("#streak-current"),
  streakHighscore: document.querySelector("#streak-highscore"),
  streakHint: document.querySelector("#streak-hint"),
  markKnown: document.querySelector("#mark-known"),
  markUnknown: document.querySelector("#mark-unknown"),
  typingPrompt: document.querySelector("#typing-prompt"),
  typingInput: document.querySelector("#typing-input"),
  checkTyping: document.querySelector("#check-typing"),
  nextTyping: document.querySelector("#next-typing"),
  typingFeedback: document.querySelector("#typing-feedback"),
  quizQuestion: document.querySelector("#quiz-question"),
  quizOptions: document.querySelector("#quiz-options"),
  quizFeedback: document.querySelector("#quiz-feedback"),
  nextQuiz: document.querySelector("#next-quiz"),
  quizScore: document.querySelector("#quiz-score"),
};

function getFilteredEntries() {
  if (state.topic === "Alle") return entries;
  return entries.filter((entry) => entry.topic === state.topic);
}

function setupTopicFilter() {
  const topics = ["Alle", ...new Set(entries.map((entry) => entry.topic))];
  refs.languageFilter.innerHTML = topics
    .map((topic) => `<option value="${topic}">${topic}</option>`)
    .join("");

  refs.languageFilter.addEventListener("change", () => {
    state.topic = refs.languageFilter.value;
    state.cardIndex = 0;
    renderDictionary();
    renderFlashcard();
    setupTypingRound();
    setupQuizRound(true);
  });
}

function renderDictionary() {
  const filtered = getFilteredEntries();
  refs.dictionaryList.innerHTML = filtered
    .map(
      (entry) =>
        `<li><strong>${entry.source}</strong> (${entry.sourceLang}) → ${entry.target} (${entry.targetLang}) <span class="muted">· ${entry.topic}</span></li>`
    )
    .join("");
}

function cardMarkup(entry, side = "source") {
  if (state.cardVisualMode === "image") {
    return `
      <img src="${entry.image}" alt="${entry.source}" />
      <p class="caption">${side === "source" ? entry.source : entry.target}</p>
    `;
  }
  return `<p class="term">${side === "source" ? entry.source : entry.target}</p>`;
}


const HIGH_SCORE_KEY = "vocab-vista-highscore";

function loadHighscore() {
  const stored = Number.parseInt(localStorage.getItem(HIGH_SCORE_KEY) ?? "0", 10);
  state.highscore = Number.isNaN(stored) ? 0 : stored;
}

function updateStreakUI() {
  refs.streakCurrent.textContent = `Aktuelle Streak: ${state.streak}`;
  refs.streakHighscore.textContent = `Highscore: ${state.highscore}`;
}

function updateAnswerButtons() {
  const isFlipped = refs.flashcard.classList.contains("is-flipped");
  refs.markKnown.disabled = !isFlipped;
  refs.markUnknown.disabled = !isFlipped;
  refs.streakHint.textContent = isFlipped
    ? "Hast du die Lösung gewusst? Wähle eine Bewertung."
    : "Drehe die Karte auf die Lösungsseite und bewerte dich.";
}

function renderFlashcard() {
  const filtered = getFilteredEntries();
  if (!filtered.length) return;
  const index = ((state.cardIndex % filtered.length) + filtered.length) % filtered.length;
  state.cardIndex = index;
  const entry = filtered[index];

  refs.cardCounter.textContent = `Karte ${index + 1} von ${filtered.length} · ${entry.topic}`;
  refs.frontContent.innerHTML = cardMarkup(entry, "source");
  refs.backContent.innerHTML = cardMarkup(entry, "target");
  refs.flashcard.classList.remove("is-flipped");
  updateAnswerButtons();
}

function flipCard() {
  refs.flashcard.classList.toggle("is-flipped");
  updateAnswerButtons();
}

function setupFlashcardControls() {
  refs.prevCard.addEventListener("click", () => {
    state.cardIndex -= 1;
    renderFlashcard();
  });

  refs.nextCard.addEventListener("click", () => {
    state.cardIndex += 1;
    renderFlashcard();
  });

  refs.flipCard.addEventListener("click", flipCard);
  refs.flashcard.addEventListener("click", flipCard);
  refs.flashcard.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      flipCard();
    }
  });

  refs.toggleCardView.addEventListener("click", () => {
    state.cardVisualMode = state.cardVisualMode === "text" ? "image" : "text";
    refs.toggleCardView.textContent =
      state.cardVisualMode === "text" ? "Text/Bild wechseln" : "Bild/Text wechseln";
    renderFlashcard();
  });

  refs.markKnown.addEventListener("click", () => {
    state.streak += 1;
    if (state.streak > state.highscore) {
      state.highscore = state.streak;
      localStorage.setItem(HIGH_SCORE_KEY, String(state.highscore));
    }
    updateStreakUI();
    state.cardIndex += 1;
    renderFlashcard();
  });

  refs.markUnknown.addEventListener("click", () => {
    state.streak = 0;
    updateStreakUI();
    state.cardIndex += 1;
    renderFlashcard();
  });
}

function setupModes() {
  refs.modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const newMode = button.dataset.mode;
      state.mode = newMode;

      refs.modeButtons.forEach((btn) => {
        const active = btn === button;
        btn.classList.toggle("active", active);
        btn.setAttribute("aria-selected", String(active));
      });

      refs.modePanels.forEach((panel) => {
        const isActive = panel.id === newMode;
        panel.classList.toggle("active", isActive);
        panel.setAttribute("aria-hidden", String(!isActive));
      });
    });
  });
}

function randomEntry() {
  const filtered = getFilteredEntries();
  return filtered[Math.floor(Math.random() * filtered.length)];
}

function setupTypingRound() {
  const pick = randomEntry();
  if (!pick) return;
  state.typingEntry = pick;
  refs.typingPrompt.textContent = `${pick.source} (${pick.sourceLang}) → ? (${pick.targetLang})`;
  refs.typingInput.value = "";
  refs.typingFeedback.textContent = "";
  refs.typingFeedback.className = "feedback";
}

function setupTypingMode() {
  refs.checkTyping.addEventListener("click", () => {
    const guess = refs.typingInput.value.trim().toLowerCase();
    const answer = state.typingEntry.target.toLowerCase();
    const isCorrect = guess === answer;
    refs.typingFeedback.className = `feedback ${isCorrect ? "ok" : "wrong"}`;
    refs.typingFeedback.textContent = isCorrect
      ? "Stark! Genau richtig."
      : `Fast! Richtig ist: ${state.typingEntry.target}`;
  });

  refs.nextTyping.addEventListener("click", setupTypingRound);
}

function shuffled(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function setupQuizRound(reset = false) {
  const filtered = getFilteredEntries();
  if (!filtered.length) return;

  if (reset) {
    state.quizRound = 0;
    state.quizScore = 0;
  }

  state.quizEntry = randomEntry();
  state.quizRound += 1;

  refs.quizQuestion.textContent = `Was bedeutet „${state.quizEntry.source}“?`;

  const wrongAnswers = shuffled(
    filtered.filter((entry) => entry.target !== state.quizEntry.target)
  )
    .slice(0, 3)
    .map((entry) => entry.target);

  const options = shuffled([state.quizEntry.target, ...wrongAnswers]);
  refs.quizOptions.innerHTML = options
    .map((option) => `<button class="quiz-option secondary" data-option="${option}">${option}</button>`)
    .join("");

  refs.quizFeedback.textContent = "";
  refs.quizFeedback.className = "feedback";
  refs.quizScore.textContent = `Punkte: ${state.quizScore} · Runde ${Math.min(state.quizRound, 5)}/5`;

  refs.quizOptions.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      const selected = button.dataset.option;
      const isCorrect = selected === state.quizEntry.target;
      if (isCorrect) state.quizScore += 1;
      refs.quizFeedback.className = `feedback ${isCorrect ? "ok" : "wrong"}`;
      refs.quizFeedback.textContent = isCorrect
        ? "Richtig!"
        : `Nicht ganz. Korrekt: ${state.quizEntry.target}`;
      refs.quizScore.textContent = `Punkte: ${state.quizScore} · Runde ${Math.min(state.quizRound, 5)}/5`;
    });
  });
}

function setupQuizMode() {
  refs.nextQuiz.addEventListener("click", () => {
    if (state.quizRound >= 5) {
      setupQuizRound(true);
      return;
    }
    setupQuizRound();
  });
}

function init() {
  loadHighscore();
  updateStreakUI();
  setupTopicFilter();
  renderDictionary();
  setupModes();
  setupFlashcardControls();
  setupTypingMode();
  setupQuizMode();
  renderFlashcard();
  setupTypingRound();
  setupQuizRound(true);
}

init();
