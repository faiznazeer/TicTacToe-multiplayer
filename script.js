  
let origBoard;
let huPlayer ='O';
let aiPlayer = 'X';
let playerOne = 'O';
let playerTwo = 'X';
var playerId;
const winCombos =[
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [6, 4, 2],
  [2, 5, 8],
  [1, 4, 7],
  [0, 3, 6]
];

const cells = document.querySelectorAll('.cell');
startGame();

document.querySelector('.selectSym').style.display = "none";

function selectGame(number){
  if(number === 1) {
    document.querySelector('.selectSym1').style.display = "block";
    document.querySelector('.selectGame').style.display = "none";
  }
  if(number === 2) {
    document.querySelector('.selectSym2').style.display = "block";
    document.querySelector('.selectGame').style.display = "none";
  }
}

function selectSym1(sym){
  huPlayer = sym;
  aiPlayer = sym==='O' ? 'X' :'O';
  origBoard = Array.from(Array(9).keys());
  for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener('click', turnClick1, false);
  }
  if (aiPlayer === 'X') {
    turn1(bestSpot(),aiPlayer);
  }
  document.querySelector('.selectSym').style.display = "none";
}

function selectSym2(sym){
  playerOne = sym;
  playerTwo = (sym ==='O') ? 'X' :'O';
  origBoard = Array.from(Array(9).keys());
  for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener('click', turnClick2, false);
  }
  document.querySelector('.selectSym2').style.display = "none";
  document.getElementById("who").innerHTML = "Player 1 turn";
}

function startGame() {
  playerId = 1;
  document.querySelector('.endgame').style.display = "none";
  document.querySelector('.endgame .text').innerText ="";
  document.querySelector('.selectGame').style.display = "block";
  document.querySelector('.selectSym').style.display = "none";
  document.getElementById("who").style.display = "block";
  document.getElementById("who").innerHTML = "";
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = '';
    cells[i].style.removeProperty('background-color');
  }
}

function turnClick1(square) {
  if (typeof origBoard[square.target.id] ==='number') {
    turn1(square.target.id, huPlayer);
    if (!checkWin(origBoard, huPlayer) && !checkTie1())  
      turn1(bestSpot(), aiPlayer);
  }
}

function turnClick2(square) {
  if(playerId === 1) {
      turn2(square.target.id, playerOne);
      playerId++;
      document.getElementById("who").innerHTML = "Player 2 turn";
  }
  else {    
      turn2(square.target.id, playerTwo);
      playerId--;
      document.getElementById("who").innerHTML = "Player 1 turn";
  }
}

function turn1(squareId, player) {
  origBoard[squareId] = player;
  document.getElementById(squareId).innerHTML = player;
  let gameWon = checkWin(origBoard, player);
  if (gameWon) gameOver1(gameWon);
  checkTie1();
}

function turn2(squareId, player) {
  origBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let gameWon = checkWin(origBoard, player);
  cells[squareId].removeEventListener('click', turnClick2, false); //doesnt allow 
                                                  //to click on already clicked square
  if(gameWon) 
      gameOver2(gameWon);
  else if(checkTie2()) 
      checkTie2();
}

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = {index: index, player: player};
      break;
    }
  }
  return gameWon;
}

function gameOver1(gameWon){
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor = 
      gameWon.player === huPlayer ? "#6c5ce7" : "#341f97";
  }
  for (let i=0; i < cells.length; i++) {
    cells[i].removeEventListener('click', turnClick1, false);
  }
  declareWinner1(gameWon.player === huPlayer ? "You win!" : "You lose");
}

function gameOver2(gameWon) {
  for(let index of winCombos[gameWon.index]) {
      document.getElementById(index).style.backgroundColor = 
          (gameWon.player === playerOne) ? '#6c5ce7' : '#341f97'; 
  }
  for(var i = 0; i < cells.length; i++) {
      cells[i].removeEventListener('click', turnClick2, false);
  }
  declareWinner2(gameWon.player == playerOne ? "Player One wins!" : "Player Two wins!");
}

function declareWinner1(who) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;
}

function declareWinner2(message) {
  document.querySelector('.endgame').style.display = "block";
  document.querySelector('.endgame .text').innerText = message;
  document.getElementById("who").style.display = "none";
}
function emptySquares1() {
  return origBoard.filter((elm, i) => i===elm);
}
function emptySquares2() {
  return origBoard.filter(s => typeof s == 'number');
  //return origBoard.filter((elm, i) => i===elm);
}
  
function bestSpot(){
  return minimax(origBoard, aiPlayer).index;
}
  
function checkTie1() {
  if (emptySquares1().length === 0){
    for (cell of cells) {
      cell.style.backgroundColor = "#82589F";
      cell.removeEventListener('click',turnClick1, false);
    }
    declareWinner1("Game Tied!");
    return true;
  } 
  return false;
}

function checkTie2() {
  //console.log(emptySquares.length);
  if(emptySquares2().length == 0) {
      for(var i = 0; i < cells.length; i++) {
          cells[i].style.backgroundColor = '#82589F';
          cells[i].removeEventListener('click', turnClick2, false);
      }
      declareWinner2("Game Tied!");
      return true;
  }
  return false;
}

function minimax(newBoard, player) {
  var availSpots = emptySquares1(newBoard);
  
  if (checkWin(newBoard, huPlayer)) {
    return {score: -10};
  } else if (checkWin(newBoard, aiPlayer)) {
    return {score: 10};
  } else if (availSpots.length === 0) {
    return {score: 0};
  }
  
  var moves = [];
  for (let i = 0; i < availSpots.length; i ++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;
    
    if (player === aiPlayer)
      move.score = minimax(newBoard, huPlayer).score;
    else
       move.score =  minimax(newBoard, aiPlayer).score;
    newBoard[availSpots[i]] = move.index;
    if ((player === aiPlayer && move.score === 10) || (player === huPlayer && move.score === -10))
      return move;
    else 
      moves.push(move);
  }
  
  let bestMove, bestScore;
  if (player === aiPlayer) {
    bestScore = -1000;
    for(let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
      bestScore = 1000;
      for(let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  
  return moves[bestMove];
}
