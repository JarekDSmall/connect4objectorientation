class Player {
  constructor(color) {
    this.color = color;
  }
}

class Game {
  constructor(height = 6, width = 7) {
    this.HEIGHT = height;
    this.WIDTH = width;
    this.currPlayer = null; // active player
    this.board = []; // array of rows, each row is array of cells (board[y][x])
    this.gameOver = false; // flag to indicate if the game has ended
    this.startButton = document.getElementById('start-button');
    this.playerForm = document.getElementById('player-form');
    this.boardElement = document.getElementById('board');

    this.startButton.addEventListener('click', () => {
      this.startGame();
    });
  }

  makeBoard() {
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }

  makeHtmlBoard() {
    // Clear the board element
    while (this.boardElement.firstChild) {
      this.boardElement.firstChild.remove();
    }

    // Create column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', (evt) => this.handleClick(evt));

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    this.boardElement.append(top);

    // Create the main part of the board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      this.boardElement.append(row);
    }
  }

  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  endGame(msg) {
    this.gameOver = true;
    alert(msg);
  }

  handleClick(evt) {
    if (this.gameOver) return;

    const x = +evt.target.id;
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer.color} won!`);
    }

    if (this.board.every((row) => row.every((cell) => cell))) {
      return this.endGame('Tie!');
    }

    this.currPlayer = this.currPlayer === this.player1 ? this.player2 : this.player1;
  }

  checkForWin() {
    function _win(cells) {
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currPlayer
      );
    }

    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        if (
          _win.call(this, horiz) ||
          _win.call(this, vert) ||
          _win.call(this, diagDR) ||
          _win.call(this, diagDL)
        ) {
          return true;
        }
      }
    }

    return false;
  }

  startGame() {
    this.player1 = new Player(document.getElementById('player1-color').value);
    this.player2 = new Player(document.getElementById('player2-color').value);
    this.currPlayer = this.player1;
    this.board = [];
    this.gameOver = false;
    this.makeBoard();
    this.makeHtmlBoard();
  }
}

const game = new Game();