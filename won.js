let won_button_mainMenu = {
    label: "avamenüü",
    step: 0,
    scale: 1,
    _width: 320,
    _height: 64,
    _padding: 32,
    x: () => windowWidth/2,
    y: function() { return windowHeight - this._padding - this._height/2 },
    w: function() { return min(windowWidth - this._padding * 2, 320) },
    h: function() { return this._height },
    onClick: () => setState(STATE_MAIN_MENU)
};

let animationPlayerID = 10;

function initWon(winnerPlayerID) {
    console.log('initWon())');
    animationPlayerID = 10;
}

function renderWon(winnerPlayerID) {
    animationPlayerID += (winnerPlayerID - animationPlayerID) * 0.01;

    

    push();
    colorMode(HSB, 360, 100, 100, 1);
    background(animationPlayerID * 60 % 360, 60, 100);

    textAlign(CENTER, CENTER);
    fill(0, 0, 100);


    const playerNames = ['PUNANE', 'KOLLANE', 'ROHELINE', 'SININE', 'TUMESININE', 'LILLA'];

    push();
    translate(windowWidth/2, windowHeight/2);
    textSize(windowWidth / 20);
    text(playerNames[Math.floor(animationPlayerID) % 6]+" VÕITIS", 0, 0);
    pop();

    drawButton(won_button_mainMenu);
    pop();
}