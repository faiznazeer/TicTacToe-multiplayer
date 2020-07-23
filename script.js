let origBoard;
let playerOne = 'O';
let playerTwo = 'X';
var playerId;
const winCombos = [
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

function selectSym(sym){
    playerOne = sym;
    playerTwo = (sym ==='O') ? 'X' :'O';
    origBoard = Array.from(Array(9).keys());
    for (let i = 0; i < cells.length; i++) {
      cells[i].addEventListener('click', turnClick, false);
    }
    document.querySelector('.selectSym').style.display = "none";
    document.getElementById("who").innerHTML = "Player 1 turn";
}

function startGame() {
    playerId = 1;
    document.querySelector('.endgame').style.display = "none";
    document.querySelector('.endgame .text').innerText ="";
    document.querySelector('.selectSym').style.display = "block";
    document.getElementById("who").style.display = "block";
    document.getElementById("who").innerHTML = "";
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = "";
        cells[i].style.removeProperty('background-color');
        // cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square) {
    if(playerId === 1) {
        turn(square.target.id, playerOne);
        playerId++;
        document.getElementById("who").innerHTML = "Player 2 turn";
    }
    else {    
        turn(square.target.id, playerTwo);
        playerId--;
        document.getElementById("who").innerHTML = "Player 1 turn";
    }
}

function turn(squareId, player) {
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(origBoard, player);
    cells[squareId].removeEventListener('click', turnClick, false); //doesnt allow 
                                                    //to click on already clicked square
    if(gameWon) 
        gameOver(gameWon);
    else if(checkTie()) 
        checkTie();
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

function gameOver(gameWon) {
    for(let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor = 
            (gameWon.player === playerOne) ? '#6c5ce7' : '#341f97'; 
    }
    for(var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == playerOne ? "Player One wins!" : "Player Two wins!");
}

function declareWinner(message) {
    document.querySelector('.endgame').style.display = "block";
    document.querySelector('.endgame .text').innerText = message;
    document.getElementById("who").style.display = "none";
}

function emptySquares() {
    return origBoard.filter(s => typeof s == 'number');
    //return origBoard.filter((elm, i) => i===elm);
}

function checkTie() {
    //console.log(emptySquares.length);
    if(emptySquares().length == 0) {
        for(var i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = '#82589F';
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Game Tied!");
        return true;
    }
    return false;
}