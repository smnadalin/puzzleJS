var gameGrid;
const backgroundColour = "#0F1D2E";
const offColour = "#1d3557";
const onColour = "#f1faee";
const margin = 5;
var level = 0;
const maxLevels = 2;
var sprites = [];
const spriteSize = 200;

var spriteSources = [
  "./sprites/oneSquare.png",
  "./sprites/twoSquareHorizontal.png",
  "./sprites/threeSquare.png",
  "./sprites/fourSquare.png",
  "./sprites/fiveSquare.png",
  "./sprites/sixSquare.png",
  "./sprites/sevenSquare.png",
  "./sprites/eightSquare.png",
];

//Loads all image files
function loadImages(imageFiles) {
  loadCount = 0;
  loadTotal = imageFiles.length;
  var loadedImages = [];

  for (var i = 0; i < imageFiles.length; i++) {
    var image = new Image();
    image.onload = function () {
      loadCount++;
      if (loadCount === loadTotal) {
        startGame();
      }
    };
    image.src = imageFiles[i];

    loadedImages[i] = image;
  }
  return loadedImages;
}

//Initialise game
function init() {
  sprites = loadImages(spriteSources);
}

var levels = Array(maxLevels);
levels[0] = {
  blocks: [{ x: 1, y: 1, block: 0 }],
  grid: [
    [-1, -1, -1, -1, -1, -1],
    [-1, 0, 0, 0, 0, -1],
    [-1, 0, 0, 0, 0, -1],
    [-1, 0, 0, 0, 0, -1],
    [-1, 0, 0, 0, 0, -1],
    [-1, 0, 0, 0, 0, -1],
    [-1, 0, 0, 0, 0, -1],
    [-1, 0, 0, 0, 0, -1],
    [-1, -1, -1, -1, -1, -1],
  ],
};
levels[1] = {
  blocks: [
    { x: 2, y: 2, block: 0 },
    { x: 4, y: 4, block: 0 },
  ],
  grid: [
    [-1, -1, -1, -1, -1, -1],
    [-1, 0, 0, 0, 0, -1],
    [-1, 0, 0, 0, 0, -1],
    [-1, 0, 0, 0, 0, -1],
    [-1, 0, 0, 0, 0, -1],
    [-1, 0, 0, 0, 0, -1],
    [-1, 0, 0, 0, 0, -1],
    [-1, 0, 0, 0, 0, -1],
    [-1, -1, -1, -1, -1, -1],
  ],
};

function startGame() {
  game.start();
  gameGrid = new grid(9, 6, onColour, offColour, margin);
}

