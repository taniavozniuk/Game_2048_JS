'use strict';

// // Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();
const rows = 4;
const columns = 4;

const startButton = document.querySelector('.button.start');

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    const messageLose2 = document.querySelector('.message-lose');
    const messageWin = document.querySelector('.message-win');

    if (messageLose2) {
      messageLose2.style.display = 'none';
    }

    if (messageWin) {
      messageWin.classList.add('hidden');
    }

    game.restart();
  }

  updateGameField();

  // Приховую початкове повідомлення
  const messageStart = document.querySelector('.message-start');

  if (messageStart) {
    messageStart.style.display = 'none';
  }

  // Змінюю текст кнопки на "Restart"
  startButton.textContent = 'Restart';

  startButton.style.backgroundColor = 'red';
  startButton.style.color = 'white';
  startButton.style.border = 'none';
  startButton.style.fontSize = '16px';
});

// Ініціалізація гри та підключення до DOM
document.addEventListener('keyup', handleKeyPress);

// Оновлення ігрового поля в DOM
function updateGameField() {
  const board = game.getState();
  const fieldRows = document.querySelectorAll('.field-row');

  if (!fieldRows || fieldRows.length === 0) {
    return;
  }

  for (let r = 0; r < 4; r++) {
    const cells = fieldRows[r].children; // Клітинки в рядку

    for (let c = 0; c < 4; c++) {
      const cell = cells[c];
      const num = board[r][c];

      updateCell(cell, num);
    }
  }

  // Оновлюємо рахунок
  document.querySelector('.game-score').textContent = `${game.getScore()}`;
}

// стилі окремої клітинки
function updateCell(cell, num) {
  cell.textContent = '';
  cell.className = 'field-cell';

  if (num > 0) {
    cell.textContent = num;

    if (num <= 1024) {
      cell.classList.add(`field-cell--${num}`);
    } else {
      cell.classList.add('field-cell--2048');
    }
  }
}

// Обробка натискання клавіш
function handleKeyPress(e) {
  if (!game || game.getStatus() !== 'playing') {
    return;
  }

  switch (e.code) {
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    default:
      return;
  }

  // Оновлюю поле після кожного ходу
  updateGameField();

  // Перевірю статус гри
  if (checkVictory(game.getState())) {
    game.setStatus('win');
    showWinMessage();
  } else if (checkGameOver(game.getState())) {
    game.setStatus('lose');
    showLoseMessage();
  }
}

function showWinMessage() {
  const messangeWim = document.querySelector('.message-win');

  if (messangeWim) {
    messangeWim.classList.remove('hidden');
  }
}

function showLoseMessage() {
  const messageLose = document.querySelector('.message-lose');

  if (messageLose) {
    messageLose.style.display = 'block';
    messageLose.classList.remove('hidden');
  }
}

// функція для перевірки перемоги
function checkVictory(board) {
  // перевіряю кожну клітинку на наявність 2048
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 2048) {
        return true;
      }
    }
  }

  return false;
}

// функція для перевірки Game Over
function checkGameOver(board) {
  // Перевіряємо наявність порожніх клітинок
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 0) {
        return false; // Є порожня клітинка, гра продовжується
      }

      // Перевірка можливості злиття по горизонталі
      if (c < columns - 1 && board[r][c] === board[r][c + 1]) {
        return false;
      }

      // Перевірка можливості злиття по вертикалі
      if (r < rows - 1 && board[r][c] === board[r + 1][c]) {
        return false;
      }
    }
  }

  return true; // Гру закінчено (немає можливих ходів)
}

// --- Мобільне керування свайпами ---
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, false);

document.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  touchEndY = e.changedTouches[0].screenY;
  handleSwipeGesture();
}, false);

function handleSwipeGesture() {
  if (!game || game.getStatus() !== 'playing') {
    return;
  }

  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 30) {
      game.moveRight();
    } else if (deltaX < -30) {
      game.moveLeft();
    }
  } else {
    if (deltaY > 30) {
      game.moveDown();
    } else if (deltaY < -30) {
      game.moveUp();
    }
  }

  updateGameField();

  if (checkVictory(game.getState())) {
    game.setStatus('win');
    showWinMessage();
  } else if (checkGameOver(game.getState())) {
    game.setStatus('lose');
    showLoseMessage();
  }
}
