
const topics = ['for', 'while'];
let score = 0;
let saved = JSON.parse(localStorage.getItem('quizData') || '{}');
score = parseInt(localStorage.getItem('quizScore')) || 0;

document.getElementById('score-badge').textContent = score;

topics.forEach(topic => {
  fetch(`quiz/${topic}.json`)
    .then(res => res.json())
    .then(questions => renderQuiz(topic, questions));
});

function renderQuiz(topic, questions) {
  const container = document.getElementById('quiz-container');
  const section = document.createElement('section');
  section.innerHTML = `<h2>${topic.toUpperCase()} Quiz</h2>`;
  container.appendChild(section);

  questions.forEach((q, idx) => {
    const div = document.createElement('div');
    div.className = 'question';
    div.innerHTML = `<h3>Q${idx + 1}: What is the output of the following code?</h3><pre>${q.code}</pre>`;

    const scoreTag = document.createElement('div');
    scoreTag.className = 'per-question-score';
    div.appendChild(scoreTag);

    q.options.forEach((opt, i) => {
      const optDiv = document.createElement('div');
      optDiv.className = 'option';
      optDiv.textContent = `${String.fromCharCode(65 + i)}. ${opt}`;

      optDiv.addEventListener('click', () => {
        const allOptions = div.querySelectorAll('.option');
        allOptions.forEach(o => o.classList.remove('correct', 'wrong'));

        if (i === q.answer) {
          optDiv.classList.add('correct');
          scoreTag.textContent = '+5 pts';
          if (saved[topic + idx] !== q.answer) score += 5;
        } else {
          optDiv.classList.add('wrong');
          scoreTag.textContent = '0 pts';
          if (saved[topic + idx] === q.answer) score -= 5;
        }

        saved[topic + idx] = i;
        localStorage.setItem('quizData', JSON.stringify(saved));
        localStorage.setItem('quizScore', score);
        document.getElementById('score-badge').textContent = score;
      });

      div.appendChild(optDiv);
    });

    // Restore state
    if (saved[topic + idx] !== undefined) {
      const userAns = saved[topic + idx];
      const optDivs = div.querySelectorAll('.option');
      if (userAns === q.answer) {
        optDivs[userAns].classList.add('correct');
        scoreTag.textContent = '+5 pts';
      } else {
        optDivs[userAns].classList.add('wrong');
        scoreTag.textContent = '0 pts';
      }
    }

    section.appendChild(div);
  });
}