var game = {
  canvas: document.createElement("canvas"),
  start: function () {
    this.canvas.oncontextmenu = function (e) {
      e.preventDefault();
      e.stopPropagation();
    };
    this.canvas.width = 900;
    this.canvas.height = 600;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGame, 10);
    window.addEventListener("mousedown", (e) => {
      e.preventDefault();
      switch (e.button) {
        case 0: {
          var mouseX = e.pageX;
          var mouseY = e.pageY;
          var gridX = Math.floor(mouseX / gameGrid.gridWidth);
          var gridY = Math.floor(mouseY / gameGrid.gridHeight);
          console.log(`mousex: ${mouseX}, gridX: ${gridX}`);
          gameGrid.state[gridX][gridY] = gameGrid.state[gridX][gridY] ? 0 : 1;
          break;
        }
        case 2: {
          check();
        }
      }
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
  this.gridWidth = game.canvas.width / this.x;
  this.gridHeight = game.canvas.height / this.y;
  this.state = levels[level].grid;
  this.update = function () {
    context = game.context;
    for (var i = 0; i < this.x; i++) {
      for (var j = 0; j < this.y; j++) {
        if (this.state[i][j] === 1) {
          context.fillStyle = this.onColour;
          context.fillRect(
            this.gridWidth * i + this.margin,
            this.gridHeight * j + this.margin,
            this.gridWidth - 2 * this.margin,
            this.gridHeight - 2 * this.margin
          );
        } else if (this.state[i][j] === 0) {
          context.fillStyle = this.offColour;
          context.fillRect(
            this.gridWidth * i + this.margin,
            this.gridHeight * j + this.margin,
            this.gridWidth - 2 * this.margin,
            this.gridHeight - 2 * this.margin
          );
        }
      }
    }
    for (let i in levels[level].blocks) {
      var symbol = levels[level].blocks[i];
      context.drawImage(
        sprites[blocks[symbol.block].sprite],
        symbol.x * this.gridWidth,
        symbol.y * this.gridWidth,
        this.gridWidth,
        this.gridWidth
      );
    }
  };
  this.levelLoad = function () {
    this.state = levels[level].grid;
  };
}

function updateGame() {
  game.clear();
  gameGrid.update();
}

function check() {
  var allTrue = true;
  for (let i in levels[level].blocks) {
    var symbol = levels[level].blocks[i];
    var x = symbol.x;
    var y = symbol.y;
    var parameters = blocks[symbol.block].parameters;
    if (!blocks[symbol.block].rule(x, y, gameGrid.state, parameters)) {
      allTrue = false;
    }
  }
  if (allTrue) {
    level++;
    gameGrid.levelLoad();
  }
}

function spriteID(name) {
  return spriteSources.findIndex((s) => s === "./sprites/" + name + ".png");
}

//Rules
const atleastNAdjacentCells = (x, y, state, n) => {
  var left = state[x - 1][y] === 1 ? 1 : 0;
  var right = state[x + 1][y] === 1 ? 1 : 0;
  var top = state[x][y - 1] === 1 ? 1 : 0;
  var bottom = state[x][y + 1] === 1 ? 1 : 0;
  return n <= left + right + top + bottom;
};

const atleastNSurroundingCells = (x, y, state, n) => {
  var left = state[x - 1][y] === 1 ? 1 : 0;
  var right = state[x + 1][y] === 1 ? 1 : 0;
  var top = state[x][y - 1] === 1 ? 1 : 0;
  var bottom = state[x][y + 1] === 1 ? 1 : 0;
  var topLeft = state[x - 1][y - 1] === 1 ? 1 : 0;
  var topRight = state[x + 1][y - 1] === 1 ? 1 : 0;
  var bottomLeft = state[x - 1][y + 1] === 1 ? 1 : 0;
  var bottomRight = state[x + 1][y + 1] === 1 ? 1 : 0;
  return (
    n <=
    left + right + top + bottom + topLeft + topRight + bottomLeft + bottomRight
  );
};

const nAdjacentCells = (x, y, state, n) => {
  var left = state[x - 1][y] === 1 ? 1 : 0;
  var right = state[x + 1][y] === 1 ? 1 : 0;
  var top = state[x][y - 1] === 1 ? 1 : 0;
  var bottom = state[x][y + 1] === 1 ? 1 : 0;
  return n === left + right + top + bottom;
};

const nSurroundingCells = (x, y, state, n) => {
  var left = state[x - 1][y] === 1 ? 1 : 0;
  var right = state[x + 1][y] === 1 ? 1 : 0;
  var top = state[x][y - 1] === 1 ? 1 : 0;
  var bottom = state[x][y + 1] === 1 ? 1 : 0;
  var topLeft = state[x - 1][y - 1] === 1 ? 1 : 0;
  var topRight = state[x + 1][y - 1] === 1 ? 1 : 0;
  var bottomLeft = state[x - 1][y + 1] === 1 ? 1 : 0;
  var bottomRight = state[x + 1][y + 1] === 1 ? 1 : 0;
  return (
    n ===
    left + right + top + bottom + topLeft + topRight + bottomLeft + bottomRight
  );
};

const nCellsRight = (x, y, state, n) => {
  var count = 0;
  for (var i = x; i < state.length; i++) {
    if (state[i][y] === 1) {
      count++;
    }
  }
  return n === count;
};

const nCellsLeft = (x, y, state, n) => {
  var count = 0;
  for (var i = x; i < 0; i--) {
    if (state[i][y] === 1) {
      count++;
    }
  }
  return n === count;
};

const nCellsUp = (x, y, state, n) => {
  var count = 0;
  for (var i = y; i < 0; i--) {
    if (state[x][i] === 1) {
      count++;
    }
  }
  return n === count;
};

const nCellsDown = (x, y, state, n) => {
  var count = 0;
  for (var i = y; i < state[0].length; i++) {
    if (state[i][y] === 1) {
      count++;
    }
  }
  return n === count;
};

const blocks = [
  {
    sprite: spriteID("oneSquare"),
    rule: nAdjacentCells,
    parameters: 1,
  },
];
