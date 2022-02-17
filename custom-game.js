let gameInfo = null;

let currentOptions = {
    numPlayers: 6,
    players: [
        { enabled: false, isAI: false },
        { enabled: false, isAI: false },
        { enabled: false, isAI: false },
        { enabled: true,  isAI: false },
        { enabled: true,  isAI: false },
        { enabled: true,  isAI: false },
    ]
};
  
/* MAIN MENU STATE */
let customGame_player_options_button_common = {
    index: 0,
    _numButtons: 6,
    _width: 256,
    _height: 40,
    _padding: 32,
    step: 0,
    scale: 0,
    color: function() {  return currentOptions.players[this.index].enabled },
    onClick: function() { currentOptions.players[this.index].enabled = !currentOptions.players[this.index].enabled },
    x: function() { return this._width/2 + this._padding },
    y: function() { return this._height/2 + this._padding + this.index * (this._height/2 + this._padding) },
    w: function() { return this._width },
    h: function() { return this._height },
}

let CUSTOM_GAME_BUUTON_PLAYER_1 = {
    ...customGame_player_options_button_common,
    index: 0,
    label: 'Mängija 1'
}

let CUSTOM_GAME_BUUTON_PLAYER_2 = {
    ...customGame_player_options_button_common,
    index: 1,
    label: 'Mängija 2'
}

let CUSTOM_GAME_BUUTON_PLAYER_3 = {
    ...customGame_player_options_button_common,
    index: 2,
    label: 'Mängija 3'
}

let CUSTOM_GAME_BUUTON_PLAYER_4 = {
    ...customGame_player_options_button_common,
    index: 3,
    label: 'Mängija 4'
}

let CUSTOM_GAME_BUUTON_PLAYER_5 = {
    ...customGame_player_options_button_common,
    index: 4,
    label: 'Mängija 5'
}

let CUSTOM_GAME_BUUTON_PLAYER_6 = {
    ...customGame_player_options_button_common,
    index: 5,
    label: 'Mängija 6'
}

let CUSTOM_GAME_BUTTON_START = {
    label: 'alusta',
    _width: 256,
    _height: 40,
    _padding: 32,
    step: 0,
    scale: 0,
    onClick: () => {  },
    x: function() { return windowWidth - this._width/2 - this._padding },
    y: function() { return windowHeight - this._height/2 - this._padding },
    w: function() { return this._width },
    h: function() { return this._height },
};

function initCustomGame(players) {
    let boardData = generateBoard();
    return {
        board: boardData.board,
        targetSlots: boardData.targetSlots,
        state: GAME_STATE_NONE,
        currentPlayerID: 0,
        turnTempData: {},
        round: 0,
        playerSlotOnClick: undefined,
    };
}

function renderCustomGameMenu() {
    push();

    drawButton(CUSTOM_GAME_BUTTON_START);
    drawButton(CUSTOM_GAME_BUUTON_PLAYER_1);
    drawButton(CUSTOM_GAME_BUUTON_PLAYER_2);
    drawButton(CUSTOM_GAME_BUUTON_PLAYER_3);
    drawButton(CUSTOM_GAME_BUUTON_PLAYER_4);
    drawButton(CUSTOM_GAME_BUUTON_PLAYER_5);
    drawButton(CUSTOM_GAME_BUUTON_PLAYER_6);

    pop();
}