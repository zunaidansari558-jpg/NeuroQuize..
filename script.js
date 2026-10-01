
const questions = [
  {
    category: "PROGRAMMING",
    level: "easy",
    q: "Which data structure follows the LIFO principle?",
    options: ["Queue", "Stack", "Linked List", "Tree"],
    answer: 1,
    explanation: "A Stack follows Last In, First Out (LIFO). The last element inserted is the first one removed."
  },
  {
    category: "DBMS",
    level: "easy",
    q: "Which SQL command is used to retrieve data from a database?",
    options: ["GET", "OPEN", "SELECT", "FETCH ALL"],
    answer: 2,
    explanation: "SELECT is the SQL command used to retrieve records from one or more database tables."
  },
  {
    category: "OPERATING SYSTEM",
    level: "easy",
    q: "Which component is known as the brain of a computer?",
    options: ["RAM", "Hard Disk", "CPU", "Motherboard"],
    answer: 2,
    explanation: "The CPU executes instructions, performs calculations and controls the operations of a computer."
  },
  {
    category: "NETWORKING",
    level: "easy",
    q: "What does IP stand for in computer networking?",
    options: [
      "Internet Process",
      "Internet Protocol",
      "Internal Program",
      "Integrated Port"
    ],
    answer: 1,
    explanation: "IP stands for Internet Protocol. It provides addressing and routing of packets across networks."
  },
  {
    category: "DATA STRUCTURES",
    level: "easy",
    q: "Which data structure uses FIFO?",
    options: ["Stack", "Queue", "Tree", "Graph"],
    answer: 1,
    explanation: "A Queue follows First In, First Out (FIFO), so the earliest inserted element is removed first."
  },
  {
    category: "PROGRAMMING",
    level: "medium",
    q: "What is the time complexity of binary search in a sorted array?",
    options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
    answer: 2,
    explanation: "Binary search halves the search space at each step, resulting in logarithmic time complexity."
  },
  {
    category: "DBMS",
    level: "medium",
    q: "Which normal form eliminates partial dependencies?",
    options: ["1NF", "2NF", "3NF", "BCNF"],
    answer: 1,
    explanation: "Second Normal Form (2NF) requires 1NF and removes partial dependencies on a composite candidate key."
  },
  {
    category: "OPERATING SYSTEM",
    level: "medium",
    q: "Which scheduling algorithm may cause starvation?",
    options: [
      "Round Robin",
      "FCFS",
      "Priority Scheduling",
      "FIFO"
    ],
    answer: 2,
    explanation: "In priority scheduling, low-priority processes may wait indefinitely if higher-priority processes keep arriving."
  },
  {
    category: "NETWORKING",
    level: "medium",
    q: "How many layers are there in the OSI model?",
    options: ["4", "5", "6", "7"],
    answer: 3,
    explanation: "The OSI model consists of seven layers: Physical, Data Link, Network, Transport, Session, Presentation and Application."
  },
  {
    category: "OOP",
    level: "medium",
    q: "Which OOP concept allows one interface to have multiple implementations?",
    options: [
      "Encapsulation",
      "Polymorphism",
      "Abstraction",
      "Inheritance"
    ],
    answer: 1,
    explanation: "Polymorphism allows the same interface or method name to represent different implementations."
  },
  {
    category: "ALGORITHMS",
    level: "hard",
    q: "What is the average time complexity of Quick Sort?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
    answer: 1,
    explanation: "Quick Sort has average time complexity O(n log n), although its worst case is O(n²)."
  },
  {
    category: "OPERATING SYSTEM",
    level: "hard",
    q: "Which condition is NOT necessary for deadlock to occur?",
    options: [
      "Mutual Exclusion",
      "Hold and Wait",
      "Preemption",
      "Circular Wait"
    ],
    answer: 2,
    explanation: "The four necessary Coffman conditions are mutual exclusion, hold and wait, no preemption and circular wait. Preemption itself is not a required condition; the required condition is no preemption."
  },
  {
    category: "DBMS",
    level: "hard",
    q: "Which property of ACID ensures committed data survives system failure?",
    options: [
      "Atomicity",
      "Consistency",
      "Isolation",
      "Durability"
    ],
    answer: 3,
    explanation: "Durability guarantees that once a transaction commits, its changes persist even after a system crash."
  },
  {
    category: "NETWORKING",
    level: "hard",
    q: "Which protocol is commonly used to securely transfer web pages?",
    options: ["FTP", "HTTP", "HTTPS", "SMTP"],
    answer: 2,
    explanation: "HTTPS uses TLS to encrypt communications between the browser and web server, helping protect data in transit."
  },
  {
    category: "COMPUTER ARCHITECTURE",
    level: "hard",
    q: "Which cache mapping technique allows a memory block to be placed in any cache line?",
    options: [
      "Direct Mapping",
      "Fully Associative Mapping",
      "Set Associative Mapping",
      "Fixed Mapping"
    ],
    answer: 1,
    explanation: "Fully associative mapping allows any main-memory block to occupy any cache line, offering placement flexibility."
  }
];

