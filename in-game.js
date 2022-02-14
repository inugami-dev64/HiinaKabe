class Slot {
    /* 
        x: number (0.0 - 1.0)
        y: number (0.0 - 1.0)
        color: 0 (empty), 1 - 6 (subtract 1 to get player color/id)
        topLeftNeighbour: ref to Slot
        topRightNeighbour: ref to Slot
        bottomLeftNeighbour: ref to Slot
        bottomRightNeighbour: ref to Slot
        leftNeighbour: ref to Slot
        rightNeighbour: ref to Slot
    */
    constructor(x, y, color, topLeftNeighbour, topRightNeighbour, bottomLeftNeighbour, bottomRightNeighbour, leftNeighbour, rightNeighbour) {
        this.x = x;
        this.y = y;
        this.rotX = x;
        this.rotY = y;
        this.color = color;
        this.topLeftNeighbour = topLeftNeighbour;
        this.topRightNeighbour = topRightNeighbour;
        this.bottomLeftNeighbour = bottomLeftNeighbour;
        this.bottomRightNeighbour = bottomRightNeighbour;
        this.leftNeighbour = leftNeighbour;
        this.rightNeighbour = rightNeighbour;
    }
}

const GAME_STATE_NONE       =  0;
const GAME_STATE_PICK       =  1;
const GAME_STATE_MOVE       =  2;
const GAME_STATE_AWAIT      =  3;
const GAME_STATE_FINISHED   =  4;
const GAME_STATE_JUMP       =  5;
const ZOOM_OUT_AMOUNT       =  0.5;

// these variables are taken from generateBoard method and should have been made into constants in the first place
const SPECTRUM_X = 14;
const SPECTRUM_Y = 17;
const STEP_X = 1.0;
const STEP_Y = 1.0;
const HALF_STEP_X = 0.5;
const HALF_STEP_Y = 0.5;

let gameInfo = initGame();
let rotation = 0;
let prevRotationStage = 0;

let BUTTON_END_ROUND = {
    label: 'lõpeta käik',
    _width: 256,
    _height: 40,
    _padding: 32,
    scale: 0,
    onClick: () => { if(gameInfo.state == GAME_STATE_JUMP) gameInfo.state = GAME_STATE_FINISHED; },
    x: function() { return windowWidth - this._width/2 - this._padding },
    y: function() { return windowHeight - this._height/2 - this._padding },
    w: function() { return this._width },
    h: function() { return this._height },
};

// using ig_ prefix to avoid overlapping names with ui.js
let ig_mouseIsPressedLast = true;


// #########################
// #                       #
// #   BOARD GENERATION    #
// #                       #
// #########################


