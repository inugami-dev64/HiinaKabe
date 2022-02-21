/* STATE MANAGING */

const STATE_MAIN_MENU = 0;
const STATE_CUSTOM_GAME = 1;
const STATE_WON = 2;
const STATE_CREDITS = 3;
const STATE_IN_GAME = 4;

let state = STATE_MAIN_MENU;
let prevState = null;

/* ENGINE STUFF */

let mouseLastPressed = false;
let font300;

/**
	p5.js built-in function. Called once to initialzie the game.
 */
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

/**
	@param newState Must have value of a constant starting with 'STATE_'

	Must be called to change the game state. Calls respective 
	initialization functions when state changes.
 */
function setState(newState) {
    switch(newState) {
        case STATE_WON:
            initWon(gameInfo);
            break;
        case STATE_IN_GAME:
            initInGame();
            break;
    }
    state = newState;
}

/**
	p5.js built-in function. Called on every frame.
	Draws (ticks/updates & renders) correct state of the game.
 */
function draw() {
    background(0);

    push();
    switch(state) {
        case STATE_MAIN_MENU: {
			renderMainMenu();
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
			renderCredits();
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

/**
	@param {
		step: number (must be initialized as 0),
		scale: number (must be initialized as 0),
		x: function() => number,
		y: function() => number,
		w: function() => number,
		h: function() => number,
		label: string or function() => string,
		onClick: function(),
		toggled: function() => bool (optional)
	} button

    Used to draw interactive buttons. This function handles both, 
	ticking/updating and rendering of the button.

	To access button's own objects, full sized function literal must be used:
	onClick: function() { return console.log('button: ', this.label, ' was pressed') }

	This won't work:
	onClick: () => console.log('button: ', this.label, ' was pressed')
 */
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
    if(typeof button.label == "function") text(button.label().toUpperCase(), 0, 0);
    else text(button.label.toUpperCase(), 0, 0);
    pop();
}

/**
	p5.js built-in function. Drawed when window resized.
	Used to resize the canvas.
 */
function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
