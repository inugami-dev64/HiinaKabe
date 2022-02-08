/* 
    TODOs:
    - 
 */

/* Slot definition:

    {
        x: number (0.0 - 1.0), 
        y: number (0.0 - 1.0), 
        color: 0 (empty), 1 - 6 (subtract 1 to get player color/id), 
        topLeftNeighbour: ref to Slot, 
        topRightNeighbour: ref to Slot, 
        bottomLeftNeighbour: ref to Slot, 
        bottomRightNeighbour: ref to Slot,
        leftNeighbour: ref to Slot,
        rightNeighbour: ref to Slot,
    }
*/

class Slot {    
    constructor(x, y, color, topLeftNeighbour, topRightNeighbour, bottomLeftNeighbour, bottomRightNeighbour, leftNeighbour, rightNeighbour) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.topLeftNeighbour = topLeftNeighbour;
        this.topRightNeighbour = topRightNeighbour;
        this.bottomLeftNeighbour = bottomLeftNeighbour;
        this.bottomRightNeighbour = bottomRightNeighbour;
        this.leftNeighbour = leftNeighbour;
        this.rightNeighbour = rightNeighbour;
    }
}

// type: [Slot]
let board = generateBoard();
let round = 0;
let playerID = 0;
let rotation = 0;

const ZOOM_OUT_AMOUNT = 0.5;

// using _ig prefix to avoid overlappign names with ui.js
let ig_mouseIsPressedLast = true;