/**
    @returns {{board: [Slot], targetSlots: [[Slot]]}}
    Generates a game board. Returns an array with target slots for each player, where array index is playerID.
*/
function generateBoard() {
    // width: number, x: number [0.0 - 1.0], y: number [0.0 - 1.0]
    const generateRow = (width, x, y) => {
        let arr = [];

        let offsetX = (width * STEP_X) / 2;

        for(let i = 0; i < width; i++) {
            arr.push(new Slot(-offsetX + x + STEP_X * i, y, 0));
        }

        return arr;
    }

    // Generate slots
    let rows = [
        generateRow(1, SPECTRUM_X / 2 + HALF_STEP_X, STEP_Y * 0 + HALF_STEP_Y),
        generateRow(2, SPECTRUM_X / 2 + HALF_STEP_X, STEP_Y * 1 + HALF_STEP_Y),
        generateRow(3, SPECTRUM_X / 2 + HALF_STEP_X, STEP_Y * 2 + HALF_STEP_Y),
        generateRow(4, SPECTRUM_X / 2 + HALF_STEP_X, STEP_Y * 3 + HALF_STEP_Y),
        generateRow(13, SPECTRUM_X / 2 + HALF_STEP_X, STEP_Y * 4 + HALF_STEP_Y),
        generateRow(12, SPECTRUM_X / 2 + HALF_STEP_X, STEP_Y * 5 + HALF_STEP_Y),
        generateRow(11, SPECTRUM_X / 2 + HALF_STEP_X, STEP_Y * 6 + HALF_STEP_Y),
        generateRow(10, SPECTRUM_X / 2 + HALF_STEP_X, STEP_Y * 7 + HALF_STEP_Y),
        generateRow( 9, SPECTRUM_X / 2 + HALF_STEP_X, STEP_Y * 8 + HALF_STEP_Y),
        generateRow(10, SPECTRUM_X / 2 + HALF_STEP_X, STEP_Y * 9 + HALF_STEP_Y),
        generateRow(11, SPECTRUM_X / 2 + HALF_STEP_X, STEP_Y * 10 + HALF_STEP_Y),
        generateRow(12, SPECTRUM_X / 2 + HALF_STEP_X, STEP_Y * 11 + HALF_STEP_Y),
        generateRow(13, SPECTRUM_X / 2 + HALF_STEP_X, STEP_Y * 12 + HALF_STEP_Y),
        generateRow(4, SPECTRUM_X / 2 + HALF_STEP_X, STEP_Y * 13 + HALF_STEP_Y),
        generateRow(3, SPECTRUM_X / 2 + HALF_STEP_X, STEP_Y * 14 + HALF_STEP_Y),
        generateRow(2, SPECTRUM_X / 2 + HALF_STEP_X, STEP_Y * 15 + HALF_STEP_Y),
        generateRow(1, SPECTRUM_X / 2 + HALF_STEP_X, STEP_Y * 16 + HALF_STEP_Y),
    ];

    let board = [
        ...rows[0],
        ...rows[1],
        ...rows[2],
        ...rows[3],
        ...rows[4],
        ...rows[5],
        ...rows[6],
        ...rows[7],
        ...rows[8],
        ...rows[9],
        ...rows[10],
        ...rows[11],
        ...rows[12],
        ...rows[13],
        ...rows[14],
        ...rows[15],
        ...rows[16],
    ];
    let playerSlots = [
        rows[16][0],
        rows[12][rows[12].length-1],
        rows[4][rows[4].length-1],
        rows[0][0],
        rows[4][0],
        rows[12][0],
    ];

    // x: number
    // y: number
    // returns: slot reference
    const searchForSlot = (x, y) => {
        // return board.find(slot => Math.abs(slot.x - x) < HALF_STEP_Y && Math.abs(slot.y - y) < HALF_STEP_Y);
        return board.find(slot => slot.x == x && slot.y == y);
    };

    // Create references
    rows.forEach((row, j) => {
        row.forEach((slot, i) => {
            if(i > 0) slot.leftNeighbour = row[i-1];
            if(i < row.length-1) slot.rightNeighbour = row[i+1];

            let found;
            if((found = searchForSlot(slot.x - HALF_STEP_X, slot.y - STEP_Y))) slot.topLeftNeighbour = found;
            if((found = searchForSlot(slot.x + HALF_STEP_X, slot.y - STEP_Y))) slot.topRightNeighbour = found;
            if((found = searchForSlot(slot.x - HALF_STEP_X, slot.y + STEP_Y))) slot.bottomLeftNeighbour = found;
            if((found = searchForSlot(slot.x + HALF_STEP_X, slot.y + STEP_Y))) slot.bottomRightNeighbour = found;
        });
    });

    const collectNeighbours = (slot, ignoredSlots) => {
        let slots = [];
        if(slot.topLeftNeighbour && !slots.includes(slot.topLeftNeighbour) && !ignoredSlots.includes(slot.topLeftNeighbour))
            slots.push(slot.topLeftNeighbour);
        if(slot.topRightNeighbour && !slots.includes(slot.topRightNeighbour) && !ignoredSlots.includes(slot.topRightNeighbour))
            slots.push(slot.topRightNeighbour);
        if(slot.bottomLeftNeighbour && !slots.includes(slot.bottomLeftNeighbour) && !ignoredSlots.includes(slot.bottomLeftNeighbour))
            slots.push(slot.bottomLeftNeighbour);
        if(slot.bottomRightNeighbour && !slots.includes(slot.bottomRightNeighbour) && !ignoredSlots.includes(slot.bottomRightNeighbour))
            slots.push(slot.bottomRightNeighbour);
        if(slot.leftNeighbour && !slots.includes(slot.leftNeighbour) && !ignoredSlots.includes(slot.leftNeighbour))
            slots.push(slot.leftNeighbour);
        if(slot.rightNeighbour && !slots.includes(slot.rightNeighbour) && !ignoredSlots.includes(slot.rightNeighbour))
            slots.push(slot.rightNeighbour);
        
        return slots;
    };
    
    const collectSlotRows = (slot, rows) => {
        let totalSlots = [];
        let prevRow = [slot];

        for(let i = 0; i < rows; i++) {
            let row = [];

            prevRow.forEach((rowSlot) => {
                row = row.concat(collectNeighbours(rowSlot, totalSlots));
            });
            
            totalSlots = totalSlots.concat(prevRow);
            prevRow = row;
        };

        return totalSlots;
    };

    // Identify player slots
    let collectedSlots = [];
    playerSlots.forEach((slot, i) => {
        collectedSlots.push(collectSlotRows(slot, 4));
    });

    // Color player slots
    collectedSlots.forEach((slots, i) => {
        slots.forEach((slot) => {
            slot.color = 1+i;
        });
    });

    // Identify players' target slots
    let targetSlots = [];
    targetSlots.length = collectedSlots.length;
    collectedSlots.forEach((slot, i) => targetSlots[(i+6) % 6] = slot);

    board.forEach(slot => {
        slot.x /= SPECTRUM_X;
        slot.y /= SPECTRUM_Y;
    });

    return {board, targetSlots};
}

