const STATE_MAIN_MENU = 0;
const STATE_PAUSE = 1;
const STATE_CUSTOM_GAME = 2;
const STATE_WON = 3;
const STATE_CREDITS = 4;
const STATE_IN_GAME = 5;

let state = STATE_MAIN_MENU;
let prevState = null;

/* STYLES */
let BUTTON_COMMON = {
  step: 0,
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
    onClick: () => {
      setState(STATE_IN_GAME);
      gameInfo = initGame([
        { enabled: true, isAI: false },
        { enabled: true, isAI: false },
        { enabled: true, isAI: false },
        { enabled: true,  isAI: false },
        { enabled: true,  isAI: false },
        { enabled: true,  isAI: false },
      ]);
    },

	...mainMenu_button_common,
	...BUTTON_COMMON,
};

let mainMenu_button_pvcGame = {
    index: 1,
    label: "kohandatud mäng",
    onClick: () => setState(STATE_CUSTOM_GAME),

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
let mouseLastPressed = false;
let font300;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Hacky way to apply letter spacing to the game's canvas
  select('canvas').elt.style.letterSpacing = "3px";

  // Default properties
  background(255);
  textStyle(BOLD);
  textFont('Open Sans');
  textSize(21);
  colorMode(HSB, 360, 100, 100, 1);
}

function setState(newState) {
  switch(newState) {
    case STATE_WON:
      initWon(gameInfo);
      break;
  }
  state = newState;
}

function draw() {
  background(0);

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
    case STATE_CUSTOM_GAME: {
      renderCustomGameMenu();
    };
    break;
    case STATE_WON: {
      renderWon(gameInfo.winner);
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

  mouseLastPressed = mouseIsPressed;
}

function drawButton(button) {
  push();
  colorMode(HSB, 360, 100, 100, 1);
  angleMode(RADIANS);
  rectMode(CENTER);

  let x = button.x(), y = button.y(), w = button.w(), h = button.h();

  // UPDATE
  if(mouseX >= x-w/2 && mouseX <= x+w/2 && mouseY >= y-h/2 && mouseY <= y+h/2) {
    button.step = min(button.step + 1.0 / 60.0, 1);
    button.scale = easeInElastic(button.step);

    // handle click events
    if(mouseIsPressed && !mouseLastPressed && button.hasOwnProperty('onClick')) button.onClick();
  } else {
    button.step -= button.step * 0.2;
    button.step = max(0, button.step - 1.0 / 24.0);
    button.scale = button.step;
  }

  // DRAW
  let c = button.scale * (mouseX - x) / w;
  let cmax = (mouseX - x) / w;
  
  noStroke();
  if(button.toggled) {
    if(button.toggled()) fill(180+50, 20, 50, 1);
    else fill(0, 0, 70, 0.25);
  } else {
    fill(210+c*20, abs(c) * 50, 70, 0.25 + 0.75 * button.scale);
  }
  rectMode(CENTER);
  textAlign(CENTER, CENTER);

  translate(x, y);
  scale(1 + button.scale * 0.1);
  rotate(button.scale * radians((mouseX - x) / w * 5));
  rect(0, 0, w, h, h);
  fill(0, 0, 100);
  if(typeof button.label == "function") text(button.label(), 0, 0);
  else text(button.label, 0, 0);
  pop();
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