// App state
let selectedLevel = "all";
let quizQuestions = [];
let current = 0;
let score = 0;
let timeLeft = 60;
let timerInterval = null;
let startTime = 0;
let answers = [];
let locked = false;

// Elements
const home = document.getElementById("home");
const quiz = document.getElementById("quiz");
const result = document.getElementById("result");
const review = document.getElementById("review");

const questionText = document.getElementById("question-text");
const optionsBox = document.getElementById("options");
const explanationBox = document.getElementById("explanation");
const nextBtn = document.getElementById("next-btn");
const timerEl = document.getElementById("timer");
const timerBox = document.getElementById("timer-box");

// Difficulty selection
document.querySelectorAll(".difficulty").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".difficulty").forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");
    selectedLevel = button.dataset.level;
  });
});

// Start quiz
document.getElementById("start-btn").addEventListener("click", startQuiz);

function showScreen(screen) {
  [home, quiz, result, review].forEach(s => {
    s.classList.add("hidden");
  });
  screen.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function startQuiz() {
  quizQuestions = questions.filter(q =>
    selectedLevel === "all" || q.level === selectedLevel
  );

  // Randomize question order
  quizQuestions = [...quizQuestions].sort(() => Math.random() - 0.5);

  current = 0;
  score = 0;
  answers = [];
  startTime = Date.now();

  showScreen(quiz);
  showQuestion();
}

function showQuestion() {
  clearInterval(timerInterval);
  locked = false;
  timeLeft = 60;

  const q = quizQuestions[current];
  const total = quizQuestions.length;
  const progress = (current / total) * 100;

  document.getElementById("question-count").textContent =
    `QUESTION ${String(current + 1).padStart(2, "0")} / ${total}`;

  document.getElementById("q-number").textContent =
    String(current + 1).padStart(2, "0");

  document.getElementById("progress-percent").textContent =
    `${Math.round(progress)}% COMPLETED`;

  document.getElementById("progress-bar").style.width = `${progress}%`;

  document.getElementById("category").textContent = q.category;
  document.getElementById("difficulty-label").textContent =
    q.level.toUpperCase();

  questionText.textContent = q.q;
  document.getElementById("current-score").textContent = `${score} XP`;

  optionsBox.innerHTML = "";
  explanationBox.classList.add("hidden");
  explanationBox.innerHTML = "";

  nextBtn.disabled = true;
  nextBtn.innerHTML = current === total - 1
    ? 'View Results <span>→</span>'
    : 'Next Question <span>→</span>';

  q.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "option";

    const key = document.createElement("span");
    key.className = "option-key";
    key.textContent = String.fromCharCode(65 + index);

    const label = document.createElement("span");
    label.textContent = option;

    button.append(key, label);

    button.addEventListener("click", () => {
      selectAnswer(index);
    });

    optionsBox.appendChild(button);
  });

  updateTimer();
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      if (!locked) {
        selectAnswer(-1);
      }
    }
  }, 1000);
}

function updateTimer() {
  timerEl.textContent = timeLeft;
  timerBox.classList.toggle("warning", timeLeft <= 10);
}