/**
    @params {[Slot]} board   Game board to render
    Draws game board.
 */
function renderBoard(x, y, scale, rotation, board, gameInfo) {
    stroke(0, 0, 0, 0.25);
    fill(0, 0, 100, 0.5);

    const renderSlot = (slot) => {
        strokeWeight(1);
        // translate slot
        let location = rotatePoint(0, 0, (slot.x - 0.5) * scale, (slot.y - 0.5) * scale, rotation);
        let radius = (1.0 / 15.0) * scale;

        // precise collision check to avoid cases where two slots are selected at the same time
        let a = sqr(mouseX - location.x - x);
        let b = sqr(mouseY - location.y - y);
        let c = sqr(radius/2);

        if(a + b < c || gameInfo.turnTempData.pickedSlot == slot) strokeWeight(4);
        
        if(slot.color) fill(360 / 6 * (slot.color - 1), 90, 90, 1.0);
        else fill(0, 0, 100, 0.2);

        if(a + b < c && mousePressed()) {
            if(gameInfo.playerSlotOnClick != undefined) gameInfo.playerSlotOnClick(slot);
        }

        // draw slot
        circle(x + location.x, y + location.y, radius);
        slot.rotX = (x + location.x) / windowWidth;
        slot.rotY = (y + location.y) / windowHeight;
    };

    board.forEach(slot => {
        renderSlot(slot);
    });

    stroke(255);
    fill(0);
}


// #########################
// #                       #
// #   UTILITY FUNCTIONS   #
// #                       #
// #########################


/**
    @param {[Slot]} board
    @param {number} playerID
    Return an array containing all given player's slots.
 */
function findPlayerSlots(board, playerID) {
    return board.filter(slot => slot.color - 1 == playerID);
}

/**
    @param {Slot} slot
    @param {Slot} except
    Checks if given slot can jump anywhere around it. Parameter 'except' can be used to exclude the slot (ex. where it was last time).
 */
function slotHasJumpingPossibility(slot, except = null) {
    if(slot.topLeftNeighbour && slot.topLeftNeighbour.topLeftNeighbour && slot.topLeftNeighbour.color && 
            slot.topLeftNeighbour.color != slot.color && !slot.topLeftNeighbour.topLeftNeighbour.color && slot.topLeftNeighbour.topLeftNeighbour != except) 
        return true;
    if(slot.topRightNeighbour && slot.topRightNeighbour.topRightNeighbour && slot.topRightNeighbour.color && 
            slot.topRightNeighbour.color != slot.color && !slot.topRightNeighbour.topRightNeighbour.color && slot.topRightNeighbour.topRightNeighbour != except) 
        return true;
    if(slot.bottomLeftNeighbour && slot.bottomLeftNeighbour.bottomLeftNeighbour && slot.bottomLeftNeighbour.color && 
            slot.bottomLeftNeighbour.color != slot.color && !slot.bottomLeftNeighbour.bottomLeftNeighbour.color && slot.bottomLeftNeighbour.bottomLeftNeighbour != except) 
        return true;
    if(slot.bottomRightNeighbour && slot.bottomRightNeighbour.bottomRightNeighbour && slot.bottomRightNeighbour.color && 
            slot.bottomRightNeighbour.color != slot.color && !slot.bottomRightNeighbour.bottomRightNeighbour.color && slot.bottomRightNeighbour.bottomRightNeighbour != except) 
        return true;
    if(slot.leftNeighbour && slot.leftNeighbour.leftNeighbour && slot.leftNeighbour.color && 
            slot.leftNeighbour.color != slot.color && !slot.leftNeighbour.leftNeighbour.color && slot.leftNeighbour.leftNeighbour != except) 
        return true;
    if(slot.rightNeighbour && slot.rightNeighbour.rightNeighbour && slot.rightNeighbour.color && 
            slot.rightNeighbour.color != slot.color && !slot.rightNeighbour.rightNeighbour.color && slot.rightNeighbour.rightNeighbour != except) 
        return true;
    
    return false;
}

