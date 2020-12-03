var gameGrid;
const backgroundColour = "#0F1D2E";
const offColour = "#1d3557";
const onColour = "#f1faee"
const margin = 5;

function startGame() {
  game.start();
  gameGrid = new grid(9, 6, onColour, offColour, margin);
}

var game = {
  canvas: document.createElement("canvas"),
  start: function () {
    this.canvas.width = 900 + margin;
    this.canvas.height = 600 + margin;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGame, 10);
    window.addEventListener("click", (e) => {
        var mouseX = e.pageX;
        var mouseY = e.pageY;
        var gridX = Math.floor(mouseX / gameGrid.gridWidth);
        var gridY = Math.floor(mouseY / gameGrid.gridHeight);
        console.log(`Grid x: ${gridX}, grid y: ${gridY}`);
        gameGrid.state[gridX][gridY] = gameGrid.state[gridX][gridY] ? 0: 1;
        //gameGrid.update();
    });
  },
  clear: function () {
    this.context.fillStyle = backgroundColour;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  },
};

function grid(x, y, onColour, offColour, margin) {
  this.x = x;
  this.y = y;
  this.onColour = onColour;
  this.offColour = offColour;
  this.margin = margin;
  this.gridWidth = (game.canvas.width - margin) / this.x;
  this.gridHeight = (game.canvas.height - margin) / this.y;
  this.state = Array(this.x);
  for (var i = 0; i < this.state.length; i++) {
    this.state[i] = Array(this.y);
    for (var j = 0; j < this.state[i].length; j++) {
      this.state[i][j] = 0;
    }
  }
  this.update = function () {
    context = game.context;
    for (var i = 0; i < this.x; i++) {
      for (var j = 0; j < this.y; j++) {
        context.fillStyle =
          this.state[i][j] === 1 ? this.onColour : this.offColour;
        context.fillRect(
          this.gridWidth * i + this.margin,
          this.gridHeight * j + this.margin,
          this.gridWidth - this.margin,
          this.gridHeight - this.margin
        );
      }
    }
  };
}

function updateGame() {
  game.clear();
  gameGrid.update();
}