function selectAnswer(selected) {
  if (locked) return;

  locked = true;
  clearInterval(timerInterval);

  const q = quizQuestions[current];
  const isCorrect = selected === q.answer;
  const buttons = optionsBox.querySelectorAll(".option");

  buttons.forEach((button, index) => {
    button.disabled = true;

    if (index === q.answer) {
      button.classList.add("correct");
      button.querySelector(".option-key").textContent = "✓";
    } else if (index === selected) {
      button.classList.add("wrong");
      button.querySelector(".option-key").textContent = "✕";
    }
  });

  let earned = 0;

  if (isCorrect) {
    earned = 100 + Math.round(timeLeft / 6);
    score += earned;
  }

  answers.push({
    selected,
    correct: isCorrect,
    earned,
    timedOut: selected === -1
  });

  document.getElementById("current-score").textContent = `${score} XP`;

  explanationBox.innerHTML = "";

  const heading = document.createElement("strong");
  heading.textContent = isCorrect
    ? `✓ Correct! +${earned} XP`
    : selected === -1
      ? "⏰ Time's up!"
      : "✕ Incorrect answer";

  const detail = document.createElement("span");
  detail.textContent = q.explanation;

  explanationBox.append(heading, detail);
  explanationBox.classList.remove("hidden");

  nextBtn.disabled = false;
  nextBtn.focus();
}

// Next question
nextBtn.addEventListener("click", () => {
  if (!locked) return;

  if (current < quizQuestions.length - 1) {
    current++;
    showQuestion();
  } else {
    showResults();
  }
});

// Results dashboard
function showResults() {
  clearInterval(timerInterval);
  showScreen(result);

  const total = quizQuestions.length;
  const correct = answers.filter(a => a.correct).length;
  const wrong = total - correct;
  const percentage = Math.round((correct / total) * 100);
  const seconds = Math.floor((Date.now() - startTime) / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;

  document.getElementById("result-title").textContent =
    percentage >= 90 ? "Outstanding!" :
    percentage >= 70 ? "Excellent Work!" :
    percentage >= 50 ? "Well Played!" :
    "Keep Practicing!";

  document.getElementById("result-message").textContent =
    percentage >= 90
      ? "Your CS knowledge is on fire. Keep pushing your limits!"
      : percentage >= 70
        ? "Great effort! You're building strong computer science skills."
        : percentage >= 50
          ? "Good progress! Review the concepts and challenge yourself again."
          : "Every expert starts somewhere. Learn from this attempt and try again!";

  document.getElementById("percentage").textContent = `${percentage}%`;
  document.getElementById("correct-count").textContent = correct;
  document.getElementById("wrong-count").textContent = wrong;
  document.getElementById("total-xp").textContent = score;
  document.getElementById("time-taken").textContent =
    `${minutes}:${String(remainder).padStart(2, "0")}`;

  document.getElementById("score-ring").style.background =
    `conic-gradient(#9475ff ${percentage}%, #272a44 ${percentage}%)`;
}

// Review all answers
document.getElementById("review-btn").addEventListener("click", () => {
  showScreen(review);
  const list = document.getElementById("review-list");
  list.innerHTML = "";

  quizQuestions.forEach((q, index) => {
    const userAnswer = answers[index];
    const item = document.createElement("article");
    item.className = "review-item";

    const heading = document.createElement("h3");
    heading.textContent = `${index + 1}. ${q.q}`;

    const user = document.createElement("p");
    user.className = userAnswer.correct
      ? "review-correct"
      : "review-wrong";

    user.textContent = userAnswer.selected === -1
      ? "Your answer: Not answered"
      : `Your answer: ${q.options[userAnswer.selected]}`;

    const correct = document.createElement("p");
    correct.className = "review-correct";
    correct.textContent = `Correct answer: ${q.options[q.answer]}`;

    const explanation = document.createElement("p");
    explanation.textContent = `Explanation: ${q.explanation}`;

    item.append(heading, user, correct, explanation);
    list.appendChild(item);
  });
});

document.getElementById("back-result").addEventListener("click", () => {
  showScreen(result);
});

document.getElementById("review-home").addEventListener("click", () => {
  showScreen(home);
});

// Restart
document.getElementById("restart-btn").addEventListener("click", startQuiz);

// Exit
document.getElementById("exit-btn").addEventListener("click", () => {
  if (confirm("Are you sure you want to exit this challenge?")) {
    clearInterval(timerInterval);
    showScreen(home);
  }
});