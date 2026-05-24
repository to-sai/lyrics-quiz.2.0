let combo = 0;
let revealText = "";
let revealCharacterIndex = 0;
let revealSpeed = 100;
let currentLyricsLines = [];
let revealIndex = 0;
let revealInterval;
let currentSong;
let correctAnswer;
let score = 0;
let questionCount = 0;
let timer = 10;
let interval;
let filteredSongs = [];
let highScore =
  localStorage.getItem("highScore") || 0;
let playCount =
  localStorage.getItem("playCount") || 0;

playCount++;

localStorage.setItem(
  "playCount",
  playCount
);

/* 要素取得 */

const lyricsElement =
  document.getElementById("lyrics");

const resultElement =
  document.getElementById("result");

const scoreElement =
  document.getElementById("score");

const remainingElement =
  document.getElementById("remaining");

const questionNumberElement =
  document.getElementById("question-number");

const timerElement =
  document.getElementById("timer");

const highScoreElement =
  document.getElementById("highScore");

const playCountElement =
  document.getElementById("playCount");

const difficultySelect =
  document.getElementById("difficultySelect");

const choicesContainer =
  document.getElementById("choices-container");

const comboElement =
  document.getElementById("combo");

/* 初期表示 */

highScoreElement.textContent =
  `High Score : ${highScore}`;

playCountElement.textContent =
  `Play Count : ${playCount}`;

/* 曲フィルタ */

function stopReveal() {

  clearInterval(revealInterval);

}

function updateFilteredSongs() {

  const selectedDifficulty =
    difficultySelect.value;

  filteredSongs = songs.filter(function(song) {

    return song.difficulty ===
           selectedDifficulty;

  });

}

/* タイマー */

function startTimer() {

  clearInterval(interval);

  timer = 10.0;

  timerElement.textContent =
    `Time : ${timer}`;

  interval = setInterval(function() {

    timer -= 0.1;

    timer =
    Math.max(
    0,
    Number(timer.toFixed(1))
  );

    timerElement.textContent =
      `Time : ${timer.toFixed(1)}`

    if (timer <= 0) {

      clearInterval(interval);

      resultElement.textContent =
        `時間切れ 正解は「${correctAnswer}」`;

      resultElement.className =
        "wrong";

      disableChoices();

      setTimeout(nextQuestion, 1500);
    }

  }, 100);

}

/* 選択肢無効化 */

function disableChoices() {

  const buttons =
    document.querySelectorAll(".choice-button");

  buttons.forEach(function(button) {

    button.disabled = true;

    button.style.opacity = "0.6";

  });

}

/* シャッフル */

function shuffleArray(array) {

  for (
    let i = array.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(
        Math.random() * (i + 1)
      );

    [
      array[i],
      array[j]
    ] = [
      array[j],
      array[i]
    ];

  }

  return array;
}

/* 問題生成 */

function nextQuestion() {

  clearInterval(interval);

  updateFilteredSongs();

  if (filteredSongs.length < 4) {

    lyricsElement.textContent =
      "4曲以上登録してください";

    return;
  }

  resultElement.textContent = "";

  resultElement.className = "";

  choicesContainer.innerHTML = "";

  questionCount++;

  questionNumberElement.textContent =
    `Question ${questionCount}`;

  const randomSongIndex =
    Math.floor(
      Math.random() *
      filteredSongs.length
    );

  currentSong =
    filteredSongs[randomSongIndex];

  correctAnswer =
    currentSong.title;

  /* 歌詞を改行ごとに分割 */

revealText =
  currentSong.lyrics.trim();

lyricsElement.textContent = "";

revealCharacterIndex = 0;

clearInterval(revealInterval);

revealInterval = setInterval(function() {

  if (
    revealCharacterIndex <
    revealText.length
  ) {

    lyricsElement.textContent +=
      revealText[revealCharacterIndex];

    revealCharacterIndex++;

  } else {

    clearInterval(revealInterval);

  }

}, 100);
  /* 選択肢 */

  const choices =
    [correctAnswer];

  while (choices.length < 4) {

    const randomChoice =
      filteredSongs[
        Math.floor(
          Math.random() *
          filteredSongs.length
        )
      ].title;

    if (!choices.includes(randomChoice)) {

      choices.push(randomChoice);

    }

  }

  shuffleArray(choices);

  choices.forEach(function(choice) {

    const button =
      document.createElement("button");

    button.textContent =
      choice;

    button.className =
      "choice-button";

    button.addEventListener(
      "click",
      function() {

        checkAnswer(choice);

      }
    );

    choicesContainer.appendChild(button);

  });

  remainingElement.textContent =
    `Remaining : ${filteredSongs.length}`;

  startTimer();
}

/* 回答判定 */

function checkAnswer(selectedChoice) {

  stopReveal();

  clearInterval(interval);

  disableChoices();

  if (selectedChoice === correctAnswer) {

  const timeScore =
    Math.floor(timer * 100);

  const hiddenBonus =
    Math.max(
      0,
      300 - revealCharacterIndex
    );

  let comboMultiplier = 1;

  if (combo >= 10) {

    comboMultiplier = 2;

  } else if (combo >= 5) {

    comboMultiplier = 1.5;

  } else if (combo >= 3) {

    comboMultiplier = 1.2;

  }

  let difficultyMultiplier = 1;

  if (
    difficultySelect.value ===
    "HARD"
  ) {

    difficultyMultiplier = 2;

  }

  const gainedScore =
    Math.floor(
      (
        timeScore +
        hiddenBonus
      ) *
      comboMultiplier *
      difficultyMultiplier
    );

  score += gainedScore;

  combo++;

  resultElement.textContent =
    `正解！
+${gainedScore}点
x${comboMultiplier}
COMBO ${combo}`;

  resultElement.className =
    "correct";

  scoreElement.textContent =
    `Score : ${score}`;

  comboElement.textContent =
    `Combo : ${combo}`;

  if (score > highScore) {

    highScore = score;

    localStorage.setItem(
      "highScore",
      highScore
    );

    highScoreElement.textContent =
      `High Score : ${highScore}`;
  }

} else {

  resultElement.textContent =
    `不正解！ 正解は「${correctAnswer}」`;

  resultElement.className =
    "wrong";

  combo = 0;

  comboElement.textContent =
    `Combo : ${combo}`;
}

  setTimeout(nextQuestion, 1500);

}

/* イベント */

difficultySelect.addEventListener(
  "change",
  nextQuestion
);

/* 初期問題 */

nextQuestion();