/**
    @param {Slot} slot
    @param {Slot} target
    Checks if 'target' is one block away from 'slot', meaning a jump occurred.
 */
function hasJumped(slot, target) {
    if(slot.topLeftNeighbour && slot.topLeftNeighbour.topLeftNeighbour == target) return true;
    if(slot.topRightNeighbour && slot.topRightNeighbour.topRightNeighbour == target) return true;
    if(slot.bottomLeftNeighbour && slot.bottomLeftNeighbour.bottomLeftNeighbour == target) return true;
    if(slot.bottomRightNeighbour && slot.bottomRightNeighbour.bottomRightNeighbour == target) return true;
    if(slot.leftNeighbour && slot.leftNeighbour.leftNeighbour == target) return true;
    if(slot.rightNeighbour && slot.rightNeighbour.rightNeighbour == target) return true;

    return false;
}

/**
    @param {Slot} slot
    @param {Slot} target
    Checks if the 'target' is reachable from 'slot'.
 */
function isReachable(slot, target) {
    if(target.color != 0) return;
    if(
        slot.topLeftNeighbour == target ||
        slot.topRightNeighbour == target ||
        slot.bottomLeftNeighbour == target ||
        slot.bottomRightNeighbour == target ||
        slot.leftNeighbour == target ||
        slot.rightNeighbour == target
    ) return true;

    let slotBetween;
    if(slot.topLeftNeighbour == target.bottomRightNeighbour) slotBetween = slot.topLeftNeighbour;
    if(slot.topRightNeighbour == target.bottomLeftNeighbour) slotBetween = slot.topRightNeighbour;
    if(slot.bottomLeftNeighbour == target.topRightNeighbour) slotBetween = slot.bottomLeftNeighbour;
    if(slot.bottomRightNeighbour == target.topLeftNeighbour) slotBetween = slot.bottomRightNeighbour;
    if(slot.leftNeighbour == target.rightNeighbour) slotBetween = slot.leftNeighbour;
    if(slot.rightNeighbour == target.leftNeighbour) slotBetween = slot.rightNeighbour;

    if(!slotBetween) return false;
    if(slotBetween.color != 0) return true;
    return false;
}

/**
    Initializes board, player slots, resets round counter etc. 
    Initializes/restarts the whole game.
 */
function initGame() {
    let boardData = generateBoard();
    return {
        board: boardData.board,
        targetSlots: boardData.targetSlots,
        state: GAME_STATE_NONE,
        currentPlayerID: 0,
        turnTempData: {},
        round: 0,
        playerSlotOnClick: undefined,
        players: [
            { isAI: false },
            { isAI: true },
            { isAI: false },
            { isAI: true },
            { isAI: false },
            { isAI: true },
        ],
    };
}

// ##################
// #                #
// #   GAME LOGIC   #
// #                #
// ##################


function onSlotClick_pickSlot(slot) {
    // Avoid selecting other players' slots
    if(slot.color - 1 != gameInfo.currentPlayerID) return;
    
    // Remember the picked slot
    gameInfo.turnTempData = { pickedSlot: slot };
    gameInfo.state = GAME_STATE_MOVE;
}

function onSlotClick_jump(slot) {
    // Check if this is a valid jump move
    if(hasJumped(gameInfo.turnTempData.pickedSlot, slot)) {
        // Move the picked slot
        slot.color = gameInfo.turnTempData.pickedSlot.color;
        gameInfo.turnTempData.pickedSlot.color = 0;
        gameInfo.turnTempData.pickedSlot = slot;
    }
}

