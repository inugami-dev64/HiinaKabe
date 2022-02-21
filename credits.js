

let CREDITS_GO_BACK = {
    _width: 256,
    _height: 40,
    _padding: 32,
    step: 0,
    scale: 0,
    onClick: function() { setState(STATE_MAIN_MENU) },
    x: function() { return windowWidth/2 },
    y: function() { return windowHeight - this._padding - this._height/2 },
    w: function() { return this._width },
    h: function() { return this._height },
    label: 'tagasi'
}

function renderCredits() {
    push();
    colorMode(HSB, 360, 100, 100, 1);
    background(0, 60, 100);

    textAlign(CENTER, CENTER);
    fill(0, 0, 100);

    push();
    translate(windowWidth/2, windowHeight/2);
    textSize(windowWidth / 25);
    text("UI & mängu loogika: Rainis Randmaa", 0, -64);
    text("AI algoritm: Karl-Mihkel Ott", 0, 64);
    pop();

    drawButton(CREDITS_GO_BACK);
}