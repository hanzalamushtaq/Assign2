let i = 0;
let answers = [];
let selectedAnswer = "";

let questions = [
  {
    q: "HTML is a ________.",
    opt: [
      "Programming Language",
      "High Level Language",
      "Markup language",
      "A & B",
    ],
    ans: "Markup language",
  },
  {
    q: "What is CSS for?",
    opt: ["Structure ", "Styling", "logic", "Data"],
    ans: "Styling",
  },
  {
    q: "Which HTML tag is used for internal style sheet?",
    opt: ["<script>", "<style>", "<css>", "<link>"],
    ans: "<style>",
  },
  {
    q: "Which property is used for background color in CSS?",
    opt: ["color", "bgcolor", "background-color", "canvas-color"],
    ans: "background-color",
  },
  {
    q: "Which keyword is used to declare a variable in JavaScript?",
    opt: ["var", "string", "dim", "val"],
    ans: "var",
  },
];

// Helper to normalize strings and HTML entities
function normalizeString(str) {
  if (!str) return "";
  return String(str)
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .trim();
}

// Check if student answer matches the correct answer
function isAnswerCorrect(studentAns, correctAns) {
  if (!studentAns || !correctAns) return false;
  return normalizeString(studentAns) === normalizeString(correctAns);
}

// Update card styling: show red when wrong, green when correct
function updateCardStyles(n) {
  let feedbackEl = document.getElementById("feedback");

  // Reset classes from all cards
  for (let k = 1; k <= 4; k++) {
    let card = document.getElementById("card" + k);
    card.classList.remove("selected", "correct", "wrong");
  }

  if (feedbackEl) {
    feedbackEl.textContent = "";
    feedbackEl.className = "feedback";
  }

  // If student already selected an answer for this question
  if (answers[n] !== undefined && answers[n] !== "") {
    selectedAnswer = answers[n];
    let correctAns = questions[n].ans;
    let isCorrect = isAnswerCorrect(selectedAnswer, correctAns);

    for (let k = 0; k < 4; k++) {
      let optText = questions[n].opt[k];
      let card = document.getElementById("card" + (k + 1));

      // Chosen answer styling
      if (normalizeString(optText) === normalizeString(selectedAnswer)) {
        if (isCorrect) {
          card.classList.add("correct");
        } else {
          card.classList.add("wrong");
        }
      } else if (!isCorrect && normalizeString(optText) === normalizeString(correctAns)) {
        // If wrong answer was chosen, also highlight correct option in green
        card.classList.add("correct");
      }
    }

    if (feedbackEl) {
      if (isCorrect) {
        feedbackEl.textContent = "✔ Correct Answer!";
        feedbackEl.className = "feedback correct-text";
      } else {
        feedbackEl.textContent = "✖ Wrong Answer! Correct option is highlighted in green.";
        feedbackEl.className = "feedback wrong-text";
      }
    }
  } else {
    selectedAnswer = "";
  }
}

function flow(n) {
  document.getElementById("ques").textContent = questions[n].q;
  document.getElementById("0").textContent = questions[n].opt[0];
  document.getElementById("1").textContent = questions[n].opt[1];
  document.getElementById("2").textContent = questions[n].opt[2];
  document.getElementById("3").textContent = questions[n].opt[3];
  document.getElementById("t").textContent = i + 1 + "/" + questions.length;

  updateCardStyles(n);
}

function call(n) {
  if (n == 0) {
    document.getElementById("prev").style.backgroundColor = "grey";
  } else {
    document.getElementById("prev").style.backgroundColor = "red";
  }

  if (n + 1 == questions.length) {
    document.getElementById("next").style.backgroundColor = "grey";
  } else {
    document.getElementById("next").style.backgroundColor = "green";
  }
}

// Option selection handling - automatically saves answer with red/green feedback
function selectCard(optIndex, cardId) {
  selectedAnswer = questions[i].opt[optIndex];
  answers[i] = selectedAnswer;
  updateCardStyles(i);
}

document.getElementById("card1").addEventListener("click", function () {
  selectCard(0, "card1");
});
document.getElementById("card2").addEventListener("click", function () {
  selectCard(1, "card2");
});
document.getElementById("card3").addEventListener("click", function () {
  selectCard(2, "card3");
});
document.getElementById("card4").addEventListener("click", function () {
  selectCard(3, "card4");
});

// for next
document.getElementById("next").addEventListener("click", function () {
  if (i < questions.length - 1) {
    i++;
    flow(i);
    call(i);
  }
});

// for prev
document.getElementById("prev").addEventListener("click", function () {
  if (i != 0) {
    i--;
    flow(i);
    call(i);
  }
});

// Dark / Light mode toggle
document.getElementById("mode").addEventListener("click", function () {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    this.textContent = "Light Mode";
  } else {
    this.textContent = "Dark Mode";
  }
});

// Go to separate Result Screen to download/view
function goToResult() {
  localStorage.setItem("quiz_answers", JSON.stringify(answers));
  localStorage.setItem("quiz_questions", JSON.stringify(questions));
  window.location.href = "result.html";
}

document.getElementById("download").addEventListener("click", function () {
  goToResult();
});

// Simple Countdown Timer (5 Minutes)
let timeSec = 300;
let timer = setInterval(function () {
  let m = Math.floor(timeSec / 60);
  let s = timeSec % 60;
  if (s < 10) s = "0" + s;
  if (m < 10) m = "0" + m;
  document.getElementById("time-text").textContent = "Time: " + m + ":" + s;
  timeSec--;
  if (timeSec < 0) {
    clearInterval(timer);
    goToResult();
  }
}, 1000);

flow(i);
call(i);
