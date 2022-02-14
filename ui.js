const STATE_MAIN_MENU = 0;
const STATE_PAUSE = 1;
const STATE_SETTINGS = 2;
const STATE_GAME_FINISHED = 3;
const STATE_CREDITS = 4;
const STATE_IN_GAME = 5;

let state = STATE_MAIN_MENU;

/* STYLES */
let BUTTON_COMMON = {
  scale: 1,
  _padding: 32,
  _height: 64,
  x: function() { return windowWidth / 2 },
  y: function() { return windowHeight / 2 - (this._numButtons - 1) * (this._height + this._padding) / 2 + this.index * (this._height + this._padding) },
  w: function() { return min(320, windowWidth - this._padding * 2) },
  h: function() { return min(this._height/* , (windowHeight - this._numButtons * (this._padding + 1)) / this._numButtons */) }
};

/* MAIN MENU STATE */
let mainMenu_button_common = {
  _numButtons: 3
}

let mainMenu_button_pvpGame = {
  index: 0,
  label: "tavasätted",
  onClick: () => state = STATE_IN_GAME,

  ...mainMenu_button_common,
  ...BUTTON_COMMON,
};

let mainMenu_button_pvcGame = {
  index: 1,
  label: "kohandatud mäng",

  ...mainMenu_button_common,
  ...BUTTON_COMMON,
};

let mainMenu_button_creditsGame = {
  index: 2,
  label: "koostajad",

  ...mainMenu_button_common,
  ...BUTTON_COMMON,
};

/* ENGINE STUFF */
let font300;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  textFont('Open Sans');
  textSize(21);
}

function draw() {
  background(192);

  push();
  switch(state) {
    case STATE_MAIN_MENU: {
      drawButton(mainMenu_button_pvpGame);
      drawButton(mainMenu_button_pvcGame);
      drawButton(mainMenu_button_creditsGame);
    };
    break;
    case STATE_PAUSE: {

    };
    break;
    case STATE_SETTINGS: {

    };
    break;
    case STATE_GAME_FINISHED: {

    };
    break;
    case STATE_CREDITS: {

    };
    break;
    case STATE_IN_GAME: {
      renderGame(); // in in-game.js
    };
    break;
  }
  pop();
}

function drawButton(button) {
  let x = button.x(), y = button.y(), w = button.w(), h = button.h();

  // UPDATE
  if(mouseX >= x-w/2 && mouseX <= x+w/2 && mouseY >= y-h/2 && mouseY <= y+h/2) {
    button.scale = min(1.1, button.scale * 1.02);

    // handle click events
    if(mouseIsPressed && button.hasOwnProperty('onClick')) button.onClick();
  } else {
    button.scale = max(1, button.scale * 0.98);
  }

  // DRAW
  
  noStroke();
  fill(0, 0, 0, 255);
  rectMode(CENTER);
  textAlign(CENTER, CENTER);

  push();
  translate(x, y);
  scale(button.scale);
  rect(0, 0, w, h);
  fill(255);
  text(button.label, 0, 0);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}