"use strict";

const empty = 0;
const you = 1;
const ai = -1;

function startGame() {
  const field = [];
  const table = document.querySelector(".game__table");

  for (let y = 0; y < 3; y++) {
    const tr = document.createElement("tr");
    table.appendChild(tr);
    const row = [];
    field.push(row);
    for (let x = 0; x < 3; x++) {
      const td = document.createElement("td");
      td.classList.add("game__cell");
      td.onclick = playerMove(field, x, y);
      tr.appendChild(td);
      row.push({ value: empty, element: td });
    }
  }
}

function playerMove(field, x, y) {
  return function () {
    if (!move(field, x, y, you)) return;
    wins(field, you) ? gameOver("Вы выиграли!") : aiMove(field);
  };
}

function move(field, x, y, who) {
  const e = field[y][x];
  if (e.value != empty) return false;
  e.value = who;
  e.element.innerHTML = who == you ? "X" : "O";
  return true;
}

function gameOver(msg) {
  setTimeout(function () {
    alert(msg);
    window.location.reload();
  }, 100);
}

function wins(f, player) {
  function lineWins(x, y, dx, dy) {
    const a = f[y][x].value;
    const b = f[y + dy][x + dx].value;
    const c = f[y + 2 * dy][x + 2 * dx].value;
    return a == b && b == c && a == player;
  }
  for (let i = 0; i < 3; i++) {
    if (lineWins(0, i, 1, 0) || lineWins(i, 0, 0, 1)) return true;
  }
  return lineWins(0, 0, 1, 1) || lineWins(2, 0, -1, 1);
}

function validMoves(field) {
  const moves = [];
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      field[y][x].value == empty && moves.push({ x: x, y: y });
    }
  }
  return moves;
}

function findRandomMove(field) {
  let moves = validMoves(field);
  if (moves.length == 0) return null;
  return moves[Math.floor(Math.random() * moves.length)];
}

function findBestMove(field, player) {
  if (wins(field, player)) return { score: player };
  if (wins(field, -player)) return { score: -player };

  const moves = validMoves(field);

  if (moves.length == 0) return { score: 0 };

  const res = [];

  for (let i = 0; i < moves.length; i++) {
    const m = moves[i];
    const e = field[m.y][m.x];
    e.value = player;
    const r = findBestMove(field, -player);
    r.move = m;
    res.push(r);
    e.value = empty;
  }

  res.sort(function (a, b) {
    return (b.score - a.score) * player;
  });

  return res[0];
}

function aiMove(field) {
  let m = findBestMove(field, ai).move;
  if (!m) {
    gameOver("Ничья!");
    return;
  }

  move(field, m.x, m.y, ai);

  wins(field, ai) && gameOver("Выиграл компьютер!");
}

startGame();