function onSlotClick_movePickedSlot(slot) {
    // Can't move to an occupied slot
    if(slot.color != 0) return;

    // If selected a slot of the same color, replace picked slot with that
    if(slot.color - 1 == gameInfo.currentPlayerID) {
        gameInfo.turnTempData = { pickedSlot: slot };
        return;
    }

    // Check if that slot can be moved there
    if(!isReachable(gameInfo.turnTempData.pickedSlot, slot)) return;
    
    // If jumped over another slot
    if(hasJumped(slot, gameInfo.turnTempData.pickedSlot)) {
        // If the only option where to jump is back, the round is finished as you have nowhere else to jump
        if(!slotHasJumpingPossibility(slot, gameInfo.turnTempData.pickedSlot)) {
            gameInfo.state = GAME_STATE_FINISHED;
        }
        // If player has the possibility of continuing to jump
        else {
            // Remember the slot, where the roudn started, because round can't be ended there
            gameInfo.turnTempData.started = gameInfo.turnTempData.pickedSlot;
            gameInfo.state = GAME_STATE_JUMP;
            gameInfo.playerSlotOnClick = onSlotClick_jump;
        }
    } else gameInfo.state = GAME_STATE_FINISHED; // if didn't jump over another slot

    // Move the picked slot
    slot.color = gameInfo.turnTempData.pickedSlot.color;
    gameInfo.turnTempData.pickedSlot.color = 0;
    gameInfo.turnTempData.pickedSlot = slot;
}


function gameStep(gameInfo) {
    // If we're waiting for player to pick a slot, do nothing
    if(gameInfo.state == GAME_STATE_AWAIT) return;
    if(gameInfo.state == GAME_STATE_JUMP) return;

    // Callbacks must change gameInfo.state to GAME_STATE_FINISHED to end the round
    if(gameInfo.state == GAME_STATE_FINISHED) {
        // End turn
        gameInfo.turnTempData = {};
        gameInfo.currentPlayerID = (gameInfo.currentPlayerID + 1) % 6; 
        gameInfo.round++;
        gameInfo.state = GAME_STATE_NONE;
        gameInfo.playerSlotOnClick = null;
    }

    // If the current player is an AI, play its turn after random delay of 1-2 seconds
    if(gameInfo.players[gameInfo.currentPlayerID].isAI) {
        gameInfo.state = GAME_STATE_AWAIT;

        setTimeout(() => {
            playAITurn(gameInfo.board, gameInfo.currentPlayerID, findPlayerSlots(gameInfo.board, gameInfo.currentPlayerID), gameInfo.targetSlots);
            gameInfo.state = GAME_STATE_FINISHED;
        }, 1000+Math.random()*1000);
    }
    // If the current player is not an AI
    else {
        // Start by picking a slot
        if(gameInfo.state == GAME_STATE_NONE) {
            gameInfo.state = GAME_STATE_PICK;
        }

        // Let the player pick a slot
        if(gameInfo.state == GAME_STATE_PICK) {
            gameInfo.state = GAME_STATE_AWAIT;
            gameInfo.playerSlotOnClick = onSlotClick_pickSlot;
        } 
        // Let the player move that slot
        else if(gameInfo.state == GAME_STATE_MOVE) {
            gameInfo.state = GAME_STATE_AWAIT;
            gameInfo.playerSlotOnClick = onSlotClick_movePickedSlot;
        }
    }
}


// #################
// #               #
// #   RENDERING   #
// #               #
// #################


function animateBoardScale() {
    let baseScale = min(windowWidth, windowHeight);
    rotation += ((gameInfo.round / 6 * 360) - rotation) * 0.04;
    let zoomOut = sin((rotation % 60) / 60 * 180) * baseScale * ZOOM_OUT_AMOUNT;

    return baseScale - zoomOut;
}


function renderGame() {
    colorMode(HSB, 360, 100, 100, 1);
    angleMode(DEGREES);
    rectMode(CENTER);
    ellipseMode(CENTER);

    background(rotation % 360, 60, 100);
    
    let scale = animateBoardScale();
    renderBoard(windowWidth / 2, windowHeight / 2, scale, rotation, gameInfo.board, gameInfo);
    gameStep(gameInfo);

    // button the let the player end jumping
    if(gameInfo.state == GAME_STATE_JUMP && gameInfo.turnTempData.pickedSlot != gameInfo.turnTempData.started) {
        drawButton(BUTTON_END_ROUND);
    }

    ig_mouseIsPressedLast = mouseIsPressed;
}

function mousePressed() { return !ig_mouseIsPressedLast && mouseIsPressed; }
