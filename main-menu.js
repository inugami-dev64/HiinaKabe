
/* COMPONENTS */

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

let mainMenu_button_common = {
	_numButtons: 3
}

let mainMenu_button_vanillaGame = {
    index: 0,
    label: "tavasätted",
    onClick: () => {
        setState(STATE_IN_GAME);
        gameInfo = initGame([
            { enabled: true, isAI: false },
            { enabled: true, isAI: false },
            { enabled: true, isAI: false },
            { enabled: true, isAI: false },
            { enabled: true, isAI: false },
            { enabled: true, isAI: false },
        ]);
    },

	...mainMenu_button_common,
	...BUTTON_COMMON,
};

let mainMenu_button_customGame = {
    index: 1,
    label: "kohandatud mäng",
    onClick: () => setState(STATE_CUSTOM_GAME),

	...mainMenu_button_common,
	...BUTTON_COMMON,
};

let mainMenu_button_creditsGame = {
	index: 2,
	label: "koostajad",
    onClick: () => setState(STATE_CREDITS),

	...mainMenu_button_common,
	...BUTTON_COMMON,
};

/* RENDERING */

function renderMainMenu() {
    drawButton(mainMenu_button_vanillaGame);
    drawButton(mainMenu_button_customGame);
    drawButton(mainMenu_button_creditsGame);
}