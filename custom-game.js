let gameInfo = null;

let currentOptions = {
    numPlayers: 6,
    players: [
        { isAI: false },
        { isAI: false },
        { isAI: false },
        { isAI: false },
        { isAI: false },
        { isAI: false },
    ]
};

function isPlayerEnabled(playerID, numPlayers) {
    if(numPlayers == 6) return true;
    else if(numPlayers == 5) return [true, true, true, true, true, false][playerID];
    else if(numPlayers == 4) return [true, true, false, true, true, false][playerID];
    else if(numPlayers == 3) return [true, false, true, false, true, false][playerID];
    else if(numPlayers == 2) return [true, false, false, true, false, false][playerID];
    else return false;
}
  
/* MAIN MENU STATE */
let customGame_player_options_button_common = {
    index: 0,
    _numButtons: 6,
    _width: 256,
    _height: 40,
    _padding: 32,
    step: 0,
    scale: 0,
    toggled: function() { return isPlayerEnabled(this.index, currentOptions.numPlayers) },
    onClick: function() { currentOptions.players[this.index].isAI = !currentOptions.players[this.index].isAI },
    x: function() { return windowWidth/2 },
    y: function() { return this._height/2 + this._padding + this.index * (this._height/2 + this._padding) },
    w: function() { return this._width },
    h: function() { return this._height },
    label: function() { return this.toggled() ? `${this.index}: ${currentOptions.players[this.index].isAI ? 'AI' : 'Mängija'}` : '' }
}

let CUSTOM_GAME_BUTTON_PLAYER_1 = {
    ...customGame_player_options_button_common,
    index: 0
}

let CUSTOM_GAME_BUTTON_PLAYER_2 = {
    ...customGame_player_options_button_common,
    index: 1
}

let CUSTOM_GAME_BUTTON_PLAYER_3 = {
    ...customGame_player_options_button_common,
    index: 2
}

let CUSTOM_GAME_BUTTON_PLAYER_4 = {
    ...customGame_player_options_button_common,
    index: 3
}

let CUSTOM_GAME_BUTTON_PLAYER_5 = {
    ...customGame_player_options_button_common,
    index: 4
}

let CUSTOM_GAME_BUTTON_PLAYER_6 = {
    ...customGame_player_options_button_common,
    index: 5
}

let CUSTOM_GAME_BUTTON_START = {
    label: 'alusta',
    _width: 256,
    _height: 40,
    _padding: 32,
    step: 0,
    scale: 0,
    x: function() { return windowWidth - this.w()/2 - this._padding },
    y: function() { return windowHeight - this._height/2 - this._padding },
    w: function() { return min(this._width, (windowWidth - this._padding * 4 )/ 3) },
    h: function() { return this._height },
    onClick: () => {
        gameInfo = initCustomGame(currentOptions.players);
        setState(STATE_IN_GAME);
    },
};

let CUSTOM_GAME_BUTTON_CHANGE_NUM_PLAYERS = {
    label: () => currentOptions.numPlayers + ' mängijat',
    _width: 256,
    _height: 40,
    _padding: 32,
    step: 0,
    scale: 0,
    onClick: () => currentOptions.numPlayers = [0, 3, 4, 5, 6, 2][currentOptions.numPlayers-1],
    x: function() { return this.w()/2 + this._padding },
    y: function() { return windowHeight - this._height/2 - this._padding },
    w: function() { return min(this._width, (windowWidth - this._padding * 4 ) / 3) },
    h: function() { return this._height },
};

let CUSTOM_GAME_BUTTON_GO_BACK = {
    label: 'tagasi',
    _width: 256,
    _height: 40,
    _padding: 32,
    step: 0,
    scale: 0,
    onClick: () => setState(STATE_MAIN_MENU),
    x: function() { return windowWidth/2 },
    y: function() { return windowHeight - this._height/2 - this._padding },
    w: function() { return min(this._width, (windowWidth - this._padding * 4 ) / 3) },
    h: function() { return this._height },
};

function initCustomGame(players) {
    players.forEach((player, playerID) => player.enabled = isPlayerEnabled(playerID, currentOptions.numPlayers));
    return initGame(players);
}

function renderCustomGameMenu() {
    push();

    drawButton(CUSTOM_GAME_BUTTON_START);
    drawButton(CUSTOM_GAME_BUTTON_PLAYER_1);
    drawButton(CUSTOM_GAME_BUTTON_PLAYER_2);
    drawButton(CUSTOM_GAME_BUTTON_PLAYER_3);
    drawButton(CUSTOM_GAME_BUTTON_PLAYER_4);
    drawButton(CUSTOM_GAME_BUTTON_PLAYER_5);
    drawButton(CUSTOM_GAME_BUTTON_PLAYER_6);
    drawButton(CUSTOM_GAME_BUTTON_CHANGE_NUM_PLAYERS);
    drawButton(CUSTOM_GAME_BUTTON_GO_BACK);

    if(currentOptions.numPlayers == 5) {
        push();
        textAlign(CENTER, CENTER);
        fill(0, 0, 100);
        translate(windowWidth/2,  - 64);
        textSize(windowWidth / 25);
        text("5 inimesega mängides on ühel eelis", 0, 0);
        pop();
    }

    pop();
}