/**
    @returns [Slot]

    Generates empty game board with no player tiles.
*/
function generateBoard() {
    /* 
    let spectrumX = 1;
    let spectrumY = 1;
    let stepX = 1.0 / 14.0;
    let stepY = 1.0 / 17.0;
    let halfStepX = stepX / 2.0;
    let halfStepY = stepY / 2.0; */

    let spectrumX = 14;
    let spectrumY = 17;
    let stepX = 1.0;
    let stepY = 1.0;
    let halfStepX = 0.5;
    let halfStepY = 0.5;
    
    // width: number, x: number (0.0 - 1.0), y: number (0.0 - 1.0)
    const generateRow = (width, x, y) => {
        let arr = [];

        let offsetX = (width * stepX) / 2;

        for(let i = 0; i < width; i++) {
            arr.push(new Slot(-offsetX + x + stepX * i, y, 0));
        }

        return arr;
    }

    // Generate objects

    let rows = [
        generateRow(1, spectrumX / 2 + halfStepX, stepY * 0 + halfStepY),
        generateRow(2, spectrumX / 2 + halfStepX, stepY * 1 + halfStepY),
        generateRow(3, spectrumX / 2 + halfStepX, stepY * 2 + halfStepY),
        generateRow(4, spectrumX / 2 + halfStepX, stepY * 3 + halfStepY),
        generateRow(13, spectrumX / 2 + halfStepX, stepY * 4 + halfStepY),
        generateRow(12, spectrumX / 2 + halfStepX, stepY * 5 + halfStepY),
        generateRow(11, spectrumX / 2 + halfStepX, stepY * 6 + halfStepY),
        generateRow(10, spectrumX / 2 + halfStepX, stepY * 7 + halfStepY),
        generateRow( 9, spectrumX / 2 + halfStepX, stepY * 8 + halfStepY),
        generateRow(10, spectrumX / 2 + halfStepX, stepY * 9 + halfStepY),
        generateRow(11, spectrumX / 2 + halfStepX, stepY * 10 + halfStepY),
        generateRow(12, spectrumX / 2 + halfStepX, stepY * 11 + halfStepY),
        generateRow(13, spectrumX / 2 + halfStepX, stepY * 12 + halfStepY),
        generateRow(4, spectrumX / 2 + halfStepX, stepY * 13 + halfStepY),
        generateRow(3, spectrumX / 2 + halfStepX, stepY * 14 + halfStepY),
        generateRow(2, spectrumX / 2 + halfStepX, stepY * 15 + halfStepY),
        generateRow(1, spectrumX / 2 + halfStepX, stepY * 16 + halfStepY),
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
        // return board.find(slot => Math.abs(slot.x - x) < halfStepY && Math.abs(slot.y - y) < halfStepY);
        return board.find(slot => slot.x == x && slot.y == y);
    };

    // Create references
    rows.forEach((row, j) => {
        row.forEach((slot, i) => {
            if(i > 0) slot.leftNeighbour = row[i-1];
            if(i < row.length-1) slot.rightNeighbour = row[i+1];

            let found;
            if((found = searchForSlot(slot.x - halfStepX, slot.y - stepY))) slot.topLeftNeighbour = found;
            if((found = searchForSlot(slot.x + halfStepX, slot.y - stepY))) slot.topRightNeighbour = found;
            if((found = searchForSlot(slot.x - halfStepX, slot.y + stepY))) slot.bottomLeftNeighbour = found;
            if((found = searchForSlot(slot.x + halfStepX, slot.y + stepY))) slot.bottomRightNeighbour = found;
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
            console.log('running on row:', prevRow);
            let row = [];

            prevRow.forEach((rowSlot) => {
                row = row.concat(collectNeighbours(rowSlot, totalSlots));
            });
            
            console.log('collected row:', row);
            totalSlots = totalSlots.concat(prevRow);
            prevRow = row;
        };

        return totalSlots;
    };

    // Identify player slots
    let collectedSlots = [];
    playerSlots.forEach((slot, i) => {
        console.log('filling slot:', slot);
        collectedSlots.push(
            collectSlotRows(slot, 4)
        );
    });

    // Color player slots
    collectedSlots.forEach((slots, i) => {
        slots.forEach((slot) => {
            slot.color = 1+i;
        });
    });

    board.forEach(slot => {
        slot.x /= 14.0;
        slot.y /= 17.0;
    });

    return board;
}

/**
    @params board   Game board to render
    @returns void

    Draws game board.
 */
function renderBoard(x, y, scale, rotation, board) {

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

        if(a + b < c) strokeWeight(4);
        
        if(slot.color) fill(360 / 6 * (slot.color - 1), 90, 90, 1.0);
        else fill(0, 0, 100, 0.2);

        if(a + b < c && mousePressed()) {
            slot.color = playerID + 1;
            console.log('button placed:', playerID);
        }

        // draw slot
        circle(x + location.x, y + location.y, radius);
    };

    board.forEach(slot => {
        renderSlot(slot);
    });

    stroke(255);
    fill(0);
}

function renderGame() {
    colorMode(HSB, 360, 100, 100, 1);
    angleMode(DEGREES);
    rectMode(CENTER);
    ellipseMode(CENTER);

    background(rotation % 360, 60, 100);
    
    let baseScale = min(windowWidth, windowHeight);
    rotation += ((round / 6 * 360) - rotation) * 0.04;
    // let zoomOut = baseScale * ZOOM_OUT_AMOUNT / 2 - abs((rotation % 60) / 60 * baseScale * ZOOM_OUT_AMOUNT - baseScale * ZOOM_OUT_AMOUNT / 2);
    let zoomOut = sin((rotation % 60) / 60 * 180) * baseScale * ZOOM_OUT_AMOUNT;
    renderBoard(windowWidth/2, windowHeight/2, baseScale - zoomOut, rotation, board);

    if(mousePressed()) {
        round++;
        playerID = round % 6;
    };

    ig_mouseIsPressedLast = mouseIsPressed;
}

function mousePressed() { return !ig_mouseIsPressedLast && mouseIsPressed; }

function sqr(a) { return a*a; }

function rotatePoint(centerX, centerY, pointX, pointY, angle) {
    // angle = radians(angle);
    return {
        x: cos(angle) * (pointX - centerX) - sin(angle) * (pointY - centerY) + centerX,
        y: sin(angle) * (pointX - centerX) + cos(angle) * (pointY - centerY) + centerY,
    };